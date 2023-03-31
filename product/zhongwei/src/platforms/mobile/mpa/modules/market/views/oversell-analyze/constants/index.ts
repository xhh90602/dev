export const getLineBarOptions = ({ barData = [], lineData = [], xAxisData = [], barOption = {}, lineOption = {} }) => [
  {
    xAxisData,
    // legendName: '持仓数量',
    // yAxisName: '單位(萬股)',
    series: {
      name: barOption.legendName || '',
      data: barData,
      type: 'bar',
      color: '#2F9BFA',
    },
    yLabelFormatter: (value) => value / 10000,
    ...barOption,
  },
  {
    xAxisData,
    // legendName: '收盤價',
    // yAxisName: '收盤價(HKD)',
    series: {
      data: lineData,
      type: 'line',
      symbol: 'none',
      color: '#FA6D16',
      yAxisIndex: 1,
    },
    yLabelFormatter: (value) => {
      const splitValue = value.toString().split('.');
      if (!splitValue[1]) splitValue[1] = '00';
      if (splitValue[1] && splitValue[1].length === 1) splitValue[1] += '0';
      return splitValue.join('.');
    },
    ...lineOption,
  },
];
