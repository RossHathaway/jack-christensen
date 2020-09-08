export function makeReadableName(path) {
  const namesToOverride = [{ 'obama-s-neighborhood': 'Obama\'s Neighborhood' }]
  const indexOfNameToOverride = namesToOverride.findIndex((element) => element[path])

  if (indexOfNameToOverride >= 0) {
    return namesToOverride[indexOfNameToOverride][path]
  }

  if (!path) return '';
  return path
    .split('-')
    .map(
      (nameSegment) => nameSegment[0].toUpperCase() + nameSegment.substring(1)
    )
    .join(' ');
}
