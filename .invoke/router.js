import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
const routes = [
  {
    component: () =>
      import('/Users/qymh/Documents/vue-router-invoke-webpack-plugin/demos/src/Login/Index.vue'),
    name: 'login',
    path: '/login'
  },
  {
    component: () =>
      import('/Users/qymh/Documents/vue-router-invoke-webpack-plugin/demos/src/User/Index.vue'),
    name: 'user',
    path: '/user'
  },
  {
    path: '/home',
    redirect: '/'
  },

  {
    path: '/demo',
    redirect: '/test'
  }
];
const router = new Router({ mode: 'history', routes });
export default router;
