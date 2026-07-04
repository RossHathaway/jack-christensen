import { readFileSync } from 'node:fs';

// Vercel serverless function backing the site search. The index is generated
// by scripts/build-search-index.mjs during `npm run build`; reading it with
// `new URL(..., import.meta.url)` lets Vercel's file tracer bundle it with
// the function.
const PAGES = JSON.parse(
  readFileSync(new URL('./_search-index.json', import.meta.url), 'utf8')
);

const MAX_RESULTS = 20;
const SNIPPET_LENGTH = 220;

export default function handler(req, res) {
  const query = String(req.query.q ?? '').trim();
  // The index only changes on deploys, so let Vercel's edge cache hold
  // responses; a new deploy invalidates the cache.
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=86400');

  if (!query) {
    res.status(400).json({ error: 'Missing search query. Use /api/search?q=words' });
    return;
  }

  const queryLower = query.toLowerCase();
  const terms = [...new Set(queryLower.split(/\s+/).filter(Boolean))].slice(0, 10);

  const scored = [];
  for (const page of PAGES) {
    const titleLower = page.title.toLowerCase();
    const textLower = page.text.toLowerCase();

    let score = 0;
    let matchedTerms = 0;
    for (const term of terms) {
      const inTitle = countOccurrences(titleLower, term);
      const inText = countOccurrences(textLower, term);
      if (inTitle + inText > 0) matchedTerms += 1;
      // Title hits dominate; body hits are capped so long pages don't
      // drown out short, focused ones.
      score += inTitle * 10 + Math.min(inText, 5);
    }
    if (matchedTerms === 0) continue;

    if (matchedTerms === terms.length) score += 20;
    if (terms.length > 1 && (titleLower.includes(queryLower) || textLower.includes(queryLower))) {
      score += 20; // exact phrase bonus
    }

    scored.push({
      score,
      result: {
        url: page.url,
        title: page.title,
        snippet: makeSnippet(page.text, textLower, terms),
      },
    });
  }

  scored.sort((a, b) => b.score - a.score);

  res.status(200).json({
    query,
    terms,
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

// An excerpt of the page text centered on the first matched term.
function makeSnippet(text, textLower, terms) {
  let first = -1;
  for (const term of terms) {
    const index = textLower.search(termMatcher(term));
    if (index !== -1 && (first === -1 || index < first)) first = index;
  }
  if (first === -1) return text.slice(0, SNIPPET_LENGTH);

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
