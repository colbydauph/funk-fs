'use strict';

// modules
const R = require('ramda');
const { Volume } = require('memfs');
const { expect } = require('chai');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

// local
const {
  dirExists,
  dirExistsSync,
  fileExists,
  fileExistsSync,
  isDir,
  isDirSync,
  isFile,
  isFileSync,
  mkdir,
  mkdirp,
  mkdirpSync,
  readDirDeep,
  readDirDeepSync,
  readFile,
  readTree,
  readTreeWith,
  require: requireFs,
  requireSync: requireFsSync,
  stat,
  writeFile,
  writeTree,
} = require('..');

// add chai-as-promised middleware
chai.use(chaiAsPromised);

const fileSize = R.curry(async (path, fs) => {
  return (await stat(path, fs)).size;
});

describe('extra functions', () => {
  
  let fs;
  beforeEach('create in-memory fs', () => {
    fs = Volume.fromJSON({});
  });
    
  describe('dirExists / dirExistsSync', () => {
    
    beforeEach('write files', async () => {
      await writeTree('/', {
        one: {
          'test.txt': '1',
        },
      }, fs);
    });
    
    it('should return true if dir exists', async () => {
      expect(await dirExists('/one', fs)).to.eql(true);
      expect(dirExistsSync('/one', fs)).to.eql(true);
    });
    
    it('should return false if path is empty', async () => {
      expect(await dirExists('/two', fs)).to.eql(false);
      expect(dirExistsSync('/two', fs)).to.eql(false);
    });
    
    it('should return false if path is file', async () => {
      expect(await dirExists('/two/test.txt', fs)).to.eql(false);
      expect(dirExistsSync('/two/test.txt', fs)).to.eql(false);
    });

  });
  
  describe('fileExists / fileExistsSync', () => {
    
    beforeEach('write files', async () => {
      await writeFile('test-text', '/one.txt', fs);
    });
    
    it('should return true if file exists', async () => {
      expect(await fileExists('/one.txt', fs)).to.eql(true);
      expect(fileExistsSync('/one.txt', fs)).to.eql(true);
    });
    
    it('should return false if path is empty', async () => {
      expect(await fileExists('/two.txt', fs)).to.eql(false);
      expect(fileExistsSync('/two.txt', fs)).to.eql(false);
    });
    
    it('should return false if path is a dir', async () => {
      await mkdir('/one', fs);
      expect(await fileExists('/one', fs)).to.eql(false);
      expect(fileExistsSync('/one', fs)).to.eql(false);
    });

  });
    
  describe('isFile / isFileSync', () => {
    
    it('should return true if path is file', async () => {
      await writeFile('data', '/test', fs);
      
      expect(await isFile('/test', fs)).to.eql(true);
      expect(isFileSync('/test', fs)).to.eql(true);
    });
    
    it('should return false if path is a dir', async () => {
      await mkdir('/test', fs);
      
      expect(await isFile('/test', fs)).to.eql(false);
      expect(isFileSync('/test', fs)).to.eql(false);
    });
    
    it('should throw if nothing at path', async () => {
      await expect(isFile('/test', fs)).to.eventually.be.rejectedWith(Error);
      expect(() => isFileSync('/test', fs)).to.throw(Error);
    });
    
  });
  
  describe('isDir / isDirSync', () => {
    
    it('should return true if path is a dir', async () => {
      await mkdir('/test', fs);
      
      expect(await isDir('/test', fs)).to.eql(true);
      expect(isDirSync('/test', fs)).to.eql(true);
    });
    
    it('should return false if path is a file', async () => {
      await writeFile('data', '/test', fs);
      
      expect(await isDir('/test', fs)).to.eql(false);
      expect(isDirSync('/test', fs)).to.eql(false);
    });
    
    it('should throw if nothing at path', async () => {
      await expect(isDir('/test', fs)).to.eventually.be.rejectedWith(Error);
      expect(() => isDirSync('/test', fs)).to.throw(Error);
    });
    
  });
  
  describe('mkdirp / mkdirpSync', () => {
    
    it('should make dirs a single level deep', async () => {
      const dir = '/test-dir-123';
      const dirSync = '/test-dir-123-sync';
      
      await mkdirp(dir, fs);
      mkdirpSync(dirSync, fs);
      
      expect(await dirExists(dir, fs)).to.eql(true);
      expect(dirExistsSync(dirSync, fs)).to.eql(true);
    });
    
    it('should make intermediate dirs', async () => {
      const dir = '/some/deep/test/dir';
      const dirSync = '/sync/deep/test/dir';
      
      await mkdirp(dir, fs);
      mkdirpSync(dirSync, fs);
      
      expect(await dirExists('/some/deep', fs)).to.eql(true);
      expect(dirExistsSync('/sync/deep', fs)).to.eql(true);
    });
    
    it('should make dirs of arbitrary depth', async () => {
      const dir = '/some/deep/test/dir';
      const dirSync = '/sync/deep/test/dir';
      
      await mkdirp(dir, fs);
      mkdirpSync(dirSync, fs);
      
      expect(await dirExists(dir, fs)).to.eql(true);
      expect(dirExistsSync(dirSync, fs)).to.eql(true);
    });
    
    it('should not throw if an intermediate dir exists', async () => {
      await mkdirp('/some', fs);
      await mkdirp('/some/other', fs);
      await mkdirp('/some/other/test-dir', fs);
      
      mkdirpSync('/sync', fs);
      mkdirpSync('/sync/other', fs);
      mkdirpSync('/sync/other/test-dir', fs);
      
      expect(await dirExists('/some/other/test-dir', fs)).to.eql(true);
      expect(dirExistsSync('/sync/other/test-dir', fs)).to.eql(true);
    });
    
  });
  
  describe('readDirDeep / readDirDeepSync', () => {
    
    beforeEach('write test files', async () => {
      await mkdirp('/some/very/deep/test/dir', fs);
      await writeFile('test-file-content-1', '/some/very/deep/test/dir/file.ext', fs);
      await writeFile('test-file-content-2', '/some/test-file.ext', fs);
    });
    
    it('should traverse subdirs infinitely deep', async () => {
      const expected = [
        '/some/test-file.ext',
        '/some/very/deep/test/dir/file.ext',
      ];
      
      await expect(readDirDeep('/some', fs)).to.eventually.eql(expected);
      expect(readDirDeepSync('/some', fs)).to.eql(expected);
    });
    
  });
  
  describe('require / requireSync', () => {
    
    beforeEach('write test files', async () => {
      await writeFile('module.exports = { success: true };', '/my-module.js', fs);
    });
    
    it('should require files from the specified file system', async () => {
      await expect(requireFs('/my-module.js', fs)).to.eventually.eql({ success: true });
      expect(requireFsSync('/my-module.js', fs)).to.eql({ success: true });
    });
    
  });
  
  describe('readTreeWith', () => {
    
    beforeEach('write tree', async () => {
      await writeTree('/', {
        one: 'a',
        two: 'aa',
        three: 'aaa',
        four: {
          five: 'aaaaa',
          six: { seven: 'aaaaaaa' },
        },
      }, fs);
    });
    
    it('should determine object values with pred', async () => {
      const tree = await readTreeWith(fileSize, '/', fs);

      expect(tree).to.eql({
        one: 1,
        two: 2,
        three: 3,
        four: {
          five: 5,
          six: { seven: 7 },
        },
      });
      
    });
    
  });
  
  describe('readTree', () => {
    
    beforeEach('write tree', async () => {
      await writeTree('/', {
        one: '1',
        two: '2',
        three: '3',
        four: {
          five: '6',
          six: { seven: '8' },
        },
      }, fs);
    });
    
    it('should read all files in a dir', async () => {
      const tree = await readTree('/', fs);

      expect(tree.one).to.eql('1');
      expect(tree.two).to.eql('2');
      expect(tree.three).to.eql('3');
    });
    
    it('should read recursively', async () => {
      const tree = await readTree('/', fs);
      expect(tree.four.five).to.eql('6');
      expect(tree.four.six).to.eql({ seven: '8' });
    });
    
  });
  
  describe('writeTree', () => {
    
    it('should write strings', async () => {
      const tree = {
        'text-file-1.txt': 'one',
        'text-file-2.jpg': 'two',
        'text-file-3.png': 'three',
      };
      await writeTree('/', tree, fs);
      expect(`${ await readFile('/text-file-1.txt', fs) }`).to.eql('one');
      expect(`${ await readFile('/text-file-2.jpg', fs) }`).to.eql('two');
      expect(`${ await readFile('/text-file-3.png', fs) }`).to.eql('three');
    });
    
    it('should recursively create subdirs', async () => {
      const tree = {
        one: {},
        two: {
          three: {
            four: {},
          },
        },
      };
      await writeTree('/', tree, fs);
      expect(await isDir('/one', fs)).to.eql(true);
      expect(await isDir('/two', fs)).to.eql(true);
      expect(await isDir('/two/three', fs)).to.eql(true);
      expect(await isDir('/two/three/four', fs)).to.eql(true);
    });
    
    it('should recurisvely write files', async () => {
      const tree = {
        one: '1',
        two: {
          three: '3',
          four: {
            five: '5',
          },
        },
      };
      await writeTree('/', tree, fs);
      expect(`${ await readFile('/one', fs) }`).to.eql('1');
      expect(`${ await readFile('/two/three', fs) }`).to.eql('3');
      expect(`${ await readFile('/two/four/five', fs) }`).to.eql('5');
    });
    
    it('should be complementary to readTree', async () => {
      const treeIn = {
        bin: {
          bash: {
            node: 'test',
          },
        },
      };
      await writeTree('/', treeIn, fs);
      const treeOut = await readTree('/', fs);
      expect(treeIn).to.eql(treeOut);
    });
    
    it('should throw if dir content written to existing file', async () => {
      await writeFile('content', '/test', fs);
      const tree = {
        test: {
          one: 'two',
        },
      };
      await expect(writeTree('/', tree, fs)).to.eventually.be.rejectedWith(Error);
    });
  
    it('should create target dir if it does not exist', async () => {
      const tree = { one: 'two' };
      await writeTree('/test-dir', tree, fs);
      expect(await isDir('/test-dir', fs)).to.eql(true);
    });
    
    // todo: should this use mkdirp logic instead?
    it('should throw if parent dir does not exist', async () => {
      const tree = { one: 'two' };
      await expect(writeTree('/fake/dir', tree, fs)).to.eventually.be.rejectedWith(Error);
    });
  
  });
  
});
