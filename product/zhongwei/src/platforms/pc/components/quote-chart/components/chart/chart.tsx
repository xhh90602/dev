import React, { useRef, useMemo, useState, useEffect, memo } from 'react';
import { throttle } from 'lodash-es';
import { CacheStore } from '@dz-web/cache';
import { useIntl } from 'react-intl';
import { useGetState } from 'ahooks';
import { QuoteChart, MAIN_HOOK_DICT } from '@dz-web/quote-chart-pc';
import { toFixed, toPercent } from '@dz-web/o-orange';
import ResizeObserver from 'rc-resize-observer';
import { isUSSymbol } from '@dz-web/quote-client';
import { useQuoteClient, useSubscribeSingleStockQuote } from 'quote-client-react';
import type { Stock } from 'quote-ws-client-for-dz';
import { WeightType } from 'quote-ws-client-for-dz';

import { humanNumber } from '@/utils';

import { ITimeData, IKLineData, queryDataType, refreshChartTypeEnum } from '../../constant/chart-type';
import { THEME_DICT, ITHEME, colorModeMap } from '../../constant/chart-theme';
import { periodTypeDict, Period } from '../../constant/period';
import { typeIndicatorChosen } from '../../constant/indicator';
import { defaultPlaceHold } from '../../constant/common';
import {
  K_INDICATOR_CONFIG_DICT,
  K_MAIN_INDICATOR_LIST, K_SUB_INDICATOR_LIST,
} from '../../constant/indicator-k';
// import { TIME_MAIN_INDICATOR_LIST, TIME_SUB_INDICATOR_LIST } from '../../constant/indicator-time';

import { judgeColor, getUnitFromHumanNumber, NumberUnitMap } from '../../utils/common';

import { getBaseOfTimeConfig, getTimeConfig, getVolumeOfTime } from '../../helper/time-indicator-dict';
import { getBaseOfKLineConfig, getCandleOfKLineConfig } from '../../helper/k-line-indicator-dict';

import { queryTimeTrend, queryUSTimeTrend } from '../../api/time';
import { queryKline } from '../../api/k';

import './chart.scss';

interface IProps extends Stock {
  periodType: string;
  period: Period;
  candleModle: WeightType;
}

const initialNum = 800; // 首次加载条数
const pushNum = 200; // 推送条数

const isLive = true;
// const refreshTime = 3000;
const themeType = 'white';
const colorMode = 'RAISE_RED_DECLINE_GREEN';
const mini = false;

const t = (v) => v;

const Chart: React.FC<IProps> = (props) => {
  const { periodType, period, candleModle, market, code } = props;
  const chartId = useRef(`chart-${performance.now().toString().replace('.', '')}`);
  const { formatMessage } = useIntl();

  const commodityQuotes = useSubscribeSingleStockQuote(market, code);
  const { dec, prev_close: lastclose, quote_state: quoteState } = commodityQuotes;

  const { wsClient, isWsClientReady } = useQuoteClient();

  // Time chart
  const [timeBaseData, setTimeBaseData] = useGetState<ITimeData>();
  const [timeMainChosenIndicator] = useState<typeIndicatorChosen>([]);
  const [timeSubChosenIndicator, setTimeSubChosenIndicator] = useState<typeIndicatorChosen>([]);

  // K chart
  const [kLineBaseData, setKLineBaseData, getKLineBaseData] = useGetState<IKLineData>({
    timeData: [],
    kLineData: [],
    volumeData: [],
    amountData: [],
    miscData: [],
    dataType: refreshChartTypeEnum.resetData,
  });
  const [kMainChosenIndicator, setKMainChosenIndicator] = useState<typeIndicatorChosen>(['ma']);
  const [kSubChosenIndicator, setKSubChosenIndicator] = useState<typeIndicatorChosen>(['macd']);

  const chartPeriodType = useRef(periodType); // 缓存图表当前的类型，用于判断是否需要销毁重建
  const resizeTimer = useRef<any>(null);
  const chartInstance = useRef<any>(null);
  const maxVol = React.useRef(0);
  const requestLoop = useRef<any>(null);
  const chartOptions = useRef(null);
  const volumeUnit = useRef<string>('');
  const subChosenIndicatorRef = useRef<any>([]);
  const isLayoutInited = useRef<boolean>(true);

  const kMainChosenIndicatorCacheDict = useRef({});
  const kSubChosenIndicatorCacheDict = useRef({});

  const endTime = useRef<string>();
  const queryKlineParams = React.useRef<any>(null);

  const isLoading = useRef<boolean>(false);

  const themeConfig: ITHEME = useMemo(() => {
    const theme = THEME_DICT[themeType] || THEME_DICT.white;
    const color = colorModeMap[colorMode] || colorModeMap.RAISE_RED_DECLINE_GREEN;
    return { ...theme, ...color };
  }, [themeType, colorMode]);

  // Now
  const [
    mainIndicatorList, mainChosenIndicator, setMainChosenIndicator,
    subIndicatorList, subChosenIndicator,
    setSubChosenIndicator,
  ] = useMemo(() => {
    if (periodType === periodTypeDict.time) {
      subChosenIndicatorRef.current = timeSubChosenIndicator;
      return [
        // TIME_MAIN_INDICATOR_LIST, timeMainChosenIndicator, setTimeMainChosenIndicator,
        // TIME_SUB_INDICATOR_LIST, timeSubChosenIndicator,
        setTimeSubChosenIndicator,
      ];
    }

    subChosenIndicatorRef.current = kSubChosenIndicator;
    return [
      K_MAIN_INDICATOR_LIST, kMainChosenIndicator, setKMainChosenIndicator,
      K_SUB_INDICATOR_LIST, kSubChosenIndicator,
      setKSubChosenIndicator,
    ];
  }, [periodType, timeMainChosenIndicator, timeSubChosenIndicator, kMainChosenIndicator, kSubChosenIndicator]);

  const queryPropertyTimeTrend = useMemo<any>(() => (isUSSymbol(market) ? queryUSTimeTrend : queryTimeTrend), [market]);

  const clearChart = () => {
    const selector = {
      [periodTypeDict.time]: () => {
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
      },
      [periodTypeDict.k]: () => {
        setKLineBaseData({
          timeData: [],
          kLineData: [],
          volumeData: [],
          amountData: [],
          miscData: [],
          dataType: refreshChartTypeEnum.resetData,
        });

        kMainChosenIndicatorCacheDict.current = {};
        kSubChosenIndicatorCacheDict.current = {};
      },
    };

    selector[periodType]();
  };

  /**
 * 加载更多历史k线数据
 *
 */
  async function loadMoreKLineData(pageSize?) {
    try {
      isLoading.current = true;
      const result = await queryKLineData(queryDataType.unshift, refreshChartTypeEnum.unshiftData, pageSize);

      setKLineBaseData(result);
    } catch (e) {
      console.warn(e, '获取更多k线数据失败');
    } finally {
      isLoading.current = false;
    }
  }

  const destroyChart = () => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }
  };

  const onChartHeightResize = () => {
    // const clientHeight = get(document.getElementById(chartId.current), 'clientHeight', 0);
    // if (!clientHeight) return;

    // maxIndicators.current = clientHeight > 400 ? 3 : 2;
    // const indicators = [...kSubChosenIndicator];
    // if (indicators.length <= maxIndicators.current) return;
    // const delIndicators = indicators.splice(maxIndicators.current, indicators.length);
    // delIndicators.forEach((v) => {
    //   chartInstance.current.removeGrid(v);
    // });
    // setSubChosenIndicator(indicators);
  };

  const onResizeObserver = () => {
    clearTimeout(resizeTimer.current);
    if (!chartInstance.current) return;
    resizeTimer.current = setTimeout(() => {
      onChartHeightResize();
      chartInstance.current.resize();
    }, 500);
  };

  /**
 * 图表初始化后 根据图表缩放比例补充数据条数
 *
 */
  const initLayoutHanlder = throttle(({ showCount }) => {
    setTimeout(() => { isLayoutInited.current = true; }, 500);

    if (isLoading.current || !kLineBaseData) return;

    const { timeData } = getKLineBaseData();
    const len = timeData.length;
    if (len < initialNum) return;
    const num = showCount - len;

    if (num < 0) return;

    if (num < 1000) {
      loadMoreKLineData(Math.max(num, pushNum));
      return;
    }

    const count = Math.ceil(num / initialNum);
    for (let i = 0; i < count; i += 1) {
      const size = num - i * initialNum;
      loadMoreKLineData(Math.min(size, initialNum));
    }
  }, 60, { leading: false });

  const queryTimeData = async function queryTimeData(dataType) {
    let timeRes: any = { tendency: { data: [] }, timeList: [] };

    try {
      timeRes = await queryPropertyTimeTrend(
        wsClient,
        {
          market,
          code,
          quoteState,
          isLive,
        },
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
      // setIsChartLoading(true);
    }

    const lastClose = Number(toFixed(lastclose, { precision: dec }));

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

    // const max = Math.max.apply(
    //   null,
    //   data.map((v) => v.volume),
    // );
    // const unit = getUnitFromHumanNumber(humanNumber(max, 2));
    // volumeUnit.current = unit;
    // const exponent = NumberUnitMap[unit] || 1;

    data.forEach((item: any, index) => {
      const nextIndex = index + 1;
      const price = toFixed(item.close, dec);
      const avg = toFixed(item.avg, dec);
      const floatValue = +price - lastClose;
      const floatRate = floatValue / lastClose;
      const volume = item.volume / 10;
      const floatColorField = judgeColor(floatValue, 0);
      const avgColorField = judgeColor(avg, lastClose);

      result.priceData[nextIndex] = price;
      result.avgData[nextIndex] = avg;
      result.volumeData[nextIndex] = volume;
      result.miscData[nextIndex] = {
        floatRate: toPercent(floatRate),
        floatValue: toFixed(floatValue, dec),
        amount: item.amount,
        floatColorField,
        avgColorField,
        volume: item.volume,
      };
    });

    setTimeBaseData({ ...result });
    // setIsChartLoading(false);
    return result;
  };

  /**
 * 取消选择副图指标
 *
 */
  // const onDeselectSubIndicator = (v) => {
  //   chartInstance.current.removeGrid(v.key);
  //   setSubChosenIndicator(v.selectedKeys);
  // };

  /**
   * 取消选择副图指标-来自图表
   *
   */
  const onDeselectSubIndicatorFromChart = (v: string) => {
    chartInstance.current.removeGrid(v);
    const deleteIndex = subChosenIndicatorRef.current.indexOf(v);

    if (deleteIndex !== -1) {
      subChosenIndicatorRef.current.splice(deleteIndex, 1);
      setSubChosenIndicator([...subChosenIndicatorRef.current]);
    }
  };

  /**
 * 获取配置
 *
 */
  function getIndicatorConfig(key: string, cacheDict: any) {
    const info = {
      commodityQuotes,
      baseData: kLineBaseData,
      themeConfig,
      closeCallback: onDeselectSubIndicatorFromChart,
      volumeUnit: volumeUnit.current,
    };

    const cacheValue = cacheDict.current[key];
    let value = null;

    if (cacheValue) {
      value = cacheValue;
    } else {
      value = K_INDICATOR_CONFIG_DICT[key](info, { mini }, t);
      cacheDict.current[key] = value;
    }

    return value;
  }

  /**
 * 加载K线数据
 *
 */
  const queryKLineData = async function queryKLineData(queryType, dataType, pageSize?) {
    isLoading.current = true;
    if (!queryKlineParams.current) {
      return Promise.reject();
    }

    const { market: m, code: c, period: p } = queryKlineParams.current;

    const rs = await queryKline({
      wsClient,
      market: m,
      code: c,
      period: p,
      count: pageSize || pushNum,
      adjMode: candleModle,
      endTime: queryType === queryDataType.push ? '' : endTime.current,
    });

    const result: IKLineData = {
      timeData: [],
      kLineData: [],
      volumeData: [],
      amountData: [],
      miscData: [],
      dataType,
    };

    let internaLastClose: number;

    if (!rs.length) {
      // clearChart();
      return Promise.reject();
    }

    const max = maxVol.current || Math.max.apply(null, rs.map((v) => v.volume));
    maxVol.current = max;
    const unit = getUnitFromHumanNumber(humanNumber(max, 2));
    const exponent = NumberUnitMap[unit] || 1;

    volumeUnit.current = unit;
    rs.forEach((item) => {
      let floatColorField;
      let openColorField;
      let closeColorField;
      let highColorField;
      let lowColorField;
      const open = toFixed(item.open, dec);
      const close = toFixed(item.close, dec);
      const high = toFixed(item.high, dec);
      const low = toFixed(item.low, dec);

      const volume = item.volume / (10 ** exponent);
      let floatRate = defaultPlaceHold;
      let floatValue = defaultPlaceHold;
      let zhenfu = defaultPlaceHold;

      if (internaLastClose) {
        floatValue = toFixed(+close - internaLastClose, dec);
        floatRate = toPercent(+floatValue / internaLastClose);
        zhenfu = toPercent((+high - +low) / internaLastClose);

        floatColorField = judgeColor(floatValue, 0);
        openColorField = judgeColor(open, internaLastClose);
        closeColorField = judgeColor(close, internaLastClose);
        highColorField = judgeColor(high, internaLastClose);
        lowColorField = judgeColor(low, internaLastClose);
      }

      result.kLineData.push([
        open, high, low, close,
      ]);

      const barColorField = judgeColor(close, open);

      result.amountData.push(toFixed(item.amount / 100000000, dec));
      result.volumeData.push(volume);
      result.timeData.push(item.time);

      result.miscData.push({
        floatRate,
        floatValue,
        amount: humanNumber(item.amount, 2),
        floatColorField,
        highColorField,
        lowColorField,
        openColorField,
        closeColorField,
        barColorField,
        isRise: close < open,
        volume: `${humanNumber(item.volume, 2)}`,
        zhenfu,
        open,
        high,
        low,
        close,
      });

      internaLastClose = item.close;
    });

    if (queryType !== queryDataType.push) {
      endTime.current = rs[0].time;
    }

    const resultDict = {
      [queryDataType.create]: {
        action: (key) => result[key],
      },
      [queryDataType.push]: {
        action: (key) => {
          if (!getKLineBaseData()) return;
          result[key] = [...getKLineBaseData()[key].slice(0, -pushNum), ...result[key]];
        },
      },
      [queryDataType.unshift]: {
        action: (key) => {
          if (!getKLineBaseData()) return;
          result[key] = [...result[key], ...getKLineBaseData()[key]];
        },
      },
    };

    const { action } = resultDict[queryType];
    Object.keys(result).forEach((key) => {
      if (Array.isArray(result[key])) action(key);
    });

    return result;
  };

  /**
 * 获取图表基本数据
 *
 */
  useEffect(() => {
    maxVol.current = 0;
    if (!period || !periodType) return;

    if ((!market && !code) || !lastclose) {
      if (chartInstance.current) {
        clearChart();
      }

      return;
    }

    queryKlineParams.current = { market, code, period };

    if (!isWsClientReady) return;
    let cancel = false;

    clearInterval(requestLoop.current);

    async function queryTimeDataRes(type = refreshChartTypeEnum.resetData) {
      const data = await queryTimeData(type);

      if (cancel || !data) return;

      setTimeBaseData(data);
    }

    async function queryKLineDataRes(queryType = queryDataType.create, dataType = refreshChartTypeEnum.resetData) {
      try {
        const isPush = queryType === queryDataType.push;
        const data = await queryKLineData(queryType, dataType, isPush ? pushNum : initialNum);
        console.log(data, '<-- data');
        if (cancel || !data) return;

        setKLineBaseData(data);
      } catch (e) {
        console.warn(e, '获取k线数据失败');
      } finally {
        isLoading.current = false;
      }
    }

    const selector = {
      [periodTypeDict.time]: () => {
        queryTimeDataRes();

        // 无实时行情权限不订阅图表数据
        // if (quoteLevel === QuoteLevel.DELAY || isBmp) return;
        // requestLoop.current = setInterval(() => {
        //   queryTimeDataRes(refreshChartTypeEnum.pushData);
        // }, refreshTime);
      },
      [periodTypeDict.k]: async function queryData() {
        endTime.current = '';
        queryKLineDataRes();

        // if (period > 6) return;

        // requestLoop.current = setInterval(() => {
        //   queryKLineDataRes(queryDataType.push, refreshChartTypeEnum.pushData);
        // }, refreshTime);
      },
    };

    selector[periodType]();

    // eslint-disable-next-line consistent-return
    return () => {
      cancel = true;

      clearInterval(requestLoop.current);
    };
  }, [period, periodType, `${market}${code}${lastclose}`, candleModle, themeConfig, isWsClientReady]);

  /**
   * 生成股票分时图
   */
  useEffect(() => {
    if (chartPeriodType.current !== periodTypeDict.time && chartInstance.current) {
      destroyChart();
    }

    if (!timeBaseData) return;

    const info = {
      commodityQuotes,
      baseData: timeBaseData,
      themeConfig,
      // volumeUnit: volumeUnit.current,
      volumeUnit: '万',
    };

    const baseConfig = getBaseOfTimeConfig(info, { chartId: `#${chartId.current}`, formatMessage });
    const timeConfig = getTimeConfig(info, { formatMessage });
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

    chartPeriodType.current = periodType;
  }, [timeBaseData, formatMessage]);

  /**
 * 切换股票生成K线图
 *
 */
  useEffect(() => {
    if (chartPeriodType.current !== periodTypeDict.k && chartInstance.current) {
      destroyChart();
    }

    if (!kLineBaseData.timeData.length) return;

    const info = {
      commodityQuotes,
      baseData: kLineBaseData,
      themeConfig,
      volumeUnit: volumeUnit.current,
    };
    const perTickWidth = mini ? undefined : CacheStore.getItem('perTickWidth');
    const baseConfig = getBaseOfKLineConfig(
      info,
      { chartId: `#${chartId.current}`, period, perTickWidth, formatMessage },
    );
    const candleConfig = getCandleOfKLineConfig(info);
    const mainIndicatorConfigList: any[] = [];
    const subIndicatorConfigList: any[] = [];

    kMainChosenIndicator.forEach((item) => {
      mainIndicatorConfigList.push(getIndicatorConfig(item, kMainChosenIndicatorCacheDict));
    });

    mainIndicatorConfigList.forEach((item) => {
      candleConfig.series.push(...item.series);
      candleConfig.header = item.header;
    });

    kSubChosenIndicator.forEach((item) => {
      subIndicatorConfigList.push(getIndicatorConfig(item, kSubChosenIndicatorCacheDict));
    });

    baseConfig.grids = [candleConfig, ...subIndicatorConfigList];
    chartOptions.current = baseConfig;

    if (!chartInstance.current) {
      chartInstance.current = new QuoteChart(baseConfig);
    } else {
      const dict = {
        [refreshChartTypeEnum.unshiftData]() {
          chartInstance.current.refreshByUnshiftData(baseConfig);
        },
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

      dict[kLineBaseData.dataType]();
    }

    isLoading.current = false;

    chartInstance.current.on(MAIN_HOOK_DICT.ONDRAG, async ({ startIndex }) => {
      if (isLoading.current || !isLayoutInited.current) return;

      if (startIndex < 100) {
        loadMoreKLineData(pushNum);
      }
    });

    chartInstance.current.on(MAIN_HOOK_DICT.ONZOOM, async ({ startIndex, showCount, perTickWidth: tickWidth }) => {
      if (isLoading.current) return;

      if (tickWidth === CacheStore.getItem('perTickWidth')) return;

      CacheStore.setItem('perTickWidth', tickWidth);
      if (startIndex < 100) {
        const { timeData } = kLineBaseData;
        const num = showCount - timeData.length;
        if (num < 0) return;
        loadMoreKLineData(Math.max(num, pushNum));
      }
    });

    chartInstance.current.on(MAIN_HOOK_DICT.LAYOUTFINISHED, () => initLayoutHanlder);

    chartPeriodType.current = periodType;
  }, [kLineBaseData, formatMessage]);

  return (
    <div styleName="chart-x">
      <ResizeObserver onResize={onResizeObserver}>
        <div id={chartId.current} styleName="chart" />
      </ResizeObserver>
    </div>
  );
};

export default memo(Chart);
