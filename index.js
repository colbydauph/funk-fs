/* eslint-disable no-sync */
// todo: write tests for this module
'use strict';

// core
const path = require('path');

// modules
const R = require('ramda');

// local
const { forEach, map } = require('./async');
const requireString = require('./lib/require-string');

const fromCallback = (func) => {
  return new Promise((resolve, reject) => {
    func((err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

// local
const { flatMap } = require('./async');

// string -> fs -> [string]
const readDirSync = R.curry((path, fs) => fs.readdirSync(path));

// string -> fs -> string
const readFileSync = R.curry((path, fs) => fs.readFileSync(path));

// string -> fs -> bool
const existsSync = R.curry((path, fs) => fs.existsSync(path));

// string -> fs -> object
const statSync = R.curry((filepath, fs) => fs.statSync(filepath));

// string -> fs -> object
const isDirSync = R.curry((filepath, fs) => statSync(filepath, fs).isDirectory());

// string -> object -> fs -> stream
const createWriteStream = R.curry((filepath, opts, fs) => fs.createWriteStream(filepath, opts));

// string -> fs -> stream
const createReadStream = R.curry((filepath, fs) => fs.createReadStream(filepath));

// @async string -> fs -> object
const stat = R.curry((filepath, fs) => fromCallback((cb) => fs.stat(filepath, cb)));

// @async string -> fs -> boolean
const isDir = R.curry(async (filepath, fs) => (await stat(filepath, fs)).isDirectory());

// @async string -> fs -> boolean
const isFile = R.curry(async (filepath, fs) => (await stat(filepath, fs)).isFile());

// @async string -> fs -> string
const readFile = R.curry((path, fs) => fromCallback((cb) => fs.readFile(path, 'utf8', cb)));

// @async string -> fs -> [string]
const readDir = R.curry((path, fs) => fromCallback((cb) => fs.readdir(path, cb)));

// @async
const writeFile = R.curry((data, filepath, fs) => fromCallback((cb) => fs.writeFile(filepath, data, cb)));

// @async
const mkdirp = R.curry((path, fs) => fromCallback((cb) => fs.mkdirp(path, cb)));

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

// @async require a module from any filesystem
const requireFs = R.curry(async (filepath, fs) => {
  const fileContents = (await readFile(filepath, fs)).toString();
  return requireString(fileContents, filepath);
});

// require a module from any filesystem
const requireSync = R.curry((filepath, fs) => {
  const fileContents = readFileSync(filepath, fs).toString();
  return requireString(fileContents, filepath);
});

// string -> fs
const dirExists = R.curry(async (dirpath, fs) => {
  try {
    return await isDir(dirpath, fs);
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
  createReadStream,
  createWriteStream,
  dirExists,
  exists,
  existsSync,
  isDir,
  isDirSync,
  isFile,
  mkdirp,
  readDir,
  readDirDeep,
  readDirSync,
  readFile,
  readFileSync,
  readTree,
  require: requireFs,
  requireSync,
  stat,
  statSync,
  writeFile,
  writeTree,
};
