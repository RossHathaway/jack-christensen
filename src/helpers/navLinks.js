import fs from 'fs';
import path from 'path';
import { makeReadableName } from './makeReadableNameFromPath.js';

// Build-time replacement for the old Sapper navLinks.json / *.json endpoints.
// The site is fully static, so the link trees are generated while pages are
// rendered instead of being fetched from server routes. Resolved from the
// project root because this module runs from Astro's bundled build output.
const CONTENT_ROOT = path.resolve(process.cwd(), 'src/content');

export function getAllLinks(dir = CONTENT_ROOT) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  // A folder that contains an index page is represented by that single page,
  // so it gets no child links in the accordion nav. The content root is the
  // exception: its index page is the home page, not a folder listing.
  if (
    dir !== CONTENT_ROOT &&
    entries.some((e) => e.name.startsWith('index') && e.name.endsWith('.mdx'))
  ) {
    return null;
  }

  const links = [];
  for (const entry of entries) {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue;
    // Only MDX files are pages; folders may also hold extracted per-page
    // .css files, which must not become nav links.
    if (entry.isFile() && !entry.name.endsWith('.mdx')) continue;

    const childFileName = removeFileEnding(entry.name);
    const routePath = path
      .relative(CONTENT_ROOT, path.join(dir, childFileName))
      .split(path.sep)
      .join('/');

    links.push({
      path: routePath,
      name: makeReadableName(childFileName),
      lastUrlSegment: childFileName,
      children: entry.isDirectory()
        ? getAllLinks(path.join(dir, entry.name))
        : null,
    });
  }
  return links;
}

// Links to the sibling pages of a folder's index page, e.g. the poems listed
// on /featured/poems/single-sentence-poems/triptych.
export function getSiblingLinks(folderRoute) {
  const dir = path.join(CONTENT_ROOT, folderRoute);
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter(
      (e) =>
        e.isFile() &&
        e.name.endsWith('.mdx') &&
        !e.name.startsWith('index') &&
        !e.name.startsWith('.')
    )
    .map((e) => {
      const childFileName = removeFileEnding(e.name);
      return {
        path: `/${folderRoute}/${childFileName}`,
        name: makeReadableName(childFileName),
        lastUrlSegment: childFileName,
      };
    });
}

function removeFileEnding(file) {
  return file.split('.')[0];
}
