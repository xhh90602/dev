import {
  BarChart, generateSymmetryTick, LineChart,
} from '@dz-web/quote-chart-mobile';
import { toPlaceholder, toPercent } from '@dz-web/o-orange';
import Decimal from 'decimal.js/decimal';

import { ITimeData, ICommonParams } from '../type';
import { specialNumToFixed } from '../utils/misc';

interface IParams extends ICommonParams {
  baseData: ITimeData,
  themeConfig: any;
}

interface IBaseExtraInfo {
  mini: boolean;
}

interface IExtraInfo extends IBaseExtraInfo {
  chartId: string;
}

function generateDefaultTick(start: number, end: number, count: number): any {
  const value = [];
  let startValue = new Decimal(start);
  const offset = new Decimal(end).sub(startValue);
  const step = offset.div(count);

  for (let i = 0; i <= count; i += 1) {
    value.push(Math.ceil(+startValue));
    startValue = startValue.plus(+step);
  }

  return { list: value, min: start, max: end };
}

export function getBaseOfTimeConfig(info: IParams, extraInfo: IExtraInfo): any {
  const {
    baseData: { priceData, timeData, avgData, miscData, tickIndexList },
    themeConfig,
  } = info;
  const { chartId, mini } = extraInfo;
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
      maxTickDistance: 80,
      data: timeData,
      isLeaveHalfOfRectWidth: false,
      customTickListHandler: ({ splitNumber }) => {
        const len = tickIndexList.length - 1;

        if (len > splitNumber) {
          const n = Math.ceil(len / splitNumber);
          return tickIndexList.filter((v, i) => i % n === 0 || i === len);
        }
        const { list } = generateDefaultTick(0, len, splitNumber);

        return Array.from(new Set(list)).map((item) => tickIndexList[+item]);
      },
    },
    dataZoom: {
      defaultShowCount: xDataLen,
      maxShowCount: xDataLen,
      minShowCount: xDataLen,
    },
    tooltip: {
      show: false,
      dataProvider(i: number) {
        const { floatValue, floatRate, amount, floatColorField, avgColorField, volume } = miscData[i] || {};
        const floatColor = themeConfig[floatColorField];
        const avgColor = themeConfig[avgColorField];

        const dataProviderConfig = [{
          label: '时间',
          value: toPlaceholder(timeData[i]),
          staticColor: true,
        },
        {
          label: '现价',
          value: toPlaceholder(priceData[i]),
          color: floatColor,
        },
        {
          label: '涨跌额',
          value: toPlaceholder(floatValue),
          color: floatColor,
        },
        {
          label: '涨跌额',
          value: toPlaceholder(floatRate),
          color: floatColor,
        },
        {
          label: '均价',
          value: toPlaceholder(avgData[i]),
          color: avgColor,
        },
        {
          label: '成交量',
          value: toPlaceholder(volume),
          staticColor: true,
        },
        {
          label: '成交额',
          value: toPlaceholder(amount),
          staticColor: true,
        }];

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

export function getTimeConfig(info: IParams): any {
  const {
    commodityQuotes,
    commodityQuotes: {
      dec = 2, closePrice,
    },
    baseData: {
      priceData, avgData,
    },
    themeConfig,
  } = info;

  const specialClosePrice = +specialNumToFixed(closePrice?.toFixed(dec) || 0);

  const series = [{
    generator: LineChart,
    options: {
      isArea: true,
      lineStyle: {
        color: '#5C85EC',
      },
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
        color: themeConfig.avgPriceColor,
      },
      moveDot: {
        show: true,
      },
    },
    data: avgData,
  }];

  return {
    id: 'time',
    height: 200,
    header: {
      show: false,
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

export function getVolumeOfTime(info: IParams): any {
  const {
    commodityQuotes: {
      dec = 2,
    },
    baseData: {
      priceData, volumeData,
    },
    themeConfig,
  } = info;

  return {
    id: 'volume',
    precision: 2,
    height: 100,
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
            let fill = true;

            if (value < prevValue) color = themeConfig?.fallColor;
            if (value > prevValue) {
              color = themeConfig?.riseColor;
              fill = false;
            }

            return { style: { color, fill } };
          },
        },
        data: volumeData,
      },
    ],
  };
}
