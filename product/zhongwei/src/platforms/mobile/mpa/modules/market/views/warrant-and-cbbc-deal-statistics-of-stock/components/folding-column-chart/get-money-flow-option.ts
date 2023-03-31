import { toPositiveSign } from '@dz-web/o-orange';
import { getClassNameByPriceChange } from '@dz-web/quote-client';

export default function getMoneyFlowChartOption(chartData, formatMessage, raise = 'red', theme = 'white') {
  const { tradeDay, good, bad, closePrice, tooltipInfo, unit = '--' } = chartData;
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
      textStyle: {
        fontSize: 12,
      },
      className: 'custom-echarts-tooltip',
      formatter(params) {
        const index = params[0].dataIndex;
        const tooltip = tooltipInfo[index] || {};
        return `
          <h3 styleName="pop-warp">${tooltip.date}</h3>

          <ol>
            <li>
              <span>${formatMessage({ id: 'good_hold_inflow' })}</span>
              <span>${toPositiveSign(good[index])}${unit}</span>
            </li>
            <li>
              <span>${formatMessage({ id: 'call' })}</span>
              <span>${toPositiveSign(tooltip.subscribe)}${unit}</span>
            </li>
            <li class="special">
              <span>${formatMessage({ id: 'bull' })}</span>
              <span>${toPositiveSign(tooltip.cattleCard)}${unit}</span>
            </li>
            <li>
              <span>${formatMessage({ id: 'bad_hold_inflow' })}</span>
              <span>${toPositiveSign(bad[index])}${unit}</span>
            </li>
            <li>
              <span>${formatMessage({ id: 'put' })}</span>
              <span>${toPositiveSign(tooltip.put)}${unit}</span>
            </li>
            <li>
              <span>${formatMessage({ id: 'bear' })}</span>
              <span>${toPositiveSign(tooltip.bear)}${unit}</span>
            </li>
            <li>
              <span>${formatMessage({ id: 'close_price' })}</span>
              <span class="${getClassNameByPriceChange(closePrice[index])}">
                ${closePrice[index]}(${tooltip.riseRate})
              </span>
            </li>
          </ol>
        `;
      },
      // 根据黑白皮肤切换
      backgroundColor: theme !== 'dark' ? 'rgb(255, 255, 255, 90%)' : '#222f3fe6',
      borderColor: theme !== 'dark' ? 'rgb(255, 255, 255)' : 'transparent',
      boxShadow: theme !== 'dark' ? '.02rem .04rem .2rem rgb(0, 0, 0, 20%)' : '0 0 .2rem 0 rgba(0, 0, 0, 50%);',
    },
    grid: {
      left: 0,
      right: 0,
      top: 40,
      bottom: 10,
      containLabel: true,
    },
    legend: {
      show: false,
    },
    toolbox: {
      show: false,
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: tradeDay,
      axisLabel: {
        color: '#999',
      },
      axisLine: {
        lineStyle: {
          color: '#efefef',
        },
      },
      axisTick: {
        show: false,
      },
      axisPointer: {
        label: {
          backgroundColor: 'rgba(0, 0, 0, .5)',
        },
      },
    },
    yAxis: [
      {
        type: 'value',
        // name: formatMessage({ id: 'pure_inflow_unit' }, { unit }),
        name: `${formatMessage({ id: 'pure_inflow_unit1' })}(${unit})`,
        nameTextStyle: {
          color: '#717686',
          align: 'left',
          padding: [0, 0, 0, -15],
        },
        splitLine: {
          show: false,
        },
        nameLocation: 'end',
        axisLabel: {
          formatter: '{value}',
          color: '#8f95a8',
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#efefef',
          },
        },
        axisPointer: {
          label: {
            backgroundColor: 'rgba(0, 0, 0, .5)',
          },
        },
      },
      {
        type: 'value',
        name: formatMessage({ id: 'stock_price' }),
        nameTextStyle: {
          color: '#717686',
          align: 'left',
          padding: [0, 30, 0, 0],
        },
        scale: true,
        splitLine: {
          show: false,
        },
        axisLabel: {
          color: '#8f95a8',
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#efefef',
          },
        },
        axisPointer: {
          label: {
            backgroundColor: 'rgba(0, 0, 0, .5)',
          },
        },
      },
    ],
    series: [
      {
        name: '好仓',
        type: 'bar',
        yAxisIndex: 0,
        data: good,
        itemStyle: {
          // color: raise === 'red' ? '#029a01' : '#ef5a3c',
          color: raise === 'red' ? '#06B899' : '#da070e',
        },
      },
      {
        name: '淡仓',
        type: 'bar',
        yAxisIndex: 0,
        itemStyle: {
          // color: raise !== 'red' ? '#029a01' : '#ef5a3c',
          color: raise !== 'red' ? '#06B899' : '#da070e',
        },
        data: bad,
      },
      {
        name: '股价',
        type: 'line',
        symbol: 'none',
        yAxisIndex: 1,
        data: closePrice.map((item) => Number(item)),
        lineStyle: {
          width: 1,
          // color: '#5c85ec',
          color: '#fa6d16',
        },
        emphasis: {
          lineStyle: {
            width: 1,
          },
        },
      },
    ],
  };
}
