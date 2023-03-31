import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'DZ WEB TEAM',
  hash: true,
  outputPath: 'dist',
  history: {
    type: 'hash',
  },
  publicPath: process.env.NODE_ENV === 'development' ? '/' : '/pd/zw/',
  mode: 'site',
  // mfsu: {
  //   development: {
  //     output: './.mfsu-dev',
  //   },
  //   // production : {
  //   //   output : "./.mfsu-prod",
  //   // }
  // },
  styles: [
    `html, body, #root, .__dumi-default-mobile-demo-layout, .__dumi-default-mobile-demo-layout > div { height: 100% }`,
  ],
  navs: [
    null,
    {
      title: '项目资源',
      children: [
        { title: '代码地址', path: 'http://git.web.dz/WebTeam/zhongwei-web' },
        { title: '任务管理', path: 'http://git.web.dz/WebTeam/zhongwei-web/issues' },
        { title: '项目文档', path: 'https://doc.dztec.net/display/YWZTAPP' },
      ],
    },
  ],
  themeConfig: {
    repository: {
      url: '',
      branch: 'master',
      platform: 'github',
    },
  },
  favicon: './images/project-logo.jpg',
  logo: './images/dz-logo.jpg',
});
