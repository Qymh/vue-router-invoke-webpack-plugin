'use strict';

const fs = require('fs');
const yamljs = require('yamljs');
const {
  warn,
  tips,
  camelize,
  replaceVue,
  firstLowerCase,
  replaceAlias,
  replaceArtificialDynamic,
  makeMap,
  diff
} = require('./utils');
const {
  isFile,
  root,
  getRouterDir,
  getWatchDir,
  generateIgnoreFiles,
  generateModules
} = require('./files');
let routeStringPreJs = modules =>
  `import Vue from 'vue';import Router from 'vue-router';${modules};Vue.use(Router);export const routes = [`;
let routeStringPreTs = modules =>
  `import Vue from 'vue';import Router, { RouteConfig } from 'vue-router';${modules};Vue.use(Router);export const routes: RouteConfig[] = [`;
let routeStringPostFn = (mode, behavior) =>
  `];const router = new Router({mode: '${mode}',routes,${behavior &&
    'scrollBehavior:' + behavior}});`;
let routeStringExport = 'export default router;';

const modeMap = makeMap('hash,history');
const languageMap = makeMap('javascript,typescript');

function sortByIsFile(arr) {
  return arr.sort((a, b) => Number(b.isFile) - Number(a.isFile));
}

function generateYmlReg(meta) {
  this.metaYmlReg = new RegExp(`^${meta}\\.yml$`, 'gi');
}

let nestCollections = {};

/**
 * @param {Object} options
 */
function init(options) {
  let mode = options.mode || 'history';
  let language = options.language || 'javascript';
  let meta = options.meta || 'meta';
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
  let modules = generateModules(options);
  this.isFirst = this.isFirst !== false;
  this.metaYmlReg = '';
  this.routerDir = '';
  this.watchDir = '';
  this.routeString = '';
  this.ignoreRegExp = '';
  this.nestArr = [];
  this.routeStringPre =
    language === 'javascript'
      ? routeStringPreJs(modules)
      : routeStringPreTs(modules);
  this.routeStringPost = routeStringPostFn(mode, behavior);
  this.routeStringExport = routeStringExport;
  this.alias = options.alias;
  this.dir = options.dir;
  generateYmlReg.call(this, meta);
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
    const fileLowerCase = firstLowerCase(file);
    const curDir = `${root}/${dir}/${file}`;
    if (this.metaYmlReg.test(file)) {
      const ymlStr = fs.readFileSync(curDir, 'utf8');
      const ymlObj = yamljs.parse(ymlStr);
      parent.children.map(v => {
        if (!this.metaYmlReg.test(v.file) && v.isFile) {
          v.meta = ymlObj && ymlObj.meta;
        }
      });
    }
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

    if (
      this.ignoreRegExp.test(
        curAst.parentName.length ? curAst.parentName.join('') : curAst.file
      )
    ) {
      curAst.ignore = true;
    }

    // fix empty vue
    if (
      curAst.isFile &&
      !(
        curAst.file === parent.file ||
        (curAst.file && curAst.file.toLowerCase() === 'index') ||
        (this.metaYmlReg && this.metaYmlReg.test(curAst.file))
      )
    ) {
      if (
        !this.ignoreRegExp.test(
          curAst.parentName.length ? curAst.parentName.join('') : curAst.file
        )
      ) {
        // maybe node's bug must use twice to judge
        if (
          this.ignoreRegExp.test(
            curAst.parentName.length ? curAst.parentName.join('') : curAst.file
          )
        ) {
          curAst.ignore = true;
        } else {
          curAst.ignore = true;
          tips(
            `\n'${
              curAst.alias
            }'is not in accordance with the rules \n you can not name it directly without a file wraps it \n you may check the correct use in documentation https://github.com/Qymh/vue-router-invoke-webpack-plugin#singleroute\n or you should make sure you have set it in the ignore option`
          );
          if (this.isFirst) {
            warn(
              `\n'${
                curAst.alias
              }'is not in accordance with the rules \n you can not name it directly without a file wraps it \n you may check the correct use in documentation https://github.com/Qymh/vue-router-invoke-webpack-plugin#singleroute\n or you should make sure you have set it in the ignore option`
            );
          }
        }
      }
    }

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
    nestCollections = {};
  }
  for (const item of filesAst) {
    // fix when non-compliance file
    if (item.ignore) {
    } else {
      if (!item.isFile) {
        generateRouteString.call(this, item.children, item);
      } else {
        if (this.metaYmlReg.test(item.file)) {
          if (nestCollections[item.parentName.join('-')]) {
            nestCollections[item.parentName.join('-')]--;
          }
        } else {
          this.routeString += `
            {
              component: () => import('${item.alias}'),
              name:'${
                item.parentName.length
                  ? item.parentName
                      .map(v => replaceArtificialDynamic(v))
                      .join('-')
                  : 'index'
              }',
              `;
          if (item.meta) {
            this.routeString += `meta:{`;
            for (const meta of item.meta) {
              for (const key in meta) {
                this.routeString += `${key}:'${meta[key]}',`;
              }
            }
            this.routeString += `},`;
          }
          if (Object.keys(nestCollections).length) {
            const curNest = this.nestArr[this.nestArr.length - 1].split('-');
            const res = diff(curNest, item.parentName);
            this.routeString += `path:'${res.join('/')}',`;
          } else {
            this.routeString += `path:'/${item.parentName.join('/')}',`;
          }
          if (item.isNest) {
            this.nestArr.push(item.parentName.join('-'));
            // fix when directory is empty and non-compliance file
            pre.children = pre.children.filter(v => {
              return (v.children && v.children.length) !== 0 && !v.ignore;
            });
            nestCollections[item.parentName.join('-')] =
              pre.children.length - 1;
            this.routeString += `children:[`;
            if (pre.children.length - 1 === 0) {
              this.routeString += '],},';
            }
          } else {
            this.routeString += '},';
          }
          const isNestChild = this.nestArr.some(v =>
            pre.parentName.join('-').includes(v)
          );
          if (isNestChild) {
            this.nestArr.forEach(v => {
              if (pre.parentName.join('-').includes(v)) {
                nestCollections[v]--;
              }
            });
            // fix when meta.yml is empty
            if (item.meta !== undefined) {
              nestCollections[pre.parentName.join('-')] -= 1;
            }
            // fix when nested route which has more than two childish routes
            if (pre.children.length >= 2) {
              nestCollections[pre.parentName.join('-')] +=
                pre.children.length - 1;
            }
            let count = 0;
            for (const key in nestCollections) {
              const val = nestCollections[key];
              if (val === 0) {
                count++;
                this.routeString += '],},';
              }
            }
            if (count === Object.keys(nestCollections).length) {
              nestCollections = {};
            }
          }
        }
      }
    }
  }
}

exports.generateFilesAst = generateFilesAst;
exports.sortFilesAst = sortFilesAst;
exports.generateRouteString = generateRouteString;
