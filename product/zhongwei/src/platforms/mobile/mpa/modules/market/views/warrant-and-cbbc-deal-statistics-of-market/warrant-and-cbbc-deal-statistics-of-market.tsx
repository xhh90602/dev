/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-return-assign */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useEffect, useMemo, useRef, useCallback, useContext } from 'react';

import { FormattedMessage, useIntl } from 'react-intl';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { useQuoteClient } from '@dz-web/quote-client-react';
import { userConfigContext } from '@mobile/helpers/entry/native';
import { webViewTouch } from '@mobile/helpers/native/register';
import { convertWithUnit, getUnit } from '@mobile/helpers/native/unit';
import { isRollTop, normalToggleNativeGesture } from '@mobile/helpers/native/msg';
import { QUOTE_FUN } from '@dz-web/quote-client';
import { BIG_FUN, WARRANT_CBBC_FUN } from 'quote-ws-client-for-dz';

import ChartLegend, { IDataList, ChartType } from './components/chart-legend/chart-legend';
import AirTemperatureInstrumentChart from './components/air-temperature-instrument-chart';
import ColumnarDoubleFold from './components/columnar-double-fold-chart';
import { hsTrendTabs } from './constants';
import { getState } from './components/helper';

import './warrant-and-cbbc-deal-statistics-of-market.scss';
import ActiveSharesTraded from './components/active-shares-traded/active-shares-traded';
import VarietyDistribution from './components/variety-distribution/variety-distribution';
// import { toFixed } from '@dz-web/o-orange';

const WarrantAndCBBCDealStatistics: React.FC = () => {
  const userConfig = useContext<any>(userConfigContext);
  const domRef = useRef<HTMLDivElement | null>(null);
  // 获取主题配置 , 用于更改echart文字颜色
  const { theme, language } = userConfig;

  const { formatMessage } = useIntl();
  const { wsClient, isWsClientReady } = useQuoteClient();

  const [warrantAndCBBCAmountRatio, setWarrantAndCBBCAmountRatio] = useState<any>({});
  const [warrantAndCBBCHSInfo, setWarrantAndCBBCHSInfo] = useState<any>({
    rate: [],
    tradeDay: [],
    data: [],
    closePrice: [],
    tradeTime: [],
    tradeFullDay: [],
  });
  const [endTime, setEndTime] = useState<any>();
  const [HSType, setHSType] = useState(0);
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [HSUpdateTime, setHSUpdateTime] = useState('--');

  const queryWarrantAndCBBCHSTrendTimer = useRef<any>(null);
  const queryWarrantAndCBBCAmountRatioTimer = useRef<any>(null);

  const tabName = useMemo(() => formatMessage({ id: hsTrendTabs.find((v) => v.type === HSType)?.name }), [
    HSType,
    language,
  ]);

  const legendList = useMemo<IDataList[]>(
    () => [
      {
        title: 'type_of_market_transactions',
        color: '#fa6d16',
        type: ChartType.CIRCLE,
      },
      {
        title: 'hs_close',
        color: '#5b2ffa',
        type: ChartType.CIRCLE,
      },
      {
        title: 'type_of_amount',
        color: '#2f9bfa',
        type: ChartType.CIRCLE,
      },
    ],
    [tabName],
  );

  const requestHSTrend = useCallback(() => {
    if (!isWsClientReady || !endTime) {
      clearInterval(queryWarrantAndCBBCHSTrendTimer.current);
      return;
    }
    // setIsChartLoading(true);
    const fn = () => {
      wsClient
        ?.send({
          body: {
            type: HSType,
            market: 2002,
            end_time: endTime,
            days: 180,
          },
          mf: BIG_FUN.WARRANT_CBBC,
          sf: WARRANT_CBBC_FUN.HS_TREND,
        })
        .then((res) => {
          const data: string[] = [];
          const rate: string[] = [];
          const closePrice: string[] = [];
          const tradeDay: string[] = [];
          const tradeTime: number[] = [];
          const tradeFullDay: string[] = [];
          if (!res?.body?.length) return;
          const { unit, multi } = getUnit(res?.body?.[0].derivatives_amount, formatMessage);
          res?.body?.forEach((item) => {
            data.unshift((item.derivatives_amount / multi).toFixed(2));
            tradeDay.unshift(dayjs(item.trade_day * 1000).format('MM/DD'));
            tradeFullDay.unshift(dayjs(item.trade_day * 1000).format('YYYY/MM/DD'));
            rate.unshift((item.rate * 100).toFixed(2));
            closePrice.unshift(item.index_close_price.toFixed(3));
            tradeTime.unshift(item.trade_day);
          });
          setHSUpdateTime(dayjs((res?.body?.[0]?.trade_day || 0) * 1000).format('YYYY/MM/DD'));
          setWarrantAndCBBCHSInfo({ data, tradeDay, rate, closePrice, unit, tradeTime, tradeFullDay, type: HSType });
        })
        .catch((err) => {
          console.log(err, '<-- err-->');
        })
        .then(() => setIsChartLoading(false));
    };
    fn();
    queryWarrantAndCBBCHSTrendTimer.current = setInterval(fn, 60000);
  }, [endTime, isWsClientReady, warrantAndCBBCHSInfo, HSType, formatMessage]);

  useEffect(() => {
    if (!isWsClientReady) {
      return clearInterval(queryWarrantAndCBBCAmountRatioTimer.current);
    }
    const fn = () => {
      wsClient
        ?.send({
          body: { market: 2002 },
          mf: BIG_FUN.WARRANT_CBBC,
          sf: WARRANT_CBBC_FUN.AMOUNT_RATIO,
        })
        .then((res) => {
          const { body } = res;
          setWarrantAndCBBCAmountRatio({
            date: body.time * 1000,
            state: getState(body.rate),
            derivativesAmount: convertWithUnit(body.derivatives_amount, 2, formatMessage),
            indexAmount: convertWithUnit(body.index_amount, 2, formatMessage),
            ...body,
            rate: body.rate.toFixed(4),
          });
        })
        .catch((err) => {
          console.log(err, '<-- err');
        });
    };

    fn();
    queryWarrantAndCBBCAmountRatioTimer.current = setInterval(fn, 60000);

    return () => clearInterval(queryWarrantAndCBBCAmountRatioTimer.current);
  }, [isWsClientReady, wsClient, formatMessage]);

  useEffect(() => {
    if (!isWsClientReady) return;
    wsClient
      ?.send({
        body: { market: 2002, days: 5 },
        mf: BIG_FUN.QUOTE,
        sf: QUOTE_FUN.TRADE_DAY,
      })
      .then((res) => {
        const { days } = res?.body || {};
        const time = Math.ceil(+dayjs(String(days[days.length - 1])) / 1000);
        // 每天8点
        // setEndTime(time + 60 * 60 * 24);
        setEndTime(time + 60 * 60 * 8);
      })
      .catch((err) => {
        console.log(err, '<-- err-->');
      });
  }, [isWsClientReady]);

  useEffect(() => {
    requestHSTrend();
    return () => clearInterval(queryWarrantAndCBBCHSTrendTimer.current);
  }, [isWsClientReady, HSType, endTime, formatMessage]);

  useEffect(() => {
    // if (!domRef.current) return null;
    if (!domRef.current) return undefined;
    const scrollDom = domRef.current;
    const getTop = (top, scH, clH) => {
      // console.log(top, '<___top');
      if (top === 0 || scH < clH) {
        isRollTop().then((res) => {
          // console.log(res);
        });
      }
    };
    const scrollHandle = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollDom;
      getTop(scrollTop, scrollHeight, clientHeight);
    };
    webViewTouch(() => {
      console.log('触发了webview事件');
      scrollHandle();
    });
    scrollDom.addEventListener('scroll', scrollHandle);
    return () => scrollDom.removeEventListener('scroll', scrollHandle);
  }, []);

  return (
    <div styleName="page" ref={domRef}>
      {/* 輪證占大市成交 */}
      <div styleName="ratio">
        <span styleName="ratio-title">
          <FormattedMessage id="cbbc_of_market_transactions" />
        </span>
        <span styleName="ratio-update-time">
          {dayjs(warrantAndCBBCAmountRatio.date).format('YYYY/MM/DD')}
          <FormattedMessage id="update" />
        </span>
        <div styleName="ratio-chart">
          <AirTemperatureInstrumentChart
            warrantAndCBBCHSInfo={warrantAndCBBCAmountRatio.rate}
            formatMessage={warrantAndCBBCAmountRatio.state && formatMessage({ id: warrantAndCBBCAmountRatio.state })}
            theme={theme}
          />
        </div>
        <div styleName="ration-data">
          <div styleName="ration-data-inner">
            <div styleName="cbba-warrant-data">
              <p styleName="cbba-title">
                <FormattedMessage id="cbbc_amount" />
              </p>
              <span styleName="cbba-number">{warrantAndCBBCAmountRatio.derivativesAmount}</span>
            </div>
            <div styleName="market-data">
              <p styleName="market-title">
                <FormattedMessage id="market_amout" />
              </p>
              <span styleName="market-number">{warrantAndCBBCAmountRatio.indexAmount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 歷史走勢 */}
      <div styleName="hs-trend">
        <span styleName="hs-trend-title">
          <FormattedMessage id="history_trend" />
        </span>
        <span styleName="hs-update-time">
          {HSUpdateTime}
          <FormattedMessage id="update" />
        </span>
        <ol styleName="hs-tabs">
          {hsTrendTabs.map((item) => (
            <li
              key={item.type}
              onClick={() => setHSType(item.type)}
              styleName={classNames('hs-tabs-item', {
                // styleName={classNames('hs-check-tabs-item hs-tabs-item', {
                'hs-tabs-item--active': item.type === HSType,
              })}
            >
              <FormattedMessage id={item.name} />
            </li>
          ))}
        </ol>
        <div
          styleName="hs-trend-chart"
          onTouchStart={() => {
            console.log('onTouchStart');
            normalToggleNativeGesture(0);
          }}
          onTouchEnd={() => {
            console.log('onTouchEnd');
            normalToggleNativeGesture(1);
          }}
        >
          <ColumnarDoubleFold
            warrantAndCBBCHSInfo={warrantAndCBBCHSInfo}
            formatMessage={formatMessage}
            tabName={tabName}
            theme={theme}
          />
        </div>
        <ChartLegend dataList={legendList} titleParse={(id) => `${tabName}${formatMessage({ id })}`} />
      </div>
      {/* 品种分布 */}
      <VarietyDistribution language={language} />
      {/* 成交活躍股 */}
      <ActiveSharesTraded language={language} />
    </div>
  );
};

export default WarrantAndCBBCDealStatistics;
