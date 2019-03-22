const { invoke } = require('./invoke');
class VueRouterInvokeWebpackPlugin {
  constructor(options) {
    this.$options = options;
  }

  apply(compiler) {
    compiler.hooks.entryOption.tap('invoke', (a, b) => {
      invoke(this.$options);
    });
  }
}

module.exports = VueRouterInvokeWebpackPlugin;
