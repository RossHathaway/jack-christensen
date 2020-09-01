import fs from 'fs';
import pathLib from 'path';
import { makeReadableName } from './makeReadableNameFromPath';

const pathsToMakeLinksForEvenIfIndexPage = ['src/routes'];
const pathsToIgnore = ['navLinks.json.js']; // must match name property on Dirent object from readdir function

export function getAllLinks(path) {
  const pathName = typeof path === 'object' ? path.name : path;
  const links = [];

  try {
    const dirPath = removeFileEnding(pathName);
    const FSNodeChildren = fs.readdirSync(dirPath, {
      withFileTypes: true,
    });

    const shouldIgnoreParent =
      !pathsToMakeLinksForEvenIfIndexPage.includes(pathName) &&
      FSNodeChildren.some((sub) => sub.name.startsWith('index'));

    if (shouldIgnoreParent) {
      // if children array will have index page, make link without children so there are no links in acordion nav, only index page.
      return null;
    }

    for (let i = 0; i < FSNodeChildren.length; i++) {
      const FSChild = FSNodeChildren[i];
      const shouldIgnoreChild =
        FSChild.name.startsWith('_') || FSChild.name.startsWith('.') || pathsToIgnore.includes(FSChild.name);

      if (shouldIgnoreChild) {
        continue;
      }

      const childFileName = removeFileEnding(FSChild.name);
      const childFullPath = pathLib.join(path, childFileName);
      const childRelativePath = childFullPath.replace('src/routes/', '');
      const readableName = makeReadableName(childFileName);

      links.push({
        path: childRelativePath,
        name: readableName,
        lastUrlSegment: childFileName,
        children: FSChild.isDirectory() ? getAllLinks(childFullPath) : null,
      });
    }
    return links;
  } catch (err) {
    console.log('got an error in getLinks.js function getLinks', err);
  }
}

function removeFileEnding(file) {
  return file.split('.')[0];
}
