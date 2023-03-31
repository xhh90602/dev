/* eslint-disable prefer-promise-reject-errors */
import React, { useEffect } from 'react';
import { useQuoteClient } from '@dz-web/quote-client-react';
import { useSafeState } from 'ahooks';
import { useIntl } from 'react-intl';

import './hbar-charts.scss';
import { getUrlParam } from '@/utils';

const yAxis = [
  {
    value: 0,
    label: '近1日',
  },
  {
    value: 5,
    label: '近5日',
  },
  {
    value: '-',
    label: '近20日',
  },
  {
    value: 60,
    label: '近60日',
  },
];

// const data = [
//
//   // [-134.2, 308.7, -130.1, 208.8],
//   ['6451.5', '55.5', '-1116.0', '6842.0'],
//   [-100.1, 208.7, -130.1, 308.8],
// ];

const HbarCharts: React.FC<any> = () => {
  const { wsClient, isWsClientReady } = useQuoteClient();
  const { formatMessage } = useIntl();

  const { market, code } = getUrlParam();

  const dim = [
    formatMessage({ id: 'time_title' }),
    formatMessage({ id: 'net_number_shares_traded' }),
    formatMessage({ id: 'net_capital_flow' }),
  ];

  const legend = [
    [formatMessage({ id: 'net_buy' }), formatMessage({ id: 'net_sell' })],
    [formatMessage({ id: 'net_inflow' }), formatMessage({ id: 'net_outflow' })],
  ];

  const [capitalFlowsData, setCapitalFlowsData] = useSafeState<any>({
    vol: [],
    amount: [],
  });

  const setBarWidth = (list: number[], value: number) => {
    const maxWidth = 2.17 / 2;
    const maxValue = Math.max(...list.map((v) => Math.abs(v)));
    return `${Math.abs((maxWidth / maxValue) * value)}rem`;
  };

  const getCapitalFlowsData = (TimeBase) => new Promise((resolve, reject) => {
    wsClient
      ?.send({
        ReqType: 1224,
        ReqID: 1,
        // TimeBase: 1,
        Data: [
          {
            Market: market,
            Code: code,
            TimeBase,
          },
        ],
      })
      .then((res) => {
        if (res.Status !== 0 || !res.Data.length) {
          reject(false);
          return;
        }
        const result = res.Data[0];
        const buyVolName = ['ExBigBuyVol', 'BigBuyVol', 'MidBuyVol', 'SmallBuyVol', 'MnSBuyVol'];
        const sellVolName = ['ExBigSellVol', 'BigSellVol', 'MidSellVol', 'SmallSellVol', 'MnSSellVol'];
        const buyAmountName = ['ExBigBuyAmount', 'BigBuyAmount', 'MidBuyAmount', 'SmallBuyAmount', 'AllBuyAmount'];
        const sellAmountName = [
          'ExBigSellAmount',
          'BigSellAmount',
          'MidSellAmount',
          'SmallSellAmount',
          'AllSellAmount',
        ];
        let netBuyVol = 0; // 净买入量
        let netSellVol = 0; // 净卖出量
        let netBuyAmount = 0; // 净买入量
        let netSellAmount = 0; // 净卖出量

        buyVolName.forEach((item) => {
          netBuyVol += result[item];
        });
        sellVolName.forEach((item) => {
          netSellVol += result[item];
        });
        buyAmountName.forEach((item) => {
          netBuyAmount += result[item];
        });
        sellAmountName.forEach((item) => {
          netSellAmount += result[item];
        });
        console.log(netSellAmount, netBuyAmount, 'netBuyAmount');

        resolve({
          vol: ((netBuyVol - netSellVol) / 1000).toFixed(1),
          amount: ((netBuyAmount - netSellAmount) / 1000).toFixed(1),
        });
      })
      .catch((err) => {
        console.log(err, 'err res');
        reject(false);
      });
  });

  useEffect(() => {
    if (!isWsClientReady) return;
    if ((!market && !code)) return;

    const capitalFlowPromise = yAxis.map((item, index) => getCapitalFlowsData(item.value));

    Promise.allSettled(capitalFlowPromise)
      .then((res) => {
        const capitalFlowDay = res.map((item) => {
          if (item.status !== 'fulfilled') {
            return {
              vol: 0,
              amount: 0,
            };
          }
          return item.value;
        });

        const capitalFlowVol = capitalFlowDay.map((item) => item.vol);
        const capitalFlowAmount = capitalFlowDay.map((item) => item.amount);

        setCapitalFlowsData({
          vol: capitalFlowVol,
          amount: capitalFlowAmount,
        });
      })
      .catch((err) => console.log(err, 'err'));
  }, [isWsClientReady]);

  return (
    <div styleName="hbar-charts" className="num-font">
      <div styleName="y-axis">
        <div>{dim[0]}</div>
        {yAxis.map((item) => (
          <div key={item.value}>{item.label}</div>
        ))}
      </div>
      <div styleName="custom-charts">
        <div>{dim[1]}</div>
        <div styleName="charts">
          {capitalFlowsData.vol.map((item) => (
            <div styleName={item < 0 ? 'bar right' : 'bar left'}>
              <span>{item > 0 ? `+${item}` : item}</span>
              <div
                style={{
                  backgroundColor: item < 0 ? '#2F9BFA' : '#FA6D16',
                  width: setBarWidth(capitalFlowsData.vol, item),
                }}
              />
            </div>
          ))}
        </div>
        <div styleName="legend">
          <div styleName="circle">
            <span style={{ backgroundColor: '#FA6D16' }} />
            {legend[0][0]}
          </div>
          <div styleName="circle">
            <span style={{ backgroundColor: '#2F9BFA' }} />
            {legend[0][1]}
          </div>
        </div>
      </div>
      <div styleName="custom-charts">
        <div>{dim[2]}</div>
        <div styleName="charts">
          {capitalFlowsData.amount.map((item) => (
            <div styleName={item < 0 ? 'bar right' : 'bar left'}>
              <span>{item > 0 ? `+${item}` : item}</span>
              <div
                style={{
                  backgroundColor: item < 0 ? '#DA070E' : '#06B899',
                  width: setBarWidth(capitalFlowsData.amount, item),
                }}
              />
            </div>
          ))}
        </div>
        <div styleName="legend">
          <div styleName="circle">
            <span style={{ backgroundColor: '#06B899' }} />
            {legend[1][0]}
          </div>
          <div styleName="circle">
            <span style={{ backgroundColor: '#DA070E' }} />
            {legend[1][1]}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HbarCharts;
