import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useQuoteClient } from '@dz-web/quote-client-react';
import { queryTradeTime, PLUGIN_CODE } from '@dz-web/quote-client';
import { toPercent, dateFormat, dateRange } from '@dz-web/o-orange';
// import { get } from 'lodash-es';
// import { QuoteChart } from '@dz-web/quote-chart-pc';

import ReactECharts from 'echarts-for-react/lib/core';

import { FormattedMessage, useIntl } from 'react-intl';

import pieEcharts from '@/components/echarts/pie-chart';
import lineBarEcharts from '@/components/echarts/line-bar-chart';

// import ChartLegend, { ChartType } from '@pc-spa/views/quote/components/chart-legend/chart-legend';
// import { getUnit } from '@pc/spa/views/quote/utils/unit';
import { Spin } from 'antd';
import { getUnit } from '@/utils';
// import { useGetUserConfig } from '@/helpers/multi-platforms';
import { QuoteChart } from '@dz-web/quote-chart-pc';
import getPieOption from '../helper/get-pie-option';

import getBarOption from '../helper/get-bar-option';

import './chart.scss';
import ChartLegend, { ChartType } from '../../../../components/chart-legend/chart-legend';
import getLineOption from '../helper/get-react-line-option';
import { tabData } from '../../money-flow';

const color2 = ['#048770', '#019E83', '#06B899', '#1ED0B1'];
const color1 = ['#B4070C', '#E81B22', '#F03D43', '#E76B6F'];
const parseMultiAmount = (value: number, multi: number, precision = 2) => Number((value / multi).toFixed(precision));
const parseAmount = (value: number, _multi: number, precision = 2) => Number(value.toFixed(precision));

/**
 * 根据配置判断是红涨绿跌还是绿涨红跌
 * @param value 数值
 * @param raise 配置
 * @returns 颜色
 */
export function getItemStyleColor(value: number, raise = 'red') {
  const up = raise === 'red' ? '#06b899' : '#da070e'; // 涨
  const down = raise === 'red' ? '#da070e' : '#06b899'; // 跌
  // return value >= 0 ? up : down;
  return value >= 0 ? up : down;
}
const raise = 'red';

interface IProps {
  period: number;
  Market: number;
  Code: string;
  setUpdateTime: React.Dispatch<React.SetStateAction<string>>;
  setUnit: React.Dispatch<React.SetStateAction<string>>;
  unit: string;
}

const Chart: React.FC<IProps> = (props) => {
  const { period, Market, Code, setUpdateTime, setUnit, unit } = props;
  const { formatMessage } = useIntl();
  // const userConfig = useGetUserConfig();

  const timeData = useMemo(() => {
    const current = tabData.find((item) => item.value === period);
    return current?.label;
  }, [period]);

  const [tickStatistics, setTickStatistics] = useState<any>({ buyList: [], sellList: [] });
  const [unitInfo, setUnitInfo] = useState({ unit: '', multi: 1 });

  const [todayMoneyFlowList, setTodayMoneyFlowList] = useState({ dataList: [], timeList: [] });
  const [tradeMinList, setTradeMinList] = useState([]);
  const [tradeMinTickList, setTradeMinTickList] = useState([]);

  const [todayMoneyFlow, setTodayMoneyFlow] = useState<any>({
    all: [],
    exBig: [],
    big: [],
    time: [],
    mid: [],
    small: [],
  });

  // const trendChartConfig = useRef<any>({});
  // const trendChart = useRef<any>(null);
  const todayMoneyFlowTimer = useRef<any>(null);
  const { wsClient, isWsClientReady: isQuoteReady } = useQuoteClient();

  useEffect(() => {
    if (!isQuoteReady || wsClient === null) return;

    queryTradeTime(wsClient, {
      by_config: { market_id: Market, trade_time_id: 0 },
      by_symbol: [],
    }).then((res) => {
      const timeList: any = [];
      const tickList: any = [];
      let endTime = '';
      // console.log(res, 'res');

      res.forEach((item: any, index) => {
        const { open, close } = item;
        const fixedOpen = new Date(`${open.replace(/-/g, '/')}+0`);
        const fixedClose = new Date(`${close.replace(/-/g, '/')}+0`);

        const list = dateRange(fixedOpen, fixedClose, { dateType: 'HH:mm' });

        if (endTime) {
          tickList.push({ index: timeList.length, value: `${endTime}/${list[0]}` });
        }

        endTime = list[list.length - 1];
        if (index === 0) {
          list.splice(-1, 1);
        }

        timeList.push(...list);
      });
      setTradeMinList(timeList);
      setTradeMinTickList(tickList);
    });
  }, [isQuoteReady, Market, Code]);

  useEffect(() => {
    if (!unitInfo.multi) return () => clearInterval(todayMoneyFlowTimer.current);
    if (!isQuoteReady || !tradeMinList.length) return () => clearInterval(todayMoneyFlowTimer.current);

    const { multi } = unitInfo;
    const parseAmountSpecifyMulti = (value = 0) => parseMultiAmount(value, multi, 2);

    const fn = () => {
      wsClient
        ?.send({
          ReqType: PLUGIN_CODE.MONEY_FLOW_TODAY,
          ReqID: 1,
          Data: { Market, Code },
        })
        .then((res) => {
          const all: any = [];
          const exBig: any = [];
          const big: any = [];
          const mid: any = [];
          const small: any = [];

          const currDate = dateFormat(new Date(), 'HH:mm');
          const dict = {};
          res.Data.forEach((item, index) => {
            dict[dateFormat(item.Time, 'HH:mm')] = {
              all: parseAmountSpecifyMulti(item.all),
              exBig: parseAmountSpecifyMulti(item.big_ex_amount),
              big: parseAmountSpecifyMulti(item.big_amount),
              mid: parseAmountSpecifyMulti(item.mid_amount),
              small: parseAmountSpecifyMulti(item.small_amount),
            };

            if (index === res.Data.length - 1) {
              setUpdateTime(dateFormat(item.Time, 'yyyy/MM/dd HH:mm'));
            }
          });

          let prevData = {};
          let stop = false;
          tradeMinList.forEach((item) => {
            if (stop) return;
            const value: any = dict[item] || prevData;

            all.push(value.all);
            exBig.push(value.exBig);
            big.push(value.big);
            mid.push(value.mid);
            small.push(value.small);
            prevData = value;

            if (item === currDate) stop = true;
          });

          setTodayMoneyFlow({ exBig, big, mid, small, all });
        })
        .catch((err) => {
          console.log(err, '<-- err');
        });
    };

    fn();
    todayMoneyFlowTimer.current = setInterval(fn, 60000);

    return () => clearInterval(todayMoneyFlowTimer.current);
  }, [isQuoteReady, tradeMinList, unitInfo, Market, Code]);

  useEffect(() => {
    // console.log(todayMoneyFlow, 'todayMoneyFlow');

    const dict = {
      timeList: tradeMinList,
      dataList: [
        {
          color: '#FA6D16',
          title: 'total',
          type: ChartType.LINE,
          data: todayMoneyFlow.all,
        },
        {
          color: '#5B2FFA',
          title: 'oversized_order',
          type: ChartType.LINE,
          data: todayMoneyFlow.exBig,
        },
        {
          color: '#FAB02F',
          title: 'big_order',
          type: ChartType.LINE,
          data: todayMoneyFlow.big,
        },
        {
          color: '#EF5DA8',
          title: 'medium_order',
          type: ChartType.LINE,
          data: todayMoneyFlow.mid,
        },
        {
          color: '#06B899',
          title: 'small_order',
          type: ChartType.LINE,
          data: todayMoneyFlow.small,
        },
      ],
    };

    setTodayMoneyFlowList(dict as any);
    // console.log(dict, 'dict');

    // trendChartConfig.current = getLineOption(dict, tradeMinList, tradeMinTickList);

    // if (trendChart.current) {
    //   trendChart.current.refreshByResetData(trendChartConfig.current);
    // } else {
    //   trendChart.current = new QuoteChart(trendChartConfig.current);
    // }
  }, [todayMoneyFlow]);

  useEffect(() => {
    if (!isQuoteReady) return;

    wsClient
      ?.send({
        ReqType: PLUGIN_CODE.MONEY_FLOW_BY_PERIOD,
        ReqID: 1,
        TimeBase: period,
        Data: [{ Market, Code, TimeBase: period }],
      })
      .then((res) => {
        if (!res.Data[0]) return;
        const [data] = res.Data;

        const totalAmout = Math.max(Math.abs(data.AllBuyAmount), Math.abs(data.AllSellAmount));
        const currUnitInfo = getUnit(totalAmout, formatMessage);
        const { multi, unit: unittext } = currUnitInfo;
        const parseAmountSpecifyMulti = (value = 0) => parseMultiAmount(value, multi, 2);
        const parseAmountSpecifyMultiAndData = (key: string) => parseAmountSpecifyMulti(data[key]);

        const allBuyAmount = parseAmountSpecifyMultiAndData('AllBuyAmount');
        const allSellAmount = parseAmountSpecifyMultiAndData('AllSellAmount');
        const exBigBuyAmount = parseAmountSpecifyMultiAndData('ExBigBuyAmount');
        const exBigSellAmount = parseAmountSpecifyMultiAndData('ExBigSellAmount');
        const bigBuyAmout = parseAmountSpecifyMultiAndData('BigBuyAmount');
        const bigSellAmount = parseAmountSpecifyMultiAndData('BigSellAmount');
        const midBuyAmout = parseAmountSpecifyMultiAndData('MidBuyAmount');
        const midSellAmount = parseAmountSpecifyMultiAndData('MidSellAmount');
        const smallSellAmount = parseAmountSpecifyMultiAndData('SmallSellAmount');
        const smallBuyAmount = parseAmountSpecifyMultiAndData('SmallBuyAmount');

        const totalTradeAmout = allSellAmount + allBuyAmount;
        const buyAmountRatio = totalTradeAmout ? Number((allBuyAmount / totalTradeAmout).toFixed(2)) : 0;
        const sellAmountRatio = allSellAmount ? 1 - buyAmountRatio : 0;
        const pureBuyAmount = allBuyAmount - allSellAmount;
        const maxAmount = Math.max(
          exBigBuyAmount,
          exBigSellAmount,
          bigBuyAmout,
          bigSellAmount,
          midBuyAmout,
          midSellAmount,
          smallSellAmount,
          smallBuyAmount,
        );

        const pureExBig = parseAmount(exBigBuyAmount - exBigSellAmount, multi);
        const pureBig = parseAmount(bigBuyAmout - bigSellAmount, multi);
        const pureMid = parseAmount(midBuyAmout - midSellAmount, multi);
        const pureSmall = parseAmount(smallBuyAmount - smallSellAmount, multi);

        setUnitInfo(currUnitInfo);
        setUnit(unittext);
        setTickStatistics({
          unit: unittext,
          allBuyAmount: `${allBuyAmount.toFixed(2)}${unittext}`,
          allSellAmount: `${allSellAmount.toFixed(2)}${unittext}`,
          buyAmountRatio: toPercent(buyAmountRatio, { multiply: 100 }),
          sellAmountRatio: toPercent(sellAmountRatio, { multiply: 100 }),
          exBigBuyAmount,
          pureBuyAmount: `${pureBuyAmount.toFixed(2)}${unittext}`,
          pureListData: [
            {
              name: 'oversized_order',
              value: pureExBig,
              label: {
                color: getItemStyleColor(pureExBig, 'red'),
              },
              itemStyle: {
                color: getItemStyleColor(pureExBig, 'red'),
                // color: 'blank',
              },
            },
            {
              name: 'big_order',
              value: pureBig,
              label: {
                // color: getItemStyleColor(pureBig, raise),
                color: getItemStyleColor(pureBig, 'red'),
              },
              itemStyle: {
                color: getItemStyleColor(pureBig, 'red'),
              },
            },
            {
              name: 'medium_order',
              value: pureMid,
              label: {
                color: getItemStyleColor(pureMid, 'red'),
              },
              itemStyle: {
                color: getItemStyleColor(pureMid, 'red'),
              },
            },
            {
              name: 'small_order',
              value: pureSmall,
              label: {
                color: getItemStyleColor(pureSmall, 'red'),
              },
              itemStyle: {
                color: getItemStyleColor(pureSmall, 'red'),
              },
            },
          ],

          buyList: [
            {
              name: 'oversized_order',
              value: exBigBuyAmount.toFixed(2),
              bgColor: raise === 'red' ? color1[0] : color2[0],
              width: toPercent(exBigBuyAmount / maxAmount, { multiply: 100 }),
              ratio: toPercent(exBigBuyAmount / totalTradeAmout, { multiply: 100 }),
            },
            {
              name: 'big_order',
              bgColor: raise === 'red' ? color1[1] : color2[1],
              value: bigBuyAmout.toFixed(2),
              width: toPercent(bigBuyAmout / maxAmount, { multiply: 100 }),
              ratio: toPercent(bigBuyAmout / totalTradeAmout, { multiply: 100 }),
            },
            {
              name: 'medium_order',
              bgColor: raise === 'red' ? color1[2] : color2[2],
              value: midBuyAmout.toFixed(2),
              width: toPercent(midBuyAmout / maxAmount, { multiply: 100 }),
              ratio: toPercent(midBuyAmout / totalTradeAmout, { multiply: 100 }),
            },
            {
              name: 'small_order',
              bgColor: raise === 'red' ? color1[3] : color2[3],
              value: smallBuyAmount.toFixed(2),
              width: toPercent(smallBuyAmount / maxAmount, { multiply: 100 }),
              ratio: toPercent(smallBuyAmount / totalTradeAmout, { multiply: 100 }),
            },
          ],
          sellList: [
            {
              name: 'oversized_order',
              bgColor: raise === 'red' ? color2[0] : color1[0],
              value: exBigSellAmount.toFixed(2),
              width: toPercent(exBigSellAmount / maxAmount, { multiply: 100 }),
              ratio: toPercent(exBigSellAmount / totalTradeAmout, { multiply: 100 }),
            },
            {
              name: 'big_order',
              bgColor: raise === 'red' ? color2[1] : color1[1],
              value: bigSellAmount.toFixed(2),
              width: toPercent(bigSellAmount / maxAmount, { multiply: 100 }),
              ratio: toPercent(bigSellAmount / totalTradeAmout, { multiply: 100 }),
            },
            {
              name: 'medium_order',
              bgColor: raise === 'red' ? color2[2] : color1[2],
              value: midSellAmount.toFixed(2),
              width: toPercent(midSellAmount / maxAmount, { multiply: 100 }),
              ratio: toPercent(midSellAmount / totalTradeAmout, { multiply: 100 }),
            },
            {
              name: 'small_order',
              bgColor: raise === 'red' ? color2[3] : color1[3],
              value: smallSellAmount.toFixed(2),
              width: toPercent(smallSellAmount / maxAmount, { multiply: 100 }),
              ratio: toPercent(smallSellAmount / totalTradeAmout, { multiply: 100 }),
            },
          ],
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [isQuoteReady, period, Market, Code]);

  return (
    <div styleName="wrap">
      <section styleName="wrap-item">
        <h3 styleName="title">
          <FormattedMessage id="distribution_of_funds_today" />
        </h3>

        <div styleName="today-money-distribution">
          <div styleName="pie-chart">
            {tickStatistics.buyList.length > 2 ? (
              <ReactECharts
                echarts={pieEcharts}
                option={getPieOption(
                  tickStatistics.pureBuyAmount,
                  formatMessage,
                  tickStatistics.buyList,
                  tickStatistics.sellList,
                )}
                style={{ height: '100%', width: '100%' }}
                notMerge
                lazyUpdate
                opts={{ renderer: 'svg' }}
              />
            ) : (
              ' '
            )}
          </div>
          {/* <div styleName="wrap-item" /> */}

          <div styleName="money-distribution-block">
            <div styleName="average left">
              <div styleName="money-distribution-caption">
                <span styleName="money-distribution-type">
                  <FormattedMessage id="inflow" />
                </span>
                <span styleName="money-distribution-volume">{tickStatistics.allBuyAmount}</span>
                {/* <span>{tickStatistics.buyAmountRatio}</span> */}
              </div>

              {/* <ol styleName="money-distribution-list"> */}
              <ol>
                {tickStatistics.buyList.map((item) => (
                  <li styleName="money-distribution-item" key={item.name}>
                    <span styleName="money-distribution-ratio">{`${item.ratio.split('.')[0]}%`}</span>

                    <span styleName="money-distribution-volume" className="raise">
                      {`${item.value}${tickStatistics.unit}`}
                    </span>
                    <div styleName="money-distribution-bar-x">
                      <div
                        styleName="money-distribution-bar"
                        style={{ width: item.width, backgroundColor: item.bgColor }}
                      />
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div styleName="content">
              {tickStatistics.buyList.map((item) => (
                <p styleName="content-item" key={item.name}>
                  <FormattedMessage id={item.name} />
                </p>
              ))}
            </div>

            <div styleName="average">
              <div styleName="money-distribution-caption money-distribution-caption--outer" className="decline">
                <span styleName="money-distribution-type" className="decline">
                  <FormattedMessage id="outflow" />
                </span>
                <span styleName="money-distribution-volume">{tickStatistics.allSellAmount}</span>
                {/* <span>{tickStatistics.sellAmountRatio}</span> */}
              </div>

              <ol>
                {tickStatistics.sellList.map((item) => (
                  <li styleName="money-distribution-item" key={item.name}>
                    {/* <span styleName="money-distribution-type">
                      <FormattedMessage id={item.name} />
                    </span> */}
                    <div styleName="money-distribution-bar-y">
                      <div
                        styleName="money-distribution-bar"
                        style={{ width: item.width, backgroundColor: item.bgColor }}
                      />
                    </div>
                    {/* <span className={compareToClass(item.value)} styleName="money-distribution-volume"> */}
                    <span styleName="money-distribution-volume">{`${item.value}${tickStatistics.unit}`}</span>
                    {/* <span className={compareToClass(item.ratio)} styleName="money-distribution-ratio"> */}
                    <span styleName="money-distribution-ratio">{`${item.ratio.split('.')[0]}%`}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section styleName="wrap-item">
        <h3 styleName="title">
          <FormattedMessage id="real_time_money_trend_today" />
        </h3>

        <div styleName="line-chart" id="trend-chart">
          <ReactECharts
            echarts={lineBarEcharts}
            option={getLineOption(todayMoneyFlowList, tradeMinList, tradeMinTickList, '')}
            style={{ height: '100%', width: '100%' }}
            notMerge
            lazyUpdate
            opts={{ renderer: 'svg' }}
          />
        </div>

        <div styleName="legend">
          <ChartLegend dataList={todayMoneyFlowList.dataList} titleParse={(id) => formatMessage({ id })} />
        </div>
      </section>

      <section styleName="wrap-item">
        <h3 styleName="title">{timeData + formatMessage({ id: 'pure_money_today' })}</h3>

        <div styleName="bar-chart">
          <ReactECharts
            echarts={lineBarEcharts}
            option={getBarOption(tickStatistics?.pureListData ?? [], unitInfo.unit, formatMessage)}
            style={{ height: '100%', width: '100%' }}
            notMerge
            lazyUpdate
            opts={{ renderer: 'svg' }}
          />
        </div>
      </section>
      {/* <div className="load-accomplish">{formatMessage({ id: 'nomore' })}</div> */}
    </div>
  );
};

export default Chart;
