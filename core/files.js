'use strict';

const fs = require('fs');
const fse = require('fs-extra');
const chokidar = require('chokidar');
const beautify = require('js-beautify').js;
const { toPlain } = require('./utils');
const isFile = dir => fs.statSync(dir).isFile();

let isRunning = false;

exports.isFile = isFile;

const root = process.cwd();
exports.root = root;

function writeFile(options) {
  if (!fs.existsSync(this.routerDir)) {
    if (options.routerDir) {
      fse.ensureDirSync(`${root}/${options.routerDir}/.invoke`);
    } else {
      fse.ensureDirSync(`${root}/.invoke`);
    }
    fs.writeFileSync(
      this.routerDir,
      beautify(this.routeString, { indent_size: 2, space_in_empty_paren: true })
    );
    isRunning = false;
    this.isFirst = false;
  } else {
    fs.writeFileSync(
      this.routerDir,
      beautify(this.routeString, { indent_size: 2, space_in_empty_paren: true })
    );
    isRunning = false;
    this.isFirst = false;
  }
}

function watchFile(options, start) {
  writeFile.call(this, options);
  const watcher = chokidar.watch(this.watchDir, { persistent: true });
  watcher.on('raw', (event, path) => {
    if ((event === 'modified' && !/\.yml$/.test(path)) || isRunning) {
      return;
    }
    isRunning = true;
    start.call(this, options);
    writeFile.call(this, options);
  });
}

exports.writeOrWatchFile = function(options, start) {
  const isDev = process.env.NODE_ENV === 'development';
  isDev ? watchFile.call(this, options, start) : writeFile.call(this, options);
};

exports.getRouterDir = function(options) {
  const routerDir = options.routerDir;
  const ext = options.language
    ? options.language === 'javascript'
      ? '.js'
      : '.ts'
    : '.js';
  if (routerDir) {
    this.routerDir = `${root}/${routerDir}/.invoke/router${ext}`;
  } else {
    this.routerDir = `${root}/.invoke/router${ext}`;
  }
};

exports.getWatchDir = function(options) {
  this.watchDir = `${root}/${options.dir}`;
};

exports.generateIgnoreFiles = function(options) {
  options.ignore = options.ignore
    ? [...options.ignore, '.dsstore']
    : ['.dsstore'];
  options.ignore = options.ignore.map(v => {
    if (toPlain(v) === 'RegExp') {
      return v.toString().replace(/(\/)\B/g, '');
    } else if (v) {
      return v;
    }
  });
  const reg = new RegExp(`(${options.ignore.join('|')})`, 'i');
  this.ignoreRegExp = reg;
};

exports.generateRedirectRoute = function(options) {
  const { redirect } = options;
  if (!redirect) {
    return;
  }
  for (const item of redirect) {
    this.routeString += `
      {
        path:'${item.path}',
        redirect:'${item.redirect}'
      },
    `;
  }
};

exports.generateGuards = function(options) {
  if (options.beforeEach) {
    const str = options.beforeEach.toString();
    this.routeString += `
      router.beforeEach(${str});
    `;
  }
  if (options.beforeResolve) {
    const str = options.beforeResolve.toString();
    this.routeString += `
      router.beforeResolve(${str});
    `;
  }
  if (options.afterEach) {
    const str = options.afterEach.toString();
    this.routeString += `
      router.afterEach(${str});
    `;
  }
};

exports.generateModules = function(options) {
  let str = '';
  if (options.modules) {
    for (const module of options.modules) {
      str += `import ${module.name} from '${module.package}';`;
    }
  }
  return str;
};

exports.generateNotFound = function(options) {
  if (options.notFound) {
    this.routeString += `
      {
        name:'notFound',
        path:'*',
        component: () => import('${options.notFound}')
      },
    `;
  }
};
