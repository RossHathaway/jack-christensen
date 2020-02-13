export function makeReadableName(path) {
  if (!path) return '';
  return path
    .split('-')
    .map(
      (nameSegment) => nameSegment[0].toUpperCase() + nameSegment.substring(1)
    )
    .join(' ');
}
