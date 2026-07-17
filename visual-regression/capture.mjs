#!/usr/bin/env node
// Capture full-page screenshots of every page in a built `dist/` directory.
//
// Usage:
//   node visual-regression/capture.mjs --dist dist --out visual-regression/shots/head
//
// Discovers pages by walking the static build output for HTML files, serves
// the directory locally, and screenshots each route with Playwright. Writes
// one PNG per route plus a manifest.json mapping routes to files.

import { createServer } from 'node:http';
import { promises as fs } from 'node:fs';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { chromium } from 'playwright';

const { values: args } = parseArgs({
  options: {
    dist: { type: 'string', default: 'dist' },
    out: { type: 'string' },
    width: { type: 'string', default: '1280' },
  },
});

if (!args.out) {
  console.error('Missing required --out <directory>');
  process.exit(1);
}

const distDir = path.resolve(args.dist);
const outDir = path.resolve(args.out);

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
};

async function findPages(dir, base = dir) {
  const routes = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      routes.push(...(await findPages(full, base)));
    } else if (entry.name.endsWith('.html')) {
      const rel = path.relative(base, full).split(path.sep).join('/');
      // foo/index.html -> /foo/, index.html -> /, 404.html -> /404.html
      const route =
        rel === 'index.html'
          ? '/'
          : rel.endsWith('/index.html')
            ? `/${rel.slice(0, -'index.html'.length)}`
            : `/${rel}`;
      routes.push(route);
    }
  }
  return routes;
}

function serveStatic(dir) {
  const server = createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      let filePath = path.join(dir, urlPath);
      if (!filePath.startsWith(dir)) {
        res.writeHead(403).end();
        return;
      }
      const stat = await fs.stat(filePath).catch(() => null);
      if (stat?.isDirectory()) filePath = path.join(filePath, 'index.html');
      const ext = path.extname(filePath).toLowerCase();
      const stream = createReadStream(filePath);
      stream.on('error', () => res.writeHead(404).end('not found'));
      stream.on('open', () => {
        res.writeHead(200, { 'content-type': MIME[ext] ?? 'application/octet-stream' });
        stream.pipe(res);
      });
    } catch {
      res.writeHead(500).end();
    }
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

function routeToFilename(route) {
  const name = route === '/' ? 'index' : route.replace(/^\/|\/$/g, '').replace(/[^a-zA-Z0-9._-]+/g, '_');
  return `${name}.png`;
}

const routes = (await findPages(distDir)).sort();
if (routes.length === 0) {
  console.error(`No HTML pages found in ${distDir} — did the build run?`);
  process.exit(1);
}

await fs.mkdir(outDir, { recursive: true });
const server = await serveStatic(distDir);
const baseUrl = `http://127.0.0.1:${server.address().port}`;

// CHROMIUM_PATH lets environments with a pre-installed browser skip
// `playwright install` (e.g. a system Chromium at a fixed path).
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
});
const context = await browser.newContext({
  viewport: { width: Number(args.width), height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
});

const manifest = {};
const page = await context.newPage();
for (const route of routes) {
  const file = routeToFilename(route);
  await page.goto(baseUrl + route, { waitUntil: 'networkidle' });
  await page.addStyleTag({
    content: `*, *::before, *::after {
      animation: none !important;
      transition: none !important;
      caret-color: transparent !important;
    }`,
  });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(outDir, file), fullPage: true });
  manifest[route] = file;
  console.log(`captured ${route}`);
}

await browser.close();
server.close();
await fs.writeFile(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`\n${routes.length} pages captured to ${outDir}`);
