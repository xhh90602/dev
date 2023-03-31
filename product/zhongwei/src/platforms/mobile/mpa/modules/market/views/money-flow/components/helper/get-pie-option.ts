export default function getPieOption(pureBuyAmount, formatMessage, buyList = [], sellList = [], theme = 'white') {
  const data = [...buyList, ...sellList].map((item: any) => ({
    name: item.name,
    value: Number(item.value),
    itemStyle: {
      color: item.bgColor,
    },
  }));

  return {
    title: {
      show: true,
      text: ` ${formatMessage({ id: 'pure_amount' })}`,
      subtext: pureBuyAmount,
      top: '30%',
      left: '45%',
      textAlign: 'center',
      textStyle: {
        color: theme === 'white' ? '#666' : '#999',
        fontSize: 12,
      },
      subtextStyle: {
        color: theme === 'white' ? '#212121' : '#ddd',
        align: 'center',
        fontSize: 14,
      },
    },
    tooltip: {
      show: false,
      trigger: 'item',
    },
    grid: {
      top: 0,
      left: 0,
      // right: 0,
      // bottom: 0,
    },
    legend: {
      top: '5%',
      left: 'center',
      show: false,
    },
    series: [
      {
        // name: '净额',
        name: formatMessage({ id: 'pure_amount' }),
        type: 'pie',
        radius: ['60%', '85%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: false,
            fontSize: '14',
          },
        },
        labelLine: {
          show: false,
        },
        data,
        markLine: {
          data: {
            0: {
              name: '34232432',
              xAxis: 0,
              label: {
                show: true,
                fontSize: 16,
                color: 'red',
                formatter: () => '32432',
              },
            },
            1: {
              name: '34232432',
              x: 200,
              y: 200,
              label: {
                show: true,
                fontSize: 16,
                color: 'red',
                formatter: () => '32432',
              },
            },
          },
        },
      },
    ],
  };
}
