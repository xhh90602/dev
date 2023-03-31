// import { RootState } from '@/platforms/pc/model/store';
import {
  useDispatch,
  // useSelector,
} from 'react-redux';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { setTradeOrder, TradeOrderListType } from '@/platforms/pc/model/trade-order';

const useDateCheck = (code) => {
  // const diyDate = useSelector((s: RootState) => s.tradeOrder.diyDate);
  const [diyDate, setDiyDate] = useState(dayjs().endOf('day'));

  const [isDiyDate, setIsDiyDate] = useState(false);

  const dispatch = useDispatch();

  function changeDiyDate(v: dayjs.Dayjs | undefined) {
    if (v) setDiyDate(v);
    dispatch(
      setTradeOrder({
        key: TradeOrderListType.diyDate,
        value: v ? v.format('YYYY-MM-DD') : '',
      }),
    );
  }

  function changeDiy(v: any) {
    setIsDiyDate(v);
  }

  useEffect(() => {
    changeDiyDate(dayjs().endOf('day'));
  }, [code]);

  useEffect(() => {
    if (!isDiyDate) {
      changeDiyDate(undefined);
    }
  }, [isDiyDate]);

  return {
    isDiyDate,
    diyDate,
    changeDiy,
    changeDiyDate,
  };
};

export default useDateCheck;
