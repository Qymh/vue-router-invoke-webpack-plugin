# vue-router-invoke-webpack-plugin

This is a webpack plugin which can automatic generate your `vue-router`'s routes.

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

## why use `vue-router-invoke-webpack-plugin`

As usual, We would create a file which named `router.js`,and import every route in the file. If your project has more than 50 or 60 pages.The `router.js` file will be complex. At this time you may split routes which have same function in one direcoty.And that is what we did before.

But we found some questions espicially when there are many people working togeter.

- The naming rules are not uniform

![image]()

- The hierarchy of pages is unclear

![image]()

- New to the project would be confusing because of the complex routes

So we tried another way. We split routes by the hierarchy.

## Usage

### Webpack

- make sure you have set process.env.NODE_ENV in development environment is equal to `development` and in production environment is equal to `production`.You can do that by using [cross-env](https://github.com/kentcdodds/cross-env) or some other plugin.
- make sure you have set the alias for `dir` option.
- the generated route will be lazyload. So make sure you have add [@babel/plugin-syntax-dynamic-import](https://babeljs.io/docs/en/next/babel-plugin-syntax-dynamic-import.html)

```javascript
const VueRouterInvokeWebpackPlugin = require('vue-router-invoke-webpack-plugin');
const path = require('path')

// omit some other option...

resolve: {
  alias: {
    '@': path.resolve(process.cwd(), 'demos')
  }
}

plugins: [
  new VueRouterInvokeWebpackPlugin(
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

### Start

After configure the options you can use `npm run serve` or some other scripts that you defined to activate the plugin in the development environment. When the file which in the `dir` option's direction changes.`router.js` will be automatic generated.

And you can use `npm run build` or some other scripts that you defined to activate the plugin in the production environment.

## Options

| Prop           |   Type   | Required |  Default   |                              Description |
| -------------- | :------: | :------: | :--------: | ---------------------------------------: |
| dir            |  String  |   true   |     ''     |                       vue file directory |
| alias          |  String  |   true   |     ''     |                 the option `dir`'s alias |
| notFound       |  String  |  false   |     ''     |      the alias address of notFound chunk |
| mode           |  String  |  false   |  history   |                          hash or history |
| meta           |  String  |  false   |    meta    |                      the yml file's name |
| routerDir      |  String  |  false   |    ROOT    |                 generated router.js file |
| language       |  String  |  false   | javascript |                 javascript or typescript |
| ignore         |  Array   |  false   |     []     | files or directions will not be resolved |
| redirect       |  Array   |  false   |     []     |                           redirect route |
| modules        |  Array   |  false   |     []     |                       the import modules |
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

### HomePage

We make a special treatment for HomePage which route is `/`

HomePage we named `Index.vue` and is a unique route

If your directory just like this

```
src
├── views
│   ├── Login
│   │   └── Index.vue
│   └── Index.vue
```

automatical generated route will be this

```javascript
{
  component: () =>
    import('@/views/Index.vue'),
  name: 'index',
  path: '/'
},
{
  component: () =>
    import('@/views/Login/Index.vue'),
  name: 'login',
  path: '/login'
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

In a multiplayer environment.Everyone has their own naming conventions

To a common format, Whatever the file you named.

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
  component: () => import('@/views/LoginPage/index.vue'),
  name: 'loginPage',
  path: '/loginPage'
},
{
  component: () => import('@/views/User-home/Index.vue'),
  name: 'userHome',
  path: '/userHome'
},
{
  component: () => import('@/views/User-home/Home-details/Index.vue'),
  name: 'userHome-homeDetails',
  path: '/userHome/homeDetails'
},
{
  component: () => import('@/views/User-home/account/Index.vue'),
  name: 'userHome-account',
  path: '/userHome/account'
},
```

## Meta Succedaneum

The `meta` option in `vue-router` can resolve many questions.Just like define the title of a page or define a page is necessary to login or not.

Some of the questions just like define the page title can be resolved by [vue-meta](https://github.com/nuxt/vue-meta).That is a fantastic repository.

But if you really need define the plain `meta` option of `vue-router` .You should make a `yml` file.

For example

```javascript
src/views
├── Single
│   ├── Index.vue
│   └── User
│       ├── Index.vue
│       └── meta.yml
```

`meta.yml`

```yml
meta:
  - name: user
```

automatical generated route will be this

```javascript
{
  component: () => import('@/views/Single/Index.vue'),
  name: 'single',
  path: 'single'
},
{
  component: () => import('@/views/Single/User/Index.vue'),
  name: 'single-user',
  meta: { name: user },
  path: 'single/user'
}
```

## Special Options

### NotFound

If your set options like this

```javascript
plugins: [
  new VueRouterInvokeWebpackPlugin({
    dir: 'src/views',
    alias: '@/views',
    // muse set ignore for notFound chunk
    ignore: ['NotFound.vue'],
    notFound: '@/views/NotFound.vue'
  })
];
```

the directory

```
src
├── views
│   ├── Login
│   │   └── Index.vue
│   └── Index.vue
│   └── NotFound.vue

```

automatical generated route will be this

```javascript
{
  component: () =>
    import('@/views/Index.vue'),
  name: 'index',
  path: '/'
},
{
  component: () =>
    import('@/views/NotFound.vue'),
  name: 'notFound',
  path: '*'
},
{
  component: () =>
    import('@/views/Login/Index.vue'),
  name: 'login',
  path: '/login'
}
```

### Ignore

If your set options like this

`images` `components` `template.vue` will not be resolved by the plugin

And the value ignore case

```javascript
plugins: [
  new VueRouterInvokeWebpackPlugin({
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
}
```

Obviously The plugin ignores the files

### Redirect

If your set options like this

```javascript
plugins: [
  new VueRouterInvokeWebpackPlugin({
    dir: 'src/views',
    alias: '@/views',
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

automatical generated route will be this

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

### Modules

The generated `router.js` has Two modules

```javascript
import Vue from 'vue';
import Router from 'vue-router';
```

If you need some other module which would use in `beforeEach` or some other place you can define it by using `modules`. For example

```javascript
new VueRouterInvokeWebpackPlugin({
  dir: 'src/views',
  alias: '@/views',
  modules: [
    {
      name: 'diyName',
      package: 'some-packages'
    }
  ]
});
```

automatical generated route will be this

```javascript
// omit other options
import diyName from 'some-packages';
```

### VueRouter Guards

we have supported VueRouter's Guards `beforeEach` `beforeResolve` `afterEach`

If your set options like this

```javascript
new VueRouterInvokeWebpackPlugin({
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

automatical generated route will be this

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
new VueRouterInvokeWebpackPlugin({
  dir: 'src/views',
  alias: '@/views',
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

automatical generated route will be this

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

## Demos

The detailed usage you can `git clone` our project and run `npm run build:demos` or you can just watch our [demos](https://github.com/Qymh/vue-router-invoke-webpack-plugin/tree/master/demos) directly.The demos dont't have substantial content,the more we focus is on the generation of directory,you can get how `router.js` generated in the demos.
