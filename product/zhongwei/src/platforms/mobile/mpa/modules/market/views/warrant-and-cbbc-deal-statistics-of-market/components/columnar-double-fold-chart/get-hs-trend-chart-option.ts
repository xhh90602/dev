export default function getHSTrendChartOption(dataInfo, formatMessage, tabName, theme = 'white') {
  const { rate, tradeDay, data, closePrice, unit, type, tradeFullDay } = dataInfo;
  console.log(tradeDay, 'tradeDay');
  const interval = 6;
  let rateMax = Math.max(...rate);
  let rateMin = Math.min(...rate);

  rateMax += rateMax * 0.1;
  rateMin -= rateMin * 0.1;
  const rateIntervalval = Number(((rateMax - rateMin) / interval).toFixed(2));

  let dataMax = Math.max(...closePrice);
  let dataMin = Math.min(...closePrice);

  dataMax += dataMax * 0.1;
  dataMin -= dataMin * 0.1;
  const dataIntervalval = Number(((dataMax - dataMin) / interval).toFixed(1));

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
      // 根据黑白皮肤切换
      backgroundColor: theme === 'white' ? 'rgba(255, 255, 255, 90%)' : '#222f3fe6',
      borderColor: theme === 'white' ? 'rgb(255, 255, 255)' : 'transparent',
      boxShadow: theme === 'white' ? '.02rem .04rem .2rem rgba(0, 0, 0, 20%)' : '0 0 .2rem 0 rgba(0, 0, 0, 50%);',
    },
    legend: {
      show: false,
    },
    axisPointer: {
      link: { xAxisIndex: 'all' },
    },
    dataZoom: {
      start: 0,
      xAxisIndex: [0, 1],
      type: 'inside',
    },
    className: 'custom-echarts-tooltip',
    formatter(params) {
      const index = params[0].dataIndex;

      return `
        <h3>${tradeFullDay[index]}</h3>

        <ol>
          <li>
            <span>${`${tabName}${formatMessage({ id: 'type_of_market_transactions' })}`}</span>
            <span>${rate[index]}%</span>
          </li>
          <li>
            <span>${formatMessage({ id: 'hs_close' })}</span>
            <span>${closePrice[index]}</span>
          </li>
          <li>
            <span>${`${tabName}${formatMessage({ id: 'type_of_amount' })}`}</span>
            <span>${data[index]}${unit}</span>
          </li>
        </ol>
      `;
    },
    grid: [
      {
        left: 0,
        right: 0,
        top: 20,
        bottom: 20,
        // bottom: '80%',
        containLabel: true,
        height: '60%',
      },
      {
        left: 0,
        right: 0,
        top: '72%',
        // top: '80%',
        bottom: 10,
        containLabel: true,
        height: '28%',
      },
    ],
    toolbox: {
      show: false,
    },
    xAxis: [
      {
        gridIndex: 0,
        type: 'category',
        boundaryGap: true,
        data: tradeDay,
        axisLine: { show: false },
        axisTick: { show: false },
        min: () => tradeDay[0],
        max: () => tradeDay[tradeDay.length - 1],
        axisLabel: {
          margin: 1,
          // interval: 9,
          color: '#999',
          hideOverlap: false,
          showMinLabel: true,
          showMaxLabel: true,
          formatter: (value, index) => {
            if (index === tradeDay.length - 1) {
              return `{lastLabel|${value}}`;
            }
            if (index === 0) {
              return `{firstLabel|${value}}`;
            }
            return `{center|${value}}`;
          },
          rich: {
            lastLabel: {
              padding: [0, 0, 0, -32],
            },
            firstLabel: {
              padding: [0, 0, 0, 30],
            },
            center: {
              padding: [0, 0, 0, 0],
            },
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: theme === 'white' ? '#efefef' : '#32394B',
          },
        },
      },
      {
        gridIndex: 1,
        type: 'category',
        boundaryGap: true,
        data: tradeDay,
        silent: true,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        axisPointer: {
          label: {
            show: false,
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: theme === 'white' ? '#efefef' : '#32394B',
            // color: '#efefef',
          },
        },
      },
    ],
    yAxis: [
      {
        offset: 6,
        gridIndex: 0,
        type: 'value',
        min: rateMin,
        max: rateMax,
        interval: rateIntervalval,
        boundaryGap: '3%',
        scale: true,
        axisLabel: {
          formatter: (params) => `${params.toFixed(2)}%`,
          color: '#999',
          inside: true,
          verticalAlign: 'bottom',
        },
        axisPointer: {
          label: {
            formatter: (params) => `${params.value.toFixed(2)}%`,
          },
        },
        splitLine: {
          lineStyle: {
            // color: '#efefef',
            color: theme === 'white' ? '#efefef' : '#32394B',
          },
        },
      },
      {
        offset: 6,
        gridIndex: 0,
        min: dataMin,
        max: dataMax,
        boundaryGap: '3%',
        interval: dataIntervalval,
        scale: true,
        splitNumber: 3,
        type: 'value',
        splitLine: {
          show: false,
        },
        axisLabel: {
          inside: true,
          color: '#999',
          verticalAlign: 'bottom',
        },
        axisPointer: {
          label: {
            formatter: (params) => `${params.value.toFixed(2)}`,
          },
        },
      },
      {
        gridIndex: 1,
        scale: true,
        splitNumber: 1,
        type: 'value',
        // boundaryGap: '3%',
        splitLine: {
          lineStyle: {
            color: theme === 'white' ? '#efefef' : '#32394B',
            // color: '#efefef',
          },
        },
        axisLabel: {
          // formatter: (params) => `{top|${params.toFixed(0)}${unit}}`,
          formatter: (value, index) => {
            console.log(value, index, 'last');
            if (index === 2) {
              return `{top|${value.toFixed(0)}${unit}}`;
            }
            // if (index === 0) {
            //   return `{bottom|${value.toFixed(0)}${unit}}`;
            // }
            return '';
          },
          rich: {
            top: {
              padding: [-14, 0, 0, -8],
            },
            bottom: {
              padding: [0, 0, -14, -8],
            },
          },
          inside: true,
          color: '#999',
        },
        axisPointer: {
          label: {
            formatter: (params) => `${params.value.toFixed(2)}${unit}`,
          },
        },
      },
    ],
    series: [
      {
        name: '占大市比例',
        type: 'line',
        yAxisIndex: 0,
        symbol: 'none',
        lineStyle: {
          width: 1,
          color: '#fa6d16',
        },
        emphasis: {
          lineStyle: {
            width: 1,
          },
        },
        data: rate,
      },
      {
        name: '恒指收盘价',
        type: 'line',
        yAxisIndex: 1,
        symbol: 'none',
        lineStyle: {
          color: '#5b2ffa',
          width: 1,
        },
        emphasis: {
          lineStyle: {
            width: 1,
          },
        },
        data: closePrice,
      },
      {
        // gridIndex: 1,
        name: '成交额',
        type: 'bar',
        yAxisIndex: 2,
        xAxisIndex: 1,
        itemStyle: {
          color: '#2f9bfa',
          width: 1,
        },
        data,
      },
    ],
  };
}
