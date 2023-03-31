import { useIntl } from 'react-intl';
import IconSvg from '@mobile/components/icon-svg';
import './risk-warning.scss';

const RiskWarning: React.FC = () => {
  const { formatMessage } = useIntl();

  return (
    <div styleName="risk-warning-box">
      <IconSvg path="icon_hint" styleName="icon-hint" />
      <div>{formatMessage({ id: 'risk_warning' })}</div>
    </div>
  );
};

export default RiskWarning;
