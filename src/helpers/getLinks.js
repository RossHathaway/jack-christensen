import fs from 'fs';

export function getLinks(path) {
  let links = [];
  try {
    const folderPath = removeFileEnding(path);
    const paths = fs.readdirSync('src/routes' + folderPath);

    links = paths
      .filter((child) => !child.startsWith('index'))
      .map((child) => {
        const childFileName = removeFileEnding(child);
        const childPath = `${folderPath}/${childFileName}`;
        const readableName = makeReadableName(childFileName);

        return { path: childPath, name: readableName };
      });
  } catch (err) {
    console.log('got an error in getLinks.js function getLinks');
  }
  return links;
}

function removeFileEnding(file) {
  return file.split('.')[0];
}

function makeReadableName(path) {
  return path
    .split('-')
    .map(
      (nameSegment) => nameSegment[0].toUpperCase() + nameSegment.substring(1)
    )
    .join(' ');
}
