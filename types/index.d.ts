import { VueRouterInvokeWebpackPluginOptions } from './options';
interface VueRouterInvokeWebpackPluginConstructor {
  new (options: VueRouterInvokeWebpackPluginOptions);
}

declare const VueRouterInvokeWebpackPlugin: VueRouterInvokeWebpackPluginConstructor;

export default VueRouterInvokeWebpackPlugin;
