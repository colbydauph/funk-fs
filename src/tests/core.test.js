'use strict';

// core
const Stream = require('stream');

// modules
const { Volume } = require('memfs');
const { expect } = require('chai');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

// local
const { toString: streamToString } = require('../../lib/stream');
const {
  exists,
  existsSync,
  createReadStream,
  writeFile,
} = require('../core');

const { mkdirp } = require('../extra');

// add chai-as-promised middleware
chai.use(chaiAsPromised);

describe('funk-fs', () => {
  
  let fs;
  beforeEach('create in-memory fs', () => {
    fs = Volume.fromJSON({});
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
    
  describe('exists / existsSync', () => {
    
    beforeEach('write test files', async () => {
      await mkdirp('/a/b/c/', fs);
      await writeFile('test-file-content', '/a/b/c/test-file.txt', fs);
    });
    
    it('should return true when file exists', async () => {
      await expect(exists('/a/b/c/test-file.txt', fs)).to.eventually.eql(true);
      expect(existsSync('/a/b/c/test-file.txt', fs)).to.eql(true);
    });
    
    it('should return false when file does not exist', async () => {
      await expect(exists('/some/fake/file.txt', fs)).to.eventually.eql(false);
      expect(existsSync('/some/fake/file.txt', fs)).to.eql(false);
    });
    
  });
  
});
