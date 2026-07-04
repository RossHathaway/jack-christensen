import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { makeReadableName } from '../src/helpers/makeReadableNameFromPath.js';

// Builds the search index consumed by the Vercel serverless function in
// api/search.js. Runs before `astro build` (see the build script in
// package.json) so the index always matches the deployed pages. Every file
// in src/content is a page, so indexing the content tree indexes the site.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT_ROOT = path.join(ROOT, 'src', 'content');
// The leading underscore keeps Vercel from serving the index as a function.
const OUT_FILE = path.join(ROOT, 'api', '_search-index.json');

function collectContentFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name.startsWith('_')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectContentFiles(full));
    } else if (/\.(svx|svelte)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function routeForFile(file) {
  const rel = path
    .relative(CONTENT_ROOT, file)
    .replace(/\.(svx|svelte)$/, '')
    .split(path.sep)
    .join('/');
  if (rel === 'index') return '/';
  if (rel.endsWith('/index')) return '/' + rel.slice(0, -'/index'.length);
  return '/' + rel;
}

// Named entities used in the content, so snippets show real characters.
const NAMED_ENTITIES = {
  nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'",
  ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’',
  hellip: '…', mdash: '—', ndash: '–',
  Amacr: 'Ā', amacr: 'ā', Emacr: 'Ē', emacr: 'ē', Imacr: 'Ī', imacr: 'ī',
  Omacr: 'Ō', omacr: 'ō', Umacr: 'Ū', umacr: 'ū',
};

function decodeEntities(text) {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&([a-zA-Z]+);/g, (_, name) => NAMED_ENTITIES[name] ?? ' ');
}

// Reduces an .svx or .svelte source to its title and readable text.
function extractPage(source) {
  let title = null;

  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (frontmatter) {
    const titleLine = frontmatter[1].match(/^title:\s*(.+)$/m);
    if (titleLine) title = titleLine[1].trim().replace(/^['"]|['"]$/g, '');
    source = source.slice(frontmatter[0].length);
  }

  source = source
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');

  if (!title) {
    const heading =
      source.match(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/i) ||
      source.match(/^#{1,2}\s+(.+)$/m);
    if (heading) {
      title = heading[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    }
  }
  if (title) title = decodeEntities(title);

  const text = decodeEntities(source
    .replace(/\{[#/:@][^}]*\}/g, ' ') // svelte logic blocks
    .replace(/\{[^}]*\}/g, ' ') // svelte expressions
    .replace(/<[^>]+>/g, ' ') // html / component tags
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, ' $1 ') // markdown images -> alt text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, ' $1 ') // markdown links -> link text
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_`~]+/g, ''))
    .replace(/\s+/g, ' ')
    .trim();

  return { title, text };
}

const pages = [];
for (const file of collectContentFiles(CONTENT_ROOT)) {
  const url = routeForFile(file);
  const { title, text } = extractPage(fs.readFileSync(file, 'utf8'));
  const fallbackName =
    url === '/' ? 'Home' : makeReadableName(url.split('/').at(-1));
  if (!text && !title) continue;
  pages.push({ url, title: title || fallbackName, text });
}

pages.sort((a, b) => a.url.localeCompare(b.url));

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, JSON.stringify(pages));
console.log(`Search index: ${pages.length} pages -> ${path.relative(ROOT, OUT_FILE)}`);
