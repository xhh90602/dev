import React, { useEffect, useState } from 'react';
import { useQuoteClient } from '@dz-web/quote-client-react';
import dayjs from 'dayjs';
import { useIntl } from 'react-intl';
// import VConsole from 'vconsole';

import { getUrlParam } from '@/utils';

import IconSvg from '@/platforms/mobile/components/icon-svg';
import { nativeOpenPage } from '@/platforms/mobile/helpers/native/url';
import { useGetUserConfig } from '@/helpers/multi-platforms';
import LineBarCharts from './components/line-bar-charts/line-bar-charts';
import './oversell-analyze.scss';
import { getLineBarOptions } from './constants';

// const vConsole = new VConsole();

const OversellAmount: React.FC = () => {
  const { wsClient, isWsClientReady } = useQuoteClient();
  const { language } = useGetUserConfig();
  const [oversellAmountData, setOversellAmountData] = useState({
    last_nominals: [],
    ss_turnovers: [],
    trade_dates: [],
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
        sf: '3004',
        body: {
          stk_id: code,
          language,
          date_range: [beforeDate, nowDate],
        },
      })
      .then((res) => {
        if (res.code !== 0) return;

        const { body } = res;

        body.trade_dates = body.trade_dates.map((item) => dayjs(item).format('MM/DD'));

        setOversellAmountData(body);
      })
      .catch((err) => console.log(err, '每日賣空數量 err'));
  }, [isWsClientReady]);

  return (
    <div styleName="card">
      <div styleName="card-header">
        <div styleName="card-title">{formatMessage({ id: 'daily_short_sales' })}</div>
        <div
          styleName="card-sub-title"
          className="flex-c-c"
          onClick={() => {
            nativeOpenPage('oversell-rank.html');
          }}
        >
          {formatMessage({ id: 'short_sales_list' })}

          <span styleName="arrow-icon">
            <IconSvg path="icon_arrow_right" />
          </span>
        </div>
      </div>
      <div>
        <LineBarCharts
          data={getLineBarOptions({
            barData: oversellAmountData.ss_turnovers,
            lineData: oversellAmountData.last_nominals,
            xAxisData: oversellAmountData.trade_dates,
            barOption: {
              legendName: formatMessage({ id: 'ss_turnovers' }),
              yAxisName: `${formatMessage({ id: 'ss_turnovers' })}(${formatMessage({
                id: 'unit_thousand',
              })})`,
            },
            lineOption: {
              legendName: formatMessage({ id: 'last_nominals' }),
              yAxisName: `${formatMessage({ id: 'last_nominals' })}(HKD)`,
            },
          })}
          options={{
            // dataZoom: {
            //   start: 30,
            //   type: 'inside',
            //   end: 100,
            // },
          }}
        />
      </div>
    </div>
  );
};

export default OversellAmount;
