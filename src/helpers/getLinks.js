import fs from 'fs';
import { makeReadableName } from './makeReadableNameFromPath';

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

        return { path: childPath, name: readableName, lastUrlSegment: child };
      });
  } catch (err) {
    console.log('got an error in getLinks.js function getLinks');
  }
  return links;
}

function removeFileEnding(file) {
  return file.split('.')[0];
}
