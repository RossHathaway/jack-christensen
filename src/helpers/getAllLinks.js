import fs from 'fs';
import pathLib from 'path';
import { makeReadableName } from './makeReadableNameFromPath';

const pathsToMakeLinksForEvenIfIndexPage = ['src/routes'];

export function getAllLinks(path) {
  const pathName = typeof path === 'object' ? path.name : path;
  let links = [];

  try {
    const dirPath = removeFileEnding(pathName);
    const FSNodeChildren = fs.readdirSync(dirPath, {
      withFileTypes: true,
    });

    const shouldNotMakeLinks =
      !pathsToMakeLinksForEvenIfIndexPage.includes(pathName) &&
      FSNodeChildren.some((sub) => sub.name.startsWith('index'));

    if (shouldNotMakeLinks) {
      // if children array will have index page, make link without children so there are no links in acordion nav, only index page.
      console.log(`path ${path.name} has an index and we return null here`);
      return null;
    }

    for (let i = 0; i < FSNodeChildren.length; i++) {
      const FSChild = FSNodeChildren[i];

      if (FSChild.name.startsWith('_')) continue;

      const childFileName = removeFileEnding(FSChild.name);
      const childPath = pathLib.join(path, childFileName); // is there full path available on dirent?
      const readableName = makeReadableName(childFileName);

      if (FSChild.isFile()) {
        links.push({
          path: childPath,
          name: readableName,
          lastUrlSegment: childFileName,
          children: null,
        });
      } else if (FSChild.isDirectory()) {
        links.push({
          path: childPath,
          name: readableName,
          lastUrlSegment: childFileName,
          children: getAllLinks(childPath),
        });
      }
    }
    console.log('links from inside getAllLinks:', links);
    return links;
  } catch (err) {
    console.log('got an error in getLinks.js function getLinks', err);
  }
}

function removeFileEnding(file) {
  return file.split('.')[0];
}
