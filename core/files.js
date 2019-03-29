'use strict';

const fs = require('fs');
const { replaceVue } = require('./utils');
const isFile = dir => fs.statSync(dir).isFile();

exports.isFile = isFile;

const root = process.cwd();
exports.root = root;

function writeFile(options) {
  if (!fs.existsSync(this.routerDir)) {
    if (options.routerDir) {
      fs.mkdirSync(`${root}/${options.routerDir}/.invoke`, {
        recursive: true
      });
    } else {
      fs.mkdirSync(`${root}/.invoke`, { recursive: true });
    }
    fs.writeFileSync(this.routerDir, this.routeString);
  } else {
    fs.writeFileSync(this.routerDir, this.routeString);
  }
}

function watchFile(options, start) {
  writeFile.call(this, options);
  fs.watch(this.watchDir, { recursive: true }, type => {
    if (type === 'change') {
      return;
    }
    start.call(this, options);
    writeFile.call(this, options);
  });
}

exports.writeOrWatchFile = function(options, start) {
  const isDev = process.env.NODE_ENV === 'development';
  isDev ? watchFile.call(this, options, start) : writeFile.call(this, options);
};

exports.getRouterDir = function(options) {
  let routerDir = options.routerDir;
  let ext = options.language
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
  if (!options.ignore) {
    return;
  }
  options.ignore = options.ignore.map(replaceVue);
  let reg = new RegExp(`(${options.ignore.join('|')})`, 'ig');
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
      str += `import ${module.name} from ${module.package};`;
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
