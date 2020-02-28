import Vue from 'vue';
import Router from 'vue-router';
import apis from '@/apis';;
Vue.use(Router);
export const routes = [{
    component: () => import('@/src/Index.vue'),
    name: 'index',
    path: '/',
  },
  {
    component: () => import('@/src/Complex/Index.vue'),
    name: 'complex',
    path: '/complex',
  },
  {
    component: () => import('@/src/Complex/Home/Home.vue'),
    name: 'complex-home',
    path: '/complex/home',
    children: [{
        component: () => import('@/src/Complex/Home/Account/Account.vue'),
        name: 'complex-home-account',
        path: 'account',
        children: [{
            component: () => import('@/src/Complex/Home/Account/Chunk/Index.vue'),
            name: 'complex-home-account-chunk',
            path: 'chunk',
          },
          {
            component: () => import('@/src/Complex/Home/Account/Inner/Index.vue'),
            name: 'complex-home-account-inner',
            path: 'inner',
          },
          {
            component: () => import('@/src/Complex/Home/Account/_Dynamic/Index.vue'),
            name: 'complex-home-account-dynamic',
            path: ':dynamic',
          },
        ],
      },
      {
        component: () => import('@/src/Complex/Home/Details/Details.vue'),
        name: 'complex-home-details',
        meta: {
          name: 'details',
        },
        path: 'details',
        children: [{
            component: () => import('@/src/Complex/Home/Details/Infor/Index.vue'),
            name: 'complex-home-details-infor',
            path: 'infor',
          },
          {
            component: () => import('@/src/Complex/Home/Details/Intro/Index.vue'),
            name: 'complex-home-details-intro',
            path: 'intro',
          },
        ],
      },
    ],
  },
  {
    component: () => import('@/src/Complex/Login/Index.vue'),
    name: 'complex-login',
    path: '/complex/login',
  },
  {
    component: () => import('@/src/Dynamic/Index.vue'),
    name: 'dynamic',
    path: '/dynamic',
  },
  {
    component: () => import('@/src/Dynamic/_UserForm/Index.vue'),
    name: 'dynamic-userForm',
    meta: {
      name: 'user',
    },
    path: '/dynamic/:userForm',
  },
  {
    component: () => import('@/src/Nest/Index.vue'),
    name: 'nest',
    meta: {
      name: 'nest',
      bool: true,
    },
    path: '/nest',
  },
  {
    component: () => import('@/src/Nest/Home/Home.vue'),
    name: 'nest-home',
    path: '/nest/home',
    children: [{
        component: () => import('@/src/Nest/Home/Account/Index.vue'),
        name: 'nest-home-account',
        meta: {
          name: 'account',
        },
        path: 'account',
      },
      {
        component: () => import('@/src/Nest/Home/Account/_Id/Index.vue'),
        name: 'nest-home-account-id',
        path: 'account/:id',
      },
      {
        component: () => import('@/src/Nest/Home/Infor/Index.vue'),
        name: 'nest-home-infor',
        path: 'infor',
      },
      {
        component: () => import('@/src/Nest/Home/Test/Index.vue'),
        name: 'nest-home-test',
        path: 'test',
      },
    ],
  },
  {
    component: () => import('@/src/Nest/test/index.vue'),
    name: 'nest-test',
    path: '/nest/test',
  },
  {
    component: () => import('@/src/Single/Index.vue'),
    name: 'single',
    path: '/single',
  },
  {
    component: () => import('@/src/Single/User-Name/Index.vue'),
    name: 'single-userName',
    meta: {
      name: 'user',
    },
    redirect: {
      path: '/another',
    },
    path: '/single/userName',
  },
  {
    name: 'notFound',
    path: '*',
    component: () => import('@/src/NotFound.vue')
  },
];
const router = new Router({
  mode: 'history',
  routes,
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    } else {
      return {
        x: 0,
        y: 0
      };
    }
  }
});
router.beforeEach(async (to, from, next) => {
  if (!Vue._cachedForbiddenRoute) {
    Vue._cachedForbiddenRoute = [];
    await apis.getForbiddenRoute().then(res => {
      Vue._cachedForbiddenRoute = res;
    });
  }
  if (Vue._cachedForbiddenRoute.includes(to.path)) {
    next({
      name: 'notFound'
    });
  } else {
    next();
  }
});

router.beforeResolve((to, from, next) => {
  next();
});

router.afterEach((to, from) => {});
export default router;