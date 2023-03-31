import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import HbarCharts from './components/hbar-charts/hbar-charts';
import './hk-share-holding-analyze.scss';

const AccruingAmountsFlow:React.FC = () => {
  const { formatMessage } = useIntl();
  useEffect(() => {
    console.log('初始化');
  }, []);
  return (
    <div styleName="module-box ">
      <div styleName="module-header">
        <span styleName="module-title">{formatMessage({ id: 'hong_kong_cumulative_capital_flow' })}</span>
      </div>
      <HbarCharts />
    </div>
  );
};

export default AccruingAmountsFlow;
