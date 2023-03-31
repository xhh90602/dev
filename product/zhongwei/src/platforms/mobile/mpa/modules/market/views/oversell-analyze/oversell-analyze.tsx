import React from 'react';
import IconSvg from '@/platforms/mobile/components/icon-svg';
import OversellAmount from './oversell-amount';
import TakePositionAmount from './take-position-amount';
import './oversell-analyze.scss';

const OversellAnalyze: React.FC = () => (
  <>
    <div styleName="container">
      <OversellAmount />
      <TakePositionAmount />
    </div>
    <div styleName="footer-hint">
      <span styleName="icon">
        <IconSvg path="icon_hint" />
      </span>
      以上行情、資訊及其他數據來自第三方數據源，僅供參考，不構成投資建議。
    </div>
  </>
);

export default OversellAnalyze;
