import { defineConfig, fontProviders } from 'astro/config';
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
  // Prefetch every internal link's HTML as it scrolls into view. Pages are
  // small static documents, and `viewport` also covers touch devices where
  // `hover` never fires; Astro skips prefetching on slow/data-saver
  // connections automatically.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
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
  // Self-hosted fonts, served as hashed woff2 from /_astro/fonts. The files
  // in src/assets/fonts are Google Fonts' own latin and latin-ext subset
  // builds (400 normal only, matching what the old render-blocking
  // css?family=Gelasio|Galindo|Noto+Serif link served; bold/italic stay
  // browser-synthesized), with each variant's unicode-range copied from the
  // Google CSS so browsers still skip subsets a page doesn't use. The ʻokina
  // (U+02BB) is in the latin range. The generated @font-face names are
  // hashed, so all CSS must reference the --font-* variables.
  fonts: [
    localGoogleSubsets({
      name: 'Gelasio',
      cssVariable: '--font-gelasio',
      fallbacks: ['Georgia', 'serif'],
      files: {
        latin: './src/assets/fonts/gelasio-400-latin.woff2',
        latinExt: './src/assets/fonts/gelasio-400-latin-ext.woff2',
      },
    }),
    // Only used for the ʻokina (see wrapOkina above): Gelasio's U+02BB has
    // a near-zero advance width, Noto Serif's is correct.
    localGoogleSubsets({
      name: 'Noto Serif',
      cssVariable: '--font-noto-serif',
      fallbacks: ['serif'],
      files: {
        latin: './src/assets/fonts/noto-serif-400-latin.woff2',
        latinExt: './src/assets/fonts/noto-serif-400-latin-ext.woff2',
      },
    }),
    localGoogleSubsets({
      name: 'Galindo',
      cssVariable: '--font-galindo',
      fallbacks: ['cursive', 'sans-serif'],
      files: {
        latin: './src/assets/fonts/galindo-400-latin.woff2',
        latinExt: './src/assets/fonts/galindo-400-latin-ext.woff2',
      },
    }),
  ],
});

// A local-provider font family from Google's latin/latin-ext subset files,
// with the unicode-range values Google's CSS serves for those subsets.
function localGoogleSubsets({ name, cssVariable, fallbacks, files }) {
  const LATIN_RANGE = [
    'U+0000-00FF', 'U+0131', 'U+0152-0153', 'U+02BB-02BC', 'U+02C6',
    'U+02DA', 'U+02DC', 'U+0304', 'U+0308', 'U+0329', 'U+2000-206F',
    'U+20AC', 'U+2122', 'U+2191', 'U+2193', 'U+2212', 'U+2215',
    'U+FEFF', 'U+FFFD',
  ];
  const LATIN_EXT_RANGE = [
    'U+0100-02BA', 'U+02BD-02C5', 'U+02C7-02CC', 'U+02CE-02D7',
    'U+02DD-02FF', 'U+0304', 'U+0308', 'U+0329', 'U+1D00-1DBF',
    'U+1E00-1E9F', 'U+1EF2-1EFF', 'U+2020', 'U+20A0-20AB',
    'U+20AD-20C0', 'U+2113', 'U+2C60-2C7F', 'U+A720-A7FF',
  ];
  return {
    provider: fontProviders.local(),
    name,
    cssVariable,
    fallbacks,
    options: {
      variants: [
        {
          src: [files.latin],
          weight: 400,
          style: 'normal',
          unicodeRange: LATIN_RANGE,
        },
        {
          src: [files.latinExt],
          weight: 400,
          style: 'normal',
          unicodeRange: LATIN_EXT_RANGE,
        },
      ],
    },
  };
}
