import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

// Static site, same as the old `sapper export` output: every route becomes
// route/index.html and assets are served from the site root.
export default defineConfig({
  output: 'static',
  integrations: [svelte()],
});
