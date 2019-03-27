'use strict';

const fs = require('fs');
const {
  warn,
  camelize,
  replaceVue,
  lowerCase,
  replaceDynamic,
  replaceAlias,
  makeMap
} = require('./utils');
const {
  isFile,
  root,
  getRouterDir,
  getWatchDir,
  generateIgnoreFiles
} = require('./files');
let routeStringPreJs = `import Vue from 'vue';import Router from 'vue-router';Vue.use(Router);const routes = [`;
let routeStringPreTs = `import Vue from 'vue';import Router, { RouteConfig } from 'vue-router';Vue.use(Router);const routes: RouteConfig[] = [`;
let routeStringPostFn = (mode, behavior) =>
  `];const router = new Router({mode: '${mode}',routes,${behavior &&
    'scrollBehavior:' + behavior}});`;
let routeStringExport = 'export default router;';

const modeMap = makeMap('hash,history');
const languageMap = makeMap('javascript,typescript');

function sortByIsFile(arr) {
  return arr.sort((a, b) => Number(b.isFile) - Number(a.isFile));
}

let nestCollections = {};

/**
 * @param {Object} options
 */
function init(options) {
  let mode = options.mode || 'history';
  let language = options.language || 'javascript';
  if (!modeMap(mode)) {
    warn(
      `the mode can only be hash or history, make sure you have set the value correctly`
    );
  }
  if (!languageMap(language)) {
    warn(
      `the language can only be javascript or typescript, make sure you have set the value correctly`
    );
  }
  if (!options.dir) {
    warn(`the dir option is required please set the main files of vue`);
  }
  if (!options.alias) {
    warn(
      `the alias option is required, make sure you have set the alias of the dir option: ${
        options.dir
      } `
    );
  }
  let behavior = '';
  if (options.scrollBehavior) {
    behavior = options.scrollBehavior.toString();
  }
  this.routerDir = '';
  this.watchDir = '';
  this.routeString = '';
  this.ignoreRegExp = '';
  this.routeStringPre =
    language === 'javascript' ? routeStringPreJs : routeStringPreTs;
  this.routeStringPost = routeStringPostFn(mode, behavior);
  this.routeStringExport = routeStringExport;
  this.alias = options.alias;
  this.dir = options.dir;
  getRouterDir.call(this, options);
  generateIgnoreFiles.call(this, options);
  getWatchDir.call(this, options);
  this.routeString += this.routeStringPre;
  this.filesAst = [];
}

exports.init = init;

/**
 *
 * @param {String} dir
 * @param {Array} filesAst
 * @param {Object} parent
 */
function generateFilesAst(dir, filesAst, parent) {
  const files = fs.readdirSync(dir);
  if (!files.length && !parent) {
    warn(
      `the directory ${dir} is empty, make sure you have set the directory correctly`
    );
  }
  for (const file of files) {
    const curAst = {};
    const fileLowerCase = lowerCase(file);
    const curDir = `${root}/${dir}/${file}`;
    curAst.dir = curDir;
    curAst.alias = `${this.alias}${replaceAlias(dir, this.dir)}/${file}`;
    curAst.file = camelize(replaceVue(fileLowerCase));
    curAst.isFile = isFile(curDir);
    if (parent) {
      curAst.isNest = curAst.file.trim() === camelize(parent.file).trim();
      curAst.parentName = parent.parentName.concat(parent.file);
    } else {
      curAst.parentName = [];
    }
    filesAst.push(curAst);
    if (!curAst.isFile) {
      curAst.children = [];
      generateFilesAst.call(this, `${dir}/${file}`, curAst.children, curAst);
    }
  }
}

/**
 * isFile:true will in front of isFile:false
 * @param {Array} filesAst
 */
function sortFilesAst(filesAst) {
  sortByIsFile(filesAst);
  for (const item of filesAst) {
    if (item.children) {
      sortFilesAst.call(this, item.children);
    }
  }
}

/**
 *
 * @param {Array} filesAst
 * @param {Object} pre
 */
function generateRouteString(filesAst, pre) {
  if (!pre) {
    nestCollections = [];
  }
  for (const item of filesAst) {
    if (
      this.ignoreRegExp &&
      (this.ignoreRegExp.test(item.file) ||
        (item.parentName && this.ignoreRegExp.test(item.parentName.join(''))))
    ) {
    } else {
      if (!item.isFile) {
        if (nestCollections[item.parentName.join('-')]) {
          nestCollections[item.parentName.join('-')]--;
        }
        generateRouteString.call(this, item.children, item);
      } else {
        this.routeString += `
        {
          component: () => import('${item.alias}'),
          name:'${replaceDynamic(item.parentName.join('-'))}',
          `;
        if (pre && nestCollections[pre.parentName.join('-')] !== undefined) {
          this.routeString += `path:'${pre.file}',`;
        } else {
          this.routeString += `path:'/${item.parentName.join('/')}',`;
        }
        if (item.isNest) {
          nestCollections[item.parentName.join('-')] = pre.children.length - 1;
          this.routeString += `children:[`;
          if (pre.children.length - 1 === 0) {
            this.routeString += '],},';
          }
        } else {
          this.routeString += '},';
        }
        if (pre && nestCollections[pre.parentName.join('-')] === 0) {
          this.routeString += '],},';
        }
      }
    }
  }
}

exports.generateFilesAst = generateFilesAst;
exports.sortFilesAst = sortFilesAst;
exports.generateRouteString = generateRouteString;
