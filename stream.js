'use strict';

// core
const stream = require('stream');

// modules
const R = require('ramda');

const noop = R.always(undefined);
const { Readable: ReadableStream } = stream;

const pipe = R.invoker(1, 'pipe');

// stream -> string
const toString = async (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    /* eslint-disable indent */
    stream.on('data', (chunk) => chunks.push(chunk.toString()))
          .on('end', () => resolve(chunks.join('')))
          .on('error', reject);
    /* eslint-enable indent */
  });
};

// string -> stream
const fromString = (string) => {
  const stream = new ReadableStream();
  // eslint-disable-next-line no-underscore-dangle
  stream._read = noop;
  stream.push(string);
  stream.push(null);
  return stream;
};


module.exports = {
  fromString,
  toString,
  pipe,
};
