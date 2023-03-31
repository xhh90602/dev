import { sub, add, mul, div } from '@/utils';
import { toFixed } from '@dz-web/o-orange';

export enum JavaMarket {
  USA = 'USA',
  HKEX = 'HKEX',
  SZMK = 'SZMK',
  SHMK = 'SHMK',
  A = 'SHMK-SZMK',
  MK = 'MK',
}

export enum MarketCurrency {
  USA = 'USD',
  HKEX = 'HKD',
  SZMK = 'CNY',
  SHMK = 'CNY',
  A = 'CNY',
  MK = 'CNY',
}

/**
 * 交易配置
 */
export const TradeConfig: Record<string, Record<number, number | number[]>> = Object.freeze({
  /**
   * 港股价差表
   */
  [JavaMarket.HKEX]: {
    0.001: [0, 0.25],
    0.005: [0.25, 0.5],
    0.01: [0.5, 10],
    0.02: [10, 20],
    0.05: [20, 100],
    0.1: [100, 200],
    0.2: [200, 500],
    0.5: [500, 1000],
    1: [1000, 2000],
    2: [2000, 5000],
    5: [5000, Infinity],
  },
  /**
   * 美股价差表
   */
  [JavaMarket.USA]: {
    0.0001: [0, 1],
    0.01: [1, Infinity],
  },
  /**
   * A股价差表
   */
  [JavaMarket.A]: {
    0.01: [0, Infinity],
  },
  [JavaMarket.SHMK]: {
    0.01: [0, Infinity],
  },
  [JavaMarket.SZMK]: {
    0.01: [0, Infinity],
  },
});

/**
 * 获取股票小数位
 */
export const getStockDec = (market: string, price?: string | number): number => {
  /** A股 */
  if (JavaMarket.A.indexOf(market) > -1) return 2;

  /** 美股 */
  if (market === JavaMarket.USA) {
    if (Number(price) >= 1) {
      return 2;
    }

    return 4;
  }

  /** 默认 | 港股 */
  return 3;
};

interface IInitData {
  now?: number;
  dec?: number;
  market?: string;
  lotSize?: number;
  [s: string]: any;
}

/**
 * 初始化价格计算
 * @param data 行情股票信息
 * @param setPrice 价格变动函数
 * @param dispatch 缓存价格变动值
 */
export function initCountPrice(
  tradeMarket: keyof typeof JavaMarket,
  data: IInitData,
  setPrice?: any,
  dispatch?: any,
): number[] {
  if (!data) return [0.01];
  const priceMap = data.now || data.safeNow || 0;
  // 价格取整
  const spreadList = TradeConfig[tradeMarket];

  const priceList = Object.keys(spreadList).map((v: string) => Number(v));

  const sortList = priceList.sort();

  const changeArr: number[] = [];

  if (dispatch) dispatch(data.lotSize);
  for (let i = 0; i < priceList.length; i += 1) {
    const priceItem = spreadList[sortList[i]];
    if (priceItem[1] >= priceMap && priceItem[0] <= priceMap) {
      // 缓存价格变动数值
      changeArr.push(sortList[i]);
    }
  }

  if (!setPrice) return changeArr;

  const price = mul(Math.ceil(div(priceMap, changeArr[0])), changeArr[0]);

  // 获取股票初始化价格
  return setPrice(
    toFixed(price, {
      precision: getStockDec(tradeMarket, price),
    }),
  );
}

export const enum countType {
  PLUS = 'plus',
  MINUS = 'minus',
}
interface ICountPrice {
  type: countType;
  price: StrNumber;
  setPrice: any;
  market: string;
  changePrice: number[];
}

/**
 * 股票数校准
 * @param changeNumber
 * @param number
 * @returns
 */
export function fixNumber(changeNumber: number, number: number, type = countType.MINUS as countType): number {
  return Number(mul(Math[type === countType.PLUS ? 'floor' : 'ceil'](div(number, changeNumber)), changeNumber));
}

/**
 * 价格计算
 * @param type 加减类型
 * @param price 价格值
 * @param serPrice 更新价格
 * @param changePrice 变动数值
 * @param market java标准market
 * @param cd 回调函数
 */
export function countPrice({ type, price, changePrice, setPrice, market }: ICountPrice): void {
  if (!setPrice) return;

  const changePriceNum = type === countType.PLUS ? changePrice[1] || changePrice[0] : changePrice[0];

  const priceNum = changePriceNum ? fixNumber(changePriceNum, Number(price), type) : price;

  const dataMap = type === countType.PLUS ? add(priceNum, changePriceNum) : sub(priceNum, changePriceNum);

  const dec = getStockDec(market, dataMap);
  if (Number(dataMap) < 0) {
    setPrice(Number(0).toFixed(dec));
    return;
  }

  setPrice(Number(dataMap).toFixed(dec));
}

/**
 * 计算股数
 * @param type
 * @param number
 * @param setNumber
 * @param changeNumber
 * @param countMax
 * @returns
 */
export function countNumber(obj: {
  type: countType;
  number: StrNumber;
  setNumber: any;
  changeNumber: number;
  countMax?: number;
}): void {
  const { type, number, setNumber, changeNumber, countMax } = obj;
  console.log(obj);

  const dataMap = type === countType.PLUS ? add(number, changeNumber) : sub(number, changeNumber);
  console.log(obj, dataMap, '----> 1');

  if (dataMap <= 0) {
    setNumber('');
    return;
  }

  if (countMax !== undefined && dataMap > countMax) {
    setNumber(countMax);
    return;
  }
  console.log(obj, '----> 2');

  const num = changeNumber ? fixNumber(changeNumber, dataMap, type) : number;
  console.log(obj, num, '----> 3');

  setNumber(num.toString());
}
