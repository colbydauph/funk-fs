/* eslint-disable no-sync */
// todo: make optional configs uniform
'use strict';

// core
const nodeFs = require('fs');
const path = require('path');

// modules
const R = require('ramda');

// local
const { forEach, map, flatMap } = require('./async');
const requireString = require('./lib/require-string');

const fromCallback = (func) => {
  return new Promise((resolve, reject) => {
    func((err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};


// @async string -> fs -> object
const stat = R.curry((filepath, fs) => fromCallback((cb) => fs.stat(filepath, cb)));
// string -> fs -> object
const statSync = R.curry((filepath, fs) => fs.statSync(filepath));

const CONSTANTS = nodeFs.constants;

// @async
const access = R.curry((path, fs) => fromCallback((cb) => fs.access(path, CONSTANTS.F_OK, cb)));
const accessSync = R.curry((path, fs) => fs.accessSync(path, CONSTANTS.F_OK));

// @async
const appendFile = R.curry((file, data, fs) => fromCallback((cb) => fs.appendFile(file, data, { /* opts */ }, cb)));
const appendFileSync = R.curry((file, data, fs) => fs.appendFileSync(file, data, { /* opts */ }));

// @async
const chmod = R.curry((mode, path, fs) => fromCallback((cb) => fs.chmod(path, mode, cb)));
const chmodSync = R.curry((mode, path, fs) => fs.chmod(path, mode));

// @async
const chown = R.curry((uid, gid, path, fs) => fromCallback((cb) => fs.chown(path, uid, gid, cb)));
const chownSync = R.curry((uid, gid, path, fs) => fs.chown(path, uid, gid));

// @async
const close = R.curry((fd, fs) => fromCallback((cb) => fs.close(fd, cb)));
const closeSync = R.curry((fd, fs) => fs.closeSync(fd));

// @async
const copyFile = R.curry((src, dest, fs) => fromCallback((cb) => fs.copyFile(src, dest, 0, cb)));
const copyFileSync = R.curry((src, dest, fs) => fs.copyFile(src, dest, 0));

// string -> fs -> stream
const createReadStream = R.curry((filepath, fs) => fs.createReadStream(filepath, { /* opts */ }));

// string -> object -> fs -> stream
const createWriteStream = R.curry((filepath, opts, fs) => fs.createWriteStream(filepath, opts));

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
// string -> fs -> bool
const existsSync = R.curry((path, fs) => fs.existsSync(path));

// @async
const fchmod = R.curry((mode, fd, fs) => fromCallback((cb) => fs.fchmod(fd, mode, cb)));
const fchmodSync = R.curry((mode, fd, fs) => fs.fchmodSync(fd, mode));

// @async
const fchown = R.curry((uid, gid, fd, fs) => fromCallback((cb) => fs.fchown(fd, uid, gid, cb)));
const fchownSync = R.curry((uid, gid, fd, fs) => fs.fchownSync(fd, uid, gid));

// @async
const fdatasync = R.curry((fd, fs) => fromCallback((cb) => fs.fdatasync(fd, cb)));
const fdatasyncSync = R.curry((fd, fs) => fs.fdatasyncSync(fd));

// @async
const fstat = R.curry((fd, fs) => fromCallback((cb) => fs.fstat(fd, cb)));
const fstatSync = R.curry((fd, fs) => fs.fstatSync(fd));

// @async
const fsync = R.curry((fd, fs) => fromCallback((cb) => fs.fsync(fd, cb)));
const fsyncSync = R.curry((fd, fs) => fs.fsyncSync(fd));

// @async
const ftruncate = R.curry((fd, fs) => fromCallback((cb) => fs.ftruncate(fd, 0, cb)));
const ftruncateSync = R.curry((fd, fs) => fs.ftruncateSync(fd, 0));

// @async
const futimes = R.curry((fd, atime, mtime, fs) => fromCallback((cb) => fs.futimes(fd, atime, mtime, cb)));
const futimesSync = R.curry((fd, atime, mtime, fs) => fs.futimesSync(fd, atime, mtime));

// @async string -> fs -> boolean
const isDir = R.curry(async (filepath, fs) => (await stat(filepath, fs)).isDirectory());
// string -> fs -> object
const isDirSync = R.curry((filepath, fs) => statSync(filepath, fs).isDirectory());

// @async string -> fs -> boolean
const isFile = R.curry(async (filepath, fs) => (await stat(filepath, fs)).isFile());
// string -> fs -> boolean
const isFileSync = R.curry((filepath, fs) => statSync(filepath, fs).isFile());

// @async
const lchmod = R.curry((mode, path, fs) => fromCallback((cb) => fs.lchmod(path, mode, cb)));
const lchmodSync = R.curry((mode, path, fs) => fs.lchmodSync(path, mode));

// @async
const lchown = R.curry((uid, gid, path, fs) => fromCallback((cb) => fs.lchown(path, uid, gid, cb)));
const lchownSync = R.curry((uid, gid, path, fs) => fs.lchownSync(path, uid, gid));

// @async
const link = R.curry((existingPath, newPath, fs) => fromCallback((cb) => fs.link(existingPath, newPath, cb)));
const linkSync = R.curry((existingPath, newPath, fs) => fs.linkSync(existingPath, newPath));

// @async
const lstat = R.curry((path, fs) => fromCallback((cb) => fs.lstat(path, cb)));
const lstatSync = R.curry((path, fs) => fs.lstatSync(path));

// @async
const mkdir = R.curry((path, fs) => fromCallback((cb) => fs.mkdir(path, 0o777, cb)));
const mkdirSync = R.curry((path, fs) => fs.mkdirSync(path, 0o777));

// @async
// todo: rewrite witout fs.mkdirp
const mkdirp = R.curry((path, fs) => fromCallback((cb) => fs.mkdirp(path, cb)));
const mkdirpSync = R.curry((path, fs) => {
  throw Error('mkdirpSync not implemented');
});

// @async
const mkdtemp = R.curry((prefix, fs) => fromCallback((cb) => fs.mkdtemp(prefix, { /* opts */ }, cb)));
const mkdtempSync = R.curry((prefix, fs) => fs.mkdtempSync(prefix, { /* opts */ }));

// @async
const open = R.curry((flags, path, fs) => fromCallback((cb) => fs.open(path, flags, 0o666, cb)));
const openSync = R.curry((flags, path, fs) => fs.open(path, flags, 0o666));

// @async
// todo: fix promisification
// eslint-disable-next-line max-params, max-len
const read = R.curry((fd, buffer, offset, length, position, fs) => fromCallback((cb) => fs.read(fd, buffer, offset, length, position, cb)));
// eslint-disable-next-line max-params
const readSync = R.curry((fd, buffer, offset, length, position, fs) => fs.read(fd, buffer, offset, length, position));

// @async string -> fs -> [string]
const readDir = R.curry((path, fs) => fromCallback((cb) => fs.readdir(path, { /* opts */ }, cb)));
// string -> fs -> [string]
const readDirSync = R.curry((path, fs) => fs.readdirSync(path, { /* opts */ }));

// @async string -> fs -> string
const readFile = R.curry((path, fs) => fromCallback((cb) => fs.readFile(path, { encoding: 'utf8' }, cb)));
// string -> fs -> string
const readFileSync = R.curry((path, fs) => fs.readFileSync(path, { encoding: 'utf8' }));

// @async
const readLink = R.curry((path, fs) => fromCallback((cb) => fs.readLink(path, { /* opts */ }, cb)));
const readLinkSync = R.curry((path, fs) => fs.readLinkSync(path, { /* opts */ }));

// @async
const realPath = R.curry((path, fs) => fromCallback((cb) => fs.realPath(path, { /* opts */ }, cb)));
const realPathSync = R.curry((path, fs) => fs.realPathSync(path, { /* opts */ }));

// @async
const rename = R.curry((oldPath, newPath, fs) => fromCallback((cb) => fs.rename(oldPath, newPath, cb)));
const renameSync = R.curry((oldPath, newPath, fs) => fs.renameSync(oldPath, newPath));

// @async
const rmDir = R.curry((path, fs) => fromCallback((cb) => fs.rmDir(path, cb)));
const rmDirSync = R.curry((path, fs) => fs.rmDirSync(path));

// @async
const symlink = R.curry((target, path, fs) => fromCallback((cb) => fs.symlink(target, path, 'file', cb)));
const symlinkSync = R.curry((target, path, fs) => fs.symlink(target, path, 'file'));

// @async
const truncate = R.curry((path, fs) => fromCallback((cb) => fs.truncate(path, 0, cb)));
const truncateSync = R.curry((path, fs) => fs.truncateSync(path, 0));

// @async
const unlink = R.curry((path, fs) => fromCallback((cb) => fs.unlink(path, cb)));
const unlinkSync = R.curry((path, fs) => fs.unlink(path));

// todo: add listener arg
const unwatchFile = R.curry((filename, fs) => fs.unwatchFile(filename));

// @async
const utimes = R.curry((atime, mtime, path, fs) => fromCallback((cb) => fs.utimes(path, atime, mtime, cb)));
const utimesSync = R.curry((atime, mtime, path, fs) => fs.utimesSync(path, atime, mtime));

// todo: add listener arg
const watch = R.curry((filename, fs) => fs.watch(filename, { /* opts */ }));

// todo: add listener arg
const watchFile = R.curry((listener, filename, fs) => fs.watchFile(filename, { /* opts */ }, listener));

// @async
// todo: fix this
const write = R.curry(() => {});
// todo: fix this
const writeSync = R.curry(() => {});

// @async
const writeFile = R.curry((data, file, fs) => fromCallback((cb) => fs.writeFile(file, data, { /* opts */ }, cb)));
const writeFileSync = R.curry((data, file, fs) => fs.writeFileSync(file, data, { /* opts */ }));


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
const fileExists = R.curry(async (filepath, fs) => {
  try {
    return await isFile(filepath, fs);
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
  access,
  accessSync,
  appendFile,
  appendFileSync,
  chmod,
  chmodSync,
  chown,
  chownSync,
  close,
  closeSync,
  constants: CONSTANTS,
  copyFile,
  copyFileSync,
  createReadStream,
  createWriteStream,
  dirExists,
  exists,
  existsSync,
  fchmod,
  fchmodSync,
  fchown,
  fchownSync,
  fdatasync,
  fdatasyncSync,
  fileExists,
  fstat,
  fstatSync,
  fsync,
  fsyncSync,
  ftruncate,
  ftruncateSync,
  futimes,
  futimesSync,
  isDir,
  isDirSync,
  isFile,
  isFileSync,
  lchmod,
  lchmodSync,
  lchown,
  lchownSync,
  link,
  linkSync,
  lstat,
  lstatSync,
  mkdir,
  mkdirp,
  mkdirpSync,
  mkdirSync,
  mkdtemp,
  mkdtempSync,
  open,
  openSync,
  read,
  readDir,
  readDirDeep,
  readDirSync,
  readFile,
  readFileSync,
  readLink,
  readLinkSync,
  readSync,
  readTree,
  realPath,
  realPathSync,
  rename,
  renameSync,
  require: requireFs,
  requireFs,
  requireSync,
  rmDir,
  rmDirSync,
  stat,
  statSync,
  symlink,
  symlinkSync,
  truncate,
  truncateSync,
  unlink,
  unlinkSync,
  unwatchFile,
  utimes,
  utimesSync,
  watch,
  watchFile,
  write,
  writeFile,
  writeFileSync,
  writeSync,
  writeTree,
};
