'use strict';

module.exports = (src, filepath) => {
  try {
    const mod = new module.constructor();
    // eslint-disable-next-line no-underscore-dangle
    mod._compile(src, filepath);
    return mod.exports;
  } catch (err) {
    throw Error(`Module at ${ filepath } is invalid: ${ err.stack }`);
  }
};
