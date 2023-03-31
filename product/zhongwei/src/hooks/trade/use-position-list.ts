import { getPosition } from '@/api/module-api/trade';
import { setStore } from '@mobile/model/trade';
import { useMemo, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { JavaMarket } from '@/utils/trade';
import { useLocation } from 'react-router-dom';
import { openNewPage, PageType } from '@/platforms/mobile/helpers/native/msg';
import { useTradeStore } from '@/platforms/mobile/model/trade-store';
import { useDeepCompareEffect } from 'ahooks';

let timeInterval;

const dataTemplate = [];

const usePositionList = (props) => {
  const {
    closeTime = false,
    market = [JavaMarket.HKEX, ...JavaMarket.A.split('-')], hasJump = true,
  } = props;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(dataTemplate);

  const { positionUpdate, tradeAccountUpdate, setPositionTotal, setPositionList } = useTradeStore();

  const length = useMemo(() => data.length, [data]);

  const dispatch = useDispatch();
  const location = useLocation();

  const stockJump = useCallback(
    ({ stockCode, smallMarket }, url) => {
      if (!hasJump) return;
      openNewPage({
        path: `trade.html#${url}?code=${stockCode}&market=${smallMarket}`,
        pageType: PageType.HTML,
      });
    },
    [location],
  );

  function changeData(v) {
    dispatch(setStore({
      key: 'positionList',
      value: v,
    }));
    setPositionList(market.includes(JavaMarket.HKEX) ? JavaMarket.HKEX : JavaMarket.MK, v);
    setData(v);
  }

  function getPositionList() {
    getPosition({
      tradeMarket: market,
    }).then((res) => {
      setLoading(false);
      if (res.code === 0) {
        changeData(res.result);
      }
    }).catch(() => {
      setLoading(false);
      changeData([]);
    });

    getPosition({}).then((res) => {
      if (res.code === 0) {
        setPositionTotal(res.result.length);
        setPositionList('all', res.result);
      }
    }).catch(() => {
      setPositionTotal(0);
    });
  }

  useDeepCompareEffect(() => {
    setLoading(true);
    getPositionList();

    if (!timeInterval && !closeTime) {
      setInterval(() => {
        if (loading) return;
        getPositionList();
      }, window.GLOBAL_CONFIG.TRADE_CONFIG.tableUpdateTime);
    }

    return () => {
      clearInterval(timeInterval);
    };
  }, [positionUpdate, tradeAccountUpdate, market]);

  return {
    data,
    length,
    loading,
    stockJump,
  };
};

export default usePositionList;
