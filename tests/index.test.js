'use strict';

// core
const Stream = require('stream');

// modules
const MemoryFs = require('memory-fs');
const { expect } = require('chai');

const { toString: streamToString } = require('../stream');
const {
  createReadStream,
  exists,
  mkdirp,
  readDirDeep,
  writeFile,
} = require('..');

describe('funk-fs', () => {
  
  let fs;
  beforeEach(() => {
    fs = new MemoryFs();
  });
  
  describe('createReadStream', () => {
    
    beforeEach('write test files', async () => {
      await writeFile('test-file-content', '/test-file', fs);
    });
    
    it('should return a stream reading from the file specified', async () => {
      const stream = createReadStream('/test-file', fs);
      expect(stream).to.be.an.instanceOf(Stream);
      const fileContents = await streamToString(stream);
      expect(fileContents).to.eql('test-file-content');
    });
    
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
  
  describe('readDirDeep', () => {
    
    beforeEach('write test files', async () => {
      await mkdirp('/some/very/deep/test/dir', fs);
      await writeFile('test-file-content-1', '/some/very/deep/test/dir/file.ext', fs);
      await writeFile('test-file-content-2', '/some/test-file.ext', fs);
    });
    
    it('should traverse subdirs infinitely deep', async () => {
      const files = await readDirDeep('/some', fs);
      expect(files).to.eql([
        '/some/very/deep/test/dir/file.ext',
        '/some/test-file.ext',
      ]);
    });
    
  });
  
  
});
