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

  // Splits a snippet into plain and matched parts so matches can be
  // rendered inside <mark> without touching innerHTML.
  function highlight(snippet, terms) {
    if (!terms.length) return [{ text: snippet, hit: false }];
    const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    // Word-start matches only, mirroring how the API counts matches.
    const matcher = new RegExp(`\\b(${escaped.join('|')})`, 'gi');
    return snippet
      .split(matcher)
      .filter((part) => part !== '')
      .map((part) => ({ text: part, hit: terms.includes(part.toLowerCase()) }));
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
