# funk-fs
### Functional File System Utilities for Node.js

## Features

#### Swappable Filesystem
All functions take a `FileSystem` as their final argument

*Works with any filesystem that implements node's [`fs`](https://nodejs.org/api/fs.html) interface.  (e.g. [`memory-fs`](https://github.com/webpack/memory-fs), [`memfs`](https://github.com/simonc/memfs), [`s3fs`](https://www.npmjs.com/package/s3fs))*

```javascript
const fs = new require('fs');
readFile('/', fs);
```

#### Curried
Functions allow partial application of one or more arguments

```javascript
readFile('/icon.ico')(fs);
```

#### Promised-based async
Async functions expose a promise-based interface

```javascript
// await readFile(...)
readFile(...)
  .then((file) => {})
  .catch((err) => {});
```


## API

*Note: All arguments are required*

```typescript
// create a read stream from file
createReadStream(path: String, fs: FileSystem): ReadStream
```

```typescript
// create a write stream from file
createWriteStream(path: String, fs: FileSystem): WriteStream
```

```typescript
// does a dir exist? true if dir exists, false if is file of dir not exists
dirExists(path: String, fs: FileSystem): Promise<Boolean>
```

```typescript
// does a file or dir exist?
exists(path: String, fs: FileSystem): Promise<Boolean>
```

```typescript
// does a file or dir exist?
existsSync(path: String, fs: FileSystem): Boolean
```

```typescript
// true if dir exists, throws if file or dir not exists
isDir(path: String, fs: FileSystem): Promise<Boolean>
```

```typescript
// true if dir exists, throws if file or dir not exists
isDirSync(path: String, fs: FileSystem): Boolean
```

```typescript
// true if file exists, throws if dir or file not exists
isFile(path: String, fs: FileSystem): Promise<Boolean>
```

```typescript
// recursively create folders
mkdirp(path: String, fs: FileSystem): Promise<undefined>
```

```typescript
// list file names in dir
readDir(path: String, fs: FileSystem): Promise<String[]>
```

```typescript
// list file names in dir and all sub dirs
readDirDeep(path: String, fs: FileSystem): Promise<String[]>
```

```typescript
// list file names in dir
readDirSync(path: String, fs: FileSystem): String[]
```

```typescript
// read file contents
readFile(path: String, fs: FileSystem): Promise<Buffer>
```

```typescript
// read file contents
readFileSync(path: String, fs: FileSystem): Buffer
```

```typescript
// read nested dir structure as tree
readTree(path: String, fs: FileSystem): Promise<Object>
```

```typescript
// require a javascript module
require(path: String, fs: FileSystem): Promise<Any>
```

```typescript
// require a javascript module
requireSync(path: String, fs: FileSystem): Any
```

```typescript
// get file / dir statistics
stat(path: String, fs: FileSystem): Promise<Object>
```

```typescript
// get file / dir statistics
statSync(path: String, fs: FileSystem): Object
```

```typescript
// write data to a file
writeFile(content: String, path: String, fs: FileSystem): Promise<undefined>
```

```typescript
// write nested files and dir structures
writeTree(path: String, tree: Object, fs: FileSystem): Promise<undefined>
```