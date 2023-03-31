/* eslint-disable @typescript-eslint/no-shadow */
import { remToPx } from '@/utils';

export default function getOption({
  value,
  name = '',
  color = [
    [0.1, '#88E19F'],
    [0.2, '#68D983'],
    [0.3, '#5ACA78'],
    [0.4, '#75B0FD'],
    [0.5, '#5F9CF0'],
    [0.6, '#4C90ED'],
    [0.7, '#F6B234'],
    [0.8, '#E68849'],
    [0.9, '#DF413D'],
    [1, '#C50F0B'],
  ],
  detailOffsetY = '-10%',
  titleOffsetY = '-35%',
}) {
  return {
    series: [
      {
        startAngle: 180,
        splitNumber: 100,
        endAngle: 0,
        type: 'gauge',
        center: ['50%', '99%'],
        radius: '150%',
        axisLine: {
          lineStyle: {
            width: remToPx(0.4),
            color,
          },
        },
        pointer: {
          width: remToPx(0.06),
          icon: 'rect',
          length: '20%',
          offsetCenter: [0, '-75%'],
          itemStyle: {
            color: '#fff',
            shadowColor: '#bbb',
            shadowBlur: 10,
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: true,
          color: '#1F2D56',
          fontSize: remToPx(0.24),
          distance: remToPx(-0.9),
          formatter: (value) => {
            if (value === 10) {
              return '低';
            } if (value === 50) {
              return '中';
            } if (value === 90) {
              return '高';
            } if (value === 99) {
              return '危险';
            }
            return '';
          },
        },
        title: {
          offsetCenter: [0, titleOffsetY],
          fontSize: remToPx(0.22),
        },
        detail: {
          valueAnimation: true,
          formatter: (value: any) => `${value}%`,
          color: '#1F2D56',
          fontSize: remToPx(0.46),

          offsetCenter: [0, detailOffsetY],
        },
        data: [
          {
            value,
            name,
          },
        ],
      },
    ],
  };
}
