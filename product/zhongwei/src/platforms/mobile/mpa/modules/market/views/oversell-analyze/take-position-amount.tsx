import React, { useEffect, useState } from 'react';
import { useQuoteClient } from '@dz-web/quote-client-react';
import { useIntl } from 'react-intl';
import dayjs from 'dayjs';

import { getUrlParam } from '@/utils';
import { useGetUserConfig } from '@/helpers/multi-platforms';

import LineBarCharts from './components/line-bar-charts/line-bar-charts';

import './oversell-analyze.scss';
import { getLineBarOptions } from './constants';

// const xAxisData = [
//   '09/30',
//   '10/11',
//   '10/20',
//   '10/28',
//   '11/05',
//   '11/13',
//   '11/22',
//   '09/30',
//   '10/11',
//   '10/20',
//   '10/28',
//   '11/13',
//   '11/22',
// ];

const TakePositionAmount: React.FC = () => {
  const { wsClient, isWsClientReady } = useQuoteClient();
  const { language } = useGetUserConfig();
  const [takePositionAmountData, setTakePositionAmountData] = useState({
    last_nominal: [],
    sp_volume: [],
    record_dates: [],
  });

  const { formatMessage } = useIntl();

  const { code } = getUrlParam();

  const nowDate = dayjs().format('YYYY-MM-DD');
  const beforeDate = dayjs().subtract(1, 'year').format('YYYY-MM-DD');

  useEffect(() => {
    if (!isWsClientReady && !code) return;
    wsClient
      ?.send({
        mf: '7',
        sf: '3005',
        body: {
          stk_id: code,
          language,
          date_range: [beforeDate, nowDate],
        },
      })
      .then((res) => {
        if (res.code !== 0) return;

        const { body } = res;

        body.record_dates = body.record_dates.map((item) => dayjs(item).format('MM/DD'));

        setTakePositionAmountData(body);
      })
      .catch((err) => console.log(err, '空頭持倉數量 err'));
  }, [isWsClientReady]);
  return (
    <div styleName="card">
      <div styleName="card-header">
        <div styleName="card-title">
          {formatMessage({ id: 'take_position_number' })}
          (
          {formatMessage({ id: 'week_update' })}
          )
        </div>
      </div>
      <LineBarCharts
        data={getLineBarOptions({
          barData: takePositionAmountData.sp_volume,
          lineData: takePositionAmountData.last_nominal,
          xAxisData: takePositionAmountData.record_dates,
          barOption: {
            legendName: formatMessage({ id: 'positions_number' }),
            yAxisName: `${formatMessage({ id: 'unit' })}(${
              formatMessage({ id: 'unit_thousand' }) + formatMessage({ id: 'unit_thigh' })
            })`,
          },
          lineOption: {
            legendName: formatMessage({ id: 'last_nominals' }),
            yAxisName: `${formatMessage({ id: 'last_nominals' })}(HKD)`,
          },
        })}
        options={{
          dataZoom: {
            start: 60,
            type: 'inside',
            end: 100,
          },
        }}
      />
    </div>
  );
};

export default TakePositionAmount;
