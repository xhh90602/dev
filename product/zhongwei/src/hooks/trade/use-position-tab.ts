import { RootState } from '@/platforms/pc/model/store';
import { setTradeOrder, TradeOrderListType } from '@/platforms/pc/model/trade-order';
import { countType, div, fixNumber } from '@/utils';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface IPositionTab {
  countMax?: number;
  sellNumber?: number;
  code: string;
}

interface IReturnTab {
  buyChange: (payload: { key: string }) => void;
  sellChange: (payload: { key: string }) => void;
  sellActive: string;
  buyActive: string;
  sellNumber: number;
}

/**
 * 选择仓位
 * @param countMax 最大可买量
 * @param sellNumber 最大可卖量
 * @returns {buyChange, sellChange, sellActive, buyActive}
 */
const usePositionTab = ({ countMax, code }: IPositionTab): IReturnTab => {
  const [buyActive, setBuyActive] = useState('');
  const [sellActive, setSellActive] = useState('');

  const stockChangeNumber = useSelector((state: RootState) => state.tradeOrder.stockChangeNumber);
  const positionList = useSelector((state: RootState) => state.trade.positionList);

  const sellNumber = useMemo(() => {
    const current = positionList.find((v) => v.stockCode === code);

    if (current) return Number(current.enableQty);

    return 0;
  }, [positionList, code]);

  const dispatch = useDispatch();

  const selectTab = (activeKey, payloadNumber) => {
    let stockNum = 0;

    switch (activeKey) {
      case 'all':
        stockNum = fixNumber(stockChangeNumber, payloadNumber, countType.PLUS);
        break;
      case 'half':
        stockNum = fixNumber(stockChangeNumber, div(payloadNumber, 2), countType.PLUS);
        break;
      case '3':
        stockNum = fixNumber(stockChangeNumber, div(payloadNumber, 3), countType.PLUS);
        break;
      case '4':
        stockNum = fixNumber(stockChangeNumber, div(payloadNumber, 4), countType.PLUS);
        break;
      default:
        stockNum = stockChangeNumber;
        break;
    }

    dispatch(
      setTradeOrder({
        key: TradeOrderListType.stockNumber,
        value: stockNum,
      }),
    );
  };

  function buyChange({ key }) {
    if (!countMax) return;

    const activeKey = key === buyActive ? '' : key;
    setBuyActive(activeKey);
    setSellActive('');
    selectTab(activeKey, countMax);
  }

  function sellChange({ key }) {
    if (!sellNumber) return;

    const activeKey = key === sellActive ? '' : key;
    setSellActive(activeKey);
    setBuyActive('');
    selectTab(activeKey, sellNumber);
  }

  useEffect(() => {
    setBuyActive('');
    setSellActive('');
  }, [code]);

  return {
    buyChange,
    buyActive,
    sellChange,
    sellActive,
    sellNumber,
  };
};

export default usePositionTab;
