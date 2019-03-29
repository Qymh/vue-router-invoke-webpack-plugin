# vue-router-invoke-webpack-plugin

一个可以根据文件目录自动构建`vue-router`路由的 webpack 插件.同时也是一个目录规范插件

## 下载

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

## 用法

### Webpack

- 确保你设置了 process.env.NODE_ENV 在开发环境下为`development`,在生产环境下为`production`.你可以通过[cross-env](https://github.com/kentcdodds/cross-env)设置也可以通过其他插件
- 确保你定义了`dir`配置的别名
- 自动构建的路由是懒加载的,所以你需要引用一个 babel 插件[@babel/plugin-syntax-dynamic-import](https://babeljs.io/docs/en/next/babel-plugin-syntax-dynamic-import.html)

```javascript
const VueRouterInvokePlugin = require('vue-router-invoke-webpack-plugin');
const path = require('path')

// 省略掉其他配置...

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
  // 省略掉其他配置...
  configureWebpack(config) {
    config.plugins.push(
      new VueRouterInvokeWebpackPlugin({
        dir: 'src/views',
        // 必须设置dir配置的别名
        alias: '@/views'
      })
    );
  }
};

// 或者采用另外一个方法

module.exports = {
  // 省略掉其他配置...
  configureWebpack: {
    plugins: [
      new VueRouterInvokeWebpackPlugin({
        dir: 'src/views',
        // 必须设置dir配置的别名
        alias: '@/views'
      })
    ]
  }
};
```

### Start

在配置好后,你可以通过`npm run serve`或者你定义的其他命令在开发模式下激活插件,当`dir`观察的目录发生变化时,`router.js`会被自动构建

同样的,在生产环境下
