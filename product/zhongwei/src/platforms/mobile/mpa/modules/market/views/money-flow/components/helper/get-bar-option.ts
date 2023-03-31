import { toPositiveSign } from '@dz-web/o-orange';

export default function getBarOption(data: number[], unit, formatMessage) {
  return {
    tooltip: {
      trigger: 'axis',
      show: false,
    },
    grid: {
      top: 25,
      bottom: 0,
      containLabel: true,
    },
    legend: {
      show: false,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [
        formatMessage({ id: 'oversized_order' }),
        formatMessage({ id: 'big_order' }),
        formatMessage({ id: 'medium_order' }),
        formatMessage({ id: 'small_order' }),

      ],
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        color: '#999',
      },
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    series: [
      {
        name: formatMessage({ id: 'net_inflow' }),
        // name: '净流入',
        type: 'bar',
        data,
        label: {
          show: true,
          formatter: (params) => `${toPositiveSign(params.value)}${unit}`,
          position: 'top',
        },
      },
    ],
  };
}
