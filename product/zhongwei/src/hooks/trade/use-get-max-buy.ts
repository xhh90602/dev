import { getMaxBuy, getPosition } from '@/api/module-api/trade';
import { returnJavaMarket } from '@/utils';
import { useEffect, useState } from 'react';

interface IMaxBuy {
  price: StrNumber;
  qty: StrNumber;
  isBuy: boolean;
  code: string;
  market: number;
}

interface IReturn {
  countMax: number;
  financeMax: number;
  cashMax: number;
  sellMax: number;
  costPrice: number;
}

let time;
/**
 * 获取最大可买量
 * @param price 下单价格
 * @param qty 下单数量
 * @param isBuy 是否为买入
 * @param code 股票代码
 * @param market 股票市场
 * @return {
 *   countMax: 最大数量
 *
 *   financeMax: 融资可买
 *
 *   cashMax: 现金可买
 *
 *   sellMax: 最大可卖
 *
 *   costPrice: 成本价
 *
 * }
 */
const useGetMaxBuy = ({ price, qty, isBuy, code, market }: IMaxBuy): IReturn => {
  const [countMax, setCountMax] = useState(0);
  const [cashMax, setCashMax] = useState(0);
  const [financeMax, setFinanceMax] = useState(0);
  const [sellMax, setSellMax] = useState(0);
  const [costPrice, setCostPrice] = useState(0);

  /** 获取个股持仓卖出 | 成本 */
  useEffect(() => {
    if (!isBuy) {
      getPosition({
        tradeMarket: [returnJavaMarket(market)],
        stockCode: code,
      }).then((res) => {
        if (res.code === 0) {
          const positionStock = res.result[0] || {};
          setCostPrice(positionStock?.costPrice || 0);
          setSellMax(positionStock?.enableQty || 0);
          setCountMax(positionStock?.enableQty || 0);
        }
      });
    }
  }, [isBuy, code, market]);

  useEffect(() => {
    clearTimeout(time);

    if (isBuy && code && market && price && price > 0) {
      /** 获取融资可买，现金可买，最大可买 */
      time = setTimeout(() => {
        getMaxBuy({
          stockCode: code,
          price,
          tradeMarket: returnJavaMarket(market),
        }).then((res) => {
          if (res.code === 0) {
            const { cashAmount = 0, marginAmount = 0, enableAmount = 0 } = res?.result ?? {};
            setCashMax(cashAmount);
            setFinanceMax(marginAmount);
            setCountMax(enableAmount);
          }
        });
      }, 500);
    }

    return () => {
      clearTimeout(time);
    };
  }, [isBuy, price, qty, code, market]);

  return {
    countMax,
    financeMax,
    cashMax,
    sellMax,
    costPrice,
  };
};

export default useGetMaxBuy;
