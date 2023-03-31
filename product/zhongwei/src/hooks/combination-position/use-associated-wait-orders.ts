import { useEffect, useState } from 'react';
import { useSafeState, useRequest } from 'ahooks';
import { useSubscribeStockListQuote } from '@dz-web/quote-client-react';
import { QUOTE_CATEGORY_FIELD, querySnapshot } from '@dz-web/quote-client';
import { getWaitingOrders } from '@/api/module-api/trade';

interface IProps {
  refNo?: string;
  stockCode?: string;
  tradeMarket?: string;
  portfolioId?: number;
}

interface IUseWaitOrders {
  isLoading: boolean;
  waitOrderList: Record<string, any>[];
  getList: (...args: any[]) => any;
}

const { errorRetryCount = -1, updateFrequencyOrder = 0 } = window.GLOBAL_CONFIG?.COMBINATION_POSITION || {};

export default function useAssociatedWaitOrders(props: IProps): IUseWaitOrders {
  const { refNo, stockCode, tradeMarket, portfolioId } = props;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reqWaitOrderList, setReqWaitOrderList] = useSafeState<any>([]);

  const waitOrderList = useSubscribeStockListQuote(
    async (client: any) => {
      const symbols = reqWaitOrderList.map((item: Record<string, any>) => [item.smallMarket, item.stockCode]);

      const snapshotList = await querySnapshot(client, {
        symbols,
        fields: [QUOTE_CATEGORY_FIELD.INFO, QUOTE_CATEGORY_FIELD.QUOTE],
      });

      const stockVOList = reqWaitOrderList.map((item: Record<string, any>) => {
        const snapshotStock = snapshotList.find(
          (stock: Record<string, any>) => stock.marketId === item.smallMarket && stock.code === item.stockCode,
        );

        return {
          ...item,
          nowPrice: snapshotStock?.now,
          dec: snapshotStock?.dec,
        };
      });

      return stockVOList;
    },
    [reqWaitOrderList],
  );

  async function getList() {
    getWaitingOrders({
      refNo,
      stockCode,
      tradeMarket,
      portfolioId,
    })
      .then((res) => {
        if (res.code !== 0) return;

        setReqWaitOrderList(res.result);
      })
      .catch((err) => {
        console.log('【请求持仓组合/待成交订单列表错误】', err);
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
    waitOrderList,
    getList,
  };
}
