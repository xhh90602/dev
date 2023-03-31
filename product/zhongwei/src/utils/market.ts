import { isUSSymbol, isSSESymbol, isSZSESymbol, isHKSymbol } from '@dz-web/quote-client';
import { JavaMarket, MarketCurrency } from './trade';

/**
 * 返回java市场代码
 * @param market smallMarket
 * @returns {keyof JavaMarket}
 */
export const returnJavaMarket = (market: number) => {
  if (isUSSymbol(market)) return JavaMarket.USA;
  if (isSSESymbol(market)) return JavaMarket.SHMK;
  if (isSZSESymbol(market)) return JavaMarket.SZMK;
  return JavaMarket.HKEX;
};

/**
 * 返回对应币种
 * @param market smallMarket
 * @returns {keyof JavaMarket}
 */
export const returnCurrency = (market: number, placeholder = MarketCurrency.HKEX as string): string => {
  if (isHKSymbol(market)) return MarketCurrency.HKEX;
  if (isUSSymbol(market)) return MarketCurrency.USA;
  if (isSSESymbol(market)) return MarketCurrency.SHMK;
  if (isSZSESymbol(market)) return MarketCurrency.SZMK;
  return placeholder;
};

const MarketCodeMap = {
  K: 2002,
  t: 1,
  v: 1001,
  P: 40000,
};

/**
 * 市场代码 -> 交易编码
 * @param tradeCode
 */
export function tradeCodeToMarket(tradeCode): number {
  if (tradeCode in MarketCodeMap) {
    return MarketCodeMap[tradeCode];
  }
  throw new Error(`无法找到对应的交易编码( ${tradeCode} )和市场代码的映射！`);
}

/**
 * 交易编码 -> 市场代码
 * @param marketCode
 */
export function marketToTradeCode(marketCode): string {
  // eslint-disable-next-line no-restricted-syntax
  for (const i in MarketCodeMap) {
    if (MarketCodeMap[i].includes(marketCode)) {
      return i;
    }
  }
  throw new Error(`无法找到对应的交易编码和市场代码( ${marketCode} )的映射！`);
}

/**
 * 是否是夜盘交易时间
 *
 */
export function isNightMarketTime(offset: number) {
  return offset < -480;
}
