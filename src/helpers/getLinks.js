import fs from 'fs';

export function getLinks(path) {
  // console.log('cwd', process.cwd());
  const folderPath = path.split('.')[0];
  const paths = fs.readdirSync('src/routes' + folderPath);
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
