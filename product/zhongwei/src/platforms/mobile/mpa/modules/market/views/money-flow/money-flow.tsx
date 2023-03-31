import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSearchParam } from 'react-use';
import { useQuoteClient } from '@dz-web/quote-client-react';
import { queryTradeTime, PLUGIN_CODE } from '@dz-web/quote-client';
import { useClient } from '@/platforms/mobile/hooks/quote/client-context';
import StockDetailTabs from '../../components/stock-detail-tabs/stock-detail-tabs';
import './money-flow.scss';

import Chart from './components/chart/chart';

export const tabData = [
  {
    value: 1,
    label: '今日',
  },
  {
    value: 3,
    label: '3日',
  },
  {
    value: 5,
    label: '5日',
  },
  {
    value: 10,
    label: '10日',
  },
];

const MoneyFlow: React.FC = () => {
  const market: any = useSearchParam('market');
  const code: any = useSearchParam('code');
  // const { wsClient, isWsClientReady: isQuoteReady } = useQuoteClient();
  // const a = useSubscribeComponent({ market: 2002, code: '00700' });
  // useEffect(() => {}, [isQuoteReady]);

  const [value, setValue] = useState(1);
  // const [period, setPeriod] = useState(periodList[0].value);
  const [updateTime, setUpdateTime] = useState('--');
  const [unit, setUnit] = useState('--');
  return (
    <div styleName="page-wrapper">
      <div styleName="page-top-box">
        <div>
          <span styleName="page-title">
            <FormattedMessage id="distribution_of_funds" />
          </span>
          <span styleName="page-date">
            {`${updateTime}`}
            <FormattedMessage id="update_time" />
          </span>
        </div>
        <div styleName="page-unit">
          <FormattedMessage id="unity_name" />
          {`:${unit}`}
        </div>
      </div>
      <div styleName="tab-box">
        <StockDetailTabs tabData={tabData} onChange={(v) => setValue(v)} styles={{ background: '#ebedf5' }} />
      </div>
      <Chart period={value} Market={market} Code={code} setUpdateTime={setUpdateTime} setUnit={setUnit} unit={unit} />
    </div>
  );
};

export default MoneyFlow;
