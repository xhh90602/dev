import { fileURLToPath, URL } from 'node:url'

import { defineConfig, mergeConfig, splitVendorChunk, SplitVendorChunkCache, splitVendorChunkPlugin, type UserConfigExport } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import typescript2 from 'rollup-plugin-typescript2'
import legacy from '@vitejs/plugin-legacy'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {

  // 公共配置
  const commonConfig: UserConfigExport = {
    base: './', // 基础路径，存放在服务器的目录
    publicDir: 'public', // 静态资源目录，默认为public，该目录中的文件在开发期间在 / 处提供，并在构建期间复制到 outDir 的根目录
    cacheDir: '.cache', // 缓存目录，默认为 "node_modules/.vite"
    plugins: [
      vue(), // vue plugin, 解析.vue文件
      vueJsx(), // vue-jsx plugin, 解析.jsx文件
      {
        ...typescript2(), // typescript plugin, 解析.ts文件
        apply: 'build', // 只在build时使用
      },
    ],
    resolve: {
      alias: { // 路径别名
        '@': path.resolve(__dirname, 'src') // src目录
      },
      dedupe: ['vue'], // 去除重复依赖
      conditions: ['module', 'import'], // 优先使用esm模块
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json',], // 导入文件时自动添加的扩展名
    },
    define: { // 全局常量，开发环境下会被定义在全局，而在构建时被静态替换。
      'process.env': process.env, // 防止vite打包时报错
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly', // css模块化命名规则, 只允许驼峰命名
        scopeBehaviour: 'local', // css模块化作用域, 只作用于当前文件
        globalModulePaths: [/node_modules/], // css模块化全局样式, 该目录中的文件不会被模块化
        generateScopedName: '[name]__[local]___[hash:base64:5]', // css模块化命名规则, 生成的类名
        hashPrefix: 'hash', // css模块化命名规则, 生成的类名前缀
      },
      postcss: {
        plugins: [
          require('postcss-import'), // 支持@import导入css
          require('postcss-url'), // 支持url导入图片
          require('postcss-preset-env')({ // 支持css新特性
            stage: 3,
            features: {
              'nesting-rules': true, // 支持嵌套
            }
          }),
          require('postcss-nested'), // 支持嵌套
          require('postcss-pxtorem')({ // 支持px转rem
            rootValue: 16, // 根元素字体大小
            unitPrecision: 5, // 转换后的精度
            propList: ['*'], // 转换的属性
            selectorBlackList: [], // 不转换的选择器
            replace: true, // 替换包含rem的规则，而不是添加回退
            mediaQuery: false, // 允许在媒体查询中转换px
            minPixelValue: 0, // 设置要替换的最小像素值
          }),
          require('autoprefixer'), // 自动添加浏览器前缀
        ]
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@import "./src/styles/variables.scss";`, // 全局引入scss变量
        }
      },
      devSourcemap: true, // 开发环境下生成sourcemap
    },
    json: {
      stringify: true, // 导入的 JSON 会被转换为 export default JSON.parse("...")
    },
    esbuild: {
      jsxInject: `import React from 'react'`, // 自动导入React
      sourcemap: 'inline', // 生成sourcemap
      jsxFactory: 'React.createElement', // jsx转换函数
      jsxFragment: 'React.Fragment', // jsx转换函数
    },
    envDir: 'env', // 环境变量目录
    envPrefix: 'VITE_', // 环境变量前缀
    appType: 'mpa',
    optimizeDeps: { // 优化依赖
      include: ['lodash-es'], // 排除预构建的依赖
    }
  }

  // 开发环境配置
  const devConfig: UserConfigExport = {
    server: {
      host: '0.0.0.0', // 服务器主机名
      port: 9013, // 服务器端口
      open: true, // 自动打开浏览器
      cors: true, // 允许跨域
      strictPort: false, // 端口被占用时，自动分配一个未被占用的端口, true时退出进程
      https: false, // 启用https
      proxy: { // 代理
        '/api': {
          target: 'http://localhost:3000', // 代理目标地址
          changeOrigin: true, // 改变源
          rewrite: (path) => path.replace(/^\/api/, '') // 重写路径
        }
      },
      hmr: {
        overlay: true, // 显示错误
      },
      headers: { // 设置响应头
        'Access-Control-Allow-Origin': '*', // 允许跨域
      },
    }
  }
  // 生产环境配置
  const prodConfig: UserConfigExport = {
    plugins: [
      legacy({
        targets: ['defaults', 'not IE 11'], // 兼容低版本浏览器
      }),
      splitVendorChunkPlugin()
    ],
    build: {
      outDir: 'dist', // 打包后的目录
      assetsDir: 'assets', // 静态资源目录
      assetsInlineLimit: 4096, // 小于该大小的资源会被内联为base64编码
      cssCodeSplit: true, // 提取css
      emptyOutDir: true, // 清空打包后的目录
      sourcemap: 'inline', // 生成sourcemap
      rollupOptions: { // rollup配置
        input: {// 入口文件
          main: fileURLToPath(new URL('./index.html', import.meta.url)), // 主入口
          sub: fileURLToPath(new URL('./sub.html', import.meta.url)), // 子入口
        }
      },
      target: 'es2015', // 打包后的目标环境
      watch: {
        clearScreen: false, // 清空控制台
      },
    }
  }

  return mergeConfig(commonConfig, command === 'serve' ? devConfig : prodConfig)
})
