'use strict';

// core
const Stream = require('stream');

// modules
const { Volume } = require('memfs');
const { expect } = require('chai');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { toString: streamToString } = require('funk-lib/stream');

// local
const {
  exists,
  existsSync,
  createReadStream,
  writeFile,
  readFile,
  copyFile,
  copyFileSync,
} = require('../core');

const {
  writeTree,
} = require('../extra');

const { mkdirp } = require('../extra');

// add chai-as-promised middleware
chai.use(chaiAsPromised);

describe('core functions', () => {
  
  let fs;
  beforeEach('create in-memory fs', () => {
    fs = Volume.fromJSON({});
  });
  
  describe('copyFile / copyFileSync', () => {
    
    beforeEach('write files', async () => {
      await writeTree('/', {
        'one.txt': 'Hello!',
        'three.txt': '3!',
        four: {},
      }, fs);
    });
    
    describe('async', () => {
      
      it('should copy files', async () => {
        await copyFile('/one.txt', '/two.txt', fs);
        const one = await readFile('/one.txt', fs);
        const two = await readFile('/two.txt', fs);
        expect(one).to.eql('Hello!');
        expect(two).to.eql('Hello!');
      });
      
      it('should overwrite files that exist', async () => {
        await copyFile('/one.txt', '/three.txt', fs);
        const one = await readFile('/one.txt', fs);
        const three = await readFile('/three.txt', fs);
        expect(one).to.eql('Hello!');
        expect(three).to.eql('Hello!');
      });
      
      // fixme: readFileSync doesn't throw on dir read?
      // might be memfs issue
      xit('should throw if the source is a dir', async () => {
        await expect(copyFile('/four', '/test.txt', fs)).to.be.rejectedWith(Error);
      });
      
      it('should throw if the target is a dir', async () => {
        await expect(copyFile('/one.txt', '/four', fs)).to.be.rejectedWith(Error);
      });
      
    });
    
    describe('sync', () => {
      
      it('should copy files', async () => {
        copyFileSync('/one.txt', '/two.txt', fs);
        const one = await readFile('/one.txt', fs);
        const two = await readFile('/two.txt', fs);
        expect(one).to.eql('Hello!');
        expect(two).to.eql('Hello!');
      });
      
      it('should overwrite files that exist', async () => {
        copyFileSync('/one.txt', '/three.txt', fs);
        const one = await readFile('/one.txt', fs);
        const three = await readFile('/three.txt', fs);
        expect(one).to.eql('Hello!');
        expect(three).to.eql('Hello!');
      });
      
      // fixme: readFileSync doesn't throw on dir read?
      // might be memfs issue
      xit('should throw if the source is a dir', () => {
        copyFileSync('/four', '/test.txt', fs);
        expect(() => copyFileSync('/four', '/test.txt', fs)).to.throw(Error);
      });
      
      it('should throw if the target is a dir', () => {
        expect(() => copyFileSync('/one.txt', '/four', fs)).to.throw(Error);
      });
      
    });
    
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
