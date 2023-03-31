import { BarChart, LineChart, generateSymmetryTick } from '@dz-web/quote-chart-pc';
import { toPercent, ensure } from '@dz-web/o-orange';
import Decimal from 'decimal.js';

import { ITimeData } from '../constant/chart-type';
import { ICommonParams } from '../constant/indicator-type';
import { specialNumToFixed } from '../utils/common';

interface IParams extends ICommonParams {
  baseData: ITimeData;
}

interface IBaseExtraInfo {
  formatMessage: any;
}
interface IExtraInfo extends IBaseExtraInfo {
  chartId: string;
}

function generateDefaultTick(start: number, end: number, count: number): any {
  const value: number[] = [];
  let startValue = new Decimal(start);
  const offset = new Decimal(end).sub(startValue);
  const step = offset.div(count);

  for (let i = 0; i <= count; i += 1) {
    value.push(new Decimal(startValue).ceil().toNumber());
    startValue = startValue.plus(+step);
  }

  return { list: value, min: start, max: end };
}

export function getBaseOfTimeConfig(info: IParams, extraInfo: IExtraInfo): any {
  const {
    baseData: { priceData, timeData, avgData, miscData, tickIndexList },
    themeConfig,
  } = info;
  const { chartId, formatMessage } = extraInfo;
  const xDataLen = timeData.length;

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
    },
    categoryAxis: {
      maxTickDistance: 55,
      data: timeData,
      isLeaveHalfOfRectWidth: false,
      customTickListHandler: ({ splitNumber }) => {
        const len = tickIndexList.length - 1;

        if (len > splitNumber) {
          const n = Math.ceil(len / splitNumber);
          return tickIndexList.filter((_, i) => i % n === 0 || i === len);
        }
        const { list } = generateDefaultTick(0, len, splitNumber);

        return Array.from(new Set(list)).map((item: any) => tickIndexList[+item]);
      },
    },
    dataZoom: {
      defaultShowCount: xDataLen,
      maxShowCount: xDataLen,
      minShowCount: xDataLen,
    },
    tooltip: {
      show: true,
      dataProvider(i: number) {
        const { floatValue, floatRate, amount, floatColorField, avgColorField, volume } = miscData[i] || {};
        const floatColor = themeConfig[floatColorField];
        const avgColor = themeConfig[avgColorField];

        const dataProviderConfig = [
          {
            label: formatMessage({ id: 'time' }),
            value: ensure(timeData[i]),
            staticColor: true,
          },
          {
            label: formatMessage({ id: 'now' }),
            value: ensure(priceData[i]),
            color: floatColor,
          },
          {
            label: formatMessage({ id: 'price_change' }),
            value: ensure(floatValue),
            color: floatColor,
          },
          {
            label: formatMessage({ id: 'price_change_rate' }),
            value: ensure(floatRate),
            color: floatColor,
          },
          {
            label: formatMessage({ id: 'avg' }),
            value: ensure(avgData[i]),
            color: avgColor,
          },
          {
            label: formatMessage({ id: 'volume' }),
            value: ensure(volume),
            staticColor: true,
          },
          {
            label: formatMessage({ id: 'turnover' }),
            value: ensure(amount),
            staticColor: true,
          },
        ];

        // if (isAStock && dataProviderConfig.length > 1) {
        //   return dataProviderConfig.filter((v) => v.label !== t('avg'));
        // }
        return dataProviderConfig;
      },
    },
  };
}

const getMin = (min, max, dec) => {
  if (min === max && min > 10000) {
    return (min - min * 0.05).toFixed(dec);
  }
  return (min - (max - min) * 0.1).toFixed(dec);
};

const getMax = (min, max, dec) => {
  if (min === max && min > 10000) {
    return (max + max * 0.05).toFixed(dec);
  }
  return (max + (max - min) * 0.1).toFixed(dec);
};

export function getTimeConfig(info: any, extraInfo: IBaseExtraInfo): any {
  const {
    commodityQuotes: { dec = 2, closePrice },
    baseData: { priceData, avgData },
    themeConfig,
  } = info;
  const { formatMessage } = extraInfo;

  const specialClosePrice = +specialNumToFixed(closePrice);

  const series = [
    {
      generator: LineChart,
      options: {
        isArea: true,
        moveDot: {
          show: true,
        },
      },
      data: priceData,
    },
    {
      generator: LineChart,
      options: {
        lineStyle: {
          color: '#d79f5e',
        },
        moveDot: {
          show: true,
        },
      },
      data: avgData,
    },
  ];

  return {
    id: 'time',
    flex: 4,
    header: {
      show: true,
      options: {
        title: '',
        showCloseBtn: false,
        showZoomInBtn: false,
        showZoomOutBtn: false,
        dataProvider(i: number) {
          return [
            {
              label: `${formatMessage({ id: 'now' })}:`,
              value: priceData[i],
              color: themeConfig.nowPriceColor,
              staticColor: true,
            },
            {
              label: `${formatMessage({ id: 'avg' })}:`,
              value: avgData[i],
              color: themeConfig.avgPriceColor,
              staticColor: true,
            },
          ];
        },
      },
    },
    precision: dec,
    valueAxis: {
      min: (min, max) => getMin(min, max, dec),
      max: (min, max) => getMax(min, max, dec),
      customTickListHandler: ({ minNumber, maxNumber, splitNumber }) => {
        const value = generateSymmetryTick(closePrice, minNumber, maxNumber, Math.floor(splitNumber / 2), dec);
        const list = value.list.map((item) => specialNumToFixed(item));

        return { ...value, list, prevList: value.originalList };
      },
      left: {
        formatter: (value) => {
          const returnObj: any = {};
          const offset = (specialClosePrice - value) / specialClosePrice;
          switch (Math.sign(offset)) {
            case 1:
              returnObj.textStyle = {
                color: themeConfig.fallColor,
              };
              break;
            case -1:
              returnObj.textStyle = {
                color: themeConfig.riseColor,
              };
              break;
            default:
              returnObj.textStyle = {};
              break;
          }

          return returnObj;
        },
        axisPointer: {
          formatter(value) {
            return { label: specialNumToFixed(value) };
          },
        },
      },
      right: {
        formatter: (value) => {
          const offset = (specialClosePrice - value) / specialClosePrice;
          switch (Math.sign(offset)) {
            case 1:
              return {
                label: toPercent(offset),
                textStyle: {
                  color: themeConfig.fallColor,
                },
              };
            case -1:
              return {
                label: toPercent(Math.abs(offset)),
                textStyle: {
                  color: themeConfig.riseColor,
                },
              };
            case 0:
              return {
                label: '0.00%',
              };
            default:
              return {};
          }
        },
        axisPointer: {
          formatter(value) {
            const offset = (closePrice - value) / closePrice;

            return { label: toPercent(Math.abs(offset)) };
          },
        },
      },
    },
    series,
  };
}

export function getVolumeOfTime(info: any): any {
  const {
    baseData: { priceData, volumeData },
    themeConfig,
  } = info;

  return {
    id: 'volume',
    precision: 2,
    flex: 1,
    header: {
      show: false,
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
          barWidth: 1,
          formatter(_: string, index: number) {
            const value = priceData[index];
            const prevValue = index === 0 ? value : priceData[index - 1];
            let color = themeConfig.equalColor;

            if (value < prevValue) color = themeConfig?.fallColor;
            if (value > prevValue) color = themeConfig?.riseColor;

            return { style: { color } };
          },
        },
        data: volumeData,
      },
    ],
  };
}
