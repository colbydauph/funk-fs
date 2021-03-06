'use strict';

// modules
const { Volume } = require('memfs');
const { expect } = require('chai');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

// local
const {
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
  writeFile,
  writeTree,
} = require('..');

// add chai-as-promised middleware
chai.use(chaiAsPromised);


describe('extra functions', () => {
  
  let fs;
  beforeEach('create in-memory fs', () => {
    fs = Volume.fromJSON({});
  });
    
  describe('copy / copySync', () => {
    
    beforeEach('write files', async () => {
      await writeTree('/', {
        'one.txt': 'Hello!',
        'three.txt': '3!',
        two: {},
        src: {
          'aaa.txt': 1,
          'bbb.txt': 2,
          ccc: {
            'ddd.txt': {
              'eee.txt': 6,
            },
          },
        },
        partial: {
          'aaa.txt': 1000,
          'ddd.txt': 2000,
          ccc: {
            'ddd.txt': {
              'eee.txt': 60000,
              'fff.txt': 7,
            },
          },
        },
      }, fs);
    });
    
    describe('async', () => {
      
      it('should copy files', async () => {
        await copy('/one.txt', '/two.txt', fs);
        const one = await readFile('/one.txt', fs);
        const two = await readFile('/two.txt', fs);
        expect(one).to.eql('Hello!');
        expect(two).to.eql('Hello!');
      });
      
      it('should recursively copy dirs', async () => {
        await copy('/src', '/dist', fs);
        const src = await readTree('/src', fs);
        const dist = await readTree('/dist', fs);
        expect(src).to.eql(dist);
      });
      
      it('should overwrite files that exist', async () => {
        await copy('/one.txt', '/three.txt', fs);
        const one = await readFile('/one.txt', fs);
        const three = await readFile('/three.txt', fs);
        expect(one).to.eql('Hello!');
        expect(three).to.eql('Hello!');
      });

      it('should overwrite deep files that exist', async () => {
        await copy('/src', '/partial', fs);
        const partial = await readTree('/partial', fs);
        expect(partial).to.eql({
          'aaa.txt': '1',
          'bbb.txt': '2',
          ccc: {
            'ddd.txt': {
              'eee.txt': '6',
              'fff.txt': '7',
            },
          },
          'ddd.txt': '2000',
        });
      });
      
      it('should throw if dir copied to file', async () => {
        await expect(copy('/src', '/one.txt', fs)).to.be.rejectedWith(Error);
      });
      
      it('should throw if file copied to dir', async () => {
        await expect(copy('/one.txt', '/two', fs)).to.be.rejectedWith(Error);
      });
      
    });
    
    describe('sync', () => {
      
      it('should copy files', async () => {
        copySync('/one.txt', '/two.txt', fs);
        const one = await readFile('/one.txt', fs);
        const two = await readFile('/two.txt', fs);
        expect(one).to.eql('Hello!');
        expect(two).to.eql('Hello!');
      });
      
      it('should recursively copy dirs', async () => {
        copySync('/src', '/dist', fs);
        const src = await readTree('/src', fs);
        const dist = await readTree('/dist', fs);
        expect(src).to.eql(dist);
      });
      
      it('should overwrite files that exist', async () => {
        copySync('/one.txt', '/three.txt', fs);
        const one = await readFile('/one.txt', fs);
        const three = await readFile('/three.txt', fs);
        expect(one).to.eql('Hello!');
        expect(three).to.eql('Hello!');
      });

      it('should overwrite deep files that exist', async () => {
        copySync('/src', '/partial', fs);
        const partial = await readTree('/partial', fs);
        expect(partial).to.eql({
          'aaa.txt': '1',
          'bbb.txt': '2',
          ccc: {
            'ddd.txt': {
              'eee.txt': '6',
              'fff.txt': '7',
            },
          },
          'ddd.txt': '2000',
        });
      });
      
      it('should throw if dir copied to file', async () => {
        expect(() => copySync('/src', '/one.txt', fs)).to.throw(Error);
      });
      
      it('should throw if file copied to dir', async () => {
        expect(() => copySync('/one.txt', '/two', fs)).to.throw(Error);
      });
      
    });
    
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
    
  describe('fileSize / fileSizeSync', () => {
    
    beforeEach('write files', async () => {
      await writeTree('/', {
        'file.txt': 'Hello! This is some test text.',
      }, fs);
    });
    
    describe('async', () => {
      
      it('should return file size in bytes', async () => {
        expect(await fileSize('/file.txt', fs)).to.eql(30);
      });
      
    });
    
    describe('sync', () => {
      
      it('should return file size in bytes', () => {
        expect(fileSizeSync('/file.txt', fs)).to.eql(30);
      });

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
    
    it('should not throw if the root dir exists', async () => {
      await mkdirp('/test-root', fs);
      await expect(mkdirp('/test-root', fs)).to.not.be.rejectedWith(Error);
      expect(() => mkdirpSync('/test-root', fs)).to.not.throw(Error);
    });
    
    it('should throw if dir attempts to write over file', async () => {
      await mkdir('/one', fs);
      await mkdir('/one/two', fs);
      await writeFile('test', '/one/two/three', fs);
      
      await expect(mkdirp('/one/two/three/four', fs)).to.be.rejectedWith(Error);
      expect(() => mkdirpSync('/one/two/three/four', fs)).to.throw(Error);
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
    
    it('should write files as strings', async () => {
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
    
    it('should write concatenated dirs with mkdirp', async () => {
      await writeTree('/', {
        '/test/one/two/three.jpg': 'four',
        '/test': {
          five: {
            '/six/seven.jpg': 'eight',
          },
        },
      }, fs);
      expect(await readFile('/test/one/two/three.jpg', fs)).to.eql('four');
      expect(await readFile('/test/five/six/seven.jpg', fs)).to.eql('eight');
    });
    
    it('should not throw if concatenated dirs overlap', async () => {
      await writeTree('/', {
        '/test/one/two/three.jpg': 'four',
        '/test/five/six/seven.jpg': 'eight',
      }, fs);
      expect(await readFile('/test/one/two/three.jpg', fs)).to.eql('four');
      expect(await readFile('/test/five/six/seven.jpg', fs)).to.eql('eight');
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
    
    it('should mkdirp target dir', async () => {
      const tree = { one: 'two' };
      await writeTree('/some/fake/dir', tree, fs);
      expect(await isDir('/some/fake/dir', fs)).to.eql(true);
      expect(await readFile('/some/fake/dir/one', fs)).to.eql('two');
    });
  
  });
  
});
