/* eslint-disable import/no-extraneous-dependencies */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'src/index.js'),
  plugins: [
    new HtmlWebpackPlugin(),
    new WorkboxPlugin.GenerateSW({ // 生成 Service Worker
      clientsClaim: true, // 快速启用 Service Worker
      skipWaiting: true, // 跳出等待状态
    }),
  ],
  devServer: {
    devMiddleware: {
      writeToDisk: true, // 将打包后的文件写入硬盘
    },
  },
  output: {
    clean: true,
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
};
