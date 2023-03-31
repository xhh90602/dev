import { setTradeOrder, TradeOrderListType } from '@/platforms/pc/model/trade-order';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { returnJavaMarket } from '@/utils/market';
import { editUrlParams, getUrlParam } from '@/utils/navigate';

const useTradeParams = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { code, market } = useMemo(() => getUrlParam() || {}, [location]);

  const javaMarket = useMemo(() => returnJavaMarket(Number(market)), [market]);

  const dispatch = useDispatch();

  function stockJump(obj) {
    const url = editUrlParams({ code, market, ...obj }, location.pathname);

    navigate(url, {
      replace: true,
    });
  }

  useEffect(() => {
    dispatch(
      setTradeOrder({
        key: TradeOrderListType.code,
        value: code,
      }),
    );

    dispatch(
      setTradeOrder({
        key: TradeOrderListType.market,
        value: market,
      }),
    );
  }, [code, market]);

  return {
    code,
    market,
    javaMarket,
    stockJump,
  };
};

export default useTradeParams;
