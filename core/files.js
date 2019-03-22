const fs = require('fs');

const isFile = dir => fs.statSync(dir).isFile();
exports.isFile = isFile;

const root = process.cwd();
exports.root = root;

function writeFile(options) {
  if (!fs.existsSync(this.routerDir)) {
    if (options.routerDir) {
      fs.mkdirSync(`${root}/${routerDir}/.invoke`, { recursive: true });
    } else {
      fs.mkdirSync(`${root}/.invoke`, { recursive: true });
    }
    fs.writeFileSync(this.routerDir, this.routeString);
  } else {
    fs.writeFileSync(this.routerDir, this.routeString);
  }
}

function watchFile(options, start) {
  writeFile(options);
  fs.watch(this.watchDir, { recursive: true }, type => {
    if (type === 'change') {
      return;
    }
    start(options);
    writeFile(options);
  });
}

exports.writeOrWatchFile = function(options, start) {
  const isDev = process.env.NODE_ENV === 'development';
  isDev ? watchFile(options, start) : writeFile();
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
  options.ignore = options.ignore.map(v => (v = v.replace(/([\.])/g, '\\$1')));
  let reg = new RegExp(`(${options.ignore.join('|')})`, 'gi');
  this.ignoreRegExp = reg;
};

exports.generateRedirectRoute = function(options) {
  const { redirect } = options;
  for (const item of redirect) {
    this.routeString += `
      {
        path:'${item.path}',
        redirect:'${item.redirect}'
      },
    `;
  }
};
