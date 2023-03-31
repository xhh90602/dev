import dayjs from 'dayjs';
import { useIntl } from 'react-intl';
// import { LineChart, generateDefaultTick } from '@dz-web/quote-chart-pc';

// const getMin = (min, max, dec) => {
//   if (min === max && min > 10000) {
//     return (min - min * 0.05).toFixed(dec);
//   }
//   return (min - (max - min) * 0.1).toFixed(dec);
// };

// const getMax = (min, max, dec) => {
//   if (min === max && min > 10000) {
//     return (max + max * 0.05).toFixed(dec);
//   }
//   return (max + (max - min) * 0.1).toFixed(dec);
// };

export default function getLineOption(dict, tradeMinList, tradeMinTickList, userConfig) {
  const { dataList } = dict;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { formatMessage } = useIntl();

  const { theme } = userConfig;

  // console.log(userConfig, 'userConfig');

  if (!dataList.length) return {};
  // const len = tradeMinList.length;

  const xData = [...tradeMinList];
  tradeMinTickList.forEach((item) => {
    xData[item.index] = item.value;
  });
  console.log(dataList, 'dataList');
  // console.log(tradeMinList, 'tradeMinList');
  // console.log(xData, 'xData');

  const series = dataList.map((item) => ({
    name: formatMessage({ id: item.title }),
    showSymbol: false,
    data: item.data,
    type: 'line',
    itemStyle: {
      color: item.color,
    },
    lineStyle: {
      width: 1,
    },
  }));

  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(50,50,50,0.7)',
      borderColor: 'rgba(255, 255, 255, 0)',
      textStyle: {
        color: '#fff',
      },
      formatter(params) {
        let result = '';
        let axisName = '';
        params.forEach((item) => {
          axisName = item.axisValueLabel; // 时间
          const itemValue = `${item.marker + item.seriesName}: ${item?.value || ''}亿</br>`;

          result += itemValue;
        });
        const allResult = `${axisName}</br>${result}`;
        return allResult;
      },
    },
    grid: {
      top: '10%',
      left: '4%',
      right: '5%',
      bottom: '2%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: xData,
      boundaryGap: false,
      axisLine: {
        show: false, // 隐藏坐标线
        lineStyle: {
          type: 'dashed',
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        margin: 1,
        color: '#999',
        hideOverlap: false,
        showMinLabel: true,
        showMaxLabel: true,
        splitNumber: 0,
        interval: 0,
        minInterval: 0,
        maxInterval: 0,
        formatter: (value, index) => {
          // const currentValue = dayjs(value).format('MM-DD');
          if (index === xData.length - 1) {
            return `{lastLabel|${value}}`;
          }
          if (index === 0) {
            return `{firstLabel|${value}}`;
          }

          // if (index === Math.ceil(xData.length / 2)) {
          //   return `{ceil|${value}}`;
          // }
          if (index === 150) {
            return `{center|${value}}`;
          }
          return '';
        },
        rich: {
          lastLabel: {
            padding: [0, 0, 0, -30],
          },
          firstLabel: {
            padding: [0, 0, 0, 30],
          },
          center: {
            padding: [0, -20, 0, 0],
          },
        },
      },
    },
    yAxis: {
      offset: 5,
      // min: rateMin,
      // max: rateMax,
      type: 'value',
      axisLabel: {
        formatter(value, index) {
          return value + formatMessage({ id: 'hundredMillion' });
          // return `${value}亿`;
        },
        // textStyle: {
        //   color: (params) => {
        //     let colorType = '#666666';
        //     if (params > 0) {
        //       colorType = RiseFallColor[riseFallColor].riseColor;
        //     } else if (params < 0) {
        //       colorType = RiseFallColor[riseFallColor].fallColor;
        //     }
        //     return colorType;
        //   },
        //   fontSize: 16,
        // },
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: theme === 'white' ? ' #8F95A8' : '#32394B',
          // color: '#32394B',
          width: 0.1,
        },
      },
      splitLine: {
        // 网格线
        lineStyle: {
          type: 'solid', // 设置网格线类型 dotted：虚线   solid:实线
          color: theme === 'white' ? ' #8F95A8' : '#32394B',
          width: 0.1,
        },
      },
    },
    series,
  };
}
