#!/usr/bin/env python3
"""World Cup ticket watcher.

Checks ticket marketplaces for England vs France World Cup tickets and
emails an alert when the cheapest listing drops below a price threshold
(default $700 USD).

Data sources, each independently fault-tolerant:
  * SeatGeek Discovery API   (optional, needs free SEATGEEK_CLIENT_ID)
  * Ticketmaster Discovery API (optional, needs free TICKETMASTER_API_KEY)
  * Any marketplace page listed in config.json, parsed via the schema.org
    JSON-LD blocks that StubHub / TickPick / Gametime / Vivid Seats /
    SeatGeek embed in their event and category pages.

State (to avoid re-sending the same alert every run) is kept in a small
JSON file whose location is controlled by STATE_FILE; in CI it is
persisted between runs with actions/cache.

Exit code is 0 unless the script itself is misconfigured — individual
site failures are logged and skipped so one flaky marketplace never
kills the whole run.
"""

from __future__ import annotations

import argparse
import html
import json
import os
import re
import smtplib
import sys
import time
from dataclasses import dataclass, field
from email.message import EmailMessage
from pathlib import Path

import requests

HERE = Path(__file__).resolve().parent
DEFAULT_CONFIG = HERE / "config.json"

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
)

# Re-send the alert after this long even if the price hasn't moved,
# so a still-live deal isn't only ever mentioned once.
REALERT_AFTER_SECONDS = 12 * 3600
# Also re-alert immediately if the cheapest price drops by at least this much.
REALERT_PRICE_DROP = 5.0


@dataclass
class Listing:
    site: str
    event: str
    price: float
    currency: str
    url: str
    date: str = ""


@dataclass
class SiteResult:
    site: str
    ok: bool
    listings: list[Listing] = field(default_factory=list)
    note: str = ""


def log(msg: str) -> None:
    print(msg, flush=True)


def load_config(path: Path) -> dict:
    with open(path) as f:
        return json.load(f)


def matches_keywords(name: str, keywords: list[str]) -> bool:
    lowered = name.lower()
    return all(k.lower() in lowered for k in keywords)


# --------------------------------------------------------------------------
# JSON-LD scraping (works on most ticket marketplaces' event/category pages)
# --------------------------------------------------------------------------

JSONLD_RE = re.compile(
    r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
    re.DOTALL | re.IGNORECASE,
)


def extract_jsonld_blocks(page_html: str) -> list:
    blocks = []
    for raw in JSONLD_RE.findall(page_html):
        raw = html.unescape(raw).strip()
        try:
            blocks.append(json.loads(raw))
        except json.JSONDecodeError:
            # Some sites ship multiple JSON objects or trailing commas;
            # try a lenient line-by-line recovery before giving up.
            try:
                blocks.append(json.loads(raw.replace("\n", " ")))
            except json.JSONDecodeError:
                continue
    return blocks


def iter_jsonld_events(node) -> list[dict]:
    """Recursively collect schema.org Event-ish objects from a JSON-LD tree."""
    events: list[dict] = []
    if isinstance(node, dict):
        node_type = node.get("@type", "")
        types = node_type if isinstance(node_type, list) else [node_type]
        if any(isinstance(t, str) and "event" in t.lower() for t in types):
            events.append(node)
        for value in node.values():
            events.extend(iter_jsonld_events(value))
    elif isinstance(node, list):
        for item in node:
            events.extend(iter_jsonld_events(item))
    return events


def offers_low_price(offers) -> tuple[float, str] | None:
    """Pull the lowest advertised price out of a schema.org offers value."""
    candidates: list[tuple[float, str]] = []
    stack = [offers]
    while stack:
        cur = stack.pop()
        if isinstance(cur, list):
            stack.extend(cur)
        elif isinstance(cur, dict):
            currency = str(cur.get("priceCurrency") or "USD").upper()
            for key in ("lowPrice", "price", "minPrice"):
                value = cur.get(key)
                if value in (None, "", 0, "0", "0.0", "0.00"):
                    continue
                try:
                    candidates.append((float(str(value).replace(",", "")), currency))
                except ValueError:
                    continue
            if "offers" in cur:
                stack.append(cur["offers"])
    if not candidates:
        return None
    return min(candidates, key=lambda c: c[0])


def check_jsonld_page(session: requests.Session, site: str, url: str,
                      keywords: list[str]) -> SiteResult:
    result = SiteResult(site=site, ok=False)
    try:
        resp = session.get(url, timeout=30)
    except requests.RequestException as exc:
        result.note = f"request failed: {exc}"
        return result
    if resp.status_code != 200:
        result.note = f"HTTP {resp.status_code} (likely bot protection)"
        return result

    events = []
    for block in extract_jsonld_blocks(resp.text):
        events.extend(iter_jsonld_events(block))
    result.ok = True
    result.note = f"{len(events)} JSON-LD event(s) on page"

    for event in events:
        name = str(event.get("name", ""))
        if not matches_keywords(name, keywords):
            continue
        low = offers_low_price(event.get("offers"))
        if low is None:
            continue
        price, currency = low
        result.listings.append(Listing(
            site=site,
            event=name,
            price=price,
            currency=currency,
            url=str(event.get("url") or url),
            date=str(event.get("startDate", "")),
        ))
    return result


# --------------------------------------------------------------------------
# API-based sources (much more reliable than scraping when keys are set)
# --------------------------------------------------------------------------

def check_seatgeek(session: requests.Session, keywords: list[str]) -> SiteResult:
    result = SiteResult(site="SeatGeek API", ok=False)
    client_id = os.environ.get("SEATGEEK_CLIENT_ID", "").strip()
    if not client_id:
        result.note = "skipped (no SEATGEEK_CLIENT_ID set)"
        return result
    try:
        resp = session.get(
            "https://api.seatgeek.com/2/events",
            params={
                "client_id": client_id,
                "q": " ".join(keywords),
                "per_page": 25,
            },
            timeout=30,
        )
        resp.raise_for_status()
        data = resp.json()
    except (requests.RequestException, ValueError) as exc:
        result.note = f"request failed: {exc}"
        return result

    result.ok = True
    events = data.get("events", [])
    result.note = f"{len(events)} event(s) returned"
    for event in events:
        title = event.get("title", "")
        if not matches_keywords(title, keywords):
            continue
        lowest = (event.get("stats") or {}).get("lowest_price")
        if not lowest:
            continue
        result.listings.append(Listing(
            site="SeatGeek",
            event=title,
            price=float(lowest),
            currency="USD",
            url=event.get("url", "https://seatgeek.com"),
            date=event.get("datetime_local", ""),
        ))
    return result


def check_ticketmaster(session: requests.Session, keywords: list[str]) -> SiteResult:
    result = SiteResult(site="Ticketmaster API", ok=False)
    api_key = os.environ.get("TICKETMASTER_API_KEY", "").strip()
    if not api_key:
        result.note = "skipped (no TICKETMASTER_API_KEY set)"
        return result
    try:
        resp = session.get(
            "https://app.ticketmaster.com/discovery/v2/events.json",
            params={
                "apikey": api_key,
                "keyword": " ".join(keywords),
                "size": 25,
            },
            timeout=30,
        )
        resp.raise_for_status()
        data = resp.json()
    except (requests.RequestException, ValueError) as exc:
        result.note = f"request failed: {exc}"
        return result

    result.ok = True
    events = (data.get("_embedded") or {}).get("events", [])
    result.note = f"{len(events)} event(s) returned"
    for event in events:
        name = event.get("name", "")
        if not matches_keywords(name, keywords):
            continue
        prices = [
            (float(pr["min"]), str(pr.get("currency", "USD")).upper())
            for pr in event.get("priceRanges", [])
            if pr.get("min")
        ]
        if not prices:
            continue
        price, currency = min(prices, key=lambda p: p[0])
        result.listings.append(Listing(
            site="Ticketmaster",
            event=name,
            price=price,
            currency=currency,
            url=event.get("url", "https://www.ticketmaster.com"),
            date=((event.get("dates") or {}).get("start") or {}).get("localDate", ""),
        ))
    return result


# --------------------------------------------------------------------------
# Alert state (so the same deal doesn't email you every 30 minutes)
# --------------------------------------------------------------------------

def state_path() -> Path:
    return Path(os.environ.get("STATE_FILE", HERE / ".state" / "state.json"))


def load_state() -> dict:
    try:
        with open(state_path()) as f:
            return json.load(f)
    except (OSError, ValueError):
        return {}


def save_state(state: dict) -> None:
    path = state_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w") as f:
        json.dump(state, f, indent=2)


def should_alert(state: dict, new_min: float) -> bool:
    last = state.get("last_alert")
    if not last:
        return True
    if new_min <= float(last["min_price"]) - REALERT_PRICE_DROP:
        return True
    return time.time() - float(last["at"]) > REALERT_AFTER_SECONDS


# --------------------------------------------------------------------------
# Email
# --------------------------------------------------------------------------

def send_email(subject: str, body: str) -> None:
    host = os.environ["SMTP_HOST"]
    port = int(os.environ.get("SMTP_PORT", "587"))
    username = os.environ["SMTP_USERNAME"]
    password = os.environ["SMTP_PASSWORD"]
    to_addr = os.environ.get("EMAIL_TO", "rosswh@pm.me")
    from_addr = os.environ.get("EMAIL_FROM", username)

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = from_addr
    msg["To"] = to_addr
    msg.set_content(body)

    if port == 465:
        with smtplib.SMTP_SSL(host, port, timeout=30) as server:
            server.login(username, password)
            server.send_message(msg)
    else:
        with smtplib.SMTP(host, port, timeout=30) as server:
            server.starttls()
            server.login(username, password)
            server.send_message(msg)
    log(f"Alert email sent to {to_addr}")


def format_alert(deals: list[Listing], all_listings: list[Listing],
                 threshold: float) -> str:
    lines = [
        f"Tickets found below ${threshold:.0f} for England vs France (World Cup):",
        "",
    ]
    for deal in sorted(deals, key=lambda d: d.price):
        date = f" on {deal.date}" if deal.date else ""
        lines.append(f"  ${deal.price:,.2f} {deal.currency} — {deal.site}: "
                     f"{deal.event}{date}")
        lines.append(f"    {deal.url}")
    others = [l for l in all_listings if l not in deals]
    if others:
        lines += ["", "Other prices seen this run (above threshold):"]
        for listing in sorted(others, key=lambda l: l.price):
            lines.append(f"  ${listing.price:,.2f} {listing.currency} — "
                         f"{listing.site}: {listing.event}")
    lines += ["", "— automated watcher (GitHub Actions)"]
    return "\n".join(lines)


# --------------------------------------------------------------------------
# Main
# --------------------------------------------------------------------------

def run(config: dict, dry_run: bool) -> None:
    keywords = config.get("keywords", ["england", "france"])
    threshold = float(os.environ.get("PRICE_THRESHOLD_USD",
                                     config.get("threshold_usd", 700)))

    session = requests.Session()
    session.headers.update({
        "User-Agent": USER_AGENT,
        "Accept-Language": "en-US,en;q=0.9",
        "Accept": "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
    })

    results: list[SiteResult] = [
        check_seatgeek(session, keywords),
        check_ticketmaster(session, keywords),
    ]
    for page in config.get("pages", []):
        results.append(check_jsonld_page(session, page["site"], page["url"], keywords))

    all_listings: list[Listing] = []
    log(f"Threshold: ${threshold:.0f} USD | keywords: {keywords}")
    for res in results:
        status = "ok" if res.ok else "FAIL"
        log(f"[{status}] {res.site}: {res.note}; "
            f"{len(res.listings)} matching listing(s)")
        for listing in res.listings:
            log(f"       ${listing.price:,.2f} {listing.currency} — {listing.event}")
        all_listings.extend(res.listings)

    usd = [l for l in all_listings if l.currency == "USD"]
    skipped_fx = len(all_listings) - len(usd)
    if skipped_fx:
        log(f"Ignoring {skipped_fx} non-USD listing(s) for threshold comparison")

    deals = [l for l in usd if l.price < threshold]
    if not deals:
        log("No listings below threshold this run.")
        return

    new_min = min(d.price for d in deals)
    state = load_state()
    if not should_alert(state, new_min):
        log(f"Cheapest is ${new_min:,.2f} but an alert for a similar price "
            "was already sent recently; skipping email.")
        return

    body = format_alert(deals, all_listings, threshold)
    subject = (f"🎟️ England vs France World Cup tickets from "
               f"${new_min:,.2f} (below ${threshold:.0f})")
    log("---- alert ----\n" + body + "\n---------------")
    if dry_run:
        log("Dry run: not sending email or updating state.")
        return
    send_email(subject, body)
    state["last_alert"] = {"min_price": new_min, "at": time.time()}
    save_state(state)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--config", type=Path, default=DEFAULT_CONFIG)
    parser.add_argument("--dry-run", action="store_true",
                        help="check prices and print the alert, but never email")
    args = parser.parse_args()
    run(load_config(args.config), args.dry_run)
    return 0


if __name__ == "__main__":
    sys.exit(main())
