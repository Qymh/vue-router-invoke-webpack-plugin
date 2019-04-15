# vue-router-invoke-webpack-plugin

[中文版本](https://github.com/Qymh/vue-router-invoke-webpack-plugin/blob/master/docs/zh_CN/README.md)

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

## why use `vue-router-invoke-webpack-plugin`

In a `Single Page App`. `vue-router` will be used as a plugin to change route.The last generated `router.js` will be complex when there are more than fifty or sixty pages.To be friendly, we will split routes by function, the route which has same function will be put into one directory. That is what we did before.But later we found same problems especially when there are many people working together.

- the rule of naming

no universal name

![image](https://github.com/Qymh/vue-router-invoke-webpack-plugin/blob/master/docs/images/name.png)

- no specific hierarchy

The hierarchy of the route maybe second or third, but put them into one direcotry with the route which is first hierarchy.And we can't differentiate the hierarchy

![image](https://github.com/Qymh/vue-router-invoke-webpack-plugin/blob/master/docs/images/index_en.png)

- new people find it hard to accept

The generated routes are so complex,the naming of the rule doesn't have the semantization,and can't differentiate the hierarchy

Actually,The first and second problem can be resolved by `code review`.But it maybe coast many time,So we learn the generating of route from [nuxt](https://nuxtjs.org/guide/routing), we use the `hierarchy` instead `function` to split routes. And we resolved the problems.

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
