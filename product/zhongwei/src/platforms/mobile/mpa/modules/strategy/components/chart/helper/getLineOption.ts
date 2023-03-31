export default function getOption({
  value,
  names,
  date,
  title = '',
  legend,
  colors,
  selectItem,
  formatMessage,
  theme = 'white',
}) {
  const seriesMap = ({ name, data, color }) => ({
    name,
    type: 'line',
    data,
    smooth: true,
    symbol: 'none',
    itemStyle: {
      color, // 折线颜色
    },
    lineStyle: {
      width: 1,
    },
  });

  const SeriesData = () => {
    const temp: any = [];
    value.forEach((item: any, idx: number) => {
      const series: any = seriesMap({
        name: names[idx],
        data: item,
        color: theme === 'white' ? colors[idx] : colors[idx],
      });
      temp.push(series);
    });
    return temp;
  };

  // 字段类型格式化。 1: 保留2位小数；2：保留两位小数，并且加%；3：金额转换成万亿、亿、万，并且保留两位小数；4：日期格式化
  const fieldFormat = (val) => {
    const { formatType } = selectItem;
    if (val !== null && val !== '') {
      if (formatType === 1) {
        return val ? +val.toFixed(2) : 0.0;
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

  const unitFieldFormat = (val) => {
    const { formatType } = selectItem;
    if (formatType === 2) {
      return val ? `${val}%` : '0.00%';
    }
    if (formatType === 3) {
      return `${val}${formatMessage({ id: 'unit9' })}`; // 亿
    }
    return val;
  };

  const option = {
    title: {
      text: title,
      textAlign: 'left',
      textVerticalAlign: 'top',
      padding: [2, 0, 0, 0],
      textStyle: {
        color: '#8f95a8', // title颜色
        fontWeight: 400,
        fontSize: 12,
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          show: true,
          backgroundColor: '#6e7079',
        },
        // crossStyle: {
        //   color: '#b5bbcf',
        // },
      },
      confine: true,
      triggerOn: 'mousemove',
      hideDelay: 500,
      valueFormatter: (v) => `${fieldFormat(v)}`,
    },
    legend: {
      show: false,
      selected: legend,
    },
    grid: {
      show: false,
      left: '0%',
      right: '0%',
      bottom: '2%',
      top: '12%',
      containLabel: true,
    },
    xAxis: {
      boundaryGap: false,
      data: date,
      axisLine: {
        show: true,
        onZero: false,
        lineStyle: {
          type: 'solid',
          color: '#f2f5ff', // x轴虚线颜色
          fontSize: 10,
        },
      },
      axisLabel: {
        color: '#b5bbcf', // x轴label的颜色
        align: 'left',
        width: 0,
        fontWeight: 100,
        fontSize: 10,
        showMinLabel: true,
        showMaxLabel: true,
        splitNumber: 0,
        minInterval: 0,
        maxInterval: 0,
        interval: 0,
        hideOverlap: false,
        formatter: (data, index) => {
          if (date && date.length >= 3) {
            const half = Math.ceil(value && value[0] && value[0].length / 2) - 1;
            const oddEven = half % 2;
            if (index === 0) {
              return `{left|${data}}`;
            }
            if (index === half) {
              return oddEven ? `{center|${data}}` : `{odd|${data}}`;
            }
            if (index === ((value && value[0] && value[0].length - 1) || 0)) {
              return `{right|${data}}`;
            }
          } else if (date && date.length >= 2) {
            if (index === 0) {
              return `{left|${data}}`;
            }
            if (index === ((value && value[0] && value[0].length - 1) || 0)) {
              return `{right|${data}}`;
            }
          } else if (date && date.length >= 1) {
            if (index === 0) {
              return `{left|${data}}`;
            }
          }
          return '';
        },
        rich: {
          left: {
            align: 'left',
            color: '#b5bbcf',
            fontWeight: 700,
            fontSize: 10,
            padding: 0,
          },
          center: {
            align: 'center',
            color: '#b5bbcf',
            fontWeight: 700,
            fontSize: 10,
          },
          odd: {
            align: 'left',
            color: '#b5bbcf',
            fontWeight: 700,
            fontSize: 10,
            padding: [0, 0, 0, -27],
          },
          right: {
            align: 'right',
            color: '#b5bbcf',
            fontWeight: 700,
            fontSize: 10,
          },
        },
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
      // min: -100,
      // max: 100,
      splitNumber: 4,
      // interval: 25,
      // minInterval: 20,
      // maxInterval: 50,
      splitLine: {
        show: true,
        lineStyle: {
          type: 'solid',
          color: '#f2f5ff', // x轴虚线颜色
          fontSize: 10,
        },
      },
      axisLabel: {
        color: '#b5bbcf',
        fontWeight: 700,
        fontSize: 10,
        formatter: (data) => `${unitFieldFormat(data)}`,
      },
    },
    series: SeriesData(),
  };
  return option;
}
