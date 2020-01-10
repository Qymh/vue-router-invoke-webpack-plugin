# vue-router-invoke-webpack-plugin

![](https://img.shields.io/codecov/c/github/qymh/vue-router-invoke-webpack-plugin)
![](https://img.shields.io/npm/dm/vue-router-invoke-webpack-plugin)
![](https://img.shields.io/npm/v/vue-router-invoke-webpack-plugin)
![](https://img.shields.io/npm/l/vue-router-invoke-webpack-plugin)

[CHANGELOG](https://github.com/Qymh/vue-router-invoke-webpack-plugin/blob/dev/CHANGELOG.md)

[中文版本](https://github.com/Qymh/vue-router-invoke-webpack-plugin/blob/dev/docs/zh_CN/README.md)

Automatic generate the routes of `vue-router` based on the file directory.

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

## What is Automatic Generate Routes

Routing automatic injection refers to according to the format of the file directory to automatically generate the corresponding `router.js`, every time without the need to create a module to reference manual

## Usage

### Webpack

- We need know whether the environment is `development` or `production`.So you should set `process.env.NODE_ENV` which is equal to `development` in the development environment and is equal to `production` in the production environment.There are many plugins can do that. We recommend [cross-env](https://github.com/kentcdodds/cross-env)
- If there are many people working together,we can't import route by the absolute address,so you should set a [alias](https://webpack.js.org/configuration/resolve/#resolvealias) for the watching `dir`.
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

vueCli3 will be easier than webpack

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

After configure the options you can use `npm run serve` or some other scripts that you defined to activate the plugin in the development environment. When first generated or the file which in the `dir` option's direction changes.`router.js` will be automatic generated.

And you can use `npm run build` or some other scripts that you defined to activate the plugin in the production environment. `router.js` will be automatic generated.

## Options

| Prop           |   Type   | Required |   Default    |                              Description |
| -------------- | :------: | :------: | :----------: | ---------------------------------------: |
| dir            |  String  |   true   |      ''      |                       vue file directory |
| alias          |  String  |   true   |      ''      |                 the option `dir`'s alias |
| notFound       |  String  |  false   |      ''      |      the alias address of notFound chunk |
| mode           |  String  |  false   |   history    |                          hash or history |
| meta           |  String  |  false   |     meta     |                      the yml file's name |
| routerDir      |  String  |  false   |     ROOT     |                 generated router.js file |
| language       |  String  |  false   |  javascript  |                 javascript or typescript |
| ignore         |  Array   |  false   | ['.dsstore'] | files or directions will not be resolved |
| redirect       |  Array   |  false   |      []      |                           redirect route |
| modules        |  Array   |  false   |      []      |                       the import modules |
| scrollBehavior | Function |  false   |      ''      |                   same as scrollBehavior |
| beforeEach     | Function |  false   |      ''      |                        router.beforeEach |
| beforeResolve  | Function |  false   |      ''      |                     router.beforeResolve |
| afterEach      | Function |  false   |      ''      |                         router.afterEach |

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

The address of `routerDir` is relative to `ROOT`, Pay attention to that it is not a absolute address

And I recommoned that `router.js` may put into `.gitignore` or `.eslintignore`. Everyone's branch can be independent because `router.js` will be automatic generated

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

Please pay attention to that there is a direcotry which wrapping the `Index.vue`,Do not name `vue` directly.It maybe not quite in the usual way

The same, do not name the directory with `Index`, it may have diffrent sense on `Nested Route`

> version 0.2.7, The plugin will throw an error when the wrong naming of the directory in production environment and will show you a danger notice in development environment

So if you see that

![image](https://github.com/Qymh/vue-router-invoke-webpack-plugin/blob/master/docs/images/notice.png)

The rule of naming about your directory maybe wrong

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
│       ├── _Home
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
    import('@/views/User/_Home/Index.vue'),
  name: 'user-home',
  path: '/user/:home'
}
```

### Nested Route

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

### Dymaic and Nested Route

If your directory just like this

```
src
├── views
│   ├── Login
│   │   └── Index.vue
│   └── User
│       ├── _Category
│       │   ├── _Category.vue
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
      import('@/views/User/_Category/_Category.vue'),
    name: 'user-category',
    path: '/user/:category',
    children: [
      {
        component: () =>
          import('@/views/User/_Category/Infor/Index.vue'),
        name: 'user-category-infor',
        path: 'infor'
      }
    ]
  }
```

## Correct the name

We will transform diffetent rule of naming into `upperCamelCase` naming

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

> Version greater than 0.4.1, meta's type supports `boolean` `string` `array` `plain object`, but it doesn't support `Symbol` `function` `undefined` `circled object` that can't be translated by `JSON.stringify`

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

Above Version `0.4.3` you can use `RegExp` to ignore files

And the value ignore case

```javascript
plugins: [
  new VueRouterInvokeWebpackPlugin({
    dir: 'src/views',
    alias: '@/views',
    language: 'javascript',
    ignore: ['images', 'components', 'template.vue', /\.scss$/]
  })
];
```

the directory

```
src
├── views
│   ├── Login
│   │   └── Index.vue
│   │   └── Index.scss
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

#### Redirect In yml

> Feature In `0.4.0`

you can add redirect path by using `yml`

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
redirect:
  - path: /test
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
  path: 'single/user',
  redirect: {
    path: '/test'
  },
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
