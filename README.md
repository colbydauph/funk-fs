# funk-fs
### Functional File System Utilities for Node.js

## Features

#### Swappable Filesystem
All functions take a `FileSystem` as their final argument, and will work with any filesystem that implements node's [`fs`](https://nodejs.org/api/fs.html) interface.
(e.g. [`memfs`](https://github.com/simonc/memfs), [`fs-extra`](https://github.com/jprichardson/node-fs-extra), [`level-fs`](https://github.com/juliangruber/level-fs), [`s3fs`](https://www.npmjs.com/package/s3fs))


```javascript
const fs = require('fs');
readFile('/', fs);
```

#### Curried
Functions allow partial application of one or more arguments

```javascript
const readIcon = readFile('/icon.ico');
readIcon(fs1);
readIcon(fs2);
```

#### Promised-based Async
Async functions expose a promise-based interface

*This also has the effect of making async / sync function arguments symetrical*

```javascript
// file = await readFile('data.txt')
readFile('data.txt')
  .then((file) => {})
  .catch((err) => {});
```


## API
*Note: All arguments are required*

*Note: argument order differs from node fs functions to foster useful partial-application.*

See [`nodejs.org/api/fs`](https://nodejs.org/api/fs.html) for more thorough documentation, and alternate argument types.

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
chown(uid: Number, gid: Number, path: String, fs: FileSystem):
```

#### `close` / `closeSync`
```typescript
close(fd: Number, fs: FileSystem): undefined
```

#### `copyFile` / `copyFileSync`
```typescript
copyFile():
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

#### `dirExists` / `dirExistsSync`
```typescript
// does a dir exist? true if dir exists, false if is file, or dir not exists
dirExists(path: String, fs: FileSystem): Boolean
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
ftruncate():
```

#### `futimes` / `futimesSync`
```typescript
futimes(fd: Number, atime: Date, mtime: Date): undefined
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
link():
```

#### `lstat` / `lstatSync`
```typescript
lstat(): fs.Stats
```

#### `mkdir` / `mkdirSync`
```typescript
mkdir():
```

#### `mkdirp` / `mkdirpSync`
```typescript
// recursively create folders
mkdirp(path: String, fs: FileSystem): undefined
```

#### `mkdtemp` / `mkdtempSync`
```typescript
mkdtemp():
```

#### `open` / `openSync`
```typescript
open():
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

#### `readDirDeep` / `readDirDeepSync`
```typescript
// list file names in dir and all sub dirs
readDirDeep(path: String, fs: FileSystem): String[]
```

#### `readFile` / `readFileSync`
```typescript
// read file contents
readFile(path: String, fs: FileSystem): Buffer
```

#### `readLink` / `readLinkSync`
```typescript
readLink():
```

#### `readTree` / `readTreeSync`
```typescript
// read nested dir structure as tree
readTree(path: String, fs: FileSystem): Object
```

#### `realPath` / `realPathSync`
```typescript
realPath():
```

#### `rename` / `renameSync`
```typescript
rename():
```

#### `require` / `requireSync`
```typescript
// require a javascript module
require(path: String, fs: FileSystem): Any
```

#### `rmDir` / `rmDirSync`
```typescript
rmDir():
```

#### `stat` / `statSync`
```typescript
stat(path: String, fs: FileSystem): fs.Stats
```

#### `symlink` / `symlinkSync`
```typescript
symlink():
```

#### `truncate` / `truncateSync`
```typescript
truncate():
```

#### `unlink` / `unlinkSync`
```typescript
unlink():
```

#### `unwatchFile`
```typescript
unwatchFile():
```

#### `utimes` / `utimesSync`
```typescript
utimes():
```

#### `watch`
```typescript
watch():
```

#### `watchFile`
```typescript
watchFile():
```

#### `write` / `writeSync`
```typescript
write():
```

#### `writeFile` / `writeFileSync`
```typescript
writeFile(content: String, path: String, fs: FileSystem): undefined
```

#### `writeTree` / `writeTreeSync`
```typescript
// write nested files and dir structures
writeTree(path: String, tree: Object, fs: FileSystem): undefined
```