'use strict';
const fse = require('fs-extra');
const fs = require('fs');
const path = require('path');
const tests = path.resolve(process.cwd(), 'tests');

exports.makeFile = str => {
  str = str.split('/');
  if (!str.length) {
    return;
  }
  const file = str.pop();
  const dir = str.join('/');
  fse.ensureDirSync(path.resolve(tests, dir));
  fs.writeFileSync(path.resolve(tests, dir, file), '');
};

exports.writeFile = (file, str) => {
  fs.writeFileSync(path.resolve(tests, file), str);
};

exports.removeFile = str => {
  fse.removeSync(path.resolve(tests, str));
};
