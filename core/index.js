'use strict';

const { invoke } = require('./invoke');
class VueRouterInvokeWebpackPlugin {
  constructor(options) {
    this.$options = options;
    this.routerDir = '';
  }

  apply(compiler) {
    // webpack4
    if (compiler && compiler.hooks && compiler.hooks.entryOption) {
      compiler.hooks.entryOption.tap('invoke', () => {
        invoke.call(this, this.$options);
      });
    }
    // webpack3
    else {
      compiler.plugin('entry-option', () => {
        invoke.call(this, this.$options);
      });
    }
  }
}

module.exports = VueRouterInvokeWebpackPlugin;
