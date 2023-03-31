import React from 'react';
import { useIntl } from 'react-intl';
import livingIcon from '@mobile/images/icon_living.png';
import './liveing-icon.scss';

const LivingIcon: React.FC = () => {
  const { formatMessage } = useIntl();
  return (
    <div
      styleName="living-icon"
      style={{
        backgroundImage: `url(${livingIcon})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <span>
        {formatMessage({ id: 'living' })}
      </span>
    </div>
  );
};

export default LivingIcon;
