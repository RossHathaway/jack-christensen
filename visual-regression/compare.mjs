#!/usr/bin/env node
// Compare two screenshot directories produced by capture.mjs and report
// per-page visual differences.
//
// Usage:
//   node visual-regression/compare.mjs \
//     --base visual-regression/shots/base \
//     --head visual-regression/shots/head \
//     --out  visual-regression/report
//
// Writes diff PNGs for changed pages, summary.md (markdown table), and
// summary.json. Exits non-zero with --fail-on-diff if anything changed.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const { values: args } = parseArgs({
  options: {
    base: { type: 'string' },
    head: { type: 'string' },
    out: { type: 'string' },
    'base-label': { type: 'string', default: 'base' },
    'head-label': { type: 'string', default: 'head' },
    'fail-on-diff': { type: 'boolean', default: false },
    threshold: { type: 'string', default: '0.1' },
  },
});

for (const required of ['base', 'head', 'out']) {
  if (!args[required]) {
    console.error(`Missing required --${required}`);
    process.exit(1);
  }
}

const baseDir = path.resolve(args.base);
const headDir = path.resolve(args.head);
const outDir = path.resolve(args.out);
const diffDir = path.join(outDir, 'diffs');
await fs.mkdir(diffDir, { recursive: true });

async function readManifest(dir) {
  return JSON.parse(await fs.readFile(path.join(dir, 'manifest.json'), 'utf8'));
}

async function readPng(file) {
  return PNG.sync.read(await fs.readFile(file));
}

// Pad an image to the given dimensions (transparent fill) so pages that
// changed height can still be diffed pixel-for-pixel.
function padTo(img, width, height) {
  if (img.width === width && img.height === height) return img;
  const out = new PNG({ width, height });
  PNG.bitblt(img, out, 0, 0, img.width, img.height, 0, 0);
  return out;
}

const baseManifest = await readManifest(baseDir);
const headManifest = await readManifest(headDir);
const routes = [...new Set([...Object.keys(baseManifest), ...Object.keys(headManifest)])].sort();

const results = [];
for (const route of routes) {
  const inBase = route in baseManifest;
  const inHead = route in headManifest;
  if (!inBase) {
    results.push({ route, status: 'added' });
    continue;
  }
  if (!inHead) {
    results.push({ route, status: 'removed' });
    continue;
  }

  const baseImg = await readPng(path.join(baseDir, baseManifest[route]));
  const headImg = await readPng(path.join(headDir, headManifest[route]));
  const width = Math.max(baseImg.width, headImg.width);
  const height = Math.max(baseImg.height, headImg.height);
  const a = padTo(baseImg, width, height);
  const b = padTo(headImg, width, height);
  const diff = new PNG({ width, height });
  const diffPixels = pixelmatch(a.data, b.data, diff.data, width, height, {
    threshold: Number(args.threshold),
  });

  if (diffPixels === 0) {
    results.push({ route, status: 'unchanged' });
    continue;
  }

  const diffFile = path.join('diffs', baseManifest[route]);
  await fs.writeFile(path.join(outDir, diffFile), PNG.sync.write(diff));
  results.push({
    route,
    status: 'changed',
    diffPixels,
    diffPercent: Number(((diffPixels / (width * height)) * 100).toFixed(2)),
    dimensionsChanged:
      baseImg.width !== headImg.width || baseImg.height !== headImg.height
        ? `${baseImg.width}x${baseImg.height} -> ${headImg.width}x${headImg.height}`
        : null,
    diffImage: diffFile,
  });
}

const counts = { changed: 0, added: 0, removed: 0, unchanged: 0 };
for (const r of results) counts[r.status]++;

const icon = { changed: '🔴', added: '🟡', removed: '🟠', unchanged: '🟢' };
const lines = [];
lines.push(`# Visual regression: \`${args['head-label']}\` vs \`${args['base-label']}\``);
lines.push('');
lines.push(
  `**${counts.changed} changed**, ${counts.added} added, ${counts.removed} removed, ${counts.unchanged} unchanged (${results.length} pages total)`
);
lines.push('');

const interesting = results.filter((r) => r.status !== 'unchanged');
if (interesting.length === 0) {
  lines.push('✅ No visual differences detected on any page.');
} else {
  lines.push('| Page | Status | Pixels changed | Notes |');
  lines.push('| --- | --- | ---: | --- |');
  for (const r of interesting) {
    const pixels = r.status === 'changed' ? `${r.diffPixels.toLocaleString()} (${r.diffPercent}%)` : '—';
    const notes = [
      r.dimensionsChanged ? `page size ${r.dimensionsChanged}` : null,
      r.diffImage ? `diff: \`${r.diffImage}\`` : null,
      r.status === 'added' ? 'new page, no baseline' : null,
      r.status === 'removed' ? 'page no longer exists' : null,
    ]
      .filter(Boolean)
      .join('; ');
    lines.push(`| \`${r.route}\` | ${icon[r.status]} ${r.status} | ${pixels} | ${notes} |`);
  }
}
lines.push('');

const summaryMd = lines.join('\n');
await fs.writeFile(path.join(outDir, 'summary.md'), summaryMd);
await fs.writeFile(
  path.join(outDir, 'summary.json'),
  JSON.stringify({ base: args['base-label'], head: args['head-label'], counts, results }, null, 2)
);

console.log(summaryMd);

if (args['fail-on-diff'] && counts.changed + counts.added + counts.removed > 0) {
  process.exit(1);
}
