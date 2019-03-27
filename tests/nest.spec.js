const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const VueRouterInvokeWebpackPlugin = require('../core');
const { makeFile, removeFile } = require('./utils');
function testPlugin(options, expectVal, notExpectVal) {
  webpack({
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'tests')
      }
    },
    plugins: [
      new VueRouterInvokeWebpackPlugin(
        Object.assign({ routerDir: 'tests/nestT' }, options)
      )
    ]
  });
  if (expectVal || notExpectVal) {
    const isTs = options.language === 'typescript';
    let file = fs.readFileSync(
      `tests/nestT/.invoke/router.${isTs ? 'ts' : 'js'}`,
      'utf-8'
    );
    file = file.replace(/\s/g, '');
    if (expectVal) {
      expect(new RegExp(expectVal, 'gi').test(file)).toBeTruthy();
    } else {
      expect(new RegExp(notExpectVal, 'gi').test(file)).toBeFalsy();
    }
  }
}

describe('nestRoute', () => {
  it('hump name', () => {
    makeFile('nestT/Parent/Parent.vue');
    testPlugin(
      { dir: 'tests/nestT', alias: '@/nestT' },
      `name\\:\\'parent\\',path\\:\\'\\/parent\\',children\\:\\[\\]`
    );
    removeFile('nestT');
  });

  it('yakitori name', () => {
    makeFile('nestT/:Parent/:Parent.vue');
    testPlugin(
      { dir: 'tests/nestT', alias: '@/nestT' },
      `name\\:\\'parent\\',path\\:\\'\\/\\:parent\\',children\\:\\[\\]`
    );
    removeFile('nestT');
  });

  it('underlinename', () => {
    makeFile('nestT/:Parent_Name/:Parent_Name.vue');
    testPlugin(
      { dir: 'tests/nestT', alias: '@/nestT' },
      `name\\:\\'parentName\\',path\\:\\'\\/\\:parentName\\',children\\:\\[\\]`
    );
    removeFile('nestT');
  });

  it('lowercase name', () => {
    makeFile('nestT/:parent_name/:parent_name.vue');
    testPlugin(
      { dir: 'tests/nestT', alias: '@/nestT' },
      `name\\:\\'parentName\\',path\\:\\'\\/\\:parentName\\',children\\:\\[\\]`
    );
    removeFile('nestT');
  });

  it('uppercase name', () => {
    makeFile('nestT/:PARENT_NAME/:PARENT_NAME.vue');
    testPlugin(
      { dir: 'tests/nestT', alias: '@/nestT' },
      `name\\:\\'parentName\\',path\\:\\'\\/\\:parentName\\',children\\:\\[\\]`
    );
    removeFile('nestT');
  });

  it('multiple', () => {
    makeFile('nestT/:parent_name/:parent_name.vue');
    makeFile('nestT/:parent_name/Child/Index.vue');
    testPlugin(
      { dir: 'tests/nestT', alias: '@/nestT' },
      `(name\\:\\'parentName\\',path\\:\\'\\/\\:parentName\\',children\\:\\[\\]|name\\:\\'parentName-child\\',path\\:\\'child\\')`
    );
    removeFile('nestT');
  });
});
