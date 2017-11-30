# funk-fs
### Functional File System Utilities for Node.js

## Contents
- [Features](#features)
- [Api](#api)
  - [Core](#core)
  - [Extra](#extra)

## Features

#### Filesystem Agnostic
Functions are designed to work with any filesystem that implements Node's [`fs`](https://nodejs.org/api/fs.html) interface.
(e.g. [`memfs`](https://github.com/simonc/memfs), [`fs-extra`](https://github.com/jprichardson/node-fs-extra), [`level-fs`](https://github.com/juliangruber/level-fs),[`unionfs`](https://github.com/streamich/unionfs),[`s3fs`](https://www.npmjs.com/package/s3fs))


```javascript
// core
const fs = require('fs');
const files = await readDir('/', fs);

// 3rd-party
const memfs = require('memfs').Volume.fromJSON({});
const files = await readDir('/', memfs);
```

#### Curried
Functions can have their arguments partially applied to create useful intermediate functions.
*See [`Ramda.curry`](http://ramdajs.com/docs/#curry).*

```javascript
const iconExists = fileExists('/icon.ico');
await iconExists(fs1);
await iconExists(fs2);
```

#### Promise-based Async
Async functions expose a promise-based interface. 

*This also has the effect of making async / sync function arguments symmetrical*

```javascript
// async
const dataExists = await fileExists('data.txt', fs);
// sync
const dataExists = fileExistsSync('data.txt', fs);
```


## API
All arguments are required

The order of arguments for many functions differ from those in [Node's `fs` module](https://nodejs.org/api/fs.html). Arguments are arranged "data-last" to promote useful partial-application.

See [`nodejs.org/api/fs`](https://nodejs.org/api/fs.html) for more thorough documentation, and alternate argument types.


### Core
Core functions mirroring [Node's `fs` module](https://nodejs.org/api/fs.html).

#### `access` / `accessSync`
```typescript
access(path: String, fs: FileSystem): undefined
```

#### `appendFile` / `appendFileSync`
```typescript
appendFile(file: String, data: String, fs: FileSystem): undefined
```

#### `chmod` / `chmodSync`
```typescript
chmod(mode: Number, path: String, fs: FileSystem): undefined
```

#### `chown` / `chownSync`
```typescript
chown(uid: Number, gid: Number, path: String, fs: FileSystem): undefined
```

#### `close` / `closeSync`
```typescript
close(fd: Number, fs: FileSystem): undefined
```

#### `copyFile` / `copyFileSync`
```typescript
copyFile(src: String, dest: String, fs: FileSystem): undefined
```

#### `createReadStream`
```typescript
// create a read stream from file
createReadStream(path: String, fs: FileSystem): ReadStream
```

#### `createWriteStream`
```typescript
// create a write stream from file
createWriteStream(path: String, fs: FileSystem): WriteStream
```

#### `exists` / `existsSync`
```typescript
// does a file or dir exist?
exists(path: String, fs: FileSystem): Boolean
```

#### `fchmod` / `fchmodSync`
```typescript
fchmod(mode: Number, fd: Number, fs: FileSystem): undefined
```

#### `fchown` / `fchownSync`
```typescript
fchown(uid: Number, gid: Number, fd: Number, fs: FileSystem): undefined
```

#### `fdatasync` / `fdatasyncSync`
```typescript
fdatasync(fd: Number, fs: FileSystem): undefined
```

#### `fstat` / `fstatSync`
```typescript
fstat(fd: Number, fs: FileSystem): fs.Stats
```

#### `fsync` / `fsyncSync`
```typescript
fsync(fd: Number, fs: FileSystem): undefined
```

#### `ftruncate` / `ftruncateSync`
```typescript
ftruncate(fd: Number, fs: FileSystem): undefined
```

#### `futimes` / `futimesSync`
```typescript
futimes(fd: Number, atime: Date, mtime: Date, fs: FileSystem): undefined
```

#### `lchmod` / `lchmodSync`
```typescript
lchmod(mode: Number, path: String, fs: FileSystem): undefined
```

#### `lchown` / `lchownSync`
```typescript
lchown(uid: Number, gid: Number, path: String, fs: FileSystem): undefined
```

#### `link` / `linkSync`
```typescript
link(existingPath: String, newPath: String, fs: FileSystem): undefined
```

#### `lstat` / `lstatSync`
```typescript
lstat(path: String): fs.Stats
```

#### `mkdir` / `mkdirSync`
```typescript
mkdir(path: String, fs: FileSystem): undefined
```

#### `mkdtemp` / `mkdtempSync`
```typescript
mkdtemp(prefix: String, fs: FileSystem): String
```

#### `open` / `openSync`
```typescript
open(flags: String, path: String, fs: FileSystem): Number
```

#### `read` / `readSync`
```typescript
read():
```

#### `readDir` / `readDirSync`
```typescript
// list file names in dir
readDir(path: String, fs: FileSystem): String[]
```

#### `readFile` / `readFileSync`
```typescript
// read file contents
readFile(path: String, fs: FileSystem): Buffer
```

#### `readLink` / `readLinkSync`
```typescript
readLink(path: String, fs: FileSystem): String
```

#### `realpath` / `realpathSync`
```typescript
realpath(path: String, fs: FileSystem): String
```

#### `rename` / `renameSync`
```typescript
rename(oldPath: String, newPath: String, fs: FileSystem): undefined
```

#### `rmdir` / `rmdirSync`
```typescript
rmDir(path: String, fs: FileSystem): undefined
```

#### `stat` / `statSync`
```typescript
stat(path: String, fs: FileSystem): fs.Stats
```

#### `symlink` / `symlinkSync`
```typescript
symlink(target: String, path: String, fs: FileSystem): undefined
```

#### `truncate` / `truncateSync`
```typescript
truncate(path: String, fs: FileSystem): undefined
```

#### `unlink` / `unlinkSync`
```typescript
unlink(path: String, fs: FileSystem): undefined
```

#### `unwatchFile`
```typescript
unwatchFile(filename: String, fs: FileSystem): String
```

#### `utimes` / `utimesSync`
```typescript
utimes(atime: Date, mtime: Date, path: String, fs: FileSystem): undefined
```

#### `watch`
```typescript
watch()
```

#### `watchFile`
```typescript
watchFile(listener: Function, filename: String, fs: FileSystem):
```

#### `write` / `writeSync`
```typescript
write()
```

#### `writeFile` / `writeFileSync`
```typescript
writeFile(data: String, file: String, fs: FileSystem): undefined
```

### Extra
Additional functions for useful filesystem operations.

#### `dirExists` / `dirExistsSync`
```typescript
// does a dir exist? true if dir exists, false if not dir, or path not exists
dirExists(path: String, fs: FileSystem): Boolean
```

#### `fileExists` / `fileExistsSync`
```typescript
// does a file exist? true if file exists, false if not file, or path not exists
fileExists(path: String, fs: FileSystem): Boolean
```

#### `mkdirp` / `mkdirpSync`
```typescript
// recursively create folders
mkdirp(path: String, fs: FileSystem): undefined
```

#### `isDir` / `isDirSync`
```typescript
// true if dir exists, throws if file, or dir not exists
isDir(path: String, fs: FileSystem): Boolean
```

#### `isFile` / `isFileSync`
```typescript
// true if file exists, throws if dir or file not exists
isFile(path: String, fs: FileSystem): Boolean
```

#### `readDirDeep` / `readDirDeepSync`
```typescript
// list file names in dir and all sub dirs
readDirDeep(path: String, fs: FileSystem): String[]
```

#### `readTree` / `readTreeSync`
```typescript
// read nested dir structure as tree
readTree(path: String, fs: FileSystem): Object
```

#### `require` / `requireSync`
```typescript
// require a javascript module
require(path: String, fs: FileSystem): Any
```

#### `writeTree` / `writeTreeSync`
```typescript
// write nested files and dir structures
writeTree(path: String, tree: Object, fs: FileSystem): undefined
```