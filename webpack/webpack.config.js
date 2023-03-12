/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
/* eslint-disable max-len */
const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const yaml = require('yaml');
// 用于生成html文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 用于提取css文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 用于压缩css文件
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// 用于压缩js文件
const TerserPlugin = require('terser-webpack-plugin');
// 用于ESLint检查
const ESLintPlugin = require('eslint-webpack-plugin');
// 用于gzip压缩
const CompressionPlugin = require('compression-webpack-plugin');

/**
 * 获取当前目录下所有的entry.js文件
 * 然后将其作为入口文件，key为文件名，value为文件路径
 * 例如:
 * - src
 *  - - index.entry.js
 * - main.entry.js
*/
const getEntryList = () => {
  const entryList = {};
  glob.sync(path.join(__dirname, './**/**.entry.js')).forEach((entry) => {
    console.log('🚀 ~ file: webpack.config.js:11 ~ glob.sync ~ entry:', entry);
    const entryName = entry.split('/')[entry.split('/').length - 1].split('.')[0];
    entryList[entryName] = entry;
  });
  console.log('🚀 ~ file: webpack.config.js:11 ~ glob.sync ~ entryList:', entryList);
  return entryList;
};

const entryList = getEntryList();

module.exports = {
  entry: {
    ...Object.keys(entryList).reduce((acc, cur) => {
      const obj = {
        import: entryList[cur], // 入口文件
        // dependOn: 'shared', // 依赖shared模块, 将公共代码提取到shared模块中
      };
      acc[cur] = obj;
      return acc;
    }, {}),
    // shared: ['lodash-es'], // 公共模块, 包含的模块会被提取到shared模块中
  }, // 入口文件
  output: {
    clean: true, // 删除上一次打包的文件，webpack5新增的配置，替代了clean-webpack-plugin
    path: path.join(__dirname, 'dist'), // 输出路径, 必须是绝对路径
    filename: 'js/[name]_[contenthash:8].js', // 输出文件名, name为entry的key值, contenthash:8为文件内容的hash值, 8位
    assetModuleFilename: 'images/[name]_[contenthash:8][ext]', // 用于打包图片文件, [ext]为文件后缀名
  },
  // 设置环境变量, 用于区分生产环境和开发环境, 默认为production, 可以通过cross-env设置环境变量, 也可以通过webpack的--mode参数设置环境变量
  mode: process.env.production ? 'production' : 'development',
  devtool: 'cheap-source-map', // 生成source-map文件, 用于调试, 会影响打包速度
  devServer: {
    compress: true, // 开启gzip压缩
    port: 8080, // 设置端口号为8080
    hot: true, // 热替换
    host: '0.0.0.0', // 设置域名
    historyApiFallback: {
      disableDotRule: true, // 用于解决单页面应用路由刷新404的问题
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/, // 匹配ts文件
        exclude: /node_modules/, // 排除node_modules文件夹
        include: path.join(__dirname, 'src'), // 只匹配src文件夹, 可以提高打包速度
        use: [
          'ts-loader', // 使用ts-loader, 用于将ts转换为js
        ],
      },
      {
        test: /\.js$/, // 匹配js文件
        exclude: /node_modules/, // 排除node_modules文件夹
        // include: path.join(__dirname, 'src'), // 只匹配src文件夹
        use: [
          // 缓存打包结果, 用于加快打包速度, 不兼容webpack5, 需要安装@2版本, 或者使用webpack5的cache: { type: 'filesystem' }
          // 'cache-loader',
          {
            loader: 'babel-loader', // 使用babel-loader, 用于将es6转换为es5
            options: {
              // 使用@babel/preset-env, 这是babel7的默认预设, 用于将es6转换为es5, 需要安装@babel/core和@babel/preset-env，配合@babel/plugin-transform-runtime使用
              presets: [
                [
                  '@babel/preset-env',
                  {
                    corejs: 3, // 指定core-js版本，需要安装core-js@3
                    useBuiltIns: 'usage', // 按需引入polyfill
                    targets: [
                      'last 1 versions', // 兼容最近的1个版本
                      '> 1%', // 兼容市场份额大于1%的浏览器
                    ],
                  },
                ],
              ],
              plugins: [
                ['@babel/plugin-transform-runtime', { // 使用@babel/plugin-transform-runtime, 用于减少打包后的文件体积
                }],
              ],
            },
          },
          {
            loader: 'thread-loader', // 多进程打包, 用于加快打包速度
            options: {
              workers: 3, // 进程数
              workerParallelJobs: 50, // 每个进程并行处理的任务数
              workerNodeArgs: ['--max-old-space-size=1024'], // 每个进程的node参数
              poolTimeout: 2000, // 空闲时等待的毫秒数
              poolParallelJobs: 50, // 池中并行处理的任务数
              name: 'my-pool', // 池的名称
            },
          },
        ],
      },
      {
        test: /\.css$/, // 匹配css文件
        use: [
          MiniCssExtractPlugin.loader, // // 使用MiniCssExtractPlugin.loader, 用于将css文件单独打包
          // 'style-loader', // 使用style-loader, 用于将css文件插入到html中
          {
            loader: 'css-loader', // 使用css-loader, 用于解析css文件
            options: {
              modules: {
                // 开启css模块化, 用于解决css样式冲突的问题
                localIdentName: '[name]_[local]_[hash:base64:5]', // 指定css模块化的类名格式, [name]为文件名, [local]为类名, [hash:base64:5]为文件内容的hash值, 5位
              },
            },
          },
          {
            loader: 'postcss-loader', // 使用postcss-loader, 兼容浏览器，自动添加前缀
            options: {
              postcssOptions: {
                plugins: [
                  'autoprefixer', // 使用autoprefixer, 用于自动添加浏览器前缀
                ],
              },
            },
          },
        ],
      },
      // {
      //   test: /\.vue$/i, // 匹配vue文件
      //   use: [
      //     {
      //       loader: 'vue-loader', // 使用vue-loader, 用于解析vue文件
      //       plugins: [
      //         {
      //           postTransformNode: (astEl) => {
      //             // 用于解决vue文件中的img标签src属性不生效的问题
      //             astEl.attrsList = astEl.attrsList.filter((attr) => attr.name !== 'src');
      //           },
      //         },
      //       ],
      //       options: {
      //         compilerOptions: {
      //           whitespace: 'condense', // 去除vue文件中的空格
      //         },
      //       },
      //     },
      //   ],
      // },
      {
        test: /\.(png|jpg|gif)$/i, // 匹配png/jpg文件
        type: 'asset', // 使用asset, 用于将图片文件打包到dist目录下, 自动根据文件大小选择使用asset/resource或asset/inline
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 8kb, 小于8kb的图片文件会被转换为base64字符串
          },
        },
        generator: {
          filename: 'images/[name].[contenthash:8][ext]', // 用于打包图片文件, [ext]为文件后缀名, 优先级高于output.assetModuleFilename
        },
      },
      {
        test: /\.svg$/i, // 匹配svg文件
        type: 'asset/inline', // 使用asset/inline, 用于将svg文件转换为base64字符串
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i, // 匹配字体文件
        type: 'asset/resource', // 使用asset/resource, 这是所有资源文件的默认生成器, 用于将字体文件打包到dist目录下
      },
      {
        test: /\.txt$/i, // 匹配txt文件
        type: 'asset/source', // 使用asset/source, 用于将txt文件打包到dist目录下
      },
      // 解析自定义文件
      {
        test: /\.yaml$/i, // 匹配yaml文件
        type: 'json', // 使用json, 用于将yaml文件转换为json文件
        parser: {
          parse: yaml.parse, // 使用yaml.parse, 用于将yaml文件转换为json文件
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      // 使用DefinePlugin, 用于定义全局变量
      BASE_URL: JSON.stringify('http://localhost:8080'),
    }),
    new webpack.ProvidePlugin({
      // 使用ProvidePlugin, 用于在每个模块中注入变量
      $: 'jquery', // $为变量名, jquery为模块名, 用于在每个模块中注入jquery模块, 无需在每个模块中import jquery模块
    }),
    new ESLintPlugin({
      extensions: ['js'], // 指定需要检查的文件后缀名
      exclude: 'node_modules', // 指定不需要检查的文件夹
      // fix: true, // 自动修复
    }),
    // 将css文件单独打包, 配合MiniCssExtractPlugin.loader使用
    new MiniCssExtractPlugin({
      filename: 'css/[name].css', // 输出文件名, name为entry的key值, contenthash:8为文件内容的hash值, 8位
      chunkFilename: 'css/[id].css', // 用于按需加载的css文件名
    }),
    ...Object.keys(entryList).map((name) => new HtmlWebpackPlugin({
      inject: 'body', // 将js文件插入到body底部
      chunks: [name], // 与entry的key值对应, 用于多页面应用, 一个页面对应一个entry, 一个entry对应一个chunk, 一个chunk对应一个js文件, 一个js文件对应一个html文件
      template: path.join(__dirname, 'src/template.html'), // 模板文件
      filename: `${name}.html`, // 输出文件名
      title: `这是${name}页面`, // 传递给模板文件的参数, 通过htmlWebpackPlugin.options.title获取, 例如: <%= htmlWebpackPlugin.options.title %>
      hash: true, // 为静态资源url后面添加hash值, 例如: main_1b2c3d4e.js?123123123123
      // minify: {
      //   removeComments: true, // 删除注释
      //   collapseWhitespace: true, // 删除空格
      //   removeAttributeQuotes: true, // 删除属性的引号
      //   minifyCSS: true, // 压缩内联css
      //   minifyJS: true, // 压缩内联js
      // },
    })),
  ],
  cache: {
    type: 'filesystem', // 使用文件系统缓存, 用于加快打包速度
  },
  optimization: {
    usedExports: true, // 用于标记未使用的导出, 用于tree shaking, 例如: import { a } from './a.js', 如果a.js中没有导出a, 则会被标记为未使用, 但是a.js中可能有副作用, 所以需要将a.js加入到sideEffects中, production模式下默认为true
    sideEffects: true, // 用于标记副作用, 用于tree shaking, 例如: import './a.js', 如果a.js中有副作用, 则会被标记为有副作用, 例如: import './a.js', 如果a.js中没有副作用, 则会被标记为没有副作用, 例如: import { a } from './a.js', 如果a.js中没有导出a, 则会被标记为未使用, 但是a.js中可能有副作用, 所以需要将a.js加入到sideEffects中, production模式下默认为true
    runtimeChunk: 'single', // 将runtime代码单独打包, 用于加快打包速度, 例如: runtime~main_1b2c3d4e.js
    // 将node_modules中的代码单独打包, 用于加快打包速度
    splitChunks: {
      // chunks: 'all', // 将所有的chunks代码单独打包, es6按需加载的代码不会被打包
      cacheGroups: { // 缓存组, 用于将多个chunks中的公共代码单独打包，并缓存起来供后面使用
        // 将node_modules中的代码单独打包
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors', // 打包后的文件名, 例如: vendors_1b2c3d4e.js
          chunks: 'all', // 将所有的chunks代码单独打包
          // minSize: 0, // 用于控制代码块的最小大小, 0表示无限制, 默认值是30kb
        },
      },
    },
    minimizer: [
      // 压缩css文件
      new CssMinimizerPlugin({
        // parallel: true, // 使用多进程并行运行来提高构建速度, 默认是os.cpus().length - 1, 也可以设置为数字
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true }, // 删除所有注释
            },
          ],
        },
      }),
      // 压缩js文件
      new TerserPlugin({
        // parallel: true, // 使用多进程并行运行来提高构建速度
        terserOptions: {
          compress: {
            drop_console: true, // 删除所有的console语句
          },
        },
      }),
      // 开启gzip压缩
      new CompressionPlugin({
        test: /\.(js|css|html|svg)$/, // 匹配文件名
        filename: '[path][base].gz', // 输出文件名
        // exclude: /\.(png|jpe?g|gif|webp|woff2?|eot|ttf|otf)$/i, // 排除文件名
        algorithm: 'gzip', // 使用gzip压缩
        threshold: 10240, // 只处理比这个值大的资源。按字节计算
        minRatio: 0.8, // 只有压缩率比这个值小的资源才会被处理
      }),
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'], // 自动解析确定的扩展, 例如: import 'index'会自动解析为import 'index.js', 尽量减少条目，会增加搜索步骤，增加解析时间
    alias: {
      '@': path.resolve(__dirname, 'src'), // 设置别名, 例如: import 'index'会自动解析为import '@/index'
    },
  },
  externals: {
    jquery: 'jQuery', // 将jquery作为外部依赖, 例如: import $ from 'jquery'会自动解析为import $ from 'jQuery', 不需要安装jquery，但是需要在html中通过cdn引入jquery, 且不会打包到dist目录下
  },
};
