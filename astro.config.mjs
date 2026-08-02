import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import svelte from '@astrojs/svelte';

// Remark plugin: undo MDX's paragraph-wrapping of text that the old mdsvex
// pipeline rendered as bare text. Under CommonMark, a raw HTML block swallows
// every line contiguous with the tag (until a blank line), so mdsvex left
// such text unwrapped; MDX parses JSX children as markdown and wraps the same
// text in <p> elements, whose margins visibly loosened captions, quotes, and
// header blocks all over the site. Using source positions, unwrap paragraphs
// that sit tight against a JSX tag: the first child on the line right after
// its parent's opening tag, or any paragraph starting on the line right after
// a JSX sibling (a <br />, <footer>, comment, ...) ends.
function unwrapHtmlBlockParagraphs() {
  const JSXISH = new Set(['mdxJsxFlowElement', 'mdxFlowExpression']);

  function visit(node) {
    if (!node.children) return;
    const out = [];
    node.children.forEach((child, i) => {
      let bare = false;
      if (child.type === 'paragraph' && child.position) {
        const prev = node.children[i - 1];
        if (
          !prev &&
          JSXISH.has(node.type) &&
          node.position &&
          child.position.start.line - node.position.start.line <= 1
        ) {
          bare = true; // contiguous with the parent's opening tag
        } else if (
          prev &&
          JSXISH.has(prev.type) &&
          prev.position &&
          child.position.start.line - prev.position.end.line <= 1
        ) {
          bare = true; // contiguous run following a raw tag or expression
        }
      }
      out.push(...(bare ? child.children : [child]));
    });
    node.children = out;
    node.children.forEach(visit);
  }

  return (tree) => visit(tree);
}

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
  // Pages named after their own folder used to be served with the segment
  // repeated; keep the old URLs working.
  redirects: {
    '/about-uncle-jack/about-uncle-jack': '/about-uncle-jack',
    '/contents/clean-air-team/clean-air-team': '/contents/clean-air-team',
    '/featured/mahatma-gandhi/mahatma-gandhi': '/featured/mahatma-gandhi',
    '/featured/the-mature-american/the-mature-american': '/featured/the-mature-american',
  },
  // The unified (remark/rehype) processor instead of Astro's default one:
  // custom plugins only run through `markdown.processor`, and the MDX
  // integration inherits this pipeline. `dashes: true` matches mdsvex's
  // typography from the old .svx content (`--` becomes an em dash).
  markdown: {
    processor: unified({
      smartypants: { dashes: true },
      remarkPlugins: [unwrapHtmlBlockParagraphs],
      rehypePlugins: [wrapOkina],
    }),
  },
  integrations: [mdx(), svelte()],
});
