'use strict';

// modules
const { Volume } = require('memfs');
const { expect } = require('chai');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

// local
const {
  dirExists,
  dirExistsSync,
  exists,
  fileExists,
  fileExistsSync,
  isDir,
  isDirSync,
  isFile,
  isFileSync,
  mkdir,
  mkdirp,
  mkdirSync,
  readDirDeep,
  readFile,
  readTree,
  require: requireFs,
  requireSync,
  writeFile,
  writeFileSync,
  writeTree,
} = require('..');

// add chai-as-promised middleware
chai.use(chaiAsPromised);

describe('funk-fs', () => {
  
  let fs;
  beforeEach('create in-memory fs', () => {
    fs = Volume.fromJSON({});
  });
  
  describe('exists', () => {
    
    beforeEach('write test files', async () => {
      await mkdirp('/a/b/c/', fs);
      await writeFile('test-file-content', '/a/b/c/test-file.txt', fs);
    });
    
    it('should return true when file exists', async () => {
      const result = await exists('/a/b/c/test-file.txt', fs);
      expect(result).to.eql(true);
    });
    
    it('should return false when file does not exist', async () => {
      const result = await exists('/some/fake/file.txt', fs);
      expect(result).to.eql(false);
    });
    
  });
  
  describe('dirExists', () => {
    
    beforeEach('write files', async () => {
      await writeTree('/', {
        one: {
          'test.txt': '1',
        },
      }, fs);
    });
    
    it('should return true if dir exists', async () => {
      expect(await dirExists('/one', fs)).to.eql(true);
    });
    
    it('should return false if path is empty', async () => {
      expect(await dirExists('/two', fs)).to.eql(false);
    });
    
    it('should return false if path is file', async () => {
      expect(await dirExists('/two/test.txt', fs)).to.eql(false);
    });

  });
  
  describe('dirExistsSync', () => {
    
    beforeEach('write files', async () => {
      await writeTree('/', {
        one: {
          'test.txt': '1',
        },
      }, fs);
    });
    
    it('should return true if dir exists', () => {
      expect(dirExistsSync('/one', fs)).to.eql(true);
    });
    
    it('should return false if path is empty', () => {
      expect(dirExistsSync('/two', fs)).to.eql(false);
    });
    
    it('should return false if path is file', () => {
      expect(dirExistsSync('/two/test.txt', fs)).to.eql(false);
    });

  });
  
  describe('fileExists', () => {
    
    beforeEach('write files', async () => {
      await writeFile('test-text', '/one.txt', fs);
    });
    
    it('should return true if file exists', async () => {
      expect(await fileExists('/one.txt', fs)).to.eql(true);
    });
    
    it('should return false if path is empty', async () => {
      expect(await fileExists('/two.txt', fs)).to.eql(false);
    });
    
    it('should return false if path is a dir', async () => {
      await mkdir('/one', fs);
      expect(await fileExists('/one', fs)).to.eql(false);
    });

  });
  
  describe('fileExistsSync', () => {
    
    beforeEach('write files', async () => {
      await writeFile('test-text', '/one.txt', fs);
    });
    
    it('should return true if file exists', () => {
      expect(fileExistsSync('/one.txt', fs)).to.eql(true);
    });
    
    it('should return false if path is empty', () => {
      expect(fileExistsSync('/two.txt', fs)).to.eql(false);
    });
    
    it('should return false if path is a dir', async () => {
      await mkdir('/one', fs);
      expect(fileExistsSync('/one', fs)).to.eql(false);
    });

  });
  
  
  describe('isFile', () => {
    
    it('should return true if path is file', async () => {
      await writeFile('data', '/test', fs);
      expect(await isFile('/test', fs)).to.eql(true);
    });
    
    it('should return false if path is a dir', async () => {
      await mkdir('/test', fs);
      expect(await isFile('/test', fs)).to.eql(false);
    });
    
    it('should throw if nothing at path', async () => {
      await expect(isFile('/test', fs)).to.eventually.be.rejectedWith(Error);
    });
    
  });
  
  describe('isFileSync', () => {
    
    it('should return true if path is file', () => {
      writeFileSync('data', '/test', fs);
      expect(isFileSync('/test', fs)).to.eql(true);
    });
    
    it('should return false if path is a dir', () => {
      mkdirSync('/test', fs);
      expect(isFileSync('/test', fs)).to.eql(false);
    });
    
    it('should throw if nothing at path', () => {
      expect(() => isFileSync('/test', fs)).to.throw(Error);
    });
    
  });
  
  describe('isDir', () => {
    
    it('should return true if path is a dir', async () => {
      await mkdir('/test', fs);
      expect(await isDir('/test', fs)).to.eql(true);
    });
    
    it('should return false if path is a file', async () => {
      await writeFile('data', '/test', fs);
      expect(await isDir('/test', fs)).to.eql(false);
    });
    
    it('should throw if nothing at path', async () => {
      await expect(isDir('/test', fs)).to.eventually.be.rejectedWith(Error);
    });
    
  });
  
  describe('isDirSync', () => {
    
    it('should return true if path is a dir', () => {
      mkdirSync('/test', fs);
      expect(isDirSync('/test', fs)).to.eql(true);
    });
    
    it('should return false if path is a file', () => {
      writeFileSync('data', '/test', fs);
      expect(isDirSync('/test', fs)).to.eql(false);
    });
    
    it('should throw if nothing at path', () => {
      expect(() => isDirSync('/test', fs)).to.throw(Error);
    });
    
  });
  
  describe('mkdirp', () => {
    
    it('should make dirs a single level deep', async () => {
      const dir = '/test-dir-123';
      await mkdirp(dir, fs);
      expect(await dirExists(dir, fs)).to.eql(true);
    });
    
    it('should make intermediate dirs', async () => {
      const dir = '/some/deep/test/dir';
      await mkdirp(dir, fs);
      expect(await dirExists('/some/deep', fs)).to.eql(true);
    });
    
    it('should make dirs of arbitrary depth', async () => {
      const dir = '/some/deep/test/dir';
      await mkdirp(dir, fs);
      expect(await dirExists(dir, fs)).to.eql(true);
    });
    
    it('should not throw if an intermediate dir exists', async () => {
      await mkdirp('/some', fs);
      await mkdirp('/some/other', fs);
      await mkdirp('/some/other/test-dir', fs);
      expect(await dirExists('/some/other/test-dir', fs)).to.eql(true);
    });
    
  });
  
  describe('readDirDeep', () => {
    
    beforeEach('write test files', async () => {
      await mkdirp('/some/very/deep/test/dir', fs);
      await writeFile('test-file-content-1', '/some/very/deep/test/dir/file.ext', fs);
      await writeFile('test-file-content-2', '/some/test-file.ext', fs);
    });
    
    it('should traverse subdirs infinitely deep', async () => {
      const files = await readDirDeep('/some', fs);
      expect(files.length).to.eql(2);
      expect(files).to.contain('/some/test-file.ext');
      expect(files).to.contain('/some/very/deep/test/dir/file.ext');
    });
    
  });
  
  describe('require', () => {
    
    beforeEach('write test files', async () => {
      await writeFile('module.exports = { success: true };', '/my-module.js', fs);
    });
    
    it('should require files from the specified file system', async () => {
      const { success } = await requireFs('/my-module.js', fs);
      expect(success).to.eql(true);
    });
    
  });
  
  describe('requireSync', () => {
    
    beforeEach('write test files', async () => {
      await writeFile('module.exports = { success: true };', '/my-module.js', fs);
    });
    
    it('should require files from the specified file system', () => {
      const { success } = requireSync('/my-module.js', fs);
      expect(success).to.eql(true);
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
    
    it('should be complementary to writeFile', async () => {
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
      let error;
      try {
        await writeTree('/', tree, fs);
      } catch (err) {
        error = err;
      }

      expect(error).to.be.an.instanceOf(Error);
    });
    
  });
  
});
