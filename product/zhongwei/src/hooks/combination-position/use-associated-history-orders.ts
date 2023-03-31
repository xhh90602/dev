import { useEffect, useState } from 'react';
import { useSafeState, useRequest } from 'ahooks';
import { getHistoryOrders } from '@/api/module-api/trade';

interface IProps {
  refNo?: string;
  stockCode?: string;
  tradeMarket?: string;
  portfolioId?: number;
}

interface IUseHistoryOrders {
  isLoading: boolean;
  historyOrderList: Record<string, any>[];
}

const { errorRetryCount = -1, updateFrequencyOrder = 0 } = window.GLOBAL_CONFIG?.COMBINATION_POSITION || {};

export default function useAssociatedHistoryOrders(props: IProps): IUseHistoryOrders {
  const { refNo, stockCode, tradeMarket, portfolioId } = props;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [historyOrderList, setHistoryOrderList] = useSafeState<Record<string, any>[]>([]);

  async function getList() {
    getHistoryOrders({
      refNo,
      stockCode,
      tradeMarket,
      portfolioId,
    })
      .then((res) => {
        if (res.code !== 0) return;

        setHistoryOrderList(res.result);
      })
      .catch((err) => {
        console.log('【请求持仓组合/历史订单列表错误】', err);
      })
      .finally(() => {
        if (isLoading) setIsLoading(false);
      });
  }

  const { runAsync, cancel } = useRequest(getList, {
    manual: true,
    pollingErrorRetryCount: errorRetryCount,
    pollingInterval: updateFrequencyOrder,
  });

  useEffect(() => {
    runAsync();

    return () => {
      cancel();
    };
  }, []);

  return {
    isLoading,
    historyOrderList,
  };
}
