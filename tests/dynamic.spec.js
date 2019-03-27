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
        Object.assign({ routerDir: 'tests/dynamicT' }, options)
      )
    ]
  });
  if (expectVal || notExpectVal) {
    const isTs = options.language === 'typescript';
    let file = fs.readFileSync(
      `tests/dynamicT/.invoke/router.${isTs ? 'ts' : 'js'}`,
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

describe('dynamicRoute', () => {
  it('hump name', () => {
    makeFile('dynamicT/:Dynamic/Index.vue');
    testPlugin(
      { dir: 'tests/dynamicT', alias: '@/dynamicT' },
      `name\\:\\'dynamic\\',path\\:\\'\\/\\:dynamic\\'`
    );
    removeFile('dynamicT');
  });

  it('yakitori name', () => {
    makeFile('dynamicT/:Dynamic-Name/Index.vue');
    testPlugin(
      { dir: 'tests/dynamicT', alias: '@/dynamicT' },
      `name\\:\\'dynamicName\\',path\\:\\'\\/\\:dynamicName\\'`
    );
    removeFile('dynamicT');
  });

  it('underlinename', () => {
    makeFile('dynamicT/:Dynamic_Name/Index.vue');
    testPlugin(
      { dir: 'tests/dynamicT', alias: '@/dynamicT' },
      `name\\:\\'dynamicName\\',path\\:\\'\\/\\:dynamicName\\'`
    );
    removeFile('dynamicT');
  });

  it('lowercase name', () => {
    makeFile('dynamicT/:dynamic_name/index.vue');
    testPlugin(
      { dir: 'tests/dynamicT', alias: '@/dynamicT' },
      `name\\:\\'dynamicName\\',path\\:\\'\\/\\:dynamicName\\'`
    );
    removeFile('dynamicT');
  });

  it('uppercase name', () => {
    makeFile('dynamicT/:DYNAMIC_NAME/INDEX.vue');
    testPlugin(
      { dir: 'tests/dynamicT', alias: '@/dynamicT' },
      `name\\:\\'dynamicName\\',path\\:\\'\\/\\:dynamicName\\'`
    );
    removeFile('dynamicT');
  });

  it('multiple', () => {
    makeFile('dynamicT/:dynamic_name/index.vue');
    makeFile('dynamicT/:dynamic_name/:dynamic_inner.vue');
    testPlugin(
      { dir: 'tests/dynamicT', alias: '@/dynamicT' },
      `(name\\:\\'dynamicName\\',path\\:\\'\\/\\:dynamicName\\'|name\\:\\'dynamicName-dynamicInner\\',path\\:\\'\\/\\:dynamicName\\/\\:dynamicInner\\')`
    );
    removeFile('dynamicT');
  });
});
