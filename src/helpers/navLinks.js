import fs from 'fs';
import path from 'path';
import { makeReadableName } from './makeReadableNameFromPath.js';

// Build-time replacement for the old Sapper navLinks.json / *.json endpoints.
// The site is fully static, so the link trees are generated while pages are
// rendered instead of being fetched from server routes. Resolved from the
// project root because this module runs from Astro's bundled build output.
const CONTENT_ROOT = path.resolve(process.cwd(), 'src/content');

// The Contents nav is organized by frontmatter `tags` instead of by folder, so
// a page can appear in more than one section. Folders still determine URLs;
// tags only control nav placement. Every section shown in the Contents nav is
// listed here in display order — sections with no tagged pages render as empty
// placeholders. Tags used in frontmatter that aren't listed here are appended
// after these.
const CONTENTS_SECTIONS = [
  'architecture',
  'art,-artists',
  'authors',
  'clean-air-team',
  'diet-&-health',
  'exercise',
  'hawaii',
  'hobbies-&-pursuits',
  'japan',
  'language',
  'music',
  'philosophy',
  'photos',
  'psychology',
  'religion',
  'science',
  'travel',
];

// Eagerly importing the MDX modules gives us Astro's parsed frontmatter, so
// tags don't need a hand-rolled YAML parser. These modules are already in the
// build graph via src/pages/[...slug].astro.
const contentsModules = import.meta.glob('../content/contents/**/*.mdx', {
  eager: true,
});

function getContentsSectionLinks() {
  const sections = new Map(CONTENTS_SECTIONS.map((tag) => [tag, []]));

  for (const [file, mod] of Object.entries(contentsModules)) {
    const route = file.replace('../content/', '').replace(/\.mdx$/, '');
    const fileName = removeFileEnding(route.split('/').at(-1));
    // A page without tags falls back to the folder it lives in.
    const tags = mod.frontmatter?.tags ?? [route.split('/')[1]];

    for (const tag of tags) {
      if (!sections.has(tag)) sections.set(tag, []);
      sections.get(tag).push({
        path: route,
        name: makeReadableName(fileName),
        lastUrlSegment: fileName,
        children: null,
      });
    }
  }

  return [...sections.entries()].map(([tag, pages]) => ({
    path: `contents/${tag}`,
    name: makeReadableName(tag),
    lastUrlSegment: tag,
    children: pages,
  }));
}

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
        ? dir === CONTENT_ROOT && entry.name === 'contents'
          ? getContentsSectionLinks()
          : getAllLinks(path.join(dir, entry.name))
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
