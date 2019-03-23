const { invoke } = require('./invoke');
class VueRouterInvokeWebpackPlugin {
  constructor(options) {
    this.$options = options;
  }

  apply(compiler) {
    compiler.hooks.entryOption.tap('invoke', () => {
      invoke(this.$options);
    });
  }
}

module.exports = VueRouterInvokeWebpackPlugin;
