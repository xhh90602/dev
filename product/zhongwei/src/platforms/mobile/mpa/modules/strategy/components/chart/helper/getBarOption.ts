export default function getOption({ data, selectItem, title = '', legend, colors, formatMessage }) {
  const fieldFormat = (val) => {
    const { formatType } = selectItem;
    if (val !== null && val !== '') {
      if (formatType === 1) {
        return val ? val.toFixed(2) : 0.0;
      }
      if (formatType === 2) {
        return val ? `${val.toFixed(2)}%` : '0.00%';
      }
      if (formatType === 3) {
        return `${val}${formatMessage({ id: 'unit9' })}`; // 亿
      }
      return val;
    }
    return 0.0;
  };

  const dataMap = ({ value, color, position }) => ({
    value,
    itemStyle: {
      color,
    },
    label: {
      show: true,
      position,
      color: '#011628',
      formatter: (params) => `${fieldFormat(params.value)}`,
    },
  });
  const getData = () => {
    const temp: any = [];
    const legendArray = Object.values(legend);
    data.forEach((item: any, idx: number) => {
      const series: any = dataMap({
        value: legendArray[idx] ? item : null,
        color: colors[idx],
        position: item > 0 ? 'top' : 'bottom',
      });
      temp.push(series);
    });
    return temp;
  };

  const option = {
    title: {
      text: title,
      textAlign: 'left',
      textVerticalAlign: 'top',
      padding: [1, 0, 0, 0],
      textStyle: {
        color: '#212121', // title颜色
        fontWeight: 400,
        fontSize: 13,
      },
    },
    grid: {
      show: false,
      left: '0%',
      right: '0%',
      bottom: '8%',
      top: '30%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      axisLine: {
        show: true,
        onZero: true,
        lineStyle: {
          type: 'solid',
          color: '#efefef', // x轴线颜色
        },
      },
      axisLabel: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    barMaxWidth: 35,
    series: [
      {
        data: [...getData()],
        type: 'bar',
      },
    ],
  };
  return option;
}
