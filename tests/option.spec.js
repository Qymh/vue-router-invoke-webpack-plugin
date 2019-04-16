const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const VueRouterInvokeWebpackPlugin = require('../core');
const { makeFile, removeFile, writeFile } = require('./utils');
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
  it('create', () => {
    testPlugin({
      dir: 'tests/single',
      alias: '@/single'
    });
  });

  it('must have dir', () => {
    expect(() => {
      testPlugin();
    }).toThrow();
  });

  it('wrong empty dir', () => {
    expect(() => {
      testPlugin({ dir: 'tests/empty', alias: '@/empty' });
    }).toThrow();
  });

  it('must have alias', () => {
    expect(() => {
      testPlugin({ dir: 'tests/single' });
    }).toThrow();
  });

  it('mode should be hash or history', () => {
    expect(() => {
      testPlugin({
        dir: 'tests/single',
        alias: '@/single',
        mode: 'test'
      });
    }).toThrow();
  });

  it('default routerDir', () => {
    rimraf.sync(path.resolve(process.cwd(), '.invoke'));
    webpack({
      resolve: {
        alias: {
          '@': path.resolve(process.cwd(), 'demos')
        }
      },
      plugins: [
        new VueRouterInvokeWebpackPlugin({ dir: 'demos/src', alias: '@/src' })
      ]
    });
    rimraf.sync(path.resolve(process.cwd(), '.invoke'));
  });

  it('language should be javascript or typescript', () => {
    expect(() => {
      testPlugin({
        dir: 'tests/single',
        alias: '@/single',
        language: 'test'
      });
    }).toThrow();
  });

  it('javascript', () => {
    expect(() => {
      testPlugin({
        dir: 'tests/single',
        alias: '@/single',
        language: 'javascript'
      });
    }).not.toThrow();
  });

  it('typescript', () => {
    testPlugin(
      {
        dir: 'tests/single',
        alias: '@/single',
        language: 'typescript'
      },
      '{RouteConfig}'
    );
  });

  it('meta', () => {
    makeFile('metaTest/login/Index.vue');
    makeFile('metaTest/login/meta.yml');
    writeFile(
      'metaTest/login/meta.yml',
      `
      meta:
        - name: metaTest
    `
    );
    testPlugin(
      { dir: 'tests/metaTest', alias: '@/metaTest' },
      `meta\\:\\{name\\:\\'metaTest\\'`
    );
    removeFile('metaTest');
  });

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

  it('redirect', () => {
    testPlugin(
      {
        dir: 'tests/single',
        alias: '@/single',
        redirect: [
          {
            path: '/',
            redirect: '/home'
          }
        ]
      },
      `redirect\\:\\'\\/home\\'`
    );
  });

  it('notFound', () => {
    testPlugin(
      {
        dir: 'tests/single',
        alias: '@/single',
        redirect: [
          {
            path: '/',
            redirect: '/home'
          }
        ],
        ignore: ['NotFound.vue'],
        notFound: '@/single/NotFound.vue'
      },
      `name\\:\\'notFound\\',path\\:\\'\\*\\'`
    );
  });

  it('modules', () => {
    testPlugin(
      {
        dir: 'tests/single',
        alias: '@/single',
        modules: [
          {
            name: 'some',
            package: 'Some'
          }
        ]
      },
      `importsomefrom\\'Some\\'`
    );
  });

  it('scrollBehavior', () => {
    testPlugin(
      {
        dir: 'tests/single',
        alias: '@/single',
        scrollBehavior: (to, from, savedPosition) => {
          if (savedPosition) {
            return savedPosition;
          } else {
            return { x: 0, y: 0 };
          }
        }
      },
      'scrollBehavior:\\(to,from,savedPosition\\)'
    );
  });

  it('beforeEach', () => {
    testPlugin(
      {
        dir: 'tests/single',
        alias: '@/single',
        beforeEach: (to, from, next) => {
          next();
        }
      },
      'beforeEach\\(\\(to,from,next\\)'
    );
  });

  it('beforeResolve', () => {
    testPlugin(
      {
        dir: 'tests/single',
        alias: '@/single',
        beforeResolve: (to, from, next) => {
          next();
        }
      },
      'beforeResolve\\(\\(to,from,next\\)'
    );
  });

  it('afterEach', () => {
    testPlugin(
      {
        dir: 'tests/single',
        alias: '@/single',
        afterEach: (to, from) => {}
      },
      'afterEach\\(\\(to,from\\)'
    );
  });

  // eslint-disable-next-line
  it('watchFiles', done => {
    process.env.NODE_ENV = 'development';
    testPlugin({
      dir: 'tests/single',
      alias: '@/single'
    });
    removeFile('single/watch');
    makeFile('single/watch/Index.vue');
    fs.writeFileSync(
      path.resolve(process.cwd(), 'tests/single/Login/Index.vue'),
      456
    );
    setTimeout(() => {
      let file = fs.readFileSync('tests/.invoke/router.js', 'utf-8');
      file = file.replace(/\s/g, '');
      expect(new RegExp(`name\\:\\'watch\\',path\\:\\'\\/watch\\'`).test(file));
      fs.writeFileSync(
        path.resolve(process.cwd(), 'tests/single/Login/Index.vue'),
        456
      );
      removeFile('single/watch');
      process.env.NODE_ENV = 'test';
      done();
    }, 1000);
  });
});
