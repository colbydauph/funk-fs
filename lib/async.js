'use strict';

// modules
const R = require('ramda');

// @async (parallel)
// predicate -> iterable -> iterable
const map = R.curry(async (pred, iterable) => {
  return Promise.all(iterable.map((item) => pred(item)));
});

// @async (parallel)
// predicate -> iterable -> iterable
const flatMap = R.curry(async (pred, iterable) => {
  const arrs = await map(pred, iterable);
  return [].concat(...arrs);
});

// @async (parallel)
// predicate -> iterable -> iterable
const forEach = R.curry(async (pred, iterable) => {
  await Promise.all(iterable.map((item) => pred(item)));
  return iterable;
});

module.exports = { map, flatMap, forEach };
