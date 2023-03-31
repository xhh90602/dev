import { useMemo } from 'react';
import { toFixed, toUnit } from '@dz-web/o-orange';
import { getClassNameByPriceChange, isHKSymbol } from '@dz-web/quote-client';
import type { CommodityQuote } from '@dz-web/quote-client';

export interface IStr { price: string, vol: any, count: any, className: string; level: number }

/**
 * 值为字符串类型，逗号分隔每 3 个元素（委托价格，委托 数量，委托笔数）表示一个档位信息
 */
export function strHandler(str: string, dec: number, prevClose: number, defaultText: string): IStr[] {
  if (!str) return [];
  const arr = str.split(',');
  if (arr[arr.length - 1] === '') arr.pop(); // 删除最后一个多余的元素
  if (arr.length % 3 !== 0) {
    console.error('处理的买卖盘数据不为3的倍数');
    return [];
  }

  return arr.reduce((prev: IStr[], curr, idx) => {
    if (idx % 3 === 0) {
      const level = Math.ceil(idx / 3) + 1;
      const vol = arr[idx + 1];
      const count = arr[idx + 2];

      prev.push({
        level,
        price: toFixed(curr, { precision: dec }),
        vol: vol === 'null' ? defaultText : toUnit(+vol, { precision: 2 }),
        count: count === 'null' ? defaultText : count,
        className: getClassNameByPriceChange(+curr - prevClose),
      });
    }

    return prev;
  }, []);
}

export default function useBidAsk(info: Pick<CommodityQuote, 'bidGrp' | 'askGrp' | 'dec' | 'prevClose' | 'marketId'>) {
  const { bidGrp, askGrp, dec, prevClose, marketId } = info;

  const defaultText = useMemo(() => (isHKSymbol(marketId) ? '0' : ''), [marketId]);
  const bidPriceList = useMemo(
    () => strHandler(bidGrp, dec, prevClose, defaultText),
    [bidGrp, dec, prevClose, defaultText],
  );
  const askPriceList = useMemo(
    () => strHandler(askGrp, dec, prevClose, defaultText),
    [askGrp, dec, prevClose, defaultText],
  );

  return { bidPriceList, askPriceList, defaultText };
}
