import CapitalFund from '@/platforms/mobile/containers/capital-fund/capital-fund';
import { useState } from 'react';

import './capital-fund-index.scss';

const CapitalFundIndex = () => {
  const [a, s] = useState(1);

  return (
    <div styleName="index">
      {/* 资产信息 */}
      <CapitalFund />
    </div>
  );
};

export default CapitalFundIndex;
