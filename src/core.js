/* eslint-disable no-sync */
// todo: make optional configs uniform
'use strict';

// core
const nodeFs = require('fs');

// modules
const R = require('ramda');
const { fromCallback } = require('funk-lib/async');

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
const copyFile = R.curry((src, dest, fs) => fromCallback((cb) => fs.copyFile(src, dest, cb)));
const copyFileSync = R.curry((src, dest, fs) => fs.copyFileSync(src, dest));

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
const mkdtemp = R.curry((prefix, fs) => fromCallback((cb) => fs.mkdtemp(prefix, { /* opts */ }, cb)));
const mkdtempSync = R.curry((prefix, fs) => fs.mkdtempSync(prefix, { /* opts */ }));

// @async
const open = R.curry((flags, path, fs) => fromCallback((cb) => fs.open(path, flags, 0o666, cb)));
const openSync = R.curry((flags, path, fs) => fs.open(path, flags, 0o666));

// @async
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
const realpath = R.curry((path, fs) => fromCallback((cb) => fs.realpath(path, { /* opts */ }, cb)));
const realpathSync = R.curry((path, fs) => fs.realpathSync(path, { /* opts */ }));

// @async
const rename = R.curry((oldPath, newPath, fs) => fromCallback((cb) => fs.rename(oldPath, newPath, cb)));
const renameSync = R.curry((oldPath, newPath, fs) => fs.renameSync(oldPath, newPath));

// @async
const rmdir = R.curry((path, fs) => fromCallback((cb) => fs.rmdir(path, cb)));
const rmdirSync = R.curry((path, fs) => fs.rmdirSync(path));

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

const watchFile = R.curry((listener, filename, fs) => fs.watchFile(filename, { /* opts */ }, listener));

// @async
// todo: fix these
const write = R.curry(() => {
  throw Error('write not implemented');
});
const writeSync = R.curry(() => {
  throw Error('writeSync not implemented');
});

// fixme: arg order makes more sense as (file, data, fs)
// @async
const writeFile = R.curry((data, file, fs) => fromCallback((cb) => fs.writeFile(file, data, { /* opts */ }, cb)));
const writeFileSync = R.curry((data, file, fs) => fs.writeFileSync(file, data, { /* opts */ }));

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
  exists,
  existsSync,
  fchmod,
  fchmodSync,
  fchown,
  fchownSync,
  fdatasync,
  fdatasyncSync,
  fstat,
  fstatSync,
  fsync,
  fsyncSync,
  ftruncate,
  ftruncateSync,
  futimes,
  futimesSync,
  lchmod,
  lchmodSync,
  lchown,
  lchownSync,
  link,
  linkSync,
  lstat,
  lstatSync,
  mkdir,
  mkdirSync,
  mkdtemp,
  mkdtempSync,
  open,
  openSync,
  read,
  readDir,
  readDirSync,
  readFile,
  readFileSync,
  readLink,
  readLinkSync,
  readSync,
  realpath,
  realpathSync,
  rename,
  renameSync,
  rmdir,
  rmdirSync,
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
};
