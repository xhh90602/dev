import dayjs from 'dayjs';
import { CandleChart, LineChart, BarChart, CircleChart } from '@dz-web/quote-chart-pc';
import {
  calcIndicatorOfMA, calcIndicatorOfMACD,
  calcIndicatorOfBoll, calcIndicatorOfEMA,
  calcIndicatorOfSMA, calcIndicatorOfSAR,
  calcIndicatorOfRSI, calcIndicatorOfKDJ,
  calcIndicatorOfDMA,
} from '@dz-web/quote-indicator';

import { ICommonParams } from '../constant/indicator-type';
import { IKLineData } from '../constant/chart-type';

import { EMPTY_FN } from '../constant/common';
import { K_SUB_INDICATOR_DICT } from '../constant/indicator-k';
import { specialNumToFixed } from '../utils/common';

const humanNumber = (v) => v;

export const MAIN_GRID_ID = 'k-line';

interface IParams extends ICommonParams {
  baseData: IKLineData;
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

export function getBaseOfKLineConfig(info: IParams, extraInfo: IExtraInfo): any {
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
      borderLine: {
        lineStyle: {
          color: themeConfig.splitLineColor,
        },
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

export function getCandleOfKLineConfig(info: IParams): any {
  const {
    commodityQuotes: { dec },
    baseData: { kLineData, miscData },
    themeConfig,
  } = info;

  return {
    id: MAIN_GRID_ID,
    flex: 3,
    precision: dec,
    header: {
      show: true,
      options: {
        showCloseBtn: false,
        showZoomInBtn: true,
        showZoomOutBtn: true,
      },
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

export function getMaOfKLineConfig(info: IParams): any {
  const {
    commodityQuotes: { dec },
    baseData,
  } = info;

  const indicatorParamsData = baseData.kLineData.map((item) => +item[3]);
  const ma5 = calcIndicatorOfMA(indicatorParamsData, { dec, period: 5 });
  const ma10 = calcIndicatorOfMA(indicatorParamsData, { dec, period: 10 });
  const ma20 = calcIndicatorOfMA(indicatorParamsData, { dec, period: 20 });
  const ma60 = calcIndicatorOfMA(indicatorParamsData, { dec, period: 60 });

  return {
    id: MAIN_GRID_ID,
    precision: dec,
    header: {
      show: true,
      options: {
        title: 'MA',
        showCloseBtn: false,
        showZoomInBtn: true,
        showZoomOutBtn: true,
        dataProvider(i: number) {
          return [
            {
              label: 'MA5:',
              value: ma5[i],
              color: '#f58f24',
              staticColor: true,
            },
            {
              label: 'MA10:',
              value: ma10[i],
              color: '#1e9afc',
              staticColor: true,
            },
            {
              label: 'MA20:',
              value: ma20[i],
              color: '#2acee6',
              staticColor: true,
            },
            {
              label: 'MA60:',
              value: ma60[i],
              color: '#f96e25',
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
        data: ma5,
      },
      {
        generator: LineChart,
        type: 'main-auxiliary',
        options: {
          lineStyle: {
            color: '#1e9afc',
          },
        },
        data: ma10,
      },
      {
        generator: LineChart,
        type: 'main-auxiliary',
        options: {
          lineStyle: {
            color: '#2acee6',
          },
        },
        data: ma20,
      },
      {
        generator: LineChart,
        type: 'main-auxiliary',
        options: {
          lineStyle: {
            color: '#f96e25',
          },
        },
        data: ma60,
      },
    ],
  };
}

export function getSarOfKLineConfig(info: IParams): any {
  const {
    commodityQuotes: {
      dec,
    },
    baseData: {
      kLineData,
    },
    themeConfig,
  } = info;

  const high: number[] = [];
  const low: number[] = [];
  kLineData.forEach((item) => {
    high.push(+item[1]);
    low.push(+item[2]);
  });
  const BB = calcIndicatorOfSAR({ high, low });

  return {
    id: MAIN_GRID_ID,
    precision: dec,
    header: {
      options: {
        showCloseBtn: false,
        showZoomInBtn: true,
        showZoomOutBtn: true,
        title: 'SAR(10, 2, 10)',
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

export function getEmaOfKLineConfig(info: IParams): any {
  const {
    commodityQuotes: { dec },
    baseData,
  } = info;

  const indicatorParamsData = baseData.kLineData.map((item) => +item[3]);
  const ema5 = calcIndicatorOfEMA(indicatorParamsData, { dec, period: 5 });
  const ema10 = calcIndicatorOfEMA(indicatorParamsData, { dec, period: 10 });
  const ema20 = calcIndicatorOfEMA(indicatorParamsData, { dec, period: 20 });
  const ema60 = calcIndicatorOfEMA(indicatorParamsData, { dec, period: 60 });
  const ema120 = calcIndicatorOfEMA(indicatorParamsData, { dec, period: 120 });
  const ema250 = calcIndicatorOfEMA(indicatorParamsData, { dec, period: 250 });

  return {
    id: MAIN_GRID_ID,
    precision: dec,
    header: {
      options: {
        title: 'EMA',
        showCloseBtn: false,
        showZoomInBtn: true,
        showZoomOutBtn: true,
        dataProvider(i: number) {
          return [
            {
              label: 'EMA5:',
              value: ema5[i],
              color: '#f58f24',
              staticColor: true,
            },
            {
              label: 'EMA10:',
              value: ema10[i],
              color: '#1b98fc',
              staticColor: true,
            },
            {
              label: 'EMA20:',
              value: ema20[i],
              color: '#de339f',
              staticColor: true,
            },
            {
              label: 'EMA60:',
              value: ema60[i],
              color: '#2acee6',
              staticColor: true,
            },
            {
              label: 'EMA120:',
              value: ema120[i],
              color: '#fb5f00',
              staticColor: true,
            },
            {
              label: 'EMA250:',
              value: ema250[i],
              color: '#2ca569',
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
        data: ema5,
      },
      {
        generator: LineChart,
        type: 'main-auxiliary',
        options: {
          lineStyle: {
            color: '#1b98fc',
          },
        },
        data: ema10,
      },
      {
        generator: LineChart,
        type: 'main-auxiliary',
        options: {
          lineStyle: {
            color: '#de339f',
          },
        },
        data: ema20,
      },
      {
        generator: LineChart,
        type: 'main-auxiliary',
        options: {
          lineStyle: {
            color: '#2acee6',
          },
        },
        data: ema60,
      },
      {
        generator: LineChart,
        type: 'main-auxiliary',
        options: {
          lineStyle: {
            color: '#fb5f00',
          },
        },
        data: ema120,
      },
      {
        generator: LineChart,
        type: 'main-auxiliary',
        options: {
          lineStyle: {
            color: '#2ca569',
          },
        },
        data: ema250,
      },
    ],
  };
}

export function getSmaOfKLineConfig(info: IParams): any {
  const {
    commodityQuotes: { dec },
    baseData,
  } = info;

  const indicatorParamsData = baseData.kLineData.map((item) => +item[3]);
  const sma5 = calcIndicatorOfSMA(indicatorParamsData, { dec, period: 5 });
  const sma10 = calcIndicatorOfSMA(indicatorParamsData, { dec, period: 10 });
  const sma20 = calcIndicatorOfSMA(indicatorParamsData, { dec, period: 20 });
  const sma60 = calcIndicatorOfSMA(indicatorParamsData, { dec, period: 60 });
  const sma120 = calcIndicatorOfSMA(indicatorParamsData, { dec, period: 120 });

  return {
    id: MAIN_GRID_ID,
    precision: dec,
    header: {
      options: {
        title: 'SMA',
        showCloseBtn: false,
        showZoomInBtn: true,
        showZoomOutBtn: true,
        dataProvider(i: number) {
          return [
            {
              label: 'SMA5:',
              value: sma5[i],
              color: '#f58f24',
              staticColor: true,
            },
            {
              label: 'SMA10:',
              value: sma10[i],
              color: '#1b98fc',
              staticColor: true,
            },
            {
              label: 'SMA20:',
              value: sma20[i],
              color: '#de339f',
              staticColor: true,
            },
            {
              label: 'SMA60:',
              value: sma60[i],
              color: '#2acee6',
              staticColor: true,
            },
            {
              label: 'SMA120:',
              value: sma120[i],
              color: '#fb5f00',
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
        data: sma5,
      },
      {
        generator: LineChart,
        type: 'main-auxiliary',
        options: {
          lineStyle: {
            color: '#1b98fc',
          },
        },
        data: sma10,
      },
      {
        generator: LineChart,
        type: 'main-auxiliary',
        options: {
          lineStyle: {
            color: '#de339f',
          },
        },
        data: sma20,
      },
      {
        generator: LineChart,
        type: 'main-auxiliary',
        options: {
          lineStyle: {
            color: '#2acee6',
          },
        },
        data: sma60,
      },
      {
        generator: LineChart,
        type: 'main-auxiliary',
        options: {
          lineStyle: {
            color: '#fb5f00',
          },
        },
        data: sma120,
      },
    ],
  };
}

export function getBollOfKLineConfig(info: IParams): any {
  const {
    baseData,
    commodityQuotes: { dec },
  } = info;
  const period = 20;
  const stdDev = 2;

  const indicatorParamsData = baseData.kLineData.map((item) => +item[3]);
  const indicatorMiscParams = { dec, period, stdDev };
  const { middle, upper, lower } = calcIndicatorOfBoll(indicatorParamsData, indicatorMiscParams);

  return {
    id: MAIN_GRID_ID,
    precision: dec,
    header: {
      options: {
        showCloseBtn: false,
        showZoomInBtn: true,
        showZoomOutBtn: true,
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

export function getVOLOfKLineConfig(info: IParams, extraInfo: IBaseExtraInfo, t: any): any {
  const { closeCallback = EMPTY_FN, baseData, themeConfig } = info;
  const { mini } = extraInfo;
  const { volumeData, miscData } = baseData;

  const volumeMA5 = calcIndicatorOfMA(volumeData, { period: 5 });
  const volumeMA10 = calcIndicatorOfMA(volumeData, { period: 10 });

  return {
    id: K_SUB_INDICATOR_DICT.VOL,
    precision: 2,
    header: {
      show: !mini,
      options: {
        closeCallback: (currInfo) => closeCallback(currInfo.id),
        title: t('volume'),
        dataProvider(i: number) {
          const currInfo: any = miscData[i] || {};

          return [
            {
              label: t('total_volume'),
              value: currInfo.volume,
              color: themeConfig[currInfo.barColorField],
            },
            {
              label: 'MA5:',
              value: humanNumber(volumeMA5[i] * 10000),
              // value: `${volumeMA5[i]}万`,
              color: '#f58f24',
              staticColor: true,
            },
            {
              label: 'MA10:',
              value: humanNumber(volumeMA10[i] * 10000),
              // value: `${volumeMA5[i]}万`,
              color: '#1e9afc',
              staticColor: true,
            },
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
      {
        generator: LineChart,
        type: 'main-auxiliary',
        options: {
          lineStyle: {
            color: '#f58f24',
          },
        },
        data: volumeMA5,
      },
      {
        generator: LineChart,
        type: 'main-auxiliary',
        options: {
          lineStyle: {
            color: '#1e9afc',
          },
        },
        data: volumeMA10,
      },
    ],
  };
}

export function getMacdOfKLineConfig(info: IParams): any {
  const { closeCallback = EMPTY_FN, baseData } = info;
  const indicatorParamsData = baseData.kLineData.map((item) => +item[3]);
  const { diffs, deas, macd } = calcIndicatorOfMACD(indicatorParamsData);

  return {
    id: K_SUB_INDICATOR_DICT.MACD,
    precision: 2,
    header: {
      options: {
        closeCallback: (currInfo) => closeCallback(currInfo.id),
        title: 'MACD(12, 26, 9)',
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

export function getDMAOfKLineConfig(info: IParams): any {
  const {
    commodityQuotes: { dec },
    baseData: {
      kLineData,
    },
    closeCallback = EMPTY_FN,
  } = info;

  const close: number[] = [];
  kLineData.forEach((item) => {
    close.push(+item[3]);
  });

  const { DDD, AMA } = calcIndicatorOfDMA(close, { dec });

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

export function getRSIOfKLineConfig(info: IParams): any {
  const {
    commodityQuotes: { dec },
    baseData,
    closeCallback = EMPTY_FN,
  } = info;

  const indicatorParamsData = baseData.kLineData.map((item) => +item[3]);
  const rsi6 = calcIndicatorOfRSI(indicatorParamsData, { dec, period: 6 });
  const rsi12 = calcIndicatorOfRSI(indicatorParamsData, { dec, period: 12 });
  const rsi24 = calcIndicatorOfRSI(indicatorParamsData, { dec, period: 24 });

  return {
    id: K_SUB_INDICATOR_DICT.RSI,
    precision: 2,
    header: {
      options: {
        closeCallback: (currInfo) => closeCallback(currInfo.id),
        title: 'RSI(6, 12, 24)',
        showCloseBtn: true,
        showZoomInBtn: false,
        showZoomOutBtn: false,
        dataProvider(i: number) {
          return [
            {
              label: 'RSI6:',
              value: rsi6[i],
              color: '#f58f24',
              staticColor: true,
            },
            {
              label: 'RSI12:',
              value: rsi12[i],
              color: '#1b98fc',
              staticColor: true,
            },
            {
              label: 'RSI24:',
              value: rsi24[i],
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
        data: rsi6,
      },
      {
        generator: LineChart,
        type: 'main-auxiliary',
        options: {
          lineStyle: {
            color: '#1b98fc',
          },
        },
        data: rsi12,
      },
      {
        generator: LineChart,
        type: 'main-auxiliary',
        options: {
          lineStyle: {
            color: '#de339f',
          },
        },
        data: rsi24,
      },
    ],
  };
}

export function getKDJOfKLineConfig(info: IParams): any {
  const {
    commodityQuotes: { dec },
    baseData: {
      kLineData,
    },
    closeCallback = EMPTY_FN,
  } = info;

  const high: number[] = [];
  const low: number[] = [];
  const close: number[] = [];
  kLineData.forEach((item) => {
    high.push(+item[1]);
    low.push(+item[2]);
    close.push(+item[3]);
  });

  const { k, d, j } = calcIndicatorOfKDJ({ close, high, low }, { dec, period: 9 });

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
