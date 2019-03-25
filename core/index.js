'use strict';

const { invoke } = require('./invoke');
class VueRouterInvokeWebpackPlugin {
  constructor(options) {
    this.$options = options;
    this.routerDir = '';
  }

  apply(compiler) {
    compiler.hooks.entryOption.tap('invoke', () => {
      invoke.call(this, this.$options);
    });
  }
}

module.exports = VueRouterInvokeWebpackPlugin;
