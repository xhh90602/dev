import Decimal from 'decimal.js/decimal';

import { isTrue } from '@dz-web/o-orange';
import { isNil } from 'lodash-es';

declare type StrNumber = string | number;

declare interface IDecimalNumber {
  a: StrNumber;
  b: StrNumber;
}

/**
 * 输入值转换为正常浮点数(用于input)
 * @param value 要转换的值
 * @param dec 小数位
 */
export const floatNumStr = (value: number | string, dec = 2) => {
  if (!value) return '';
  let val = String(value);
  const matchReg = new RegExp(`^\\d*(\\.?\\d{0,${dec}})`, 'g');
  [val] = val.replace(/^0+(\d)/, '$1').replace(/^\./, '0.').match(matchReg) || [''];
  return val;
};

export function getUnit(value: number, formatMessage): any {
  const absValue = Math.abs(value);
  if (absValue <= 9999) {
    return { unit: '', multi: 1 };
  }

  if (absValue <= 99999999) {
    return { unit: formatMessage({ id: 'tenThousand' }), multi: 10000 };
  }

  if (absValue <= 999999999999) {
    return { unit: formatMessage({ id: 'hundredMillion' }), multi: 100000000 };
  }

  // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
  if (absValue <= 9999999999999999) {
    return { unit: formatMessage({ id: 'trillion' }), multi: 1000000000000 };
  }

  return { unit: '' };
}

export function convertWithUnit(value: number, formatMessage, precision = 2): string {
  const { unit, multi } = getUnit(value, formatMessage);

  if (!isTrue(value)) return '--';

  return `${(value / multi).toFixed(precision)}${unit}`;
}

declare interface IDecimal extends IDecimalNumber {
  type: 'add' | 'sub' | 'mul' | 'div';
}
// 计算统一处理
function numberIsNaN(a: StrNumber, b: StrNumber) {
  const numberA = Number(a);
  const numberB = Number(b);
  if (Number.isNaN(numberA) || Number.isNaN(numberB)) return false;
  return {
    numberA,
    numberB,
  };
}

function decimal({ a, b, type }: IDecimal): number {
  const number = numberIsNaN(a, b);
  if (number === false) return 0;
  return new Decimal(number.numberA)[type](new Decimal(number.numberB)).toNumber();
}

/**
 * 加法
 */
export function add(a: StrNumber, b: StrNumber): number {
  return decimal({ a, b, type: 'add' });
}

/**
 * 减法
 */
export function sub(a: StrNumber, b: StrNumber): number {
  return decimal({ a, b, type: 'sub' });
}

/**
 * 乘法
 */
export function mul(a: StrNumber, b: StrNumber): number {
  return decimal({ a, b, type: 'mul' });
}

/**
 * 除法
 */
export function div(a: StrNumber, b: StrNumber): number {
  return decimal({ a, b, type: 'div' });
}

/**
 * 对象合并赋值函数
 * @param {*} obj 元对象
 * @param {*} newItem 插入值
 * @returns 更新新对象
 */
export function setObject(obj: any, newItem): void {
  obj = JSON.parse(JSON.stringify(Object.assign(obj, newItem)));
  return obj;
}

/**
 * 添加千分位
 * @returns str
 */
export function toThousands(str: StrNumber): string {
  return String(str).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 月份转换
 * @param date 时间
 * @returns 转换后的时间
 */
export function dateChange(date: StrNumber): StrNumber {
  if (String(date).length === 8) {
    return `${String(date).slice(0, 4)}/${String(date).slice(4, 6)}/${String(date).slice(6, 8)}`;
  }
  return date;
}

/**
 * 计算涨跌颜色
 */
export const numberClass = (number, rise = 'raise', full = 'decline') => {
  if (Number(number) === 0) return '';
  return number > 0 ? rise : full;
};

// 设置前缀
export const getName = (number) => {
  const name = numberClass(number);
  if (name === 'raise') return '+ ';
  if (name === 'decline') return '- ';
  return '';
};

// 设置前缀
export const getItemName = (number) => {
  const name = numberClass(number);
  if (name === 'raise') return '+ ';
  return '';
};

/**
 * 筛选股票
 * @param arr 查询到的股票数组
 * @param data 查询参数
 */
export const filterStock = (arr, data) => {
  if (!arr.length) return false;
  if (!data || !data.name) return arr[0];

  const fristItem = arr.find((item) => item.code === data.code && item.name === data.name);
  return fristItem || arr[0];
};

/**
 * 当前时间移动天数的日期
 * @param date 时间
 * @param day 往前天数,默认一天
 * @param formatter 初始化格式 年yyyy 月MM 日dd，默认yyyy-MM-dd
 */
export const getFirstDay = (date: string, day = 1, formatter = 'yyyy-MM-dd') => {
  const timeNumber = new Date(date).getTime() - day * 24 * 60 * 60 * 1000;
  const newTime = new Date(timeNumber);
  // eslint-disable-next-line prefer-const
  let str = formatter;
  const y = String(newTime.getFullYear());
  const m = String(newTime.getMonth() + 1).padStart(2, '0');
  const d = String(newTime.getDate()).padStart(2, '0');

  if ([y, m, d].includes('NaN')) return '';

  str = str.replace('yyyy', y);
  str = str.replace('MM', m);
  str = str.replace('dd', d);

  return str;
};

/**
 * 过滤开头0，非负数规则
 */
export const noZeroNoNegative = (number: StrNumber): number => {
  if (Number.isNaN(number) || Number(number) <= 0) return 0;
  return Number(number);
};

export const replaceSymbol = (original: string, rule = /[-]/g, target = '/'): string => original.replace(rule, target);

/**
 * 金额拼接
 * @param amount 金额
 * @param amountType  金额类型 HKD
 * @returns
 */
export const amountStitching = (amount: number | string, amountType: string) => {
  if (!amount || String(amount).indexOf('--') !== -1) {
    return '--';
  }

  return `${amount}${amountType}`;
};

/**
 * 千分位替换函数 --- 默认保留两位小数
 * @param str 传入数值
 */
export function thousandsChange(str: StrNumber, fixed = 2): string {
  // 先还原
  const valOld: any = String(str).replace(/[^\w.-]+/g, '');
  // 先要过滤数字
  let handleNum = valOld.match(/[\d.]/g) ? valOld.match(/[\d.]/g).join('') : '';
  if (!handleNum) return '--';
  handleNum = Number(str).toFixed(fixed + 1);
  // 过滤多个.
  const fise = handleNum.match(/^\d*(\.?\d{0,2})/g)[0];

  // 千分位
  const newVal = fise.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const strEnd = ''.padEnd(fixed, '0');

  if (newVal.length === 0) return '--';
  if (newVal.length === 1 || newVal.split('.').length === 1) return `${newVal}.${strEnd}`;
  return newVal;
}

/**
 * 截取两位保留，千分位添加
 * @param str 数字字符串
 * @param option
 * @example
 * 默认参数 option.defaultTemplate = '--'
 *  sliceString('', {
 *    defaultTemplate: '0.00'
 *  }) => '0.00'
 *
 * 默认参数 option.sign = false
 *  sliceString('1', {
 *    sign: true
 *  }) => +1
 *
 * 默认参数 option.fixed = 2
 *  sliceString('1', {
 *    fixed: 3
 *  }) => 1.000
 */
export const sliceString = (
  str?: string | number,
  option = {} as { defaultTemplate?: string; sign?: boolean; fixed?: number; showtempVal?: number | string },
): string => {
  const { defaultTemplate = '--', sign = false, fixed = 2, showtempVal = '' } = option;
  if (isNil(str) || str === '' || str === showtempVal || str === defaultTemplate) {
    return defaultTemplate;
  }
  let string = defaultTemplate;
  if (typeof str === 'number') str = str.toString();
  if (str.indexOf('-') > -1) {
    string = `-${thousandsChange(Number(str.slice(1)), fixed)}`;
  } else {
    string = thousandsChange(Number(str), fixed);
    if (sign && Number(str) > 0) {
      string = `+${string}`;
    }
  }

  return string;
};

/**
 * 取小数位 小数位后 补0
 */
export function toFixed(n, num = 2, placeHolder = '--') {
  if (typeof n === 'string') return n;
  if (typeof n === 'number') {
    return new Decimal(n).toFixed(num);
  }
  return placeHolder;
}

/**
 * 怪异字符串转数字
 * @example
 * strToNumber('dddf2223sdss.1234-') ---> 2223.1234
 * strToNumber('ddss.1234') ---> 0.1234
 * strToNumber('dd-ss.1234') ---> -0.1234
 * strToNumber('dddf') ---> 0
 */
export const strToNumber = (s: string, defaultPlaceHold = '0'): number => {
  const s1 = String(s).split('.')[0];
  const s2 = String(s).split('.')[1];

  let sign = '';

  if (s1.indexOf('-') > -1) {
    sign = '-';
  }

  const str1 = s1.replace(/[^\d]/g, '') ? sign + s1.replace(/[^\d]/g, '') : defaultPlaceHold;

  let str2 = '.';

  if (s2) {
    str2 += s2.replace(/[^\d]/g, '') ? s2.replace(/[^\d]/g, '') : defaultPlaceHold;

    return Number(str1 + str2);
  }

  return Number(str1);
};

/**
 * 添加正数符号（+）
 * @param numericalValue
 * @param symbol
 * @returns
 */
export function setPositiveSign(numericalValue: string | number, symbol = '%') {
  let currentVal = numericalValue;

  if (typeof numericalValue === 'string') {
    currentVal = +numericalValue.replace(symbol, '');
  }

  if (currentVal > 0) {
    return `+${numericalValue}`;
  }

  return numericalValue;
}
