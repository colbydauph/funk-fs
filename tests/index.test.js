'use strict';

// modules
const { expect } = require('chai');

// local
const index = require('..');

const core = require('../src/core');
const extra = require('../src/extra');

describe('index', () => {
  
  it('should export core functions', () => {
    Object.entries(core).forEach(([name, func]) => {
      expect(index[name]).to.equal(func);
    });
  });
  
  it('should export extra functions', () => {
    Object.entries(extra).forEach(([name, func]) => {
      expect(index[name]).to.equal(func);
    });
  });
  
});
