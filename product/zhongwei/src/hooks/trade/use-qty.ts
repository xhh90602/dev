import { getMaxBuy } from '@/api/module-api/trade';
import { RootState } from '@/platforms/pc/model/store';
import { setTradeOrder, TradeOrderListType } from '@/platforms/pc/model/trade-order';
import { countNumber, countType, returnJavaMarket } from '@/utils';
import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const useQty = (type: tradeOrderType, options = {} as { originChangeNum: string; originNum: string }) => {
  const { originNum = 'stockNumber', originChangeNum = 'stockChangeNumber' } = options;
  const stockNumber = useSelector((s: RootState) => s.tradeOrder[originNum]);
  const code = useSelector((s: RootState) => s.tradeOrder.code);

  const market = useSelector((s: RootState) => s.tradeOrder.market);
  const price = useSelector((s: RootState) => s.tradeOrder.price);
  const stockChangeNumber = useSelector((s: RootState) => s.tradeOrder[originChangeNum]);
  const [countMax, setCountMax] = useState(0);
  const javaMarket = useMemo(() => returnJavaMarket(Number(market)), [market]);

  useEffect(() => {
    if (!['buy', 'all'].includes(type)) return;

    if (!code || Number(price) <= 0 || !Number(price)) {
      // 获取可买数量
      setCountMax(0);
      return;
    }

    // 最大买卖量接口
    setTimeout(() => {
      getMaxBuy({
        stockCode: code,
        price,
        tradeMarket: javaMarket,
      }).then((res) => {
        if (res.code === 0) {
          const enableAmount = res?.result?.enableAmount ?? 0;
          const remainder = enableAmount % stockChangeNumber;

          setCountMax(enableAmount - remainder);
        }
      });
    });
  }, [code, price, stockChangeNumber, type]);

  const dispatch = useDispatch();

  function changeQty(v: string) {
    dispatch(
      setTradeOrder({
        key: TradeOrderListType[originNum],
        value: v,
      }),
    );
  }

  function count(countQtyType) {
    const countMaxNumber = ['buy', 'all'].includes(type) ? countMax : 0;

    countNumber({
      type: countQtyType,
      number: stockNumber,
      setNumber: changeQty,
      changeNumber: stockChangeNumber,
      countMax: countMaxNumber,
    });
  }

  const onBlur = (e) => {
    if (e.target.value === '') return;

    if (!(Number(e.target.value) > 0)) {
      changeQty('');
      return;
    }

    changeQty(e.target.value);
  };

  return {
    qty: stockNumber,
    changeQty,
    plus: () => {
      count(countType.PLUS);
    },
    minus: () => {
      count(countType.MINUS);
    },
    onBlur,
    countMax,
    stockChangeNumber,
  };
};

export default useQty;
