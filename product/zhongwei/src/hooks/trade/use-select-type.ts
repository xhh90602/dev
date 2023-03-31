import { useMemo, useEffect } from 'react';
import getOrderTypeList from '@/helpers/order-type';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/platforms/pc/model/store';
import { setTradeOrder, TradeOrderListType } from '@/platforms/pc/model/trade-order';

interface IReturnSelectType {
  orderTypeList: {
    label: string;
    value: string;
    labelName: string;
  }[];
  entrustValue: string;
  changeEntrust: (v: string) => void;
}

const useSelectType = (): IReturnSelectType => {
  const entrustValue = useSelector((s: RootState) => s.tradeOrder.entrustValue);
  const market = useSelector((s: RootState) => s.tradeOrder.market);

  const orderTypeList = useMemo(() => getOrderTypeList(market), [market]);

  const dispatch = useDispatch();

  function changeEntrust(v: string) {
    dispatch(setTradeOrder({
      key: TradeOrderListType.entrustValue,
      value: v,
    }));
  }

  useEffect(() => {
    if (!orderTypeList.length) return;
    changeEntrust(orderTypeList[0].value);
  }, [orderTypeList]);

  return {
    orderTypeList,
    entrustValue,
    changeEntrust,
  };
};

export default useSelectType;
