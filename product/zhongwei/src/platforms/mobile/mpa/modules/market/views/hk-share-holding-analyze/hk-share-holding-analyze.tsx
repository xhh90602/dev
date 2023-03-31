import React, { useEffect } from 'react';

import IconSvg from '@/platforms/mobile/components/icon-svg';
// import ShareHoldingRatio from './share-holding-ratio';
import AccruingAmountsFlow from './accruing-amounts-flow';

import './hk-share-holding-analyze.scss';

const HkShareHoldingAnalyze: React.FC = () => {
  useEffect(() => {
    console.log('初始化');
  }, []);

  return (
    <div styleName="hk-share-hloding-analyze">
      {/* <ShareHoldingRatio /> */}
      <AccruingAmountsFlow />
      <div styleName="footer-hint">
        <span styleName="icon">
          <IconSvg path="icon_hint" />
        </span>
        以上行情、資訊及其他數據來自第三方數據源，僅供參考，不構成投資建議。
      </div>
    </div>
  );
};

export default HkShareHoldingAnalyze;
