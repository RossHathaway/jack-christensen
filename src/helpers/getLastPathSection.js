export function getLastPathSection(path) {
  const trimmedPath = path.endsWith('/') ? path.slice(0, -1) : path;
  const removedSlashes = trimmedPath.split('/');
  const lastPathSection = removedSlashes[removedSlashes.length - 1];

  return lastPathSection;
}
