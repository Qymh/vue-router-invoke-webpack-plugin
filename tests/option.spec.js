const webpack = require('webpack');
const path = require('path');
const VueRouterInvokeWebpackPlugin = require('../core');
const alias = {
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'demos')
    }
  }
};
describe('test', () => {
  it('create', () => {
    webpack({
      ...alias,
      plugins: [
        new VueRouterInvokeWebpackPlugin({
          dir: 'demos/src',
          alias: '@/src'
        })
      ]
    });
  });

  it('must have dir', () => {
    expect(() => {
      webpack({
        ...alias,
        plugins: [new VueRouterInvokeWebpackPlugin({})]
      });
    }).toThrow();
  });

  it('must have alias', () => {
    expect(() => {
      webpack({
        ...alias,
        plugins: [
          new VueRouterInvokeWebpackPlugin({
            dir: 'demos/src'
          })
        ]
      });
    }).toThrow();
  });

  it('mode should be hash or history', () => {
    expect(() => {
      webpack({
        ...alias,
        plugins: [
          new VueRouterInvokeWebpackPlugin({
            dir: 'demos/src',
            alias: '@/src',
            mode: 'test'
          })
        ]
      });
    }).toThrow();
  });

  it('language should be javascript or typescript', () => {
    expect(() => {
      webpack({
        ...alias,
        plugins: [
          new VueRouterInvokeWebpackPlugin({
            dir: 'demos/src',
            alias: '@/src',
            language: 'test'
          })
        ]
      });
    }).toThrow();
  });

  it('behavior', () => {
    webpack({
      ...alias,
      plugins: [
        new VueRouterInvokeWebpackPlugin({
          dir: 'demos/src',
          alias: '@/src',
          scrollBehavior: (to, from, savedPosition) => {
            if (savedPosition) {
              return savedPosition;
            } else {
              return { x: 0, y: 0 };
            }
          }
        })
      ]
    });
  });
});
