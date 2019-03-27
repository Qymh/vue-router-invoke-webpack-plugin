'use strict';

const assert = require('assert');

exports.warn = msg => {
  assert.fail(`\n\n\x1B[31mvue-router-invoke-webpack-plugin:${msg} \x1b[39m\n`);
};

exports.lowerCase = str => str.toLowerCase();

exports.replaceAlias = (str, dir) => {
  return str.replace(new RegExp(dir, 'gi'), '');
};

exports.replaceVue = str => str.replace(/\.vue/g, '');

exports.camelize = str => str.replace(/[-_](\w)/g, (_, c) => c.toUpperCase());

exports.makeMap = str => {
  const map = Object.create(null);
  const list = str.split(',');
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return val => map[val];
};

exports.replaceDynamic = str => str.replace(/:/g, '');

exports.diff = (a, b) => {
  const aSet = new Set(a);
  return b.filter(v => !aSet.has(v));
};
