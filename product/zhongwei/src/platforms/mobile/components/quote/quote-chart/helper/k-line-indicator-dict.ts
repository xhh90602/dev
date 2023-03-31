import dayjs from 'dayjs';
import { CandleChart, LineChart, BarChart, CircleChart } from '@dz-web/quote-chart-mobile';
import {
  calcIndicatorOfMA,
  calcIndicatorOfMACD,
  calcIndicatorOfBoll,
  calcIndicatorOfEMA,
  calcIndicatorOfSMA,
  calcIndicatorOfSAR,
  calcIndicatorOfRSI,
  calcIndicatorOfKDJ,
  calcIndicatorOfDMA,
} from '@dz-web/quote-indicator';
import { toUnit } from '@dz-web/o-orange';

import { ICommonParams } from '../constant/indicator-type';
import { IKLineData } from '../constant/chart-type';

import { EMPTY_FN } from '../constant/common';
import { K_SUB_INDICATOR_DICT, K_MAIN_INDICATOR_DICT } from '../constant/indicator-k';
import { specialNumToFixed } from '../utils/common';
// import { remToPx } from '../utils/rem';

export const MAIN_GRID_ID = 'k-line';

export interface IKlineIndicatorParams extends ICommonParams {
  baseData: IKLineData;
  chartIndicatorParamsList: number[];
}

interface IBaseExtraInfo {
  formatMessage: any;
}
interface IExtraInfo extends IBaseExtraInfo {
  chartId: string;
  period: number | string;
  perTickWidth: number;
}

function customLimit(min, max, dec) {
  const gap = max - min;

  if (gap > 1) {
    return gap * 0.1;
  }

  return Math.max(10 ** -dec, gap * 0.1);
}

const defaultPerTickWidth = 7;
const headerHeight = 22;
const mainHeight = 150;
const auxHeight = 70;
const fontSize = 10;

// headerHeight = remToPx(0.22);
// mainHeight = remToPx(2);
// auxHeight = remToPx(1);
// fontSize = remToPx(0.1);

export function getBaseOfKLineConfig(info: IKlineIndicatorParams, extraInfo: IExtraInfo): any {
  const {
    baseData: { timeData, miscData },
    themeConfig,
  } = info;

  const { chartId, formatMessage, period, perTickWidth } = extraInfo;
  const cacheDateList = [];

  return {
    selector: chartId,
    textStyle: {
      color: themeConfig.textColor,
    },
    splitLine: {
      lineStyle: {
        color: themeConfig.splitLineColor,
      },
    },
    valueAxis: {
      maxTickDistance: 40,
      textStyle: {
        color: '#656565',
      },
      borderLine: {
        lineStyle: {
          color: themeConfig.splitLineColor,
        },
      },
      right: {
        show: false,
      },
    },
    axisPointer: {
      textStyle: {
        color: themeConfig.textColor,
      },
      style: {
        borderColor: themeConfig.axisPointerBorderColor,
        backgroundColor: themeConfig.axisPointerBackgroundColor,
      },
      formatter: (value) => ({ label: specialNumToFixed(value) }),
    },
    grids: [],
    categoryAxis: {
      maxTickDistance: 100,
      gap: [0, 1, 0, 1],
      data: timeData,
      formatter: (value, index) => {
        if (!value) return undefined;

        if (index === 0) {
          cacheDateList.length = 0;
        }

        // if (period <= KLineType.M60) {
        //   const tempLabel = dayjs(value).format('MM/DD');

        //   if (cacheDateList.indexOf(tempLabel) === -1) {
        //     const label = tempLabel;
        //     cacheDateList.push(label);

        //     return { label };
        //   }
        // }else if (period === KLineType.DAY) {
        //   if (index === 0) {
        //     return { label: dayjs(value).format('YYYY/MM/DD') };
        //   }

        //   return { label: dayjs(value).format('MM/DD') };
        // } else {
        //   return { label: dayjs(value).format('YYYY/MM') };
        // }

        return { label: dayjs(value).format('YYYY/MM') };
      },
      axisPointer: {
        formatter: (value) => {
          if (!value) return undefined;

          // if (period <= KLineType.M60) {
          //   return { label: dayjs(value).format('MM/DD HH:mm') };
          // }

          return { label: dayjs(value).format('YYYY/MM/DD') };
        },
      },
    },
    dataZoom: {
      type: 'width',
      defaultTickWidth: perTickWidth || defaultPerTickWidth,
      maxTickWidth: 30,
      minTickWidth: 1,
    },
    tooltip: {
      show: true,
      dataProvider: (i: number) => {
        const {
          open,
          close,
          high,
          low,
          openColorField,
          closeColorField,
          highColorField,
          lowColorField,
          floatValue,
          floatRate,
          floatColorField,
          volume,
          amount,
          zhenfu,
        } = miscData[i] || {};

        const openColor = themeConfig[openColorField];
        const closeColor = themeConfig[closeColorField];
        const highColor = themeConfig[highColorField];
        const lowColor = themeConfig[lowColorField];
        const floatColor = themeConfig[floatColorField];

        return [
          {
            label: '',
            value: timeData[i] && dayjs(timeData[i]).format(period <= 5 ? 'YYYY/MM/DD HH:mm' : 'YYYY/MM/DD'),
          },
          {
            label: formatMessage({ id: 'today_open' }),
            value: open,
            color: openColor,
          },
          {
            label: formatMessage({ id: 'close' }),
            value: close,
            color: closeColor,
          },
          {
            label: formatMessage({ id: 'high' }),
            value: high,
            color: highColor,
          },
          {
            label: formatMessage({ id: 'low' }),
            value: low,
            color: lowColor,
          },
          {
            label: formatMessage({ id: 'price_change_rate' }),
            value: floatRate,
            color: floatColor,
          },
          {
            label: formatMessage({ id: 'price_change' }),
            value: floatValue,
            color: floatColor,
          },
          {
            label: formatMessage({ id: 'volume' }),
            value: volume,
            staticColor: true,
          },
          {
            label: formatMessage({ id: 'turnover' }),
            value: amount,
            staticColor: true,
          },
          {
            label: formatMessage({ id: 'amplitude' }),
            value: zhenfu,
            staticColor: true,
          },
        ];
      },
    },
  };
}

export function getCandleOfKLineConfig(info: IKlineIndicatorParams): any {
  const {
    commodityQuotes: { dec },
    baseData: { kLineData, miscData },
    themeConfig,
  } = info;

  return {
    id: MAIN_GRID_ID,
    height: mainHeight,
    precision: dec,
    header: {
      show: true,
      options: [
        {
          showCloseBtn: false,
          showZoomInBtn: true,
          showZoomOutBtn: true,
        },
      ],
    },
    valueAxis: {
      splitNumber: 8,
      min: (min, max) => (min - customLimit(min, max, dec)).toFixed(dec),
      max: (min, max) => (max + customLimit(min, max, dec)).toFixed(dec),
      borderLine: {
        lineStyle: {
          color: themeConfig.splitLineColor,
        },
      },
      formatter: (value) => ({ label: specialNumToFixed(value) }),
    },
    series: [
      {
        generator: CandleChart,
        options: {
          textStyle: {
            color: themeConfig.textColor,
          },
          formatter: (_, index) => {
            const { isRise, barColorField } = miscData[index];

            return {
              style: { color: themeConfig[barColorField], fill: isRise },
            };
          },
        },
        data: kLineData,
      },
    ],
  };
}

export function getMaOfKLineConfig(info: IKlineIndicatorParams): any {
  const {
    commodityQuotes: { dec },
    baseData,
    chartIndicatorParamsList,
  } = info;

  const indicatorParamsData = baseData.kLineData.map((item) => +item[3]);
  const colorMap = ['#f58f24', '#1e9afc', '#2acee6', '#f96e25'];
  const seriesList = chartIndicatorParamsList.map((v, i) => ({
    key: `MA${v}:`,
    data: calcIndicatorOfMA(indicatorParamsData, { dec, period: v }),
    color: colorMap[i],
  }));

  return {
    id: MAIN_GRID_ID,
    precision: dec,
    seriesKey: K_MAIN_INDICATOR_DICT.MA,
    header: {
      show: true,
      height: headerHeight,
      options: {
        title: 'MA',
        showCloseBtn: false,
        showZoomInBtn: true,
        showZoomOutBtn: true,
        dataProvider(i: number) {
          return seriesList.map((v) => ({
            label: v.key,
            value: v.data[i],
            color: v.color,
            staticColor: true,
          }));
        },
      },
    },
    valueAxis: {
      boundaryGap: [0, 0],
      splitNumber: 3,
    },
    series: seriesList.map((v) => ({
      generator: LineChart,
      type: 'main-auxiliary',
      options: {
        lineStyle: {
          color: v.color,
        },
      },
      data: v.data,
    })),
  };
}

export function getSarOfKLineConfig(info: IKlineIndicatorParams): any {
  const {
    commodityQuotes: { dec },
    baseData: { kLineData },
    themeConfig,
    chartIndicatorParamsList = [],
  } = info;

  const [period, step, max] = chartIndicatorParamsList;
  const high: number[] = [];
  const low: number[] = [];
  kLineData.forEach((item) => {
    high.push(+item[1]);
    low.push(+item[2]);
  });
  const BB = calcIndicatorOfSAR({ high, low }, { dec, period, step, max });

  return {
    id: MAIN_GRID_ID,
    precision: dec,
    seriesKey: K_MAIN_INDICATOR_DICT.SAR,
    header: {
      options: {

        title: `SAR(${period}, ${step}, ${max})`,
        dataProvider(i: number) {
          let color;
          const value = BB[i];
          const openPrice = (kLineData[i] || [])[0];

          if (value < openPrice) {
            color = themeConfig?.riseColor;
          } else if (value > openPrice) {
            color = themeConfig?.fallColor;
          }

          return [
            {
              label: 'SAR:',
              value: BB[i],
              color,
            },
          ];
        },
      },
    },
    valueAxis: {
      boundaryGap: [0, 0],
      splitNumber: 3,
    },
    series: [
      {
        generator: CircleChart,
        options: {
          style: {
            color: themeConfig?.riseColor,
            fill: false,
          },
          formatter(_, i: number) {
            let color;
            const value = BB[i];
            const openPrice = kLineData[i][0];

            if (value < openPrice) {
              color = themeConfig?.riseColor;
            } else if (value > openPrice) {
              color = themeConfig?.fallColor;
            }

            return { style: { color } };
          },
        },
        data: BB,
      },
    ],
  };
}

export function getEmaOfKLineConfig(info: IKlineIndicatorParams): any {
  const {
    commodityQuotes: { dec },
    baseData,
    chartIndicatorParamsList = [],
  } = info;

  const indicatorParamsData = baseData.kLineData.map((item) => +item[3]);
  const colorMap = ['#f58f24', '#1b98fc', '#de339f', '#2acee6', '#fb5f00', '#2ca569'];
  const seriesList = chartIndicatorParamsList.map((v, i) => ({
    key: `EMA${v}:`,
    data: calcIndicatorOfEMA(indicatorParamsData, { dec, period: v }),
    color: colorMap[i],
  }));

  return {
    id: MAIN_GRID_ID,
    precision: dec,
    seriesKey: K_MAIN_INDICATOR_DICT.EMA,
    header: {
      options: {
        title: 'EMA',

        dataProvider(i: number) {
          return seriesList.map((v) => ({
            label: v.key,
            value: v.data[i],
            color: v.color,
            staticColor: true,
          }));
        },
      },
    },
    valueAxis: {
      boundaryGap: [0, 0],
      splitNumber: 3,
    },
    series: seriesList.map((v) => ({
      generator: LineChart,
      type: 'main-auxiliary',
      options: {
        lineStyle: {
          color: v.color,
        },
      },
      data: v.data,
    })),
  };
}

export function getSmaOfKLineConfig(info: IKlineIndicatorParams): any {
  const {
    commodityQuotes: { dec },
    baseData,
    chartIndicatorParamsList,
  } = info;

  const indicatorParamsData = baseData.kLineData.map((item) => +item[3]);
  const colorMap = ['#f58f24', '#1b98fc', '#de339f', '#2acee6', '#fb5f00'];
  const seriesList = chartIndicatorParamsList.map((v, ii) => ({
    key: `SMA${v}:`,
    data: calcIndicatorOfSMA(indicatorParamsData, { dec, period: v }),
    color: colorMap[ii],
  }));

  return {
    id: MAIN_GRID_ID,
    precision: dec,
    seriesKey: K_MAIN_INDICATOR_DICT.SMA,
    header: {
      options: {
        title: 'SMA',

        dataProvider(i: number) {
          return seriesList.map((v) => ({
            label: v.key,
            value: v.data[i],
            color: v.color,
            staticColor: true,
          }));
        },
      },
    },
    valueAxis: {
      boundaryGap: [0, 0],
      splitNumber: 3,
    },
    series: seriesList.map((v) => ({
      generator: LineChart,
      type: 'main-auxiliary',
      options: {
        lineStyle: {
          color: v.color,
        },
      },
      data: v.data,
    })),
  };
}

export function getBollOfKLineConfig(info: IKlineIndicatorParams): any {
  const {
    baseData,
    commodityQuotes: { dec },
    chartIndicatorParamsList = [],
  } = info;
  const [period, stdDev] = chartIndicatorParamsList;

  const indicatorParamsData = baseData.kLineData.map((item) => +item[3]);
  const indicatorMiscParams = { dec, period, stdDev };
  const { middle, upper, lower } = calcIndicatorOfBoll(indicatorParamsData, indicatorMiscParams);

  return {
    id: MAIN_GRID_ID,
    precision: dec,
    seriesKey: K_MAIN_INDICATOR_DICT.BOLL,
    header: {
      options: {

        title: `BOLL(${period}, ${stdDev})`,
        dataProvider(i: number) {
          return [
            {
              label: 'MID:',
              value: middle[i],
              color: '#28c6dd',
              staticColor: true,
            },
            {
              label: 'UPPER:',
              value: upper[i],
              color: '#d43a41',
              staticColor: true,
            },
            {
              label: 'LOWER:',
              value: lower[i],
              color: '#2ca969',
              staticColor: true,
            },
          ];
        },
      },
    },
    valueAxis: {
      boundaryGap: [0, 0],
      splitNumber: 3,
    },
    series: [
      {
        generator: LineChart,
        options: {
          lineStyle: {
            color: '#28c6dd',
          },
        },
        data: middle,
      },
      {
        generator: LineChart,
        options: {
          lineStyle: {
            color: '#d43a41',
          },
        },
        data: upper,
      },
      {
        generator: LineChart,
        options: {
          lineStyle: {
            color: '#2ca969',
          },
        },
        data: lower,
      },
    ],
  };
}

export function getVOLOfKLineConfig(info: IKlineIndicatorParams, extraInfo: IExtraInfo): any {
  const { closeCallback = EMPTY_FN, baseData, themeConfig, chartIndicatorParamsList = [] } = info;
  const { formatMessage } = extraInfo;
  const { volumeData, miscData } = baseData;

  const colorMap = ['#f58f24', '#1e9afc'];
  const seriesList = chartIndicatorParamsList.map((v, ii) => ({
    key: `MA${v}:`,
    data: calcIndicatorOfMA(volumeData, { period: v }),
    color: colorMap[ii],
  }));

  return {
    id: K_SUB_INDICATOR_DICT.VOL,
    precision: 2,
    height: auxHeight,
    header: {
      show: true,
      options: {
        closeCallback: (currInfo) => closeCallback(currInfo.id),
        title: formatMessage({ id: 'volume' }),
        dataProvider(i: number) {
          const currInfo: any = miscData[i] || {};

          return [
            {
              label: formatMessage({ id: 'total_volume' }),
              value: currInfo.volume,
              color: themeConfig[currInfo.barColorField],
            },
            ...seriesList.map((v) => ({
              label: v.key,
              value: toUnit(v.data[i] * 10000, { precision: 3 }),
              color: v.color,
              staticColor: true,
            })),
          ];
        },
      },
    },
    valueAxis: {
      min: 0,
      splitNumber: 2,
      formatter(_, index: number) {
        if (index === 0) return { label: info.volumeUnit || '' };

        return undefined;
      },
    },
    series: [
      {
        generator: BarChart,
        options: {
          formatter: (_, index) => ({ style: { color: themeConfig[miscData[index].barColorField] } }),
        },
        data: volumeData,
      },
      ...seriesList.map((v) => ({
        generator: LineChart,
        type: 'main-auxiliary',
        options: { lineStyle: { color: v.color } },
        data: v.data,
      })),
    ],
  };
}

export function getMacdOfKLineConfig(info: IKlineIndicatorParams): any {
  const {
    closeCallback = EMPTY_FN,
    baseData,
    chartIndicatorParamsList = [],
    commodityQuotes: { dec },
  } = info;
  const indicatorParamsData = baseData.kLineData.map((item) => +item[3]);
  const [n1, n2, period] = chartIndicatorParamsList;
  const { diffs, deas, macd } = calcIndicatorOfMACD(indicatorParamsData, { dec, n1, n2, period });

  return {
    id: K_SUB_INDICATOR_DICT.MACD,
    precision: 2,
    header: {
      options: {
        closeCallback: (currInfo) => closeCallback(currInfo.id),
        title: `MACD(${n1}, ${n2}, ${period})`,
        dataProvider(i: number) {
          let macdColor;
          const macdValue = macd[i];

          if (macdValue < 0) {
            macdColor = '#48a854';
          } else if (macdValue > 0) {
            macdColor = '#db3c40';
          }
          return [
            {
              label: 'MACD:',
              value: macdValue,
              color: macdColor,
            },
            {
              label: 'DIFF:',
              value: diffs[i],
              color: '#f58f25',
              staticColor: true,
            },
            {
              label: 'DEA:',
              value: deas[i],
              color: '#1897fb',
              staticColor: true,
            },
          ];
        },
      },
    },
    valueAxis: {
      splitNumber: 3,
    },
    series: [
      {
        generator: BarChart,
        options: {
          barWidth: 1,
          formatter(_: string, index: number) {
            const result = { style: { color: '#db3c40' } };

            if (macd[index] < 0) {
              result.style.color = '#48a854';
            }

            return result;
          },
        },
        data: macd,
      },
      {
        generator: LineChart,
        options: {
          lineStyle: {
            color: '#f58f25',
          },
        },
        data: diffs,
      },
      {
        generator: LineChart,
        options: {
          lineStyle: {
            color: '#1897fb',
          },
        },
        data: deas,
      },
    ],
  };
}

export function getDMAOfKLineConfig(info: IKlineIndicatorParams): any {
  const {
    commodityQuotes: { dec },
    baseData: { kLineData },
    closeCallback = EMPTY_FN,
    chartIndicatorParamsList = [],
  } = info;

  const close: number[] = [];
  kLineData.forEach((item) => {
    close.push(+item[3]);
  });

  const [n1, n2, period] = chartIndicatorParamsList;
  const { DDD, AMA } = calcIndicatorOfDMA(close, { dec, n1, n2, period });

  return {
    id: K_SUB_INDICATOR_DICT.DMA,
    precision: 2,
    header: {
      options: {
        closeCallback: (currInfo) => closeCallback(currInfo.id),
        title: 'DMA(10, 50, 10)',
        showCloseBtn: true,
        showZoomInBtn: false,
        showZoomOutBtn: false,
        dataProvider(i: number) {
          return [
            {
              label: 'DDD:',
              value: DDD[i],
              color: '#f58f24',
              staticColor: true,
            },
            {
              label: 'AMA:',
              value: AMA[i],
              color: '#1b98fc',
              staticColor: true,
            },
          ];
        },
      },
    },
    valueAxis: {
      boundaryGap: [0, 0],
      splitNumber: 3,
    },
    series: [
      {
        generator: LineChart,
        type: 'main-auxiliary',
        options: {
          lineStyle: {
            color: '#f58f24',
          },
        },
        data: DDD,
      },
      {
        generator: LineChart,
        type: 'main-auxiliary',
        options: {
          lineStyle: {
            color: '#1b98fc',
          },
        },
        data: AMA,
      },
    ],
  };
}

export function getRSIOfKLineConfig(info: IKlineIndicatorParams): any {
  const {
    commodityQuotes: { dec },
    baseData,
    closeCallback = EMPTY_FN,
    chartIndicatorParamsList = [],
  } = info;

  const indicatorParamsData = baseData.kLineData.map((item) => +item[3]);
  const colorMap = ['#f58f24', '#1b98fc', '#de339f'];
  const seriesList = chartIndicatorParamsList.map((v, ii) => ({
    key: `RSI${v}:`,
    data: calcIndicatorOfRSI(indicatorParamsData, { dec, period: v }),
    color: colorMap[ii],
  }));

  return {
    id: K_SUB_INDICATOR_DICT.RSI,
    precision: 2,
    header: {
      options: {
        closeCallback: (currInfo) => closeCallback(currInfo.id),
        title: `RSI(${chartIndicatorParamsList.join(',')})`,
        showCloseBtn: true,
        showZoomInBtn: false,
        showZoomOutBtn: false,
        dataProvider(i: number) {
          return seriesList.map((v) => ({
            label: v.key,
            value: v.data[i],
            color: v.color,
            staticColor: true,
          }));
        },
      },
    },
    valueAxis: {
      boundaryGap: [0, 0],
      splitNumber: 3,
    },
    series: seriesList.map((v) => ({
      generator: LineChart,
      type: 'main-auxiliary',
      options: {
        lineStyle: {
          color: v.color,
        },
      },
      data: v.data,
    })),
  };
}

export function getKDJOfKLineConfig(info: IKlineIndicatorParams): any {
  const {
    commodityQuotes: { dec },
    baseData: { kLineData },
    closeCallback = EMPTY_FN,
    chartIndicatorParamsList = [],
  } = info;

  const high: number[] = [];
  const low: number[] = [];
  const close: number[] = [];
  kLineData.forEach((item) => {
    high.push(+item[1]);
    low.push(+item[2]);
    close.push(+item[3]);
  });

  const [period, signalPeriod, dPeriod] = chartIndicatorParamsList;
  const { k, d, j } = calcIndicatorOfKDJ({ close, high, low }, { dec, period, signalPeriod, dPeriod });

  return {
    id: K_SUB_INDICATOR_DICT.KDJ,
    precision: 2,
    header: {
      options: {
        closeCallback: (currInfo) => closeCallback(currInfo.id),
        title: 'KDJ(9, 3, 3)',
        showCloseBtn: true,
        showZoomInBtn: false,
        showZoomOutBtn: false,
        dataProvider(i: number) {
          return [
            {
              label: 'K:',
              value: k[i],
              color: '#f58f24',
              staticColor: true,
            },
            {
              label: 'D:',
              value: d[i],
              color: '#1b98fc',
              staticColor: true,
            },
            {
              label: 'J:',
              value: j[i],
              color: '#de339f',
              staticColor: true,
            },
          ];
        },
      },
    },
    valueAxis: {
      boundaryGap: [0, 0],
      splitNumber: 3,
    },
    series: [
      {
        generator: LineChart,
        type: 'main-auxiliary',
        options: {
          lineStyle: {
            color: '#f58f24',
          },
        },
        data: k,
      },
      {
        generator: LineChart,
        type: 'main-auxiliary',
        options: {
          lineStyle: {
            color: '#1b98fc',
          },
        },
        data: d,
      },
      {
        generator: LineChart,
        type: 'main-auxiliary',
        options: {
          lineStyle: {
            color: '#de339f',
          },
        },
        data: j,
      },
    ],
  };
}
