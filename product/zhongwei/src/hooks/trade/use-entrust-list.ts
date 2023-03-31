import { getWaitingOrders, getHistoryOrders } from '@/api/module-api/trade';
import { TradeSearchTableType } from '@mobile/constants/trade';
import { useSubscribeStockListQuote } from '@dz-web/quote-client-react';
import { QUOTE_CATEGORY_FIELD, querySnapshot } from '@dz-web/quote-client';
import { useDeepCompareEffect, useGetState, useUpdateEffect } from 'ahooks';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
// import { RootState } from '@mobile/model/store';
import { setStore } from '@mobile/model/trade';
import { assign } from 'lodash-es';
import { useTradeStore } from '@/platforms/mobile/model/trade-store';

let timeOut;

interface IUseEntrust {
  queryType: 'today' | 'history';
  market: number;
  search: any;
  date: { startDate: Date, endDate: Date };
  update: number;
  historyReqBody?: {
    bs?: 'B' | 'S';
    status?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
  }
}

/* const dataTemplate = [
  {
    activationDate: '2022-07-26',
    averagePrice: 0,
    bigMarket: 2,
    bs: 'B',
    currency: 'HKD',
    filledQty: 0,
    isActive: '1',
    isCancel: '1',
    isModify: '1',
    orderDescription: '增强限价盘',
    orderNo: '20120673_1145044',
    orderPrice: 52.3,
    orderTime: '2022-07-28 17:07:35',
    orderType: 'ELO',
    qty: 500,
    smallMarket: 2002,
    status: 1,
    statusDescription: '待报',
    stockCode: '00001',
    stockName: '长和',
    tradeMarket: 'HKEX',
    ttlDescription: '准备发送',
    ttlStatus: 'PSB',
  },
  {
    activationDate: '2022-07-26',
    averagePrice: 0,
    bigMarket: 2,
    bs: 'B',
    currency: 'HKD',
    filledQty: 0,
    isActive: '1',
    isCancel: '1',
    isModify: '1',
    orderDescription: '增强限价盘',
    orderNo: '20120671_1145042',
    orderPrice: 150,
    orderTime: '2022-07-28 16:57:01',
    orderType: 'ELO',
    qty: 1000,
    smallMarket: 2002,
    status: 1,
    statusDescription: '待报',
    stockCode: '00001',
    stockName: '长和',
    tradeMarket: 'HKEX',
    ttlDescription: '准备发送',
    ttlStatus: 'PSB',
  },
  {
    activationDate: '2022-07-26',
    averagePrice: 0,
    bigMarket: 2,
    bs: 'B',
    currency: 'HKD',
    filledQty: 0,
    isActive: '1',
    isCancel: '1',
    isModify: '1',
    orderDescription: '增强限价盘',
    orderNo: '20120670_1145041',
    orderPrice: 150,
    orderTime: '2022-07-28 16:56:23',
    orderType: 'ELO',
    qty: 1000,
    smallMarket: 2002,
    status: 1,
    statusDescription: '待报',
    stockCode: '00001',
    stockName: '长和',
    tradeMarket: 'HKEX',
    ttlDescription: '准备发送',
    ttlStatus: 'PSB',
  },
]; */

const useEntrustList = ({ queryType, market, search, date, update, historyReqBody }: Partial<IUseEntrust>) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading, getLoading] = useGetState(false);
  const dispatch = useDispatch();
  const length = useMemo(() => data.length, [data]);
  // const update = useSelector((s: RootState) => s.trade.entrustUpdate);

  const [u, setUpdate] = useState(0);

  const { tradeAccountUpdate } = useTradeStore();

  useUpdateEffect(() => {
    setUpdate(Math.random());
  }, [update, tradeAccountUpdate]);

  function changeData(v) {
    dispatch(
      setStore({
        key: 'entrustList',
        value: v,
      }),
    );
    setData(v);
  }

  const showData = useMemo(() => {
    const searchKey = Object.keys(search || {});
    if (searchKey.length === 0) {
      return data;
    }

    return data.filter((item: Record<string, any>) => {
      let flag = true;

      searchKey.forEach((key: string) => {
        if (typeof search[key].value === 'string' && search[key].value) {
          const defaultHandler = search[key].type === 'default' && item[key] !== search[key].value;
          const filterHandler = search[key].type === 'filter' && item[key].indexOf(search[key].value) === -1;
          const moreFilterHandler = search[key].type === 'moreFilter'
            && !search[key].filter.find((fKey) => item[fKey].indexOf(search[key].value) !== -1);

          if (defaultHandler || filterHandler || moreFilterHandler) {
            flag = false;
          }
        }
      });

      return flag;
    });
  }, [search, data]);

  const [list, setList] = useState([]);
  const finalList = useSubscribeStockListQuote(
    async (client: any) => {
      const symbols: any = list.map((item: Record<string, any>) => [item.smallMarket, item.stockCode]);

      const snapshotList = await querySnapshot(client, {
        symbols,
        fields: [QUOTE_CATEGORY_FIELD.INFO, QUOTE_CATEGORY_FIELD.QUOTE],
      });

      const stockVOList: any = list.map((item: Record<string, any>) => {
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
    [list],
  );

  useUpdateEffect(() => {
    changeData(finalList);
  }, [finalList]);

  const getListData = () => {
    const getData = queryType === TradeSearchTableType.TODAY ? getWaitingOrders : getHistoryOrders;
    const reqParams: Record<string, any> = {
    };

    if (queryType === TradeSearchTableType.HISTORY) {
      assign(reqParams, historyReqBody);
    }

    if (date) {
      reqParams.startDate = dayjs(date.startDate).format('YYYY-MM-DD');
      reqParams.endDate = dayjs(date.endDate).format('YYYY-MM-DD');
    }

    getData(reqParams)
      .then((res) => {
        const { code, result } = res;
        if (code === 0 && result) {
          setList(result);
        }
      })
      .catch(() => {
        setList([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useDeepCompareEffect(() => {
    setLoading(true);
    getListData();

    if (!timeOut) {
      timeOut = setInterval(() => {
        if (getLoading()) return;

        getListData();
      }, window.GLOBAL_CONFIG.TRADE_CONFIG.tableUpdateTime);
    }

    return () => {
      clearInterval(timeOut);
    };
  }, [queryType, market, u, date, historyReqBody]);

  return {
    data,
    showData,
    length,
    loading,
  };
};

export default useEntrustList;
