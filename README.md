# Jack Christensen

Built with [Astro](https://astro.build) and [Svelte 5](https://svelte.dev), migrated from the original Sapper/Rollup setup.

## Structure

- `src/content/` mirrors the site's URL structure. `.svx` files are markdown processed by [mdsvex](https://mdsvex.pngwn.io), so they can embed Svelte components, `<script>` blocks, and scoped `<style>` blocks just like the old Sapper `.md` routes.
- `src/pages/[...slug].astro` turns every file in `src/content/` into a static page. A folder's `index.svx` is served at the folder's own URL and receives `links` to its sibling pages as a prop (replacing the old `index.json.js` server endpoints).
- `src/layouts/BaseLayout.astro` replaces `src/template.html` + `src/routes/_layout.svelte`: it renders the header, the title, and the nav, and injects `<base href="/">` so the content's root-relative URLs keep working.
- The accordion nav tree is generated at build time by `src/helpers/navLinks.js`, which scans `src/content/` the same way the old `navLinks.json.js` endpoint scanned `src/routes/`.
- Almost everything is prerendered static HTML. Only two islands hydrate in the browser: the nav (`client:load` in the layout, for the accordion and mobile menu) and the Dancing Phantoms page (which repositions images with a `ResizeObserver`).
- The ʻokina (U+02BB) is wrapped in `<span class="okina">` at build time by a rehype plugin in `svelte.config.js`, so CSS can give it a font with a correct advance width.

## Search

Site search is powered by a Vercel serverless function:

- `scripts/build-search-index.mjs` runs at the start of `npm run build` and indexes every page in `src/content/` (title from frontmatter or the first heading, plus the page text with markup stripped) into `api/_search-index.json` (gitignored).
- `api/search.js` is a Vercel serverless function served at `/api/search?q=words`. It ranks pages by term matches (title matches weighted highest, with a bonus for exact phrases) and returns the top results with a snippet around the first match.
- The search box in the nav submits to `/search`, where `src/components/SearchResults.svelte` (a `client:only` island) calls the function and renders the results with matched terms highlighted.

`astro dev` serves only the static site, not `/api`. To exercise search locally, run `npx vercel dev`, or test the function directly by importing its handler after generating the index with `npm run build:search-index`.

## Commands

- `npm run dev` — dev server at http://localhost:4321
- `npm run build` — static build to `dist/`
- `npm run preview` — serve the built site locally
- `npm test` — runs the dev server and the Cypress specs (requires Cypress installed)

## Deployment

`npm run build` produces a fully static site in `dist/` that can be deployed to any static host. On Vercel, the `api/` directory is additionally deployed as serverless functions, which the site search depends on.
