/* eslint-disable no-restricted-globals */
/* eslint-disable @typescript-eslint/no-shadow */
import React, { useState, useRef, useEffect, useContext, useMemo, useLayoutEffect } from 'react';
import TableList from '@mobile/components/table-list/table-list';
import NoMessage from '@mobile/components/no-message/no-message';
import { InformationCircleOutline } from 'antd-mobile-icons';
import { toPercent } from '@dz-web/o-orange';
import dayjs from 'dayjs';
import { FormattedMessage, useIntl } from 'react-intl';
import { getUnit } from '@mobile/helpers/native/unit';
import qs from 'query-string';
import { isRollTop } from '@mobile/helpers/native/msg';
import { useQuoteClient } from '@dz-web/quote-client-react';
import { BIG_FUN, WARRANT_CBBC_FUN, QUOTE_FUN } from '@dz-web/quote-client';
import { userConfigContext } from '@mobile/helpers/entry/native';
import ChartLegend from './components/chart-legend/chart-legend';
import getDefaultColumn from './components/helper/get-column';
import FoldingColumnChart from './components/folding-column-chart';
import { legendList } from './constants';
import './warrant-and-cbbc-deal-statistics-of-stock.scss';

const WarrantAndCBBCDealStatistics: React.FC = () => {
  // 获取主题配置 , 用于更改echart文字颜色
  const { quoteChangeColor } = useContext(userConfigContext);

  const { market, code, theme } = qs.parse(location?.search) || {};

  // 根据配置 设置红涨绿跌还是绿涨红跌
  useLayoutEffect(() => {
    if (legendList && legendList.length) {
      legendList.forEach((v) => {
        if (v.title === 'good_hold') {
          v.color = quoteChangeColor === 'red' ? '#06B899' : '#da070e';
        } else if (v.title === 'bad_hold') {
          v.color = quoteChangeColor !== 'red' ? '#06B899' : '#da070e';
        }
      });
    }
  }, [quoteChangeColor]);

  const config = useContext<any>(userConfigContext);
  const { formatMessage } = useIntl();
  const { wsClient, isWsClientReady } = useQuoteClient();
  const [lastTradeDay, setLastTradeDay] = useState<any>();
  const [endTime, setEndTime] = useState<any>();
  const [chartData, setChartData] = useState<any>({ good: [], bad: [], tradeDay: [], closePrice: [], tooltipInfo: [] });
  const [tableData, setTableData] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [updateTime, setUpdateTime] = useState('');
  const tableDataCopy = useRef<any>([]);

  interface TooltipInfo {
    bear: string;
    cattleCard: string;
    date: string;
    put: string;
    riseRate: string;
    subscribe: string;
  }

  const columns = useMemo(() => getDefaultColumn(formatMessage), [config.languange, formatMessage]);

  useEffect(() => {
    if (!isWsClientReady) return;
    wsClient
      ?.send({
        body: {
          market,
          days: 5,
        },
        mf: BIG_FUN.QUOTE,
        sf: QUOTE_FUN.TRADE_DAY,
      })
      .then((res) => {
        const { days } = res?.body || {};
        const time = Math.ceil(+dayjs(String(days[days.length - 1])) / 1000);
        setEndTime(time);
        setLastTradeDay(time);
      })
      .catch((err) => {
        console.log(err, '<-- err');
      });
  }, [isWsClientReady]);

  useEffect(() => {
    if (!isWsClientReady || !lastTradeDay) return;
    wsClient
      ?.send({
        body: {
          market,
          code,
          end_time: lastTradeDay,
          days: 5,
        },
        mf: BIG_FUN.WARRANT_CBBC,
        sf: WARRANT_CBBC_FUN.STOCK_MONEY_FLOW,
      })
      .then((res) => {
        const good: string[] = [];
        const bad: string[] = [];
        const closePrice: string[] = [];
        const tradeDay: string[] = [];
        const tooltipInfo: TooltipInfo[] = [];
        if (!res?.body?.length) return;
        const { unit, multi } = getUnit(res?.body?.[0].good_hold || res?.body?.[0].bad_hold, formatMessage);
        res?.body?.forEach((item, index) => {
          good.unshift((item.good_hold / multi)?.toFixed(2));
          bad.unshift((item.bad_hold / multi).toFixed(2));
          tradeDay.unshift(dayjs(item.trade_day * 1000).format('MM/DD'));
          closePrice.unshift(item.close_price.toFixed(3));
          tooltipInfo.unshift({
            subscribe: (item.subscribe / multi).toFixed(2),
            cattleCard: (item.cattle_card / multi).toFixed(2),
            put: (item.put / multi).toFixed(2),
            bear: (item.bear / multi).toFixed(2),
            riseRate: toPercent(item.rise_rate, { multiply: 100 }),
            date: dayjs(item.trade_day * 1000).format('YYYY/MM/DD'),
          });
          if (index === 0) {
            setUpdateTime(dayjs(item.trade_day * 1000).format('YYYY/MM/DD'));
          }
        });
        setChartData({ good, bad, closePrice, tradeDay, unit, tooltipInfo });
      })
      .catch((err) => {
        console.log(err, '<-- err');
      });
  }, [isWsClientReady, wsClient, lastTradeDay]);

  useEffect(() => {
    if (!isWsClientReady || !endTime) return;
    wsClient
      ?.send({
        body: {
          market,
          code,
          end_time: endTime,
          days: 30,
        },
        mf: BIG_FUN.WARRANT_CBBC,
        sf: WARRANT_CBBC_FUN.STOCK_MONEY_FLOW,
      })
      .then((res) => {
        if (!res?.body || !res?.body.length) {
          return;
        }

        const list = isLoadingMore ? tableDataCopy.current.slice(0, -1) : [];
        res?.body?.forEach((item) => {
          list.push({
            goodHold: item?.good_hold,
            badHold: item?.bad_hold,
            tradeDay: dayjs((item?.trade_day || 0) * 1000).format('YYYY/MM/DD'),
            trade_day: item?.trade_day,
            closePrice: item?.close_price.toFixed(3),
            subscribe: item?.subscribe,
            cattleCard: item?.cattle_card,
            put: item?.put,
            bear: item?.bear,
            riseRate: toPercent(item?.rise_rate, { multiply: 100 }),
          });
        });
        console.log(list, '---> list');
        setTableData(list);
      })
      .catch((err) => {
        console.log(err, '<-- err');
      })
      .then(() => {
        setIsLoadingMore(false);
      });
  }, [isWsClientReady, wsClient, endTime]);

  useEffect(() => {
    tableDataCopy.current = tableData;
  }, [tableData]);

  let startY = 0;

  const getDirection = (startY: number, endY: number) => {
    const dy = startY - endY;
    if (dy > 0) {
      return 1;
    }
    if (dy < 0) {
      return 2;
    }
    return 0;
  };

  // 计算表格高度
  const tableBoxRef = useRef(null);

  return (
    <div styleName="stock-page">
      <div styleName="page-container">
        <div
          onTouchStart={(e) => {
            startY = e.touches[0].pageY;
          }}
          onTouchEnd={(e) => {
            const endY = e.changedTouches[0].pageY;
            const direction = getDirection(startY, endY);
            if (direction === 2) {
              isRollTop();
            }
          }}
        >
          <div styleName="title">
            <h3>
              <FormattedMessage id="five_day_inflow" />
              {/* <InformationCircleOutline color="#b5bbcf" fontSize={16} styleName="icon-style" /> */}
            </h3>
            <span>
              <span>{updateTime}</span>
              <FormattedMessage id="update" />
            </span>
          </div>

          <div styleName="chart">
            <FoldingColumnChart
              chartData={chartData}
              formatMessage={formatMessage}
              quoteChangeColor={quoteChangeColor}
              theme={theme}
            />
          </div>
          <div styleName="chart-legend-div">
            <ChartLegend dataList={legendList} titleParse={(id) => formatMessage({ id })} />
          </div>
        </div>

        <div styleName="table-con">
          <div styleName="inner-table" ref={tableBoxRef}>
            <TableList
              data={tableData}
              wrapperPadding={['0.32rem', '0.32rem']}
              hiddenBox={<NoMessage />}
              columns={columns}
              titleHeight={28}
              columnHeight={28}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarrantAndCBBCDealStatistics;
