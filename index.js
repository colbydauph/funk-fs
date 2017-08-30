/* eslint-disable no-sync */
// todo: write tests for this module
'use strict';

// core
const path = require('path');
const R = require('ramda');

// files
const { flatMap } = require('./async');

// modules
const Promise = require('bluebird');

const statSync = R.curry((filepath, fs) => fs.statSync(filepath));
const createWriteStream = R.curry((filepath, opts, fs) => fs.createWriteStream(filepath, opts));
const createReadStream = R.curry((filepath, fs) => fs.createReadStream(filepath));

// string -> fs -> object
const isDirSync = R.curry((filepath, fs) => statSync(filepath, fs).isDirectory());
// @async string -> fs -> object
const stat = R.curry((filepath, fs) => Promise.fromCallback((cb) => fs.stat(filepath, cb)));
// @async string -> fs -> boolean
const isDir = R.curry(async (filepath, fs) => (await stat(filepath, fs)).isDirectory());
// @async string -> fs -> string
const readFile = R.curry((path, fs) => Promise.fromCallback((cb) => fs.readFile(path, 'utf8', cb)));
// @async string -> fs -> [string]
const readDir = R.curry((path, fs) => Promise.fromCallback((cb) => fs.readdir(path, cb)));
// @async
const writeFile = R.curry((data, filepath, fs) => Promise.fromCallback((cb) => fs.writeFile(filepath, data, cb)));
// @async
const mkdirp = R.curry((path, fs) => Promise.fromCallback((cb) => fs.mkdirp(path, cb)));

// @async string -> fs -> bool
const exists = R.curry(async (filepath, fs) => {
  try {
    await stat(filepath, fs);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') return false;
    throw err;
  }
});

// @async string -> fs -> [string]
const readDirDeep = R.curry(async (dirPath, fs) => {
  const files = await readDir(dirPath, fs);
  return flatMap(async (file) => {
    const fullFilePath = path.join(dirPath, file);
    if (!await isDir(fullFilePath, fs)) return fullFilePath;
    return await readDirDeep(fullFilePath, fs);
  }, files);
});

// string -> fs -> [string]
const readDirSync = R.curry((path, fs) => fs.readdirSync(path));
// string -> fs -> string
const readFileSync = R.curry((path, fs) => fs.readFileSync(path));
// string -> fs -> bool
const existsSync = R.curry((path, fs) => fs.existsSync(path));

// const writeFiles({});

module.exports = {
  createReadStream,
  createWriteStream,
  exists,
  existsSync,
  isDir,
  isDirSync,
  mkdirp,
  readDirDeep,
  readDirSync,
  readFile,
  readFileSync,
  stat,
  statSync,
  writeFile,
};
