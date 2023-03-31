// eslint-disable-next-line default-param-last
export default function getFunnelChartOption(rate = 0, state, theme = 'white') {
  return {
    series: [
      {
        name: 'Indicator',
        type: 'gauge',
        splitNumber: 5,
        detail: {
          valueAnimation: true,
          formatter: (params) => `${params.toFixed(2)}%`,
          // color: theme === 'white' ? '#212121' : '#ddd',
          color: theme === 'white' ? '#212121' : '#1f2d56',
          fontSize: '28px',
          fontWeight: 'normal',
          offsetCenter: ['0%', '-33%'],
          // offsetCenter: ['0%', '-28%'],
        },
        title: {
          fontSize: '14px',
          color: theme === 'white' ? '#212121' : '#ddd',
          offsetCenter: ['0%', '0%'],
        },
        progress: {
          show: true,
          width: 15,
          itemStyle: {
            opacity: 0.8,
            color: {
              type: 'linear',
              x: 0,
              y: 1,
              x2: 1,
              y2: 0,
              colorStops: [
                {
                  offset: 0,
                  // color: theme === 'white' ? '#FFBE8C' : '#612902', // 0% 处的颜色
                  color: theme === 'white' ? '#2f9bfa' : '#612902', // 0% 处的颜色
                },
                {
                  offset: 1,
                  // color: theme === 'white' ? '#FF8831' : '#F96B02', // 100% 处的颜色
                  color: theme === 'white' ? '#2f9bfa' : '#F96B02', // 100% 处的颜色
                },
              ],
            },
          },
        },
        pointer: {
          show: false,
        },
        axisLabel: {
          distance: -18.5,
          fontSize: '14px',
          // color: theme === 'white' ? '#888' : '#666',
          color: theme === 'white' ? '#b5bbcf' : '#666',
        },
        axisLine: {
          lineStyle: {
            width: 15,
            // color: [[1, theme === 'white' ? '#FFECDF' : '#211004']],
            color: [[1, theme === 'white' ? '#dee1ef' : '#211004']],
            // color: [
            //   [0, '#FFBE8C'],
            //   [1, '#FF8831'],
            // ],
          },
        },
        axisTick: {
          show: true,
          distance: -20,
          splitNumber: 20,
          length: 3,
          lineStyle: {
            // color: '#FF6C00',
            color: '#dee1ef',
          },
        },
        splitLine: {
          distance: -23,
          length: 7,
          lineStyle: {
            // color: theme === 'white' ? '#FF6C00' : '#F96B02',
            color: theme === 'white' ? '#dee1ef' : '#F96B02',
            width: 2,
          },
        },
        radius: '120px',
        center: ['50%', '150px'],
        startAngle: 180,
        endAngle: 0,
        data: [
          {
            value: rate * 100,
            // name: state, // 展示“正常、偏高、极高”
          },
        ],
      },
    ],
  };
}
