'use strict';

// todo: replace with funk-lib/async
module.exports = (func) => {
  return new Promise((resolve, reject) => {
    func((err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};
