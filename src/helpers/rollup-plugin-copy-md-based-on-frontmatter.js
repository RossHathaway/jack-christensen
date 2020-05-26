import fs from 'fs';

export default function copy(options = {}) {
  const {
    copyOnce = false,
    flatten = true,
    hook = 'buildEnd',
    targets = [],
    verbose = false,
    ...restPluginOptions
  } = options;

  // for each target, create read stream

  targets.forEach(copyFiles);
}

function copyFiles(target) {
  let isWritingToFile = false;
  let isWritingToFrontMatter = false;
  let frontMatter = '';
  let writableStream;

  fs.createReadStream(target);
  // on data
  if (!isWritingToFile && !isWritingToFrontMatter) {
    // check for ---
    //   if ---, isWritingToFrontMatter = true
    //    frontMatter += buffer
    // } else if {
    //    //    no front matter; start writing file
    //   isWritingToFile = true
    //  }
  } else if (isWritingToFile) {
  } else if (!isWritingToFile && isWritingToFrontMatter) {
    // if buffer contains ---
    // finish adding to frontmatter
    // isWritingToFrontMatter = false
    // isWritingToFile = true
    // pause read stream
    const dest = getDestFromFrontMatter(frontMatter);
    writableStream = fs.createWriteStream(dest);
    // can I pipe this stream to writableStream?
  }

  // on pause of readStream
  getDestFromFrontMatter(frontMatter);
}

function getDestFromFrontMatter(frontMatter) {
  let dest;

  return dest;
}
