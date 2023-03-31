import * as React from 'react';
import { QuoteLevel } from 'quote-ws-client-for-dz';
import { toPercent } from '@dz-web/o-orange';
import { QuoteChart } from '@dz-web/quote-chart-mobile';

import { queryTimeTrend } from './interface/quotation-api';
import { ITimeData, refreshChartTypeEnum } from './type';
import { ITHEME, colorModeMap, THEME_DICT } from './constant/chart-theme';
import { humanNumber, toFixed, getUnitFromHumanNumber, NumberUnitMap } from './utils/tools';
import { judgeColor } from './utils/misc';
import { getBaseOfTimeConfig, getTimeConfig, getVolumeOfTime } from './helper/time-indicator-dict';

import './chart.scss';
import { useClient } from '../../hooks/quote/client-context';
import useSubscribeComponent from '../../hooks/use-subscribe-component';
import { userConfigContext } from '../../helpers/entry/native';

const { useState, useEffect, useRef, useMemo, useContext } = React;

const pureChartId = 'sz';
const colorMode = 'RAISE_RED_DECLINE_GREEN';

interface IProps {
  market: number;
  code: string;
  active?: any;
  isLive: boolean;
}

const Chart: React.FC<IProps> = ({ market, code, active, isLive }) => {
  const { client, isQuoteReady } = useClient();

  const commodityQuotes = useSubscribeComponent({ market, code });
  const { dec, prev_close: lastclose, quote_state: quoteState } = commodityQuotes;

  const [timeBaseData, setTimeBaseData] = useState<ITimeData>();
  const [isChartLoading, setIsChartLoading] = useState(false);

  const userConfig = useContext<any>(userConfigContext);

  const themeConfig: ITHEME = useMemo(() => {
    const theme = THEME_DICT[(userConfig as any)?.theme ?? THEME_DICT.white];
    const color = colorModeMap[colorMode] || colorModeMap.RAISE_RED_DECLINE_GREEN;
    return { ...theme, ...color };
  }, [userConfig, colorMode]);
  const queryPropertyTimeTrend = queryTimeTrend;

  const chartInstance = useRef(null);
  const chartOptions = useRef(null);
  const timeBaseDataRef = useRef<ITimeData>();
  const volumeUnit = useRef(null);
  const requestLoop = useRef(null);
  const resizeTimer = useRef(null);

  function clearChart() {
    setTimeBaseData({
      priceData: [],
      volumeData: [],
      avgData: [],
      timeData: [],
      miscData: [],
      tickIndexList: [],
      code,
      market,
      dataType: refreshChartTypeEnum.resetData,
    });
  }

  async function queryTimeData(dataType) {
    let timeRes: any = { tendency: { data: [] }, timeList: [] };

    try {
      timeRes = await queryPropertyTimeTrend(
        client,
        {
          market,
          code,
          quoteState,
          isLive,
        },
        QuoteLevel.LIVE,
      );
    } catch (err) {
      console.log(err, '<-- queryTimeTrend');
    }

    const { tendency = {}, timeList } = timeRes;
    const { data } = tendency;

    if (!data?.length) {
      clearChart();
      return undefined;
    }

    if (dataType === refreshChartTypeEnum.resetData) {
      setIsChartLoading(true);
    }

    const lastClose = Number(toFixed(lastclose, dec));
    const normalColorDict = { riseColor: 'riseColor', fallColor: 'fallColor' };

    const result: ITimeData = {
      priceData: [],
      volumeData: [],
      avgData: [],
      timeData: [],
      miscData: [],
      tickIndexList: [],
      code,
      market,
      dataType,
    };

    timeList.forEach((timeItem, index) => {
      result.timeData[index] = timeItem;

      if (index % 30 === 0) {
        result.tickIndexList.push(index);
      }
    });

    const max = Math.max.apply(
      null,
      data.map((v) => v.volume),
    );
    const unit = getUnitFromHumanNumber(humanNumber(max, 2));
    volumeUnit.current = unit;
    const exponent = NumberUnitMap[unit] || 1;

    data.forEach((item: any, index) => {
      const nextIndex = index + 1;
      const price = toFixed(item.close, dec);
      const avg = toFixed(item.avg, dec);
      const floatValue = +price - lastClose;
      const floatRate = floatValue / lastClose;
      const volume = item.volume / 10 ** exponent;
      const floatColorField = judgeColor(floatValue, 0, normalColorDict);
      const avgColorField = judgeColor(avg, lastClose, normalColorDict);

      result.priceData[nextIndex] = price;
      result.avgData[nextIndex] = avg;
      result.volumeData[nextIndex] = volume;
      result.miscData[nextIndex] = {
        floatRate: toPercent(floatRate),
        floatValue: toFixed(floatValue, dec),
        amount: `${humanNumber(item.amount, 2)}`,
        floatColorField,
        avgColorField,
        volume: `${humanNumber(item.volume, 2)}`,
      };
    });

    setTimeBaseData({ ...result });
    setIsChartLoading(false);
    return result;
  }

  useEffect(() => {
    if (!timeBaseData) return;

    const info = {
      commodityQuotes,
      baseData: timeBaseData,
      themeConfig,
      volumeUnit: volumeUnit.current,
    };

    const baseConfig = getBaseOfTimeConfig(info, { chartId: `#${pureChartId}`, mini: false });
    const timeConfig = getTimeConfig(info);
    const volumeConfig = getVolumeOfTime(info);

    baseConfig.grids = [timeConfig, volumeConfig];
    chartOptions.current = baseConfig;

    if (!chartInstance.current) {
      chartInstance.current = new QuoteChart(baseConfig);
    } else {
      const dict = {
        [refreshChartTypeEnum.pushData]() {
          chartInstance.current.refreshByPushData(baseConfig);
        },
        [refreshChartTypeEnum.changeTheme]() {
          chartInstance.current.refreshByChangeTheme(baseConfig);
        },
        [refreshChartTypeEnum.resetData]() {
          chartInstance.current.refreshByResetData(baseConfig);
        },
      };

      dict[timeBaseData.dataType]();
    }
  }, [timeBaseData]);

  useEffect(() => {
    if (!isQuoteReady || !dec) return () => undefined;

    queryTimeData(refreshChartTypeEnum.resetData);

    requestLoop.current = window.setInterval(() => {
      queryTimeData(refreshChartTypeEnum.pushData);
    }, 5000);

    return () => {
      window.clearInterval(requestLoop.current);
    };
  }, [isQuoteReady, dec, market, code, quoteState, queryPropertyTimeTrend]);

  useEffect(() => {
    timeBaseDataRef.current = timeBaseData;
  }, [timeBaseData]);

  useEffect(() => {
    const fn = () => {
      clearTimeout(resizeTimer.current);
      if (!chartInstance.current) return;

      resizeTimer.current = setTimeout(() => {
        chartInstance.current.resize();
      }, 500);
    };

    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  useEffect(() => {
    clearTimeout(resizeTimer.current);
    if (!chartInstance.current) return;

    resizeTimer.current = setTimeout(() => {
      chartInstance.current.resize();
    }, 500);
  }, [active]);

  useEffect(() => {
    if (timeBaseDataRef.current) {
      setTimeBaseData({ ...timeBaseDataRef.current, dataType: refreshChartTypeEnum.changeTheme });
      clearChart();
    }
  }, [themeConfig]);

  return (
    <div styleName="chart-wrapper">
      {isChartLoading && <div>加载中...</div>}

      <div id={pureChartId} styleName="chart" />
    </div>
  );
};

Chart.defaultProps = {
  active: '',
};

export default Chart;
