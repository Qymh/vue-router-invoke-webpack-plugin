const {
  init,
  generateRouteString,
  sortFilesAst,
  generateFilesAst
} = require('./ast');
const { generateRedirectRoute, writeOrWatchFile } = require('./files');

function start(options) {
  init(options);
  generateFilesAst(options.dir, this.filesAst, '');
  sortFilesAst(this.filesAst);
  generateRouteString(this.filesAst);
  generateRedirectRoute(options);
  this.routeString += this.routeStringPost;
}

exports.start = start;

exports.invoke = function(options) {
  start(options);
  writeOrWatchFile(options, start);
};
