import { useIntl } from 'react-intl';
import { getProfitLossInfo } from '@/api/module-api/trade';
import { JavaMarket } from '@/utils';
import { useEffect, useState } from 'react';
import { useTradeStore } from '@/platforms/mobile/model/trade-store';

const useProfitLoss = ({ isPoll }) => {
  const { formatMessage } = useIntl();
  const dataList = [
    {
      icon: 'icon_hk',
      text: formatMessage({ id: 'hk_stock' }) + formatMessage({ id: 'market_value' }),
      tradeMarket: JavaMarket.HKEX,
      requestMarket: JavaMarket.HKEX,
      currency: 'HKD',
      todayOtherPL: 0,
      todayOtherRat: 0,
      todayPL: 0, // 今日盈亏
      todayPLRat: '0%', // 今日盈亏比
      totalMarketValue: 0, // 总市值
      totalPL: 0, // 总盈亏
      totalPLRat: '0%', // 总盈亏比
    },
    // {
    //   icon: 'icon_us',
    //   text: '美元',
    //   currency: 'USD',
    // },
    {
      icon: 'icon_a',
      text: formatMessage({ id: 'sh_sz_hk' }) + formatMessage({ id: 'market_value' }),
      tradeMarket: JavaMarket.A,
      requestMarket: JavaMarket.MK,
      currency: 'CNY',
      todayOtherPL: 0,
      todayOtherRat: 0,
      todayPL: 0, // 今日盈亏
      todayPLRat: '0%', // 今日盈亏比
      totalMarketValue: 0, // 总市值
      totalPL: 0, // 总盈亏
      totalPLRat: '0%', // 总盈亏比
    },
  ];
  const { isMainlandIdentityCard, tradeAccountUpdate } = useTradeStore();

  const [currencyDataList, setCurrencyDataList] = useState<any[]>(
    dataList.filter((item) => (item.tradeMarket === JavaMarket.A ? !isMainlandIdentityCard : true)),
  );

  const fetchProfitLoss = async () => {
    const promiseList: Promise<any>[] = [];
    const list = dataList.filter((item) => {
      if (item.tradeMarket === JavaMarket.A) {
        return !isMainlandIdentityCard;
      }
      return true;
    });

    list.forEach((item) => {
      promiseList.push(getProfitLossInfo({ tradeMarket: item.requestMarket }));
    });

    const ress = await Promise.all(promiseList);
    ress.forEach((res, i) => {
      const { code, result } = res;
      if (code === 0) {
        list[i] = { ...list[i], ...result };
      }
    });
    setCurrencyDataList(list);
  };

  let timeOut;
  useEffect(() => {
    fetchProfitLoss();
    if (isPoll && !timeOut) {
      timeOut = setInterval(() => {
        fetchProfitLoss();
      }, window.GLOBAL_CONFIG.TRADE_CONFIG.tableUpdateTime);
    }

    return () => {
      clearInterval(timeOut);
    };
  }, [isPoll, isMainlandIdentityCard, tradeAccountUpdate]);

  return {
    currencyDataList,
  };
};

export default useProfitLoss;
