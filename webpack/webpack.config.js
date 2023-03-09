const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

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
  glob.sync(path.join(__dirname + '/**/**.entry.js')).forEach((entry) => {
    console.log("🚀 ~ file: webpack.config.js:11 ~ glob.sync ~ entry:", entry)
    const entryName = entry.split('/')[entry.split('/').length - 1].split('.')[0];
    entryList[entryName] = entry;
  });
  console.log("🚀 ~ file: webpack.config.js:11 ~ glob.sync ~ entryList:", entryList)
  return entryList;
};


const entryList = getEntryList();

module.exports = {
  entry: entryList, // 入口文件
  output: {
    clean: true, // 删除上一次打包的文件
    path: path.join(__dirname, 'dist'), // 输出路径, 必须是绝对路径
    filename: 'js/[name].[contenthash:8].js', // 输出文件名, name为entry的key值, contenthash:8为文件内容的hash值, 8位
  },
  mode: 'development', // 开发模式
  devtool: 'cheap-source-map', // 生成source-map文件, 用于调试, 会影响打包速度
  devServer: {
    compress: true, // 开启gzip压缩
    port: 8080, // 设置端口号为8080
    hot: true, // 热加载
    host: '127.0.0.1', // 设置域名
    historyApiFallback: {
      disableDotRule: true, // 用于解决单页面应用路由刷新404的问题
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/, // 匹配js文件
        exclude: /node_modules/, // 排除node_modules文件夹
        include: path.join(__dirname, 'src'), // 只匹配src文件夹
        use: [
          // 缓存打包结果, 用于加快打包速度, 不兼容webpack5, 需要安装@2版本, 或者使用webpack5的cache: { type: 'filesystem' }
          // 'cache-loader',
          'babel-loader', // 使用babel-loader, 用于将es6转换为es5
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
          }
        ],
      },
      {
        test: /\.css$/, // 匹配css文件
        use: ['style-loader', 'css-loader'], // 使用style-loader和css-loader
      },
    ]
  },
  plugins: [
    // 将css文件单独打包
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css', // 输出文件名, name为entry的key值, contenthash:8为文件内容的hash值, 8位
      chunkFilename: 'css/[id].[contenthash:8].css', // 用于按需加载的css文件名
    }),
    ...Object.keys(entryList).map((name) => {
      return new HtmlWebpackPlugin({
        inject: 'body', // 将js文件插入到body底部
        chunks: [name], // 与entry的key值对应, 用于多页面应用, 一个页面对应一个entry, 一个entry对应一个chunk, 一个chunk对应一个js文件, 一个js文件对应一个html文件
        template: path.join(__dirname, 'src/template.html'), // 模板文件
        filename: `${name}.html`, // 输出文件名
        title: `这是${name}页面`, // 传递给模板文件的参数, 通过htmlWebpackPlugin.options.title获取, 例如: <%= htmlWebpackPlugin.options.title %>
        hash: true, // 为静态资源生成hash值, 例如: <script src="main_1b2c3d4e.js"></script>
        // minify: {
        //   removeComments: true, // 删除注释
        //   collapseWhitespace: true, // 删除空格
        //   removeAttributeQuotes: true, // 删除属性的引号
        //   minifyCSS: true, // 压缩内联css
        //   minifyJS: true, // 压缩内联js
        // },
      })
    }),
  ],
  cache: {
    type: 'filesystem', // 使用文件系统缓存, 用于加快打包速度
  },
  optimization: {
    runtimeChunk: 'single', // 将runtime代码单独打包, 用于加快打包速度, 例如: runtime~main_1b2c3d4e.js
    // 将node_modules中的代码单独打包, 用于加快打包速度
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all', // 将所有的chunks代码单独打包
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
    ],
  },
}
