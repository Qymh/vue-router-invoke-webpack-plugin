# vue-router-invoke-webpack-plugin

This is a webpack plugin which can automatic generate your `vue-router` path and it is also a `Lint Plugin` which can stronger normalize your file directory

## ToDoList

- [x] eslint & commit check
- [x] publish shell
- [x] tests
- [x] circleci
- [x] resolve meta succedaneum
- [] 中文文档

## Install

### npm

```javascript
npm install vue-router-invoke-webpack-plugin -D
```

### cnpm

```javascript
cnpm install vue-router-invoke-webpack-plugin -D
```

### yarn

```javascript
yarn add vue-router-invoke-webpack-plugin -D
```

## Usage

### Webpack

- make sure you have set process.env.NODE_ENV in development environment is equal to `development` and in production environment is equal to `production`.You can do that by using `cross-env` or some others plugin.
- make sure you have set the alias for `dir` option.

```javascript
const VueRouterInvokePlugin = require('vue-router-invoke-webpack-plugin');
const path = require('path')

// omit some others option...

resolve: {
  alias: {
    '@': path.resolve(process.cwd(), 'demos')
  }
}

plugins: [
  new VueRouterInvokePlugin(
    dir: 'demos/src',
    alias: '@/src'
  )
];
```

### VueCli3

`vue.config.js`

```javascript
const VueRouterInvokeWebpackPlugin = require('vue-router-invoke-webpack-plugin');

module.exports = {
  // omit other options...
  configureWebpack(config) {
    config.plugins.push(
      new VueRouterInvokeWebpackPlugin({
        dir: 'src/views',
        // must set the alias for the dir option which you have set
        alias: '@/views'
      })
    );
  }
};

// or another way..

module.exports = {
  // omit other options...
  configureWebpack: {
    plugins: [
      new VueRouterInvokeWebpackPlugin({
        dir: 'src/views',
        // must set the alias for the dir option which you have set
        alias: '@/views'
      })
    ]
  }
};
```

## Options

| Prop           |   Type   | Required |  Default   |                              Description |
| -------------- | :------: | :------: | :--------: | ---------------------------------------: |
| dir            |  String  |   true   |     ''     |                       vue file directory |
| alias          |  String  |   true   |     ''     |                 the option `dir`'s alias |
| mode           |  String  |  false   |  history   |                          hash or history |
| routerDir      |  String  |  false   |    ROOT    |                 generated router.js file |
| language       |  String  |  false   | javascript |                 javascript or typescript |
| ignore         |  Array   |  false   |     []     | files or directions will not be resolved |
| redirect       |  Array   |  false   |     []     |                           redirect route |
| scrollBehavior | Function |  false   |     ''     |                   same as scrollBehavior |
| beforeEach     | Function |  false   |     ''     |                        router.beforeEach |
| beforeResolve  | Function |  false   |     ''     |                     router.beforeResolve |
| afterEach      | Function |  false   |     ''     |                         router.afterEach |

## How To Automatical Invoke

The following example depends on VueCli3. I believe that if you know how to use in VueCli3,the using of webpack is easy for you.

`vue.config.js`

```javascript
const VueRouterInvokeWebpackPlugin = require('vue-router-invoke-webpack-plugin');

module.exports = {
  // omit other options...
  configureWebpack(config) {
    config.plugins.push(
      new VueRouterInvokeWebpackPlugin({
        dir: 'src/views',
        alias: '@/views'
      })
    );
  }
};
```

And import `router.js` in your entry file `src/main.js`

The default location of `router.js` is under the invoke folder in the root directory,You can change the location anywhere by setting the `routerDir` option

```javascript
import Vue from 'vue';
import App from './App.vue';
import router from '../.invoke/router';

export default new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
```

### SingleRoute

If your directory just like this

```
src
├── views
│   ├── Login
│   │   └── Index.vue
│   └── User
│       ├── Account
│       │   └── Index.vue
│       ├── Home
│       │   └── Index.vue
│       └── Index.vue
```

automatical generated route will be this

```javascript
{
  component: () =>
    import('@/views/Login/Index.vue'),
  name: 'login',
  path: '/login'
},
{
  component: () =>
    import('@/views/User/Index.vue'),
  name: 'user',
  path: '/user'
},
{
  component: () =>
    import('@/views/User/Account/Index.vue'),
  name: 'user-account',
  path: '/user/account'
},
{
  component: () =>
    import('@/views/User/Home/Index.vue'),
  name: 'user-home',
  path: '/user/home'
}
```

### Dynamic Route

If your directory just like this

```
src
├── views
│   ├── Login
│   │   └── Index.vue
│   └── User
│       ├── :Home
│       │   └── Index.vue
│       └── Index.vue
```

automatical generated route will be this

```javascript
{
  component: () =>
    import('@/views/Login/Index.vue'),
  name: 'login',
  path: '/login'
},
{
  component: () =>
    import('@/views/User/Index.vue'),
  name: 'user',
  path: '/user'
},
{
  component: () =>
    import('@/views/User/:Home/Index.vue'),
  name: 'user-home',
  path: '/user/:home'
}
```

### Nest Route

If your directory just like this

```
src
├── views
│   ├── Login
│   │   └── Index.vue
│   └── User
│       ├── Chart
│       │   └── Index.vue
│       ├── Home
│       │   └── Index.vue
│       └── User.vue
```

automatical generated route will be this

```javascript
{
  component: () =>
    import('@/views/Login/Index.vue'),
  name: 'login',
  path: '/login'
},
{
  component: () =>
    import('@/views/User/User.vue'),
  name: 'user',
  path: '/user',
  children: [
    {
      component: () =>
        import('@/views/User/Chart/Index.vue'),
      name: 'user-chart',
      path: 'chart'
    },
    {
      component: () =>
        import('@/views/User/Home/Index.vue'),
      name: 'user-home',
      path: 'home'
    }
  ]
}
```

### Dymaic and Nest Route

If your directory just like this

```
src
├── views
│   ├── Login
│   │   └── Index.vue
│   └── User
│       ├── :Category
│       │   ├── :Category.vue
│       │   └── Infor
│       │       └── Index.vue
│       └── Index.vue
```

automatical generated route will be this

```javascript
{
    component: () =>
      import('@/views/Login/Index.vue'),
    name: 'login',
    path: '/login'
  },
  {
    component: () =>
      import('@/views/User/Index.vue'),
    name: 'user',
    path: '/user'
  },
  {
    component: () =>
      import('@/views/User/:Category/:Category.vue'),
    name: 'user-category',
    path: '/user/:category',
    children: [
      {
        component: () =>
          import('@/views/User/:Category/Infor/Index.vue'),
        name: 'user-category-infor',
        path: 'infor'
      }
    ]
  }
```

## Strong Lint

As the title of our repository shows.This is also a lint plugin.

Whatever the file you named.

- `upperCamelCase` SomeName
- `hyphenate` some-name
- `underline` some_name

Or

- `uppercase` SOMENAME
- `lowercase` some-name

it will all be escaped to `UpperCamelCase` in the generated `router.js`

And multistage route's name will be hyphenated. So it is obvious you can differentiate the hierarchical state of the route.

For Example

```
src
├── views
│   ├── LoginPage
│   │   └── index.vue
│   └── User-home
│       ├── account
│       │   └── Index.vue
│       ├── Home-details
│       │   └── Index.vue
│       └── Index.vue
```

automatical generated route will be this

```javascript
{
  component: () => import('@/src/LoginPage/index.vue'),
  name: 'loginPage',
  path: '/loginPage'
},
{
  component: () => import('@/src/User-home/Index.vue'),
  name: 'userHome',
  path: '/userHome'
},
{
  component: () => import('@/src/User-home/Home-details/Index.vue'),
  name: 'userHome-homeDetails',
  path: '/userHome/homeDetails'
},
{
  component: () => import('@/src/User-home/account/Index.vue'),
  name: 'userHome-account',
  path: '/userHome/account'
},
```

## Demos

The detailed usage you can `git clone` our project and run `npm run build:demos` or you can just watch our [demos](https://github.com/Qymh/vue-router-invoke-webpack-plugin/tree/master/demos) directly.The demos dont't have substantial content,the more we focus is on the generation of directory,you can get how `router.js` generated in the demos.

## Meta Succedaneum

[vue-meta](https://github.com/nuxt/vue-meta) is a fantastic repository which can help you resolve

## Special Options

### Ignore

If your set options like this

`images` `components` `template.vue` will not be resolved by the plugin

And the value ignore case

```javascript
plugins: [
  new VueRouterInvokePlugin({
    dir: 'src/views',
    alias: '@/views',
    language: 'javascript',
    ignore: ['images', 'components', 'template.vue']
  })
];
```

the directory

```
src
├── views
│   ├── Login
│   │   └── Index.vue
│   ├── Template.vue
│   └── User
│       ├── Components
│       ├── Images
│       └── Index.vue
```

the automatical route

```javascript
{
  component: () =>
    import('@/views/Login/Index.vue'),
  name: 'login',
  path: '/login'
},
{
  component: () =>
    import('@/views/User/Index.vue'),
  name: 'user',
  path: '/user'
}
```

Obviously The plugin ignores the files

### Redirect

If your set options like this

```javascript
plugins: [
  new VueRouterInvokePlugin({
    dir: 'src/views',
    alias: '@/src',
    language: 'javascript',
    redirect: [
      {
        redirect: '/',
        path: '/home'
      },
      {
        redirect: '/test',
        path: '/demo'
      }
    ]
  })
];
```

the automatical route

```javascript
{
  path: '/home',
  redirect: '/'
},
{
  path: '/demo',
  redirect: '/test'
}
```

### VueRouter Guards

we have supported VueRouter's Guards `beforeEach` `beforeResolve` `afterEach`

If your set options like this

```javascript
new VueRouterInvokePlugin({
  dir: 'src/views',
  alias: '@/views',
  language: 'javascript',
  beforeEach: (to, from, next) => {
    next();
  },
  beforeResolve: (to, from, next) => {
    next();
  },
  afterEach: (to, from) => {}
});
```

the automatical route

```javascript
// omit others ...
const router = new Router({ mode: 'history', routes });
router.beforeEach((to, from, next) => {
  next();
});

router.beforeResolve((to, from, next) => {
  next();
});

router.afterEach((to, from) => {});
export default router;
```

### ScrollBehavior

If your set options like this

```javascript
new VueRouterInvokePlugin({
  dir: 'src/views',
  alias: '@/src',
  language: 'javascript',
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
});
```

the automatical route

```javascript
// omit others...
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
```
