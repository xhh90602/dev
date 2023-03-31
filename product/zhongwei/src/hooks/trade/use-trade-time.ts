import { tradeTimeQuantum } from '@/api/module-api/trade';
import { sessionStorageGetItem, sessionStorageSetItem } from '@/platforms/mobile/helpers/native/msg';
import { useUpdateEffect } from 'ahooks';
import { useEffect, useState } from 'react';

const useTradeTime = (tradeMarket) => {
  const [tradeTime, setTradeTime] = useState<{
    holidayBos?: {tradeDate: string; tradeMarket: string}[];
    tradeDate?: string;
    tradeNextDate?: string;
    tradeOrNot: boolean; // 当前是否交易时间
    tradeOrNotNextDate?: string;
  }>({
    tradeOrNot: true,
  });

  const fetchTradeTime = async () => {
    const { code, result } = await tradeTimeQuantum({ tradeMarket });
    console.log('🚀 ~ file: use-user-card.ts:9 ~ fetchTradeTime ~ result', result);
    if (code === 0) {
      setTradeTime(result);
    }
  };

  useEffect(() => {
    fetchTradeTime();
  }, [tradeMarket]);

  /* 是否关闭交易下单页非交易时间段提示， 初始化关闭 */
  const [closeOrderTradeHint, setCloseOrderTradeHint] = useState(true);

  sessionStorageGetItem('closeTradeTimeHint').then((res) => {
    setCloseOrderTradeHint(!!res);
  });

  useUpdateEffect(() => {
    if (closeOrderTradeHint) {
      sessionStorageSetItem({ key: 'closeTradeTimeHint', value: true });
    }
  }, [closeOrderTradeHint]);

  return {
    tradeTime,
    closeOrderTradeHint,
  };
};

export default useTradeTime;
