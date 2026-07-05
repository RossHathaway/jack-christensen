import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import svelte from '@astrojs/svelte';

// Rehype plugin: wrap every U+02BB (ʻokina) in <span class="okina"> so that
// the CSS can give it the correct font and layout, avoiding the overlap caused
// by Gelasio's near-zero advance width for this character. (Carried over from
// the mdsvex config that processed the content before it moved to MDX.)
function wrapOkina() {
  const OKINA = 'ʻ'; // U+02BB modifier letter turned comma

  function processNode(node) {
    if (!node.children) return;
    const newChildren = [];
    for (const child of node.children) {
      if (child.type === 'text' && child.value.includes(OKINA)) {
        const parts = child.value.split(OKINA);
        parts.forEach((part, i) => {
          if (i > 0) {
            newChildren.push({
              type: 'element',
              tagName: 'span',
              properties: { className: ['okina'] },
              children: [{ type: 'text', value: OKINA }],
            });
          }
          if (part) newChildren.push({ type: 'text', value: part });
        });
      } else {
        processNode(child);
        newChildren.push(child);
      }
    }
    node.children = newChildren;
  }

  return (tree) => processNode(tree);
}

// Static site, same as the old `sapper export` output: every route becomes
// route/index.html and assets are served from the site root. Content pages
// are MDX; Svelte remains only for the hydrated islands (Nav, SearchResults).
export default defineConfig({
  output: 'static',
  // The unified (remark/rehype) processor instead of Astro's default one:
  // custom plugins only run through `markdown.processor`, and the MDX
  // integration inherits this pipeline. `dashes: true` matches mdsvex's
  // typography from the old .svx content (`--` becomes an em dash).
  markdown: {
    processor: unified({
      smartypants: { dashes: true },
      rehypePlugins: [wrapOkina],
    }),
  },
  integrations: [mdx(), svelte()],
});
