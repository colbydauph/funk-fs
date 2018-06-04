'use strict';

// core
const { dirname, join: joinPath } = require('path');

// modules
const R = require('ramda');
const { forEach, map, flatMap } = require('funk-lib/async');

// local
const requireString = require('../lib/require-string');
const {
  copyFile,
  copyFileSync,
  mkdir,
  mkdirSync,
  readDir,
  readDirSync,
  readFile,
  readFileSync,
  stat,
  statSync,
  writeFile,
  // writeFileSync,
} = require('./core');

// string -> fs -> boolean
const isDir = R.curry(async (filepath, fs) => (await stat(filepath, fs)).isDirectory());
const isDirSync = R.curry((filepath, fs) => statSync(filepath, fs).isDirectory());

// string -> fs -> boolean
const isFile = R.curry(async (filepath, fs) => (await stat(filepath, fs)).isFile());
const isFileSync = R.curry((filepath, fs) => statSync(filepath, fs).isFile());

// string -> fs -> undefined
const mkdirp = R.curry(async (path, fs) => {
  try {
    return await mkdir(path, fs);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
    // recursively make parent dir
    await mkdirp(dirname(path), fs);
    // retry original
    return await mkdirp(path, fs);
  }
});
const mkdirpSync = R.curry((path, fs) => {
  try {
    return mkdirSync(path, fs);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
    // recursively make parent dir
    mkdirpSync(dirname(path), fs);
    // retry original
    return mkdirpSync(path, fs);
  }
});

// string -> fs -> [string]
const readDirDeep = R.curry(async (dirPath, fs) => {
  const files = await readDir(dirPath, fs);
  return flatMap(async (file) => {
    const fullFilePath = joinPath(dirPath, file);
    if (!await isDir(fullFilePath, fs)) return fullFilePath;
    return await readDirDeep(fullFilePath, fs);
  }, files);
});
const readDirDeepSync = R.curry((dirPath, fs) => {
  const files = readDirSync(dirPath, fs);
  const fileArrs = files.map((file) => {
    const fullFilePath = joinPath(dirPath, file);
    if (!isDirSync(fullFilePath, fs)) return fullFilePath;
    return readDirDeepSync(fullFilePath, fs);
  });
  return [].concat(...fileArrs);
});

// string -> fs -> *
const requireFs = R.curry(async (filepath, fs) => {
  const fileContents = (await readFile(filepath, fs)).toString();
  return requireString(fileContents, filepath);
});
const requireFsSync = R.curry((filepath, fs) => {
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
const fileExistsSync = R.curry((filepath, fs) => {
  try {
    return isFileSync(filepath, fs);
  } catch (err) {
    if (err.code === 'ENOENT') return false;
    throw err;
  }
});

// string -> fs -> object
const readTreeWith = R.curry(async (pred, root, fs) => {
  const files = await readDir(root, fs);
  
  const filesPairs = await map(async (filepath) => {
    const absFilepath = joinPath(root, filepath);
    
    const res = (await dirExists(absFilepath, fs))
      ? await readTreeWith(pred, absFilepath, fs)
      : await pred(absFilepath, fs);

    return [filepath, res];
  }, files);
  return R.fromPairs(filesPairs);
});

// requireTree = readTree(requireFs);
const readTree = readTreeWith(readFile);

// string -> object -> fs -> undefined
const writeTree = R.curry(async (root, tree, fs) => {
  if (!await dirExists(root, fs)) await mkdir(root, fs);
  
  // eslint-disable-next-line max-statements
  await forEach(async ([filepath, value]) => {
    const absFilepath = joinPath(root, filepath);

    return (typeof value === 'object')
      ? writeTree(absFilepath, value, fs)
      : writeFile(value, absFilepath, fs);

  }, R.toPairs(tree));
});

// copy file or directory (recursive)
const copy = R.curry(async (source, target, fs) => {
  if (await isFile(source, fs)) return await copyFile(source, target, fs);
  if (!await dirExists(target, fs)) await mkdirp(target, fs);
  const files = await readDir(source, fs);
  await forEach((file) => copy(
    joinPath(source, file),
    joinPath(target, file),
    fs,
  ), files);
});

// copy file or directory (recursive)
const copySync = R.curry((source, target, fs) => {
  if (isFileSync(source, fs)) return copyFileSync(source, target, fs);
  if (!dirExistsSync(target, fs)) mkdirpSync(target, fs);
  const files = readDirSync(source, fs);
  R.forEach((file) => copySync(
    joinPath(source, file),
    joinPath(target, file),
    fs,
  ), files);
});

const fileSize = R.curry(async (path, fs) => (await stat(path, fs)).size);
const fileSizeSync = R.curry((path, fs) => statSync(path, fs).size);

module.exports = {
  copy,
  copySync,
  dirExists,
  dirExistsSync,
  fileExists,
  fileExistsSync,
  fileSize,
  fileSizeSync,
  isDir,
  isDirSync,
  isFile,
  isFileSync,
  mkdirp,
  mkdirpSync,
  readDirDeep,
  readDirDeepSync,
  readTree,
  readTreeWith,
  require: requireFs,
  requireSync: requireFsSync,
  writeTree,
};
