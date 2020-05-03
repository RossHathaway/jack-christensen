export function splitUrlOnSlash(path) {
  const trimmedPath = path.endsWith('/') ? path.slice(0, -1) : path;
  const urlSegments = trimmedPath.split('/');
  urlSegments.shift(); // remove empty string from start of array

  return urlSegments;
}
