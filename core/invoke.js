'use strict';

const {
  init,
  generateRouteString,
  sortFilesAst,
  generateFilesAst
} = require('./ast');
const {
  generateRedirectRoute,
  generateGuards,
  writeOrWatchFile
} = require('./files');

function start(options) {
  init.call(this, options);
  generateFilesAst.call(this, options.dir, this.filesAst, '');
  sortFilesAst.call(this, this.filesAst);
  generateRouteString.call(this, this.filesAst);
  // console.dir(this.filesAst, { depth: null });
  generateRedirectRoute.call(this, options);
  this.routeString += this.routeStringPost;
  generateGuards.call(this, options);
  this.routeString += this.routeStringExport;
}

exports.start = start;

exports.invoke = function(options) {
  start.call(this, options);
  writeOrWatchFile.call(this, options, start);
};
