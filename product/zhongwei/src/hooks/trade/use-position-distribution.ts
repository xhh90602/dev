import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSetState } from 'ahooks';
import { subtract, divide } from 'lodash-es';
import { useQuoteClient } from '@dz-web/quote-client-react';
import { QUOTE_CATEGORY_FIELD, querySnapshot } from '@dz-web/quote-client';
import { getUrlParam } from '@/utils';
import { getPositionData } from '@/api/module-api/trade';
import { getPortfolioStock } from '@/api/module-api/combination-position';
import { toFixed, toSlice } from '@dz-web/o-orange';

interface IUseRevocationOrders {
  isLoading: boolean;
  positionData: Record<string, any>;
}

export default function usePositionDistribution(): IUseRevocationOrders {
  const { tradeMarket, stockCode } = getUrlParam();
  const { formatMessage } = useIntl();
  const { wsClient } = useQuoteClient();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [positionData, setPositionData] = useSetState<Record<string, any>>({
    position: {},
    chartList: [],
    distributionList: [],
  });

  useEffect(() => {
    if (!wsClient) return;

    const fetch = async () => {
      try {
        const { result: positionResult = [] } = await getPositionData({
          tradeMarket,
          stockCode,
        });

        const { result: portfolioResult = [] } = await getPortfolioStock({
          tradeMarket,
          stockCode,
        });

        const positionStock = positionResult[0];
        // 从行情快照获取现价
        const snapshotResultList = await querySnapshot(wsClient, {
          fields: [QUOTE_CATEGORY_FIELD.QUOTE],
          symbols: [[positionStock.smallMarket, stockCode]],
        });

        const nowPrice = snapshotResultList[0]?.now;
        const portfolioTotal = {
          totalQty: 0,
          totalRatio: 0,
          totalUsableQty: 0,
        };

        const list = portfolioResult.map((item: Record<string, any>) => {
          const { qty, positionQty, portfolioName } = item;
          const currentRatio = +toFixed(divide(positionQty, positionStock.currentQty) * 100);

          portfolioTotal.totalQty += positionQty;
          portfolioTotal.totalRatio += currentRatio;
          portfolioTotal.totalUsableQty += qty;

          return {
            qty: positionQty,
            ratio: currentRatio,
            usableQty: qty,
            marketValue: toSlice(nowPrice * positionQty, { precision: 2 }),
            sourceName: portfolioName,
          };
        });

        const stockQty = subtract(positionStock.currentQty, portfolioTotal.totalQty);
        const stockUsableQty = subtract(positionStock.enableQty, portfolioTotal.totalUsableQty);
        const stockRatio = +toFixed(divide(stockQty, positionStock.currentQty) * 100);

        list.unshift({
          qty: stockQty,
          ratio: stockRatio,
          usableQty: stockUsableQty,
          marketValue: toSlice(nowPrice * stockQty, { precision: 2 }),
          sourceName: formatMessage({ id: 'individual_share' }),
        });

        const ringChartList = list.map((item: Record<string, any>) => ({
          value: item.ratio,
          name: item.sourceName,
        }));

        setPositionData({
          position: positionStock,
          chartList: ringChartList,
          distributionList: list,
        });
      } catch (error) {
        console.log('【持仓分布数据请求错误】', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, [wsClient]);

  return {
    isLoading,
    positionData,
  };
}
