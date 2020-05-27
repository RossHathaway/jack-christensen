import fs from 'fs';

export default function copy(options = {}) {
  const {
    makeDestinationFromFrontMatter = makeDestFromFrontMatter,
    hook = 'buildEnd',

    copyOnce = false,
    targets = [],
    verbose = false,
    ...restPluginOptions
  } = options;

  targets.forEach(copyFile);
}

/*
The moment that backpressure is triggered can be narrowed exactly to the return value of a Writable's .write() function. This return value is determined by a few conditions, of course.

In any scenario where the data buffer has exceeded the highWaterMark or the write queue is currently busy, .write() will return false.

When a false value is returned, the backpressure system kicks in. It will pause the incoming Readable stream from sending any data and wait until the consumer is ready again. Once the data buffer is emptied, a 'drain' event will be emitted and resume the incoming data flow.

Once the queue is finished, backpressure will allow data to be sent again. The space in memory that was being used will free itself up and prepare for the next batch of data.
*/
function copyFile(target) {
  let isWritingToFile = false;
  let isWritingToFrontMatter = false;
  let frontMatter = '';
  let writeStream;
  const readStream = fs.createReadStream(target);

  readStream.on('readable', function handleChunkFromReadStream() {
    const chunk = readStream.read();

    if (isWritingToFile) {
      writeStream.write(chunk);
    } else {
      // write to frontMatter
      if (isWritingToFrontMatter) {
        frontMatter += chunk;

        if (chunk.lastIndexOf('---') > 2) {
          // finished collecting front matter
          const frontMatterSections = frontMatter.split('---');
          const frontMatterWithoutBoundaries = frontMatterSections[1];
          const startOfDocument = frontMatterSections[3];

          isWritingToFile = true;
          // pause read stream if async??????????????????
          const dest = makeDestFromFrontMatter(frontMatterWithoutBoundaries);
          writeStream = fs.createWriteStream(dest);
          writeStream.write(startOfDocument);
        }
      } else {
        // start of readstream;
        const hasFrontMatterInChunk =
          (chunk.length >= 3 && chunk.startsWith('---')) ||
          chunk === '-' ||
          chunk === '--';
        if (hasFrontMatterInChunk) {
          isWritingToFrontMatter = true;
          frontMatter += chunk;
        } else {
          // no front matter; start writing file
          isWritingToFile = true;
          writeStream = fs.createWriteStream(/* need to accept target if we want to allow specified destinations */);
        }
      }
    }
  });
}

function makeDestFromFrontMatter(frontMatter) {
  let dest;

  return dest;
}
