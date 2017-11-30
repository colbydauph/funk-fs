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
  createReadStream,
  writeFile,
} = require('..');

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
    
});
