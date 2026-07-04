<script>
  // Rendered with client:only, so this only ever runs in the browser and can
  // read location.search directly. Results come from the Vercel serverless
  // function at /api/search.
  let query = $state(new URLSearchParams(location.search).get('q') ?? '');
  let searchedQuery = $state('');
  let searchedTerms = $state([]);
  let results = $state([]);
  let total = $state(0);
  let loading = $state(false);
  let error = $state('');

  async function search(q) {
    loading = true;
    error = '';
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (!response.ok) throw new Error(`Search failed (${response.status})`);
      const data = await response.json();
      results = data.results;
      total = data.total;
      searchedTerms = data.terms;
      searchedQuery = q;
    } catch (e) {
      error = e.message || 'Search failed';
    } finally {
      loading = false;
    }
  }

  function submit(event) {
    event.preventDefault();
    const q = query.trim();
    if (!q || q === searchedQuery) return;
    const url = new URL(location.href);
    url.searchParams.set('q', q);
    history.replaceState(null, '', url);
    search(q);
  }

  // Same folding as the API: lowercase, accents removed, ʻokina and
  // apostrophes dropped, with a map from folded positions back to the
  // original string so matches can be located in the displayed snippet.
  function fold(original) {
    let folded = '';
    const starts = [];
    const ends = [];
    let index = 0;
    for (const char of original) {
      const foldedChar = char
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[ʻ‘’']/g, '')
        .toLowerCase();
      for (const c of foldedChar) {
        folded += c;
        starts.push(index);
        ends.push(index + char.length);
      }
      index += char.length;
    }
    return { folded, starts, ends };
  }

  // Splits a snippet into plain and matched parts so matches can be
  // rendered inside <mark> without touching innerHTML. The API returns
  // folded terms, so matching runs on the folded snippet and the ranges
  // are mapped back to the original text.
  function highlight(snippet, terms) {
    if (!terms.length) return [{ text: snippet, hit: false }];
    const { folded, starts, ends } = fold(snippet);

    const ranges = [];
    for (const term of terms) {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const matcher = new RegExp(`\\b${escaped}`, 'g'); // word-start, like the API
      let match;
      while ((match = matcher.exec(folded)) !== null) {
        if (match[0].length === 0) break;
        ranges.push([starts[match.index], ends[match.index + match[0].length - 1]]);
      }
    }
    ranges.sort((a, b) => a[0] - b[0]);

    const parts = [];
    let position = 0;
    for (const [start, end] of ranges) {
      if (end <= position) continue; // overlaps a previous match
      const from = Math.max(start, position);
      if (from > position) parts.push({ text: snippet.slice(position, from), hit: false });
      parts.push({ text: snippet.slice(from, end), hit: true });
      position = end;
    }
    if (position < snippet.length) parts.push({ text: snippet.slice(position), hit: false });
    return parts;
  }

  if (query.trim()) search(query.trim());
</script>

<section aria-label="Site search">
  <h2>Search</h2>

  <form role="search" onsubmit={submit}>
    <input
      type="search"
      name="q"
      placeholder="Search all pages"
      aria-label="Search all pages"
      bind:value={query}
    />
    <button type="submit">Search</button>
  </form>

  {#if loading}
    <p class="status">Searching…</p>
  {:else if error}
    <p class="status">Something went wrong: {error}. Please try again.</p>
  {:else if searchedQuery}
    {#if results.length === 0}
      <p class="status">No pages found for “{searchedQuery}”.</p>
    {:else}
      <p class="status">
        {total} {total === 1 ? 'page' : 'pages'} found for “{searchedQuery}”{total > results.length ? `, showing the top ${results.length}` : ''}.
      </p>
      <ol>
        {#each results as result (result.url)}
          <li>
            <a href={result.url}>{result.title}</a>
            {#if result.snippet}
              <p class="snippet">
                {#each highlight(result.snippet, searchedTerms) as part}
                  {#if part.hit}<mark>{part.text}</mark>{:else}{part.text}{/if}
                {/each}
              </p>
            {/if}
          </li>
        {/each}
      </ol>
    {/if}
  {:else}
    <p class="status">Type a word or phrase to search every page of the site.</p>
  {/if}
</section>

<style>
  section {
    width: 100%;
    max-width: 42rem;
    margin: 0 auto;
    padding: 0 1rem 2rem;
    box-sizing: border-box;
  }

  form {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  input {
    flex: 1;
    min-width: 0;
    font: inherit;
    padding: 0.4rem 0.6rem;
  }

  button {
    font: inherit;
    padding: 0.4rem 1rem;
    color: white;
    background-color: var(--second-darkest-hue, #333);
    border: none;
    cursor: pointer;
  }

  .status {
    font-style: italic;
  }

  ol {
    padding-left: 1.25rem;
  }

  li {
    margin-bottom: 1.25rem;
  }

  li > a {
    font-size: 1.15rem;
  }

  .snippet {
    margin: 0.25rem 0 0;
  }

  mark {
    background-color: #ffe89a;
  }
</style>
