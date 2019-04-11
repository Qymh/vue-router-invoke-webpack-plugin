import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
export const routes = [
  {
    component: () => import('@/src/Index.vue'),
    name: 'index',
    path: '/'
  },
  {
    component: () => import('@/src/Complex/Index.vue'),
    name: 'complex',
    path: '/complex'
  },
  {
    component: () => import('@/src/Complex/Home/Home.vue'),
    name: 'complex-home',
    path: '/complex/home',
    children: [
      {
        component: () => import('@/src/Complex/Home/Account/Index.vue'),
        name: 'complex-home-account',
        path: 'account'
      },
      {
        component: () => import('@/src/Complex/Home/Details/Details.vue'),
        name: 'complex-home-details',
        meta: { name: 'details' },
        path: 'details',
        children: [
          {
            component: () =>
              import('@/src/Complex/Home/Details/Infor/Index.vue'),
            name: 'complex-home-details-infor',
            path: 'infor'
          }
        ]
      }
    ]
  },
  {
    component: () => import('@/src/Complex/Login/Index.vue'),
    name: 'complex-login',
    path: '/complex/login'
  },
  {
    component: () => import('@/src/Dynamic/Index.vue'),
    name: 'dynamic',
    path: '/dynamic'
  },
  {
    component: () => import('@/src/Dynamic/:User/Index.vue'),
    name: 'dynamic-user',
    meta: { name: 'user' },
    path: '/dynamic/:user'
  },
  {
    component: () => import('@/src/Nest/Index.vue'),
    name: 'nest',
    path: '/nest'
  },
  {
    component: () => import('@/src/Nest/Home/Home.vue'),
    name: 'nest-home',
    meta: { name: 'home' },
    path: '/nest/home',
    children: [
      {
        component: () => import('@/src/Nest/Home/Account/Index.vue'),
        name: 'nest-home-account',
        path: 'account'
      },
      {
        component: () => import('@/src/Nest/Home/Account/:Id/Index.vue'),
        name: 'nest-home-account-id',
        path: 'account/:id'
      }
    ]
  },
  {
    component: () => import('@/src/Single/Index.vue'),
    name: 'single',
    path: '/single'
  },
  {
    component: () => import('@/src/Single/User/Index.vue'),
    name: 'single-user',
    meta: { name: 'user' },
    path: '/single/user'
  },
  {
    path: '/',
    redirect: '/redirect'
  }
];
const router = new Router({
  mode: 'history',
  routes,
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
});
router.beforeEach((to, from, next) => {
  next();
});

router.beforeResolve((to, from, next) => {
  next();
});

router.afterEach((to, from) => {});
export default router;
