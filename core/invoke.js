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
  init(options);
  generateFilesAst(options.dir, this.filesAst, '');
  sortFilesAst(this.filesAst);
  generateRouteString(this.filesAst);
  generateRedirectRoute(options);
  this.routeString += this.routeStringPost;
  generateGuards(options);
  this.routeString += this.routeStringExport;
}

exports.start = start;

exports.invoke = function(options) {
  start(options);
  writeOrWatchFile(options, start);
};
