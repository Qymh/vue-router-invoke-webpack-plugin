# vue-router-invoke-webpack-plugin

This is a webpack plugin which can automatic generate your `vue-router` path and it is also a `Lint Plugin` which can stronger normalize your file directory

## ToDoList

- [x] eslint & commit check
- [x] publish shell
- [] tests
- [] circleci
- [] resolve meta succedaneum
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

make sure you have set process.env.NODE_ENV in development environment is equal to `development` and in production environment is equal to `production`.You can do that by using `cross-env` or some others plugin.

```javascript
const VueRouterInvokePlugin = require('vue-router-invoke-webpack-plugin');

// omit some others option...

plugins: [new VueRouterInvokePlugin()];
```

### VueCli3

ToDo

## Options

| Prop           |   Type   | Required |        Default         |                              Description |
| -------------- | :------: | :------: | :--------------------: | ---------------------------------------: |
| mode           |  String  |  false   |        history         |                          hash or history |
| dir            |  String  |   true   |           ''           |                       vue file directory |
| routerdir      |  String  |  false   | ROOT/.invoke/router.js |                 generated router.js file |
| language       |  String  |  false   |       javascript       |                 javascript or typescript |
| ignore         |  Array   |  false   |           []           | files or directions will not be resolved |
| redirect       |  Array   |  false   |           []           |                           redirect route |
| scrollBehavior | Function |  false   |           ''           |                   same as scrollBehavior |
| beforeEach     | Function |  false   |           ''           |                        router.beforeEach |
| beforeResolve  | Function |  false   |           ''           |                     router.beforeResolve |
| afterEach      | Function |  false   |           ''           |                         router.afterEach |

## How To Automatical Invoke

The following example depends on the same options

```javascript
plugins: [
  new VueRouterInvokePlugin({
    dir: 'demos/src',
    language: 'javascript'
  })
];
```

And import `router.js` in your entry file like `app.js` or `main.js`

The default location of `router.js` is under the invoke folder in the root directory,You can change the location anywhere by setting the `routerdir` option

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
demos
├── src
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
  component: () =>
    import('/Users/qymh/Documents/vue-router-invoke-webpack-plugin/demos/src/User/Account/Index.vue'),
  name: 'user-account',
  path: '/user/account'
},
{
  component: () =>
    import('/Users/qymh/Documents/vue-router-invoke-webpack-plugin/demos/src/User/Home/Index.vue'),
  name: 'user-home',
  path: '/user/home'
}
```

### Dynamic Route

If your directory just like this

```
demos
├── src
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
  component: () =>
    import('/Users/qymh/Documents/vue-router-invoke-webpack-plugin/demos/src/User/:Home/Index.vue'),
  name: 'user-home',
  path: '/user/:home'
}
```

### Nest Route

If your directory just like this

```
demos
├── src
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
    import('/Users/qymh/Documents/vue-router-invoke-webpack-plugin/demos/src/Login/Index.vue'),
  name: 'login',
  path: '/login'
},
{
  component: () =>
    import('/Users/qymh/Documents/vue-router-invoke-webpack-plugin/demos/src/User/User.vue'),
  name: 'user',
  path: '/user',
  children: [
    {
      component: () =>
        import('/Users/qymh/Documents/vue-router-invoke-webpack-plugin/demos/src/User/Chart/Index.vue'),
      name: 'user-chart',
      path: 'chart'
    },
    {
      component: () =>
        import('/Users/qymh/Documents/vue-router-invoke-webpack-plugin/demos/src/User/Home/Index.vue'),
      name: 'user-home',
      path: 'home'
    }
  ]
}
```

### Dymaic and Nest Route

If your directory just like this

```
demos
├── src
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
    component: () =>
      import('/Users/qymh/Documents/vue-router-invoke-webpack-plugin/demos/src/User/:Category/:Category.vue'),
    name: 'user-category',
    path: '/user/:category',
    children: [
      {
        component: () =>
          import('/Users/qymh/Documents/vue-router-invoke-webpack-plugin/demos/src/User/:Category/Infor/Index.vue'),
        name: 'user-category-infor',
        path: 'infor'
      }
    ]
  }
```

## Special Options

### Ignore

If your set options like this

`images` `components` `template.vue` will not be resolved by the plugin

And the value ignore case

```javascript
plugins: [
  new VueRouterInvokePlugin({
    dir: 'demos/src',
    language: 'javascript',
    ignore: ['images', 'components', 'template.vue']
  })
];
```

the directory

```
demos
├── src
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
    import('/Users/qymh/Documents/vue-router-invoke-webpack-plugin/demos/src/Login/Index.vue'),
  name: 'login',
  path: '/login'
},
{
  component: () =>
    import('/Users/qymh/Documents/vue-router-invoke-webpack-plugin/demos/src/User/Index.vue'),
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
    dir: 'demos/src',
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
  dir: 'demos/src',
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
  dir: 'demos/src',
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
