import { RootState } from '@/platforms/pc/model/store';
import { setTradeOrder, TradeOrderListType } from '@/platforms/pc/model/trade-order';
import { countPrice, countType, getStockDec, returnJavaMarket } from '@/utils';
import { toFixed } from '@dz-web/o-orange';
import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const usePrice = (props = {} as any) => {
  const { originKey = 'price', otherJavaMarket = '', defaultValue = '' } = props;
  const price = useSelector((s: RootState) => s.tradeOrder[originKey]);
  const market = useSelector((s: RootState) => s.tradeOrder.market);
  const priceChangeNumber = useSelector((s: RootState) => s.tradeOrder.priceChangeNumber);

  const javaMarket = useMemo(() => otherJavaMarket || returnJavaMarket(Number(market)), [market, otherJavaMarket]);

  const dispatch = useDispatch();

  function changePrice(v: string) {
    dispatch(
      setTradeOrder({
        key: TradeOrderListType[originKey],
        value: v,
      }),
    );
  }

  useEffect(() => {
    if (defaultValue) {
      changePrice(defaultValue);
    }
  }, [defaultValue]);

  function plus() {
    countPrice({
      type: countType.PLUS,
      price,
      setPrice: changePrice,
      changePrice: priceChangeNumber,
      market: javaMarket,
    });
  }
  function minus() {
    countPrice({
      type: countType.MINUS,
      price,
      setPrice: changePrice,
      changePrice: priceChangeNumber,
      market: javaMarket,
    });
  }

  const onBlur = (e) => {
    if (e.target.value === '') return;

    const dec = getStockDec(javaMarket, e.target.value);
    if (!(Number(e.target.value) > 0)) {
      changePrice('');
      return;
    }

    changePrice(
      toFixed(Number(e.target.value), {
        precision: dec,
      }),
    );
  };

  return {
    price,
    changePrice,
    plus,
    minus,
    priceChangeNumber,
    onBlur,
  };
};

export default usePrice;
