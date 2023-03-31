import PositionTab from '@/platforms/mobile/components/position-tab/position-tab';
import { countType, div, fixNumber } from '@/utils';
import { memo, useMemo, useState } from 'react';
import { useStockInfoStore } from '@mobile/model/stock-info-store';

const { defaultLotSize = 1 } = window.GLOBAL_CONFIG.TRADE_CONFIG;

const selectTab = (activeKey, payloadNumber, stockChangeNumber, setStockNumber) => {
  let stockNum = 0;

  console.log(activeKey, '---> activeKey');

  switch (activeKey) {
    case 'all': stockNum = fixNumber(stockChangeNumber, payloadNumber, countType.PLUS);
      break;
    case '2': stockNum = fixNumber(stockChangeNumber, div(payloadNumber, 2), countType.PLUS);
      break;
    case '3': stockNum = fixNumber(stockChangeNumber, div(payloadNumber, 3), countType.PLUS);
      break;
    case '4': stockNum = fixNumber(stockChangeNumber, div(payloadNumber, 4), countType.PLUS);
      break;
    default: stockNum = stockChangeNumber;
      break;
  }

  setStockNumber(stockNum);
};

/**
 * 快捷数量选中tab
 * @param setStockNumber 改变数量
 * @param countMax 最大数量
 * @returns
 */
const MaxPositionTab = (props) => {
  const { setStockNumber, countMax } = props;

  const stockInfo = useStockInfoStore((state) => state.stockInfo);

  /** 最小交易手数 */
  const stockChangeNumber = useMemo(() => stockInfo?.lotSize || defaultLotSize, [stockInfo?.lotSize]);

  const [active, setActive] = useState('');

  const activeChange = (key) => {
    setActive(key);
    if (key !== '') { selectTab(key, countMax, stockChangeNumber, setStockNumber); }
  };

  return (
    <PositionTab
      className="i-flex-c"
      active={active}
      activeChange={activeChange}
    />
  );
};

export default memo(MaxPositionTab);
