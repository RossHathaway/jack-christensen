import { readFileSync } from 'node:fs';

// Vercel serverless function backing the site search. The index is generated
// by scripts/build-search-index.mjs during `npm run build`; reading it with
// `new URL(..., import.meta.url)` lets Vercel's file tracer bundle it with
// the function.
const RAW_PAGES = JSON.parse(
  readFileSync(new URL('./_search-index.json', import.meta.url), 'utf8')
);

const MAX_RESULTS = 20;
const SNIPPET_LENGTH = 220;

// Matching runs on "folded" text: lowercased, accents removed, and the
// ʻokina and apostrophes dropped, so "Hawaii" finds "Hawaiʻi" and "obamas"
// finds "Obama's". `starts` maps each folded character back to its position
// in the original string, so snippets can show the original text.
function fold(original) {
  let folded = '';
  const starts = [];
  let index = 0;
  for (const char of original) {
    const foldedChar = char
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // combining accents (macrons etc.)
      .replace(/[ʻ‘’']/g, '') // ʻokina and apostrophes
      .toLowerCase();
    for (const c of foldedChar) {
      folded += c;
      starts.push(index);
    }
    index += char.length;
  }
  return { folded, starts };
}

const PAGES = RAW_PAGES.map((page) => ({
  ...page,
  titleFolded: fold(page.title).folded,
  textFold: fold(page.text),
}));

export default function handler(req, res) {
  const query = String(req.query.q ?? '').trim();
  // The index only changes on deploys, so let Vercel's edge cache hold
  // responses; a new deploy invalidates the cache.
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=86400');

  if (!query) {
    res.status(400).json({ error: 'Missing search query. Use /api/search?q=words' });
    return;
  }

  const foldedQuery = fold(query).folded.trim();
  const terms = [...new Set(foldedQuery.split(/\s+/).filter(Boolean))].slice(0, 10);

  const scored = [];
  for (const page of PAGES) {
    let score = 0;
    let matchedTerms = 0;
    for (const term of terms) {
      const inTitle = countOccurrences(page.titleFolded, term);
      const inText = countOccurrences(page.textFold.folded, term);
      if (inTitle + inText > 0) matchedTerms += 1;
      // Title hits dominate; body hits are capped so long pages don't
      // drown out short, focused ones.
      score += inTitle * 10 + Math.min(inText, 5);
    }
    if (matchedTerms === 0) continue;

    if (matchedTerms === terms.length) score += 20;
    if (
      terms.length > 1 &&
      (page.titleFolded.includes(foldedQuery) || page.textFold.folded.includes(foldedQuery))
    ) {
      score += 20; // exact phrase bonus
    }

    scored.push({
      score,
      result: {
        url: page.url,
        title: page.title,
        snippet: makeSnippet(page.text, page.textFold, terms, foldedQuery),
      },
    });
  }

  scored.sort((a, b) => b.score - a.score);

  res.status(200).json({
    query,
    terms, // folded, matching how the client should highlight
    total: scored.length,
    results: scored.slice(0, MAX_RESULTS).map((entry) => entry.result),
  });
}

// Terms match at word starts only, so "air" matches "airlines" but not
// "fair" or "chairman".
function termMatcher(term) {
  return new RegExp('\\b' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
}

function countOccurrences(haystack, term) {
  if (!term) return 0;
  return (haystack.match(termMatcher(term)) ?? []).length;
}

// An excerpt of the page text centered on the exact phrase if the page
// contains it, otherwise on the first matched term.
function makeSnippet(text, textFold, terms, foldedQuery) {
  let firstFolded =
    terms.length > 1 ? textFold.folded.search(termMatcher(foldedQuery)) : -1;
  if (firstFolded === -1) {
    for (const term of terms) {
      const index = textFold.folded.search(termMatcher(term));
      if (index !== -1 && (firstFolded === -1 || index < firstFolded)) firstFolded = index;
    }
  }
  if (firstFolded === -1) return text.slice(0, SNIPPET_LENGTH);
  const first = textFold.starts[firstFolded];

  let start = Math.max(0, first - Math.floor(SNIPPET_LENGTH / 3));
  // Snap to a word boundary so snippets don't open mid-word.
  if (start > 0) {
    const nextSpace = text.indexOf(' ', start);
    if (nextSpace !== -1 && nextSpace < first) start = nextSpace + 1;
  }
  const end = Math.min(text.length, start + SNIPPET_LENGTH);

  let snippet = text.slice(start, end);
  if (start > 0) snippet = '…' + snippet;
  if (end < text.length) snippet += '…';
  return snippet;
}
