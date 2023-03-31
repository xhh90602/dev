import React, { useRef, useMemo, useState, useEffect, memo, useContext } from 'react';
import { throttle, get } from 'lodash-es';
import { CacheStore } from '@dz-web/cache';
import { useIntl } from 'react-intl';
import { useGetState } from 'ahooks';
import { QuoteChart, MAIN_HOOK_DICT } from '@dz-web/quote-chart-mobile';
import { toFixed, toPercent, toUnit } from '@dz-web/o-orange';
import ResizeObserver from 'rc-resize-observer';
import type { Stock } from '@dz-web/quote-client';
import { useQuoteClient, useSubscribeSingleStockQuote } from '@dz-web/quote-client-react';
import { Toast } from 'antd-mobile';

import { useGetUserConfig, useGetChartIndicatorParamsList } from '@/helpers/multi-platforms';

import { USERCONFIG_SETTINGS } from '@/constants/config';
import { ITimeData, IKLineData, queryDataType, refreshChartTypeEnum } from '../../constant/chart-type';
import { THEME_DICT, ITHEME, colorModeMap } from '../../constant/chart-theme';
import { periodTypeDict } from '../../constant/period';
import { typeIndicatorChosen } from '../../constant/indicator';
import { defaultPlacehold } from '../../constant/common';
import {
  K_INDICATOR_CONFIG_DICT,
  K_MAIN_INDICATOR_LIST, K_SUB_INDICATOR_LIST,
  K_MAIN_INDICATOR_DICT, K_SUB_INDICATOR_DICT,
} from '../../constant/indicator-k';
// import { TIME_MAIN_INDICATOR_LIST, TIME_SUB_INDICATOR_LIST } from '../../constant/indicator-time';

// import IndicatorMenu from '../indicator-menu/indicator-menu';

import { judgeColor, getUnitFromHumanNumber, NumberUnitMap } from '../../utils/common';

import { quoteChartContext } from '../../contexts/quote-chart';

import { getBaseOfTimeConfig, getTimeConfig, getVolumeOfTime } from '../../helper/time-indicator-dict';
import {
  getBaseOfKLineConfig, getCandleOfKLineConfig, IKlineIndicatorParams,
} from '../../helper/k-line-indicator-dict';

import { queryIntradayWrap } from '../../api/time';
import { fetchKLine } from '../../api/k';

// import IndicatorSetting from '../indicator-setting/indicator-setting';

import './chart.scss';

interface IProps extends Stock {
  defaultKMainChosenIndicator?: K_MAIN_INDICATOR_DICT[];
  defaultKSubChosenIndicator?: K_SUB_INDICATOR_DICT[];
}

export const MAIN_GRID_ID = 'k-line';
const initialNum = 800; // 首次加载条数
const pushNum = 200; // 推送条数
const maxMainIndicatorsLen = 3;
const maxSubIndicatorsLen = 5;
const { upDownColor: upDownColorkey } = USERCONFIG_SETTINGS;

const isLive = true;
const refreshTime = 3000;

const Chart: React.FC<IProps> = (props) => {
  const {
    defaultKMainChosenIndicator, defaultKSubChosenIndicator,
  } = props;
  const {
    market: marketId, code, isShowIndicatorMenu, periodType, period, candleModle, USIntradayType,
  } = useContext(quoteChartContext);

  const chartId = useRef(`chart-${performance.now().toString().replace('.', '')}`);
  const userConfig = useGetUserConfig();
  const riseColor = userConfig[upDownColorkey];
  const { formatMessage } = useIntl();

  const commodityQuotes = useSubscribeSingleStockQuote(marketId || 0, code || '');
  const { dec, prevClose, quoteState } = commodityQuotes;

  const { wsClient, isWsClientReady } = useQuoteClient();

  const chartIndicatorParamsList = useGetChartIndicatorParamsList();

  // Time chart
  const [timeBaseData, setTimeBaseData] = useGetState<ITimeData>();
  const [timeMainChosenIndicator] = useState<typeIndicatorChosen>([]);
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [timeSubChosenIndicator, setTimeSubChosenIndicator] = useState<typeIndicatorChosen>([]);

  // K chart
  const [kLineBaseData, setKLineBaseData, getKLineBaseData] = useGetState<IKLineData>();
  const [kMainChosenIndicator, setKMainChosenIndicator] = useState<typeIndicatorChosen>(
    defaultKMainChosenIndicator || [K_MAIN_INDICATOR_DICT.MA],
  );
  const [kSubChosenIndicator, setKSubChosenIndicator] = useState<typeIndicatorChosen>(
    defaultKSubChosenIndicator || [K_SUB_INDICATOR_DICT.VOL],
  );

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
    if (!userConfig.theme) return {};

    const theme = THEME_DICT[userConfig.theme];
    const color = colorModeMap[riseColor] || colorModeMap.red;
    return { ...theme, ...color };
  }, [userConfig.theme, riseColor]);

  // Now
  const [
    mainIndicatorList, mainChosenIndicator, setMainChosenIndicator,
    subIndicatorList, subChosenIndicator,
    setSubChosenIndicator,
  ] = useMemo<any[]>(() => {
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
          market: marketId,
          dataType: refreshChartTypeEnum.resetData,
          tickIntervalList: [],
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
    const clientHeight = get(document.getElementById(chartId.current), 'clientHeight', 0);
    if (!clientHeight) return undefined;

    // maxIndicators.current = clientHeight > 400 ? 3 : 2;
    // const indicators = [...kSubChosenIndicator];
    // if (indicators.length <= maxIndicators.current) return;
    // const delIndicators = indicators.splice(maxIndicators.current, indicators.length);
    // delIndicators.forEach((v) => {
    //   chartInstance.current.removeGrid(v);
    // });
    // setSubChosenIndicator(indicators);
    return undefined;
  };

  const onResizeObserver = () => {
    clearTimeout(resizeTimer.current);
    if (!chartInstance.current) return;
    resizeTimer.current = setTimeout(() => {
      chartInstance.current.resize();
      onChartHeightResize();
    }, 500);
  };

  /**
 * 图表初始化后 根据图表缩放比例补充数据条数
 *
 */
  const initLayoutHanlder = throttle(({ showCount }) => {
    setTimeout(() => { isLayoutInited.current = true; }, 500);
    const kLineData = getKLineBaseData();
    if (isLoading.current || !kLineData) return;

    const { timeData } = kLineData;
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
    let timeRes: any = { tendency: { list: [] }, timeList: [] };

    try {
      timeRes = await queryIntradayWrap(
        wsClient,
        {
          period: +period,
          market: marketId,
          code,
          quoteState,
          isLive,
          range: USIntradayType,
        },
      );
    } catch (err) {
      console.log(err, '<-- queryTimeTrend');
    }

    const { tickList, timeList, tickIntervalList } = timeRes;

    if (!tickList?.length) {
      clearChart();
      setIsChartLoading(false);
      return undefined;
    }

    if (dataType === refreshChartTypeEnum.resetData) {
      setIsChartLoading(true);
    }

    const lastClose = Number(toFixed(prevClose, { precision: dec }));

    const result: ITimeData = {
      priceData: [],
      volumeData: [],
      avgData: [],
      timeData: [],
      miscData: [],
      tickIndexList: [],
      code,
      market: marketId,
      dataType,
      tickIntervalList,
    };

    if (tickIntervalList.length > 1) {
      // result.timeData = timeList;
      result.tickIndexList = tickIntervalList;
    } else {
      timeList.forEach((timeItem, index) => {
        result.timeData[index] = timeItem;

        if (index % 30 === 0) {
          result.tickIndexList.push(index);
        }
      });
    }

    timeList.forEach((timeItem, index) => {
      result.timeData[index] = timeItem;

      if (tickIntervalList.length === 1 && index % 30 === 0) {
        result.tickIndexList.push(index);
      }
    });

    const max = Math.max.apply(
      null,
      tickList.map((v) => v.volume),
    );
    const unit = getUnitFromHumanNumber(toUnit(max, { precision: 2 }));
    volumeUnit.current = unit;
    const exponent = NumberUnitMap[unit] || 1;

    tickList.forEach((item: any, index) => {
      const price = toFixed(item.close, dec);
      const avg = toFixed(item.avg, dec);
      const floatValue = +price - lastClose;
      const floatRate = lastClose ? (floatValue / lastClose) * 100 : 0;
      const volume = item.volume / (10 ** exponent);
      const floatColorField = judgeColor(floatValue, 0);
      const avgColorField = judgeColor(avg, lastClose);

      result.priceData[index] = price;
      result.avgData[index] = avg;
      result.volumeData[index] = volume;
      result.miscData[index] = {
        floatRate: toPercent(floatRate),
        floatValue: toFixed(floatValue, dec),
        amount: `${toUnit(item.amount, { precision: 2 })}`,
        floatColorField,
        avgColorField,
        volume: `${toUnit(item.volume, { precision: 2 })}`,
      };
    });

    setTimeBaseData({ ...result });
    setIsChartLoading(false);
    return result;
  };

  /**
 * 选择主图指标
 *
 */
  const onSelectMainIndicator = (v) => {
    if (v.selectedKeys.length > maxMainIndicatorsLen) {
      Toast.show(formatMessage({ id: 'chart_main_indicators_max_num_limits' }));

      return;
    }

    const info: IKlineIndicatorParams = {
      commodityQuotes,
      baseData: kLineBaseData as IKLineData,
      themeConfig,
      volumeUnit: volumeUnit.current,
      formatMessage,
    };

    if (!chartOptions.current) return;

    const candleConfig = getCandleOfKLineConfig(info);

    v.selectedKeys.forEach((item) => {
      const option: any = getIndicatorConfig(item, kMainChosenIndicatorCacheDict);
      candleConfig.series.push(...option.series);
      candleConfig.header.options.push(option.header.options);
    });

    chartInstance.current.replaceGrid(MAIN_GRID_ID, candleConfig);
    setMainChosenIndicator(v.selectedKeys);
  };

  /**
   * 取消选择主图指标
   *
   */
  const onDeselectMainIndicator = (v) => {
    onSelectMainIndicator(v);
  };

  /**
   * 选择副图指标
   *
   */
  const onSelectSubIndicator = (v) => {
    if (v.selectedKeys.length > maxSubIndicatorsLen) {
      Toast.show(formatMessage({ id: 'chart_indicators_max_num_limits' }));

      return;
    }

    const option = getIndicatorConfig(v.key, kSubChosenIndicatorCacheDict);
    chartInstance.current.addGrid(option);
    setSubChosenIndicator(v.selectedKeys);
  };

  /**
 * 取消选择副图指标
 *
 */
  const onDeselectSubIndicator = (v) => {
    chartInstance.current.removeGrid(v.key);
    setSubChosenIndicator(v.selectedKeys);
  };

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
      baseData: getKLineBaseData(),
      themeConfig,
      closeCallback: onDeselectSubIndicatorFromChart,
      volumeUnit: volumeUnit.current,
      chartIndicatorParamsList: chartIndicatorParamsList[key],
    };

    const cacheValue = cacheDict.current[key];
    let value = null;

    if (cacheValue && cacheValue.length) {
      value = cacheValue;
    } else {
      value = K_INDICATOR_CONFIG_DICT[key](info, { formatMessage });
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

    if (dataType === refreshChartTypeEnum.resetData) {
      setIsChartLoading(true);
    }

    const { marketId: m, code: c, period: p } = queryKlineParams.current;

    const rs = await fetchKLine({
      wsClient,
      market: m,
      code: c,
      period: p,
      count: pageSize || pushNum,
      adjMode: candleModle,
      endTime: queryType === queryDataType.push ? '' : endTime.current,
    });

    // 请求历史的时候，会把endTime又返回回来，在这里截取掉
    if (queryType === queryDataType.unshift && rs) {
      rs.splice(-1, 1);
    }

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
    const unit = getUnitFromHumanNumber(toUnit(max, { precision: 2 }));
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
      let floatRate = defaultPlacehold;
      let floatValue = defaultPlacehold;
      let zhenfu = defaultPlacehold;

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
        amount: toUnit(item.amount, { precision: 2 }),
        floatColorField,
        highColorField,
        lowColorField,
        openColorField,
        closeColorField,
        barColorField,
        isRise: +close > +open,
        volume: `${toUnit(item.volume, { precision: 2 })}`,
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
          const data = getKLineBaseData();
          if (!data) return;

          result[key] = [...data[key].slice(0, -pushNum), ...result[key]];
        },
      },
      [queryDataType.unshift]: {
        action: (key) => {
          const data = getKLineBaseData();
          if (!data) return;

          result[key] = [...result[key], ...data[key]];
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
    console.log(period, periodType, marketId, code, '<-- period99');
    if (!period || !periodType) return;

    clearChart();
    if ((!marketId && !code)) {
      return;
    }

    setIsChartLoading(true);
    queryKlineParams.current = { marketId, code, period };

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
        if (cancel || !data) return;

        setKLineBaseData(data);
      } catch (e) {
        console.warn(e, '获取k线数据失败');
      } finally {
        setIsChartLoading(false);
        isLoading.current = false;
      }
    }

    const selector = {
      [periodTypeDict.time]: () => {
        queryTimeDataRes();

        // 无实时行情权限不订阅图表数据
        requestLoop.current = setInterval(() => {
          queryTimeDataRes(refreshChartTypeEnum.pushData);
        }, refreshTime);
      },
      [periodTypeDict.k]: async function queryData() {
        endTime.current = '';
        queryKLineDataRes();

        // if (period > 6) return;

        requestLoop.current = setInterval(() => {
          queryKLineDataRes(queryDataType.push, refreshChartTypeEnum.pushData);
        }, refreshTime);
      },
    };

    selector[periodType]();

    // eslint-disable-next-line consistent-return
    return () => {
      cancel = true;

      clearInterval(requestLoop.current);
    };
  }, [period, periodType, USIntradayType, `${marketId}${code}${prevClose}`, candleModle, themeConfig, isWsClientReady]);

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
      formatMessage,
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

  useEffect(() => {
    const data = getKLineBaseData();
    if (!data) return;

    data.dataType = refreshChartTypeEnum.resetData;
    setKLineBaseData({ ...data });
  }, [chartIndicatorParamsList]);

  /**
 * 切换股票生成K线图
 *
 */
  useEffect(() => {
    if (chartPeriodType.current !== periodTypeDict.k && chartInstance.current) {
      destroyChart();
    }

    if (!kLineBaseData) return;

    const info = {
      commodityQuotes,
      baseData: kLineBaseData,
      themeConfig,
      volumeUnit: volumeUnit.current,
      formatMessage,
      chartIndicatorParamsList: [],
    };
    const perTickWidth = CacheStore.getItem('perTickWidth');

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
      candleConfig.header.options.push(item.header.options);
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
      {/* <Spin spinning={isChartLoading} delay={300}> */}
      <ResizeObserver onResize={onResizeObserver}>
        <div id={chartId.current} styleName="chart" />
      </ResizeObserver>
      {/* </Spin> */}

      {/* {
        (periodType !== periodTypeDict.time && isShowIndicatorMenu)
        && (
          <div styleName="indicator-tabs">
            <IndicatorMenu
              list={mainIndicatorList}
              selectedKeys={mainChosenIndicator}
              onSelect={onSelectMainIndicator}
              onDeselect={onDeselectMainIndicator}
            />

            <IndicatorMenu
              list={subIndicatorList}
              selectedKeys={subChosenIndicator}
              onSelect={onSelectSubIndicator}
              onDeselect={onDeselectSubIndicator}
            />

            <IndicatorSetting />
          </div>
        )
      } */}
    </div>
  );
};

Chart.defaultProps = {
  defaultKMainChosenIndicator: undefined,
  defaultKSubChosenIndicator: undefined,
};

export default memo(Chart);
