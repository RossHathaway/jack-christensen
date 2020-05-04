import fs from 'fs';
import pathLib from 'path';
import { makeReadableName } from './makeReadableNameFromPath';

// rootdir/src/routes
export function getAllLinks(path) {
  let links = [];
  try {
    const folderPath = removeFileEnding(path);
    const subFileOrFolders = fs.readdirSync(folderPath, {
      withFileTypes: true,
    });

    if (subFileOrFolders.some((path) => path.name.startsWith('index'))) {
      // if children array will have index page, make link without children so there are no links in acordion nav, only index page.
      return null;
    }

    for (let i = 0; i < subFileOrFolders.length; i++) {
      const subFileOrFolder = subFileOrFolders[i];

      if (subFileOrFolder.name.startsWith('_')) continue;

      const childFileName = removeFileEnding(subFileOrFolder);
      const childPath = pathLib.join(path, childFileName); // is there full path available on dirent?
      const readableName = makeReadableName(childFileName);

      if (path.isFile()) {
        links.push({
          path: childPath,
          name: readableName,
          lastUrlSegment: childFileName,
          children: null,
        });
      } else if (path.isDirectory()) {
        links.push({
          path: childPath,
          name: readableName,
          lastUrlSegment: childFileName,
          children: getAllLinks(childPath),
        });
      }
    }
    return links;
  } catch (err) {
    console.log('got an error in getLinks.js function getLinks', err);
  }
}

function removeFileEnding(file) {
  return file.split('.')[0];
}
