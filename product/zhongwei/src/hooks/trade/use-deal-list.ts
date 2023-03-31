import { getBuyDate, getHistoryBuy } from '@/api/module-api/trade';
import { TradeSearchTableType } from '@pc/constants/trade';
import { JavaMarket } from '@/utils';
import { useGetState } from 'ahooks';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

let timeOut;

const useDealList = ({ queryType, market, search, date }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading, getLoading] = useGetState(false);
  const [reload, setUpdateReload] = useState(0);

  const showData = useMemo(() => {
    const searchKey = Object.keys(search);
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

  function changeData(v) {
    setData(v);
  }

  const getListData = () => {
    const getData = queryType === TradeSearchTableType.TODAY ? getBuyDate : getHistoryBuy;
    const reqParams: Record<string, any> = {
      tradeMarket: [JavaMarket.HKEX, ...JavaMarket.A.split('-'), JavaMarket.USA],
    };

    if (date) {
      reqParams.startDate = dayjs(date.startDate).format('YYYY-MM-DD');
      reqParams.endDate = dayjs(date.endDate).format('YYYY-MM-DD');
    }

    getData(reqParams)
      .then((res) => {
        setLoading(false);

        const { code, result } = res;
        if (code === 0 && result) {
          changeData(result);
        }
      })
      .catch(() => {
        setLoading(false);
        changeData([]);
      });
  };

  useEffect(() => {
    setLoading(true);

    getListData();

    timeOut = setInterval(() => {
      if (getLoading()) return;

      getListData();
    }, window.GLOBAL_CONFIG.TRADE_CONFIG.tableUpdateTime);

    return () => {
      clearInterval(timeOut);
    };
  }, [queryType, market, reload, date]);

  return {
    data,
    showData,
    loading,
    manualUpdate: setUpdateReload,
  };
};

export default useDealList;
