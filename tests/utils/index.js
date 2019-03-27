'use strict';
const fs = require('fs');
const path = require('path');
const tests = path.resolve(process.cwd(), 'tests');
const rimraf = require('rimraf');

exports.makeFile = str => {
  str = str.split('/');
  if (!str.length) {
    return;
  }
  const file = str.pop();
  const dir = str.join('/');
  fs.mkdirSync(path.resolve(tests, dir), { recursive: true });
  fs.writeFileSync(path.resolve(tests, dir, file), '');
};

exports.removeFile = str => {
  rimraf.sync(path.resolve(tests, str));
};
