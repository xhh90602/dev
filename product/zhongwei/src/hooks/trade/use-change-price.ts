import { RootState } from '@/platforms/pc/model/store';
import { setTradeOrder, TradeOrderListType } from '@/platforms/pc/model/trade-order';
import { initCountPrice, returnJavaMarket } from '@/utils';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/**
 * 更新变动价
 */
const useChangePrice = () => {
  const price = useSelector((state: RootState) => state.tradeOrder.price);
  const market = useSelector((state: RootState) => state.tradeOrder.market);

  const dispatch = useDispatch();

  useEffect(() => {
    let changePriceTemp = [0.01];
    if (market) {
      const javaMarket = returnJavaMarket(Number(market));
      changePriceTemp = initCountPrice(javaMarket, {
        now: Number(price || 0),
        market,
      });
    }

    dispatch(
      setTradeOrder({
        key: TradeOrderListType.priceChangeNumber,
        value: changePriceTemp,
      }),
    );
  }, [price, market]);
};

export default useChangePrice;
