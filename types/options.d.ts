import { Route, NavigationGuard } from 'vue-router';
import Vue from 'vue';

type mode = 'hash' | 'history';
type language = 'javascript' | 'typescript';
type Position = { x: number; y: number };
type PositionResult = Position | { selector: string; offset?: Position } | void;

export interface VueRouterInvokeWebpackPluginOptions {
  dir: string;
  alias: string;
  notFound?: string;
  mode?: mode;
  meta?: string;
  routerDir?: string;
  language?: language;
  ignore?: string[];
  redirect?: string[];
  modules?: string[];
  scrollBehavior?: (
    to: Route,
    from: Route,
    savedPosition: Position | void
  ) => PositionResult | Promise<PositionResult>;
  beforeEach?: (guard: NavigationGuard) => void;
  beforeResolve?: (guard: NavigationGuard) => void;
  afterEach?: (to: Route, from: Route) => void;
}
