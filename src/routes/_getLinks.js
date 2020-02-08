import fs from 'fs';

export function getLinks(path) {
  const paths = fs.readdirSync(path);
  const links = paths.map((path) => {
    const name = path
      .split('-')
      .map(
        (nameSegment) => nameSegment[0].toUpperCase() + nameSegment.substring(1)
      )
      .join(' ');

    return { path, name };
  });

  return links;
}
