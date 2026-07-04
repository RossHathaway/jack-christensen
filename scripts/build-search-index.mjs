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

function componentImports(source, fromFile) {
  return [...source.matchAll(/import\s+(\w+)\s+from\s+['"]([^'"]+\.svelte)['"]/g)]
    .map((m) => ({
      name: m[1],
      file: path.resolve(path.dirname(fromFile), m[2]),
    }));
}

// Reduces an .svx or .svelte file to its title and readable text. Text
// rendered by an imported component belongs to the page too, so component
// text is inlined — but only for components unique to a single page
// (see uniquePageComponents below); components shared between pages are
// layout boilerplate whose text would repeat across the whole index.
function extractFile(file, { inlineComponents, inlineAll = false, visited = new Set() }) {
  if (visited.has(file) || !fs.existsSync(file)) return { title: null, text: '' };
  visited.add(file);

  let source = fs.readFileSync(file, 'utf8');
  let title = null;

  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (frontmatter) {
    const titleLine = frontmatter[1].match(/^title:\s*(.+)$/m);
    if (titleLine) title = titleLine[1].trim().replace(/^['"]|['"]$/g, '');
    source = source.slice(frontmatter[0].length);
  }

  const imports = componentImports(source, file);

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

  let text = decodeEntities(
    source
      .replace(/\{[#/:@][^}]*\}/g, ' ') // svelte logic blocks
      .replace(/\{[^}]*\}/g, ' ') // svelte expressions
      .replace(/<[^>]+>/g, ' ') // html / component tags
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, ' $1 ') // markdown images -> alt text
      .replace(/\[([^\]]*)\]\([^)]*\)/g, ' $1 ') // markdown links -> link text
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/[*_`~]+/g, '')
  );

  for (const imp of imports) {
    if (!inlineAll && !inlineComponents.has(imp.file)) continue;
    // Only imports actually rendered in the markup contribute text.
    if (!new RegExp(`<${imp.name}(\\s|/|>)`).test(source)) continue;
    // Everything nested inside an inlined component is part of it.
    const child = extractFile(imp.file, { inlineComponents, inlineAll: true, visited });
    if (child.text) text += ' ' + child.text;
  }

  return { title, text: text.replace(/\s+/g, ' ').trim() };
}

const contentFiles = collectContentFiles(CONTENT_ROOT);

// Components imported by exactly one page hold that page's content;
// components imported by several pages are shared layout chrome.
const importCounts = new Map();
for (const file of contentFiles) {
  for (const imp of componentImports(fs.readFileSync(file, 'utf8'), file)) {
    importCounts.set(imp.file, (importCounts.get(imp.file) ?? 0) + 1);
  }
}
const uniquePageComponents = new Set(
  [...importCounts].filter(([, count]) => count === 1).map(([file]) => file)
);

const pages = [];
for (const file of contentFiles) {
  const url = routeForFile(file);
  const { title, text } = extractFile(file, { inlineComponents: uniquePageComponents });
  const fallbackName =
    url === '/' ? 'Home' : makeReadableName(url.split('/').at(-1));
  if (!text && !title) continue;
  pages.push({ url, title: title || fallbackName, text });
}

pages.sort((a, b) => a.url.localeCompare(b.url));

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, JSON.stringify(pages));
console.log(`Search index: ${pages.length} pages -> ${path.relative(ROOT, OUT_FILE)}`);
