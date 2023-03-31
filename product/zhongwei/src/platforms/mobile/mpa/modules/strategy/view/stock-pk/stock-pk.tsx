import React from 'react';
import { useSearchParam } from 'react-use';
import StockPK from './components/stock-pk';
import './stock-pk.scss';

const StrategyHome: React.FC = () => {
  const safeAreaTop = Number(useSearchParam('safeAreaTop')) || 0;

  return (
    <div styleName="stock-pk" style={{ paddingTop: `${+safeAreaTop}px` }}>
      {/* 股票对比 主界面 */}
      <StockPK />
    </div>
  );
};

export default StrategyHome;
