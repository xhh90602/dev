import { LineChart, generateDefaultTick } from '@dz-web/quote-chart-pc';

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

export default function getLineOption(dict, tradeMinList, tradeMinTickList, theme = 'white') {
  const { dataList } = dict;
  const len = tradeMinList.length;

  const xData = [...tradeMinList];
  tradeMinTickList.forEach((item) => {
    xData[item.index] = item.value;
  });
  // console.log(dict, 'dict');

  return {
    selector: '#trend-chart',
    textStyle: {
      color: '#999',
      fontSize: 12,
    },
    splitLine: {
      lineStyle: {
        color: theme === 'white' ? '#efefef' : '#32394B',
      },
    },
    valueAxis: {
      // maxTickDistance: 60,
      width: 200,
      borderLine: {
        lineStyle: {
          color: theme === 'white' ? '#efefef' : '#32394B',
          // color: '#efefef',
        },
      },
      left: {
        show: true,
      },
      right: {
        show: false,
      },
    },
    axisPointer: {
      show: false,
    },
    dataZoom: {
      defaultShowCount: len,
      maxShowCount: len,
      minShowCount: len,
    },
    categoryAxis: {
      height: 20,
      splitNumber: 2,
      data: xData,
      isLeaveHalfOfRectWidth: false,
      customTickListHandler: ({ splitNumber }) => {
        const value = generateDefaultTick(0, len - 1, Math.floor(splitNumber / 2), 0);
        tradeMinTickList.forEach((item) => {
          value.list.push(item.index);
        });
        return value.list.sort((a, b) => a - b);
      },
    },
    tooltip: {
      show: false,
    },
    grids: [
      {
        id: 'time',
        height: 130,
        header: {
          show: false,
        },
        valueAxis: {
          min: (min, max) => getMin(min, max, 3),
          max: (min, max) => getMax(min, max, 3),
        },
        precision: 2,
        series: [
          {
            generator: LineChart,
            options: {
              isArea: false,
              lineStyle: {
                color: '#0068e7',
              },
              moveDot: {
                show: false,
              },
            },
            data: dataList[0].data,
          },
          {
            generator: LineChart,
            options: {
              isArea: false,
              lineStyle: {
                color: '#ff7a00',
              },
              moveDot: {
                show: false,
              },
            },
            data: dataList[1].data,
          },
          {
            generator: LineChart,
            options: {
              isArea: false,
              lineStyle: {
                color: '#f00065',
              },
              moveDot: {
                show: false,
              },
            },
            data: dataList[2].data,
          },
          {
            generator: LineChart,
            options: {
              isArea: false,
              lineStyle: {
                color: '#e200f0',
              },
              moveDot: {
                show: false,
              },
            },
            data: dataList[3].data,
          },
          {
            generator: LineChart,
            options: {
              isArea: false,
              lineStyle: {
                color: '#8200f0',
              },
              moveDot: {
                show: false,
              },
            },
            data: dataList[4].data,
          },
        ],
      },
    ],
  };
}
