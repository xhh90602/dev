import { getUserQuo } from '@/api/module-api/trade';
import { humanNumber, returnJavaMarket } from '@/utils';
import { toFixed } from '@dz-web/o-orange';
import React, { useDebugValue } from 'react';

type StrNum = number | string;

export type stockHandicapList = {
  index: number;
  price: StrNum;
  qty: StrNum;
  priceText: string;
};

export interface IUseHandicapProps {
  riseList: stockHandicapList[];
  fallList: stockHandicapList[];
  code: string;
  changePrice: (v: string) => void;
}

function NumberIsNaN(number) {
  return !number || Number.isNaN(Number(number)) ? '--' : number;
}

/**
 * 值为字符串类型，逗号分隔每 3 个元素（委托价格，委托 数量，委托笔数）表示一个档位信息
 */
function strHandler(str: string) {
  if (!str) return null;
  const arr = str.split(',');
  if (arr[arr.length - 1] === '') arr.pop(); // 删除最后一个多余的元素
  if (arr.length % 3 !== 0) {
    console.error('处理的买卖盘数据不为3的倍数');
    return null;
  }
  return arr.reduce((prev: any, curr, idx) => {
    if (idx % 3 === 0) {
      prev.push({ price: Number(curr), number: Number(arr[idx + 1]), count: arr[idx + 2] });
    }
    return prev;
  }, []);
}

const { useEffect, useState } = React;

const defaultList: stockHandicapList[] = [
  { qty: '--', index: 1, price: '--', priceText: '--' },
  { qty: '--', index: 2, price: '--', priceText: '--' },
  { qty: '--', index: 3, price: '--', priceText: '--' },
  { qty: '--', index: 4, price: '--', priceText: '--' },
  { qty: '--', index: 5, price: '--', priceText: '--' },
];

const marketList = {
  1: {
    key: ['HKEX'],
    block: {
      default: 5,
      level0: 1,
      level1: 1,
      level2: 10,
      bmp: 0,
    },
  },
  2: {
    key: ['SZMK', 'SHMK'],
    block: {
      default: 5,
      level1: 5,
      level2: 5,
    },
  },
  3: {
    key: ['USA'],
    block: {
      default: 5,
      level0: 0,
      level1: 1,
      level2: 40,
      bmp: 40,
    },
  },
};

const useHandicap = (state, stockInfo, setState): IUseHandicapProps => {
  const { market, code } = state;

  const [riseList, setRiseList] = useState(JSON.parse(JSON.stringify(defaultList)));
  // const [riseList, setRiseList] = useState(JSON.parse(JSON.stringify(defaultList)).reverse());
  const [fallList, setFallList] = useState(JSON.parse(JSON.stringify(defaultList)));

  function reloadList() {
    // setRiseList(JSON.parse(JSON.stringify(defaultList)).reverse());
    setRiseList(JSON.parse(JSON.stringify(defaultList)));
    setFallList(JSON.parse(JSON.stringify(defaultList)));
  }

  useDebugValue(fallList, (v) => ({ value: v, name: 'fallList' }));

  function settingList(len = 5) {
    if (!stockInfo.askGrp || !stockInfo.bidGrp) {
      reloadList();
      return;
    }

    const { dec } = stockInfo;

    // 卖
    // const riseListCopy = strHandler(stockInfo.askGrp)
    const riseListCopy = strHandler(stockInfo.bidGrp)
      .splice(0, len)
      .map((item, i) => ({
        index: i + 1,
        price: toFixed(item.price, dec),
        priceText:
          NumberIsNaN(
            toFixed(item.price, {
              placeholder: '--',
              precision: dec,
            }),
          ) || '--',
        qty: humanNumber(item.number, 1, null, true, '--') || '--',
      }));
    // .reverse();

    // 买
    // const fallListCopy = strHandler(stockInfo.bidGrp)
    const fallListCopy = strHandler(stockInfo.askGrp)
      .splice(0, len)
      // .reverse()
      .map((item, i) => ({
        index: i + 1,
        price: toFixed(item.price, dec),
        priceText:
          NumberIsNaN(
            toFixed(item.price, {
              placeholder: '--',
              precision: dec,
            }),
          ) || '--',
        qty: humanNumber(item.number, 1, null, true, '--') || '--',
      }));

    setRiseList(riseListCopy);

    setFallList(fallListCopy);
  }

  const [quoteUser, setQuoteUser] = useState<any>([]);

  useEffect(() => {
    getUserQuo()
      .then((res) => {
        if (!res.result) return;

        const { products } = res.result;
        setQuoteUser(products);
      })
      .catch((err) => {
        console.log(`获取行情权限失败: ${err}`, '<-- ');
      });
  }, [state.code]);

  function changePrice(v: string) {
    setState({ price: v });
  }

  useEffect(() => {
    if (!market || quoteUser.length === 0) {
      reloadList();
      return;
    }

    const javaMarket = returnJavaMarket(market);
    let currentQuoteRule;
    const tradeMarketList = Object.keys(marketList).find((v) => {
      if (marketList[v].key.includes(javaMarket)) {
        currentQuoteRule = quoteUser.find((q) => q.marketType === Number(v));
        return true;
      }
      return false;
    });

    /** 一个市场只会存在一个 */
    if (!tradeMarketList) {
      reloadList();
      return;
    }

    const len = marketList[tradeMarketList].block[currentQuoteRule.code] || 0;
    settingList(len);
  }, [market, stockInfo, quoteUser]);

  return {
    riseList,
    fallList,
    code,
    changePrice,
  };
};

export default useHandicap;
