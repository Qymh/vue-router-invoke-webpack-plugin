const webpack = require('webpack');
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const Progress = require('progress-bar-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueRouterInvokePlugin = require('../core/index');
const isDev = process.env.NODE_ENV === 'development';

const base = {
  mode: process.env.NODE_ENV,
  entry: {
    app: path.resolve(__dirname, './index.js')
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue']
  },
  plugins: [
    new VueRouterInvokePlugin({
      dir: 'demos/src',
      language: 'javascript',
      ignore: ['images', 'components', 'template.vue'],
      beforeEach: (to, from, next) => {
        next();
      },
      beforeResolve: (to, from, next) => {
        next();
      },
      afterEach: (to, from, next) => {
        next();
      },
      scrollBehavior: (to, from, savedPosition) => {
        if (savedPosition) {
          return savedPosition;
        } else {
          return { x: 0, y: 0 };
        }
      }
    }),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, './index.html')
    }),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }
};

if (isDev) {
  base.devServer = {
    port: '8089',
    publicPath: '/',
    inline: true,
    quiet: true,
    clientLogLevel: 'warning',
    historyApiFallback: true
  };

  base.plugins.push(
    new Progress(),
    new webpack.DefinePlugin({
      process: {
        env: {
          NODE_ENV: '"development"'
        }
      }
    })
  );
}

if (!isDev) {
  base.plugins.push(
    new webpack.DefinePlugin({
      process: {
        env: {
          NODE_ENV: '"production"'
        }
      }
    })
  );
}

module.exports = base;
