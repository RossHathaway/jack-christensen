export async function genericPreloadForLinks(page, context) {
  try {
    const { path } = page;
    const removedSlashes = path.split('/');
    const lastPathSection = removedSlashes[removedSlashes.length - 1];

    const res = await context.fetch(path + '.json');
    const links = await res.json();

    return { links, lastPathSection };
  } catch (e) {
    console.error(`error getting data from ${path}.json`);
  }
}