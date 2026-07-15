# World Cup ticket watcher

Checks ticket marketplaces every 30 minutes (via the free GitHub Actions
scheduler — see `.github/workflows/ticket-watch.yml`) for **England vs
France** World Cup tickets and emails **rosswh@pm.me** whenever the
cheapest listing drops below **$700 USD**.

## Sources checked

| Source | How | Needs a key? |
| --- | --- | --- |
| SeatGeek Discovery API | official API, most reliable | free `SEATGEEK_CLIENT_ID` from https://seatgeek.com/account/develop |
| Ticketmaster Discovery API | official API | free `TICKETMASTER_API_KEY` from https://developer.ticketmaster.com |
| StubHub, SeatGeek, TickPick, Gametime, Vivid Seats web pages | scrapes the schema.org JSON-LD these pages embed | no |

Every source is independently fault-tolerant: if one site blocks the
request or changes layout, it's logged as `FAIL` in the run output and
the rest still run. The big resale sites use bot protection that can
intermittently block GitHub's IP ranges, so **adding the two free API
keys is strongly recommended** — they are the dependable backbone, the
page scrapes are opportunistic extras.

## One-time setup

Add these repository secrets (Settings → Secrets and variables → Actions):

| Secret | Required | Value |
| --- | --- | --- |
| `SMTP_HOST` | yes | e.g. `smtp.gmail.com` |
| `SMTP_PORT` | no | `587` (default) or `465` for SSL |
| `SMTP_USERNAME` | yes | the account to send from |
| `SMTP_PASSWORD` | yes | for Gmail use an [App Password](https://myaccount.google.com/apppasswords) |
| `SEATGEEK_CLIENT_ID` | recommended | free API key |
| `TICKETMASTER_API_KEY` | recommended | free API key |

Then run the workflow once by hand (Actions → *World Cup ticket watch* →
*Run workflow*) and read the logs to confirm each source reports `ok`.

## Tuning

* **Threshold / teams**: edit `ticket-watcher/config.json`
  (`threshold_usd`, `keywords`). The keywords are matched against event
  titles, so `["england", "france"]` catches "FIFA World Cup Semifinal:
  England vs France" and similar.
* **Pinning exact match pages**: once the specific England vs France
  match page exists on a marketplace, replace the category URL in
  `config.json` with that event page URL — event pages carry a
  `lowPrice` in their JSON-LD, which is the most accurate scrape.
* **Schedule**: edit the `cron` line in the workflow.
* **Recipient**: `EMAIL_TO` env var in the workflow.

## Alert behaviour

* Emails only when a USD listing is strictly below the threshold.
* Won't re-email the same deal every run: it re-alerts only if the
  cheapest price drops by $5+ or 12 hours have passed (state is kept in
  `ticket-watcher/.state/` and persisted between runs with the Actions
  cache).
* Non-USD prices are listed in logs but excluded from threshold checks.

## Test locally

```bash
pip install -r ticket-watcher/requirements.txt
python ticket-watcher/check_tickets.py --dry-run
```

`--dry-run` prints what the alert would say without sending email or
recording state.
