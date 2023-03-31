import { UNIT_LAN } from '@dz-web/o-orange';

// 多语言
export const LAN_ENUM = UNIT_LAN;

export const DEFAULT_LAN = LAN_ENUM.EN_US;
export const DEFAULT_UPDOWNCOLOR = 'red';
export const DEFAULT_PRICETWINKLE = true;
export const DEFAULT_OPTIONALPUSH = true;

// 多皮肤
export enum THEME {
  WHITE = 'white',
  BLACK = 'black',
  LIGHT = 'light',
  DARK = 'dark',
}

export const THEME_MAP = {
  [THEME.WHITE]: 'white',
  [THEME.BLACK]: 'black',
  [THEME.LIGHT]: 'white',
  [THEME.DARK]: 'black',
};

export const DEFAULT_THEME = THEME_MAP[THEME.BLACK];

// 红涨绿跌切换
export type GREEN = 'green';
export type RED = 'red';
const GREEN_COLOR = '#2d9e00';
const RED_COLOR = '#f23030';

export enum RISEFALLCOLOR {
  RED = 'red',
  GREEN = 'green',
}

export const RISE_FALL_CLASS_DICT = {
  [RISEFALLCOLOR.RED]: 'raise-red',
  [RISEFALLCOLOR.GREEN]: 'raise-green',
};

export interface IRiseFallColor {
  riseColor: string;
  fallColor: string;
}

interface IRiseFallColorsDict {
  green: IRiseFallColor;
  red: IRiseFallColor;
}

export const RISE_FALL_COLORS_DICT: IRiseFallColorsDict = {
  green: {
    riseColor: GREEN_COLOR,
    fallColor: RED_COLOR,
  },
  red: {
    riseColor: RED_COLOR,
    fallColor: GREEN_COLOR,
  },
};

export const DEFAULT_RISE_FALL_COLOR = RISE_FALL_COLORS_DICT.red;

// 常用区号
export const COMMONLY_USED_AREA_CODE = ['+86', '+852'];

// 短信类型（获取验证码）
export enum MESSAGE_TYPE {
  LOGIN = 'LOGIN',
  LOGIN_BIND_MOBILE = 'LOGIN_BIND_MOBILE',
  LOGIN_BIND_EMAIL = 'LOGIN_BIND_EMAIL',
  RESET_PWD = 'RESET_PWD',
  MODIFY_PWD = 'MODIFY_PWD',
  MODIFY_MOBILE_OLD = 'MODIFY_MOBILE_OLD',
  MODIFY_MOBILE_NEW = 'MODIFY_MOBILE_NEW',
  RESET_TRADE_PWD = 'RESET_TRADE_PWD',
}

// 用户设置配置
export const USERCONFIG_SETTINGS = {
  QUOTATION: 'QUOTATION*',
  upDownColor: 'QUOTATION.upDownColor',
  priceTwinkle: 'QUOTATION.priceTwinkle',
  APP: 'APP*',
  language: 'APP.language',
  fontSize: 'APP.font',
  AUTO_LOGIN: 'AUTO_LOGIN*',
  autoLogin: 'AUTO_LOGIN.autoLogin',
  timeout: 'AUTO_LOGIN.timeout',
  MESSAGE_NOTIFY: 'MESSAGE_NOTIFY*',
  optionalPush: 'MESSAGE_NOTIFY.optionalPush',
};

export const FONT_SIZE = 14;

export const FONT_CFG_SIZE_DICT = {
  12: -2,
  13: -1,
  14: 0,
  15: 1,
  16: 2,
};

export const FONT_MARKS = {
  12: 1,
  13: 2,
  14: 3,
  15: 4,
  16: 5,
};

export const FONT_CONVERT_MARKS = {
  1: 12,
  2: 13,
  3: 14,
  4: 15,
  5: 16,
};

export enum openStatus {
  UNOPEN='unopen', // 未开户
  OPENED='opened', // 已开户
  OPENING='opening' // 开户中
}

export const LAF_CONVERT = {
  simplified: LAN_ENUM.ZH_CN,
  traditional: LAN_ENUM.ZH_TW,
  english: LAN_ENUM.EN_US,
  [LAN_ENUM.ZH_CN]: 'simplified',
  [LAN_ENUM.ZH_TW]: 'traditional',
  [LAN_ENUM.EN_US]: 'english',
};

export const LAF_CONVERT_NAME = {
  [LAN_ENUM.ZH_CN]: 'simplified',
  [LAN_ENUM.ZH_TW]: 'traditional',
  [LAN_ENUM.EN_US]: 'english',
};

export const MINE_MODULE = {
  pictureMax: 5,
  pictureMaxMB: 5,
};
