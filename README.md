# Jack Shields Christensen

A static memorial site commemorating the life and work of Jack Shields Christensen,
built with [Eleventy (11ty)](https://www.11ty.dev/). (Previously built with Svelte/Sapper.)

## Structure

- `site/` — the Eleventy input directory.
  - `site/**/*.md` — content pages. Their URLs mirror the folder structure
    (e.g. `site/contents/japan/first-morning-in-tokyo.md` → `/contents/japan/first-morning-in-tokyo/`).
  - `site/_data/nav.js` — builds the sidebar navigation tree by scanning the
    content folders. A folder containing an `index` page collapses to a single
    link; an empty folder (just a `.gitkeep`) renders as a disabled label.
  - `site/_includes/base.njk` — the page shell (logo, title, nav, content region).
  - `site/_includes/partials/` — reusable markup (nav, logos, the antipollution
    ad frame, the personal religious symbol explanation).
  - `site/_includes/wrappers/` — page layouts that add headers/footers around the
    content (the former Svelte `DocumentWrapper`, `PoemWrapper`, etc.).
- `static/` — assets (CSS, images, logos, manifest) copied to the site root.
- `.eleventy.js` — Eleventy config: passthrough copy, markdown options, the
  ʻokina wrapping transform, and the `quoteWrapper` / `poemList` shortcodes.

Page-level `<style>` blocks are scoped to the content region (`#observe-resize`)
so they behave like the old component-scoped Svelte styles and don't leak into
the shared navigation/header.

## Development

- `npm install` — install dependencies.
- `npm run dev` — serve locally with live reload at <http://localhost:8080>.
- `npm run build` — build the static site into `_site/`.
- `npm test` — run the Cypress smoke tests against the dev server.

## Deployment

`npm run build` produces a fully static site in `_site/` that can be deployed to
any static host.
