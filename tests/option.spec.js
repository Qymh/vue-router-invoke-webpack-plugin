const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const VueRouterInvokeWebpackPlugin = require('../core');
function testPlugin(options, expectVal, notExpectVal) {
  webpack({
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'tests')
      }
    },
    plugins: [
      new VueRouterInvokeWebpackPlugin(
        Object.assign({ routerDir: 'tests' }, options)
      )
    ]
  });
  if (expectVal || notExpectVal) {
    const isTs = options.language === 'typescript';
    let file = fs.readFileSync(
      `tests/.invoke/router.${isTs ? 'ts' : 'js'}`,
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
describe('option', () => {
  // it('create', () => {
  //   testPlugin({
  //     dir: 'tests/single',
  //     alias: '@/single'
  //   });
  // });

  // it('must have dir', () => {
  //   expect(() => {
  //     testPlugin();
  //   }).toThrow();
  // });

  // it('must have alias', () => {
  //   expect(() => {
  //     testPlugin({ dir: 'tests/single' });
  //   }).toThrow();
  // });

  // it('mode should be hash or history', () => {
  //   expect(() => {
  //     testPlugin({
  //       dir: 'tests/single',
  //       alias: '@/single',
  //       mode: 'test'
  //     });
  //   }).toThrow();
  // });

  // it('language should be javascript or typescript', () => {
  //   expect(() => {
  //     testPlugin({
  //       dir: 'tests/single',
  //       alias: '@/single',
  //       language: 'test'
  //     });
  //   }).toThrow();
  // });

  // it('typescript', () => {
  //   testPlugin(
  //     {
  //       dir: 'tests/single',
  //       alias: '@/single',
  //       language: 'typescript'
  //     },
  //     '{RouteConfig}'
  //   );
  // });

  // it('behavior', () => {
  //   testPlugin(
  //     {
  //       dir: 'tests/single',
  //       alias: '@/single',
  //       scrollBehavior: (to, from, savedPosition) => {
  //         if (savedPosition) {
  //           return savedPosition;
  //         } else {
  //           return { x: 0, y: 0 };
  //         }
  //       }
  //     },
  //     'scrollBehavior:\\(to,from,savedPosition\\)'
  //   );
  // });

  it('ignore', () => {
    testPlugin(
      {
        dir: 'tests/ignore',
        alias: '@/ignore',
        ignore: ['images', 'components']
      },
      '',
      'images|components'
    );
  });
});
