import { getLastPathSection } from './getLastPathSection';

export async function genericPreloadForLinks(page, context) {
  try {
    const { path } = page;
    const trimmedPath = path.endsWith('/') ? path.slice(0, -1) : path;
    const removedSlashes = trimmedPath.split('/');
    const lastPathSection = removedSlashes[removedSlashes.length - 1];

    const res = await context.fetch(trimmedPath + '.json');
    const links = await res.json();

    return { links, lastPathSection };
  } catch (e) {
    console.error(`error getting data from ${path}.json`);
  }
}
