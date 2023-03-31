/* eslint-disable default-param-last */
/* eslint-disable prefer-regex-literals */
import Decimal from 'decimal.js';

const defaultPlaceHold = '--';
const currLang = 'zh';

export enum LangType {
  CN = 'zh',
  HK = 'hk',
  EN = 'en',
}

export function safeCalc(b, calc, placeHolder = defaultPlaceHold) {
  if (b !== undefined) return calc();
  return placeHolder;
}

/**
 * 取小数位  小数位后 不补0
 */
export function toDecimalPlaces(n, num = 2, placeHolder = defaultPlaceHold) {
  if (typeof n === 'string') return n;
  if (typeof n === 'number') {
    return new Decimal(n).toDecimalPlaces(num).toNumber();
  }
  return placeHolder;
}

/**
 * 保留小数位向上取整
 */
export function toUpFixed(n, num = 2, placeHolder = defaultPlaceHold) {
  if (typeof n === 'string') return n;
  if (typeof n === 'number') {
    return new Decimal(n).toDecimalPlaces(num, Decimal.ROUND_UP).toNumber();
  }
  return placeHolder;
}

/**
 * 保留小数位向下取整
 */
export function toDownFixed(n, num = 2, placeHolder = defaultPlaceHold) {
  if (typeof n === 'string') return n;
  if (typeof n === 'number') {
    return new Decimal(n).toDecimalPlaces(num, Decimal.ROUND_DOWN).toNumber();
  }
  return placeHolder;
}

/**
 * 取小数位 小数位后 补0
 */
export function toFixed(n, num = 2, placeHolder = defaultPlaceHold) {
  if (typeof n === 'string') return n;
  if (typeof n === 'number') {
    return new Decimal(n).toFixed(num);
  }
  return placeHolder;
}

export function fill(s: number | string, len = 2, pad = '0') {
  return String(s).padStart(len, pad);
}

export function formateDate(d?: Date) {
  d = d || new Date();
  return `${fill(d.getHours())}:${fill(d.getMinutes())}:${fill(d.getSeconds())}`;
}

export function between(num, min, max) {
  let p = Math.max(min, num);
  p = Math.min(max, p);
  return p;
}

// 无行情数据格式化
export function formatUnAuthData(auth, data, placeholder = '--') {
  if (!auth) return placeholder;
  return data;
}

/**
 * 数值带正负号
 */
export function withSign(n, num = 2, placeHolder = defaultPlaceHold) {
  if (typeof n === 'string') return n;
  if (typeof n === 'number') {
    if (n > 0) return `+${new Decimal(n).toFixed(num)}`;
    return `${new Decimal(n).toFixed(num)}`;
  }
  return placeHolder;
}

/**
 * 数值带百分比及正负号
 */
export function withSignAndPercent(n, num = 2, placeHolder = defaultPlaceHold) {
  if (typeof n === 'string') return n;
  if (typeof n === 'number') {
    if (n > 0) return `+${new Decimal(n).toFixed(num)}%`;
    return `${new Decimal(n).toFixed(num)}%`;
  }
  return placeHolder;
}

/**
 * 数值带百分比
 */
export function withPrecent(n, num = 2, placeHolder = defaultPlaceHold) {
  if (typeof n === 'string') return n;
  if (typeof n === 'number') {
    return `${new Decimal(n).toFixed(num)}%`;
  }
  return placeHolder;
}

export const round = (value, place = 2) => {
  const placeNumber = 10 ** place;
  const valueInt = Math.round(value * placeNumber);
  if (Number.isFinite(valueInt)) {
    return (valueInt / placeNumber).toFixed(place);
  }
  return '0.00';
};

export function humanNumberCore(map: any, n: number, p = 2, fixed = true) {
  const d = new Decimal(n);
  const numLength = d.toDP(0).sd(true);
  const keys = Object.keys(map).map((i) => parseFloat(i)).sort((a, b) => b - a);
  const idx = keys.findIndex((key) => numLength - 1 >= key);
  const div = idx >= 0 ? keys[idx] : 0;
  const rs = d.dividedBy(10 ** div);
  const final = fixed ? rs.toFixed(p, Decimal.ROUND_FLOOR) : rs.toDecimalPlaces(p, Decimal.ROUND_FLOOR);
  const unit = map[keys[idx]] || '';
  return `${final}${unit}`;
}

/**
 * 人性化数字格式
 * @param number  数值
 * @param p  精度
 * @param langType
 * @param fixed
 * @param placeHolder  无数值时，占位符
 */
export function humanNumber(
  number: number | string | null | undefined,
  p = 2,
  langType,
  fixed = true,
  placeHolder = defaultPlaceHold,
) {
  if (typeof number === 'string') return number;
  if (Number.isNaN(number) || number === null || number === undefined) return placeHolder;
  const map = currLang === LangType.CN ? ({ 12: '万亿', 8: '亿', 4: '万' }) : ({ 9: 'B', 6: 'M', 3: 'K' });
  return humanNumberCore(map, number, p, fixed);
}

export function compare2Color(a, b = 0, i = 0) {
  if (a - b > i) return 'raise';
  if (a - b < i) return 'decline';
  return '';
}

export function object2FormString(obj): any {
  const fromData = new FormData();
  Object.entries(obj).forEach(([k, v]) => {
    fromData.append(k, typeof v === 'object' ? JSON.stringify(v) : v as string);
  });
  return fromData;
}

export function selectStockNameField(data) {
  const suffixMap = {
    zh: ['name', 'cnName'],
    hk: ['twName', 'hkName'],
    en: ['enName', 'usName'],
  };
  const idx = data.cnName ? 1 : 0; // 指数名称字段取配置
  return suffixMap.zh[idx];
  // switch (currLang) {
  //   case LangType.CN:
  //     return suffixMap.zh[idx];
  //   case LangType.HK:
  //     return suffixMap.hk[idx];
  //   default:
  //     return suffixMap.en[idx];
  // }
}

export enum ThemeType {
  WHITE,
  BLACK,
}

export enum ColorMode {
  /**
   * 红涨绿跌
   */
  RAISE_RED_DECLINE_GREEN = 'RAISE_RED_DECLINE_GREEN',
  /**
   * 绿涨红跌
   */
  RAISE_GREEN_DECLINE_RED = 'RAISE_GREEN_DECLINE_RED',
}

export function selectStockName(record, lang?: LangType) {
  // return record.name || '--';
  // const currLang = lang || getLangType();
  return record[selectStockNameField(record)] || record.name || '--';
}

export function safeCalcWithList(b: any[], calc: () => any, placeHolder = defaultPlaceHold) {
  if (!(b.some((item) => item === undefined))) return calc();

  return placeHolder;
}

/**
 * 为0就不计算
 *
 */
export function calcWithNoZero(num: string | number, handler = () => undefined, placeHolder = defaultPlaceHold) {
  if (+num === 0) return placeHolder;

  return handler();
}

/**
 * 涨跌色
 *
 */
export function getColor(val, lastclose) {
  if (!val || !lastclose || val - lastclose === 0) {
    return 'num-balanced';
  }
  return val - lastclose > 0 ? 'raise' : 'decline';
}

/**
 * 涨跌色配置
 *
 */
export function getRaiseDeclineColor(config) {
  if (config === ColorMode.RAISE_GREEN_DECLINE_RED) return 'raise-green';
  return 'raise-red';
}

export const isIELessThan11 = () => window.navigator.appName === 'Microsoft Internet Explorer';
export const isIE11 = () => (
  window.navigator.userAgent.indexOf('Trident') > -1
  && window.navigator.userAgent.indexOf('rv:11.0') > -1
);
export const isIE = () => isIELessThan11() || isIE11();

// 取humanNumber单位
export function getUnitFromHumanNumber(s: string) {
  const arr = s.split('').reverse();
  const reg = /^[0-9]+.?[0-9]*$/;
  const i = arr.findIndex((v) => reg.test(v));
  if (i === -1) return '';
  return arr.splice(0, i).reverse().join('');
}

export enum NumberUnitMap {
  '万亿' = 12,
  '亿' = 8,
  '万' = 4,
  'B' = 9,
  'M' = 6,
  'K' = 3
}

// 解析地址栏参数
export function queryUrlParam(url: string, name: string) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  const r = url.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

/**
 * 解析url参数
 */
export function getUrlParam(history) {
  const url = history.location.search;
  if (url.indexOf('?') === -1) return {};
  const search = url.split('?')[1];
  if (!search) return {};
  const data = search.split('&');
  const params = {};

  data.forEach((item) => {
    const objMap = item.split('=');
    const name = objMap[0];
    const value = objMap[1];
    params[name] = value;
  });

  return params;
}

// 过滤特殊字符
export function filterInvalidLetters(s) {
  const pattern = new RegExp("[`+~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
  let str = '';
  for (let i = 0; i < s.length; i += 1) {
    str += s.substr(i, 1).replace(pattern, '');
  }
  return str.toLocaleLowerCase();
}

/**
 * 截取指定长度的字符串
 * @param string
 * @param lengthConfig 截取长度
 * @param zhLengthConfig 一个中文字符占的长度（默认一个英文字母占一个长度）
 * @returns
 */
export function cropString(string, lengthConfig, zhLengthConfig = 2) {
  let length = 0;
  const zhReg = /[\u4e00-\u9fa5]/;
  const zhNoteReg = /(。|，|：|；|、|（|）)/;
  const enReg = /[A-z]/;

  return string.replace(/./gi, (letter) => {
    const isZh = zhReg.test(letter) || zhNoteReg.test(letter);
    const isEn = enReg.test(letter);
    // if (!isZh && !isEn) {
    //   return letter;
    // }

    switch (true) {
      case isZh: {
        length += zhLengthConfig;
        break;
      }
      case isEn:
      default: {
        length += 1;
      }
    }

    if (length > lengthConfig) {
      return '';
    }

    return letter;
  });
}

export const getUrl = () => {
  const { protocol, host, pathname } = window.location;
  return `${protocol}//${host}${pathname}`;
};
