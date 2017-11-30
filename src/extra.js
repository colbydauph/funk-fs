'use strict';

// core
const path = require('path');

// modules
const R = require('ramda');

// local
const { forEach, map, flatMap } = require('../lib/async');
const fromCallback = require('../lib/from-callback');
const requireString = require('../lib/require-string');
const {
  readDir,
  readFile,
  readFileSync,
  stat,
  statSync,
  writeFile,
} = require('./core');

// @async string -> fs -> boolean
const isDir = R.curry(async (filepath, fs) => (await stat(filepath, fs)).isDirectory());
// string -> fs -> object
const isDirSync = R.curry((filepath, fs) => statSync(filepath, fs).isDirectory());

// @async string -> fs -> boolean
const isFile = R.curry(async (filepath, fs) => (await stat(filepath, fs)).isFile());
// string -> fs -> boolean
const isFileSync = R.curry((filepath, fs) => statSync(filepath, fs).isFile());

// @async
// todo: rewrite witout fs.mkdirp
const mkdirp = R.curry((path, fs) => fromCallback((cb) => fs.mkdirp(path, cb)));
const mkdirpSync = R.curry((path, fs) => {
  throw Error('mkdirpSync not implemented');
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

// @async string -> fs -> *
const requireFs = R.curry(async (filepath, fs) => {
  const fileContents = (await readFile(filepath, fs)).toString();
  return requireString(fileContents, filepath);
});

// string -> fs -> *
const requireSync = R.curry((filepath, fs) => {
  const fileContents = readFileSync(filepath, fs).toString();
  return requireString(fileContents, filepath);
});


// string -> fs -> boolean
const dirExists = R.curry(async (dirpath, fs) => {
  try {
    return await isDir(dirpath, fs);
  } catch (err) {
    if (err.code === 'ENOENT') return false;
    throw err;
  }
});
// string -> fs -> boolean
const dirExistsSync = R.curry((dirpath, fs) => {
  try {
    return isDirSync(dirpath, fs);
  } catch (err) {
    if (err.code === 'ENOENT') return false;
    throw err;
  }
});


// string -> fs -> boolean
const fileExists = R.curry(async (filepath, fs) => {
  try {
    return await isFile(filepath, fs);
  } catch (err) {
    if (err.code === 'ENOENT') return false;
    throw err;
  }
});
// string -> fs -> boolean
const fileExistsSync = R.curry((filepath, fs) => {
  try {
    return isFileSync(filepath, fs);
  } catch (err) {
    if (err.code === 'ENOENT') return false;
    throw err;
  }
});

// string -> object -> fs -> undefined
const writeTree = R.curry(async (root, tree, fs) => {
  // eslint-disable-next-line max-statements
  await forEach(async ([filepath, value]) => {
    const absFilepath = path.join(root, filepath);
    const hasChildren = (typeof value === 'object');
    // todo: does an empty object write an empty dir?
    let fileIsDir = await dirExists(absFilepath, fs);

    if (hasChildren && !fileIsDir) {
      await mkdirp(absFilepath, fs);
      fileIsDir = true;
    }
  
    if (!fileIsDir && hasChildren) throw Error('Cannot write dir to file');
    if (fileIsDir) return writeTree(absFilepath, value, fs);
    await writeFile(value, absFilepath, fs);
  }, R.toPairs(tree));
});

// string -> fs -> object
// todo: use async/mapObjValues
const readTree = R.curry(async (root, fs) => {
  const files = await readDir(root, fs);
  
  const filesPairs = await map(async (filepath) => {
    const absFilepath = path.join(root, filepath);
    
    const res = (await dirExists(absFilepath, fs))
      ? await readTree(absFilepath, fs)
      : await readFile(absFilepath, fs);

    return [filepath, res];
  }, files);
  return R.fromPairs(filesPairs);
});


module.exports = {
  dirExists,
  dirExistsSync,
  fileExists,
  fileExistsSync,
  isDir,
  isDirSync,
  isFile,
  isFileSync,
  mkdirp,
  mkdirpSync,
  readDirDeep,
  readTree,
  require: requireFs,
  requireFs,
  requireSync,
  writeTree,
};
