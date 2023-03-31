require('dotenv').config();
const path = require('path');
const isDevMode = process.env.NODE_ENV === 'development';
const publicPath = isDevMode ? '/' : './';

const PLATFORMS = {
  MOBILE: 'mobile',
  PC: 'pc',
};

const PAGE_TYPE = {
  MPA: 'mpa',
  SPA: 'spa',
};

const TPL_DICT = {
  [PLATFORMS.MOBILE]: 'template/mobile.html',
  [PLATFORMS.PC]: 'template/pc.html',
}

const {
  NODE_ENV,
  ESBOOT_CONTENT_PATH,
  ESBOOT_PLATFORM = PLATFORMS.PC,
  ESBOOT_PAGE_TYPE = PAGE_TYPE.SPA,
  ESBOOT_CONTENT_PATTERN = '*'
} = process.env;

if (NODE_ENV === 'production') {
  process.env.BROWSERSLIST_ENV = `${ESBOOT_PLATFORM}-${ESBOOT_PAGE_TYPE}-production`;
}

module.exports = {
  ESBOOT_CONTENT_PATTERN,
  ESBOOT_PLATFORM,
  ESBOOT_PAGE_TYPE,
  ESBOOT_TEMPLATE: TPL_DICT[ESBOOT_PLATFORM],
  ESBOOT_CONTENT_PATH,
  ESBOOT_IS_MOBILE: ESBOOT_PLATFORM === PLATFORMS.MOBILE,
  ESBOOT_RELATIVE_STATIC_CONFIG_PATH: `./static-${ESBOOT_PLATFORM}-${ESBOOT_PAGE_TYPE}.config.js`,
  ESBOOT_CONFIG_PATH: path.resolve(__dirname, `../config/esboot/esboot-${ESBOOT_PLATFORM}-${ESBOOT_PAGE_TYPE}.config.js`),
  publicPath,
  ESBOOT_STATIC_CONFIG_PATH: path.resolve(__dirname, `../config/static-config/static-${ESBOOT_PLATFORM}-${ESBOOT_PAGE_TYPE}.config.js`)
};
