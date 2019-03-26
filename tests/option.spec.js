const webpack = require('webpack');
const path = require('path');
const VueRouterInvokeWebpackPlugin = require('../core');
function testPlugin(options, expect) {
  webpack({
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'demos')
      }
    },
    plugins: [
      new VueRouterInvokeWebpackPlugin(
        Object.assign({ routerDir: 'tests' }, options)
      )
    ]
  });
}
describe('option', () => {
  it('create', () => {
    testPlugin({
      dir: 'demos/src',
      alias: '@/src'
    });
  });
  it('must have dir', () => {
    expect(() => {
      testPlugin();
    }).toThrow();
  });
  it('must have alias', () => {
    expect(() => {
      testPlugin({ dir: 'demos/src' });
    }).toThrow();
  });
  it('mode should be hash or history', () => {
    expect(() => {
      testPlugin({
        dir: 'demos/src',
        alias: '@/src',
        mode: 'test'
      });
    }).toThrow();
  });
  it('language should be javascript or typescript', () => {
    expect(() => {
      testPlugin({
        dir: 'demos/src',
        alias: '@/src',
        language: 'test'
      });
    }).toThrow();
  });
  it('behavior', () => {
    testPlugin({
      dir: 'demos/src',
      alias: '@/src',
      scrollBehavior: (to, from, savedPosition) => {
        if (savedPosition) {
          return savedPosition;
        } else {
          return { x: 0, y: 0 };
        }
      }
    });
  });
});
