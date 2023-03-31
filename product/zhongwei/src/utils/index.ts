import Decimal from 'decimal.js';
import { get, isArray, isEqual } from 'lodash-es';
import { thousandsChange } from './num';

export * from './market';
export * from './num';
export * from './trade';

// eslint-disable-next-line no-shadow
export enum LangType {
  CN = 'zh',
  HK = 'hk',
  EN = 'en',
}

export function humanNumberCore(map: any, n: number, p = 2, fixed = true) {
  const d = new Decimal(n);
  const numLength = d.toDP(0).sd(true);
  const keys = Object.keys(map)
    .map((i) => parseFloat(i))
    .sort((a, b) => b - a);
  const idx = keys.findIndex((key) => numLength - 1 >= key);
  const div = idx >= 0 ? keys[idx] : 0;
  const rs: Decimal = d.dividedBy(10 ** div);
  const final = fixed ? rs.toFixed(p, Decimal.ROUND_FLOOR) : rs.toDecimalPlaces(p, Decimal.ROUND_FLOOR);
  const unit = map[keys[idx]] || '';
  return `${final}${unit}`;
}

/**
 * 字符串转 LangType
 * @param s  'zh'  'zh-CN'  'zh-HK'
 */
export function str2LangType(s: string): LangType {
  if (!s) return LangType.CN;
  s = s.toLowerCase();
  if (s.includes('hk')) return LangType.HK;
  if (s.includes('en')) return LangType.EN;
  return LangType.CN;
}

export const showContent = (val: any) => {
  if (val === undefined || val === null || val === '') {
    return '--';
  }
  return val.toString();
};

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
  langType = null as string | LangType | null,
  fixed = true,
  placeHolder = '--',
) {
  if (typeof number === 'string') return number;
  if (Number.isNaN(number) || number === null || number === undefined) return placeHolder;
  let lang;
  if (langType === null || langType === undefined) {
    lang = 1;
  } else if (typeof langType === 'string') {
    lang = str2LangType(langType);
  } else {
    lang = langType;
  }
  const map = lang === LangType.CN ? { 12: '万亿', 8: '亿', 4: '万' } : { 9: 'B', 6: 'M', 3: 'K' };
  return humanNumberCore(map, number, p, fixed);
}

export const getText = (item) => {
  let str = '--';
  if (String(item).indexOf('-') > -1) {
    str = `-${thousandsChange(Number(String(item).slice(1)), 2)}`;
  } else {
    str = thousandsChange(Number(item), 2);
  }

  return str;
};

/**
 * 解析url参数
 */
export function getUrlParam(defaultObj = {} as Record<string, any>): Record<string, any> {
  const url = window.location.href;
  if (url.lastIndexOf('?') === -1) return defaultObj;
  const search = url.slice(url.lastIndexOf('?') + 1);

  if (!search) return defaultObj;

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

/**
 * 节流函数
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function throttle(fn: Function, delay = 500) {
  let timer: any = null;
  return (...args: any[]) => {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, delay);
    }
  };
}

/**
 * rem转px
 * @param rem number
 * @param isUnit 是否返回单位
 * @returns number | string
 */
export function remToPx(rem: number): number;
export function remToPx(rem: number, isUnit: true): string;
export function remToPx(rem: number, isUnit = false) {
  const rootPx = Number.parseFloat(document.documentElement.style.fontSize);
  const size = rem * rootPx;
  return isUnit ? `${size}px` : size;
}

/**
 * 查找对象数组的对象属性值（条件判断为 全等 ===）
 * @param arr 对象数组
 * @param key 对象属性，用作查找, 多个属性用英文逗号（,）分隔
 * @param value 对象属性值，用作查找条件，多个值用数组传递
 * @param returnKey 返回的属性
 * @param defaultVal 返回的属性默认值
 * @returns any
 */
export function getObjArrAttribute(
  arr: Record<string, any>[],
  key: string,
  value: any,
  returnKey: string,
  defaultVal?: any,
) {
  const obj = arr.find((item) => {
    const oldValue = key.split(',').map((k) => item[k]);
    return isEqual(oldValue, isArray(key) ? value : [value]);
  });
  return get(obj, returnKey, defaultVal || value);
}
