import { remToPx } from '@/utils';

export default function getOption({ value, names, date, title = '', theme = 'white' }) {
  const colors = [
    {
      whiteColor: '#fa6d0e',
      blackColor: '#fa6d0e',
      whiteStartRgba: 'rgba(250, 109, 14, 0.5)', // 白色皮肤开始rgba色值
      whiteEndRgba: 'rgba(255,255,255, 0.1)', // 白色皮肤结束rgba色值
      blackStartRgba: 'rgba(250, 109, 14, 0.5)', // 黑色皮肤开始rgba色值
      blackEndRgba: 'rgba(255,255,255, 0.1)', // 黑色皮肤结束rgba色值
    },
    {
      whiteColor: '#40a1f4',
      blackColor: '#40a1f4',
      whiteStartRgba: 'rgba(60, 159, 244, 0.5)',
      whiteEndRgba: 'rgba(255,255,255, 0.1)',
      blackStartRgba: 'rgba(60, 159, 244, 0.5)',
      blackEndRgba: 'rgba(255,255,255,0.1)',
    },
    {
      whiteColor: '#6433f3',
      blackColor: '#6433f3',
      whiteStartRgba: 'rgba(98, 51, 245, 0.5)',
      whiteEndRgba: 'rgba(255,255,255, 0.1)',
      blackStartRgba: 'rgba(98, 51, 245, 0.5)',
      blackEndRgba: 'rgba(255,255,255,0.1)',
    },
    {
      whiteColor: '#f062aa',
      blackColor: '#f062aa',
      whiteStartRgba: 'rgba(240, 98, 170, 0.5)',
      whiteEndRgba: 'rgba(255,255,255,0.1)',
      blackStartRgba: 'rgba(240, 98, 170, 0.5)',
      blackEndRgba: 'rgba(255,255,255,0.1)',
    },
  ];
  const seriesMap = ({ name, data, color, startColor, endColor }) => ({
    name,
    type: 'line',
    data,
    // smooth: true,
    symbol: 'none',
    itemStyle: {
      color, // 折线颜色
    },
    lineStyle: {
      width: 1,
    },
    areaStyle: {
      origin: 'start',
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0, // 从左到右
        y2: 1, // 从上到下
        colorStops: [
          {
            offset: 0,
            color: startColor, // 0% 处的颜色
          },
          {
            offset: 1,
            color: endColor, // 100% 处的颜色
          },
        ],
        globalCoord: false, // 缺省为 false
      },
    },
  });
  const SeriesData = () => {
    const temp: any = [];
    value.forEach((item: any, idx: number) => {
      const series = seriesMap({
        name: names[idx],
        data: item,
        color: theme === 'white' ? colors[idx].whiteColor : colors[idx].blackColor,
        startColor: theme === 'white' ? colors[idx].whiteStartRgba : colors[idx].blackStartRgba,
        endColor: theme === 'white' ? colors[idx].whiteEndRgba : colors[idx].blackEndRgba,
      });
      temp.push(series);
    });
    return temp;
  };

  const option = {
    title: {
      show: !!title,
      text: title,
      textAlign: 'left',
      textVerticalAlign: 'top',
      padding: [2, 0, 0, 0],
      textStyle: {
        color: '#8f95a8', // title颜色
        fontWeight: 400,
        fontSize: remToPx(0.24),
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(50,50,50,0.7)',
      borderWidth: 0,
      textStyle: {
        color: '#fff',
      },
      confine: true,
      valueFormatter: (v) => `${v}%`,
    },
    legend: {
      type: 'plain',
      data: names,
      itemWidth: remToPx(0.18),
      itemHeight: remToPx(0.18),
      bottom: 0,
      icon: 'circle',
      itemGap: remToPx(0.5),
      textStyle: {
        color: '#1F2D56',
        fontWeight: 400,
        fontSize: remToPx(0.24),
      },
    },
    grid: {
      show: false,
      left: '0%',
      right: '0%',
      bottom: '15%',
      top: '5%',
      containLabel: true,
    },
    xAxis: {
      boundaryGap: false,
      data: date,
      axisLine: {
        show: true,
        onZero: false,
        lineStyle: {
          type: 'dashed',
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
        splitNumber: 0,
        minInterval: 0,
        maxInterval: 0,
        interval: 0,
        hideOverlap: false,
        formatter: (data, index) => {
          if (index === 0) {
            return `{left|${data}}`;
          }
          console.log(Math.ceil(value && value[0] && value[0].length / 2));

          if (index + 1 === (Math.ceil(value && value[0] && value[0].length / 2) || 0)) {
            return `{center|${data}}`;
          }
          if (index === ((value && value[0] && value[0].length - 1) || 0)) {
            return `{right|${data}}`;
          }
          return '';
        },
        rich: {
          left: {
            align: 'left',
          },
          center: {
            align: 'center',
          },
          right: {
            align: 'right',
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
      splitNumber: 2,
      splitLine: {
        show: false,
      },
      axisLabel: {
        color: '#b5bbcf',
        fontWeight: 100,
        fontSize: 10,
        formatter: (data) => `${data}%`,
      },
    },
    series: SeriesData(),
  };
  return option;
}
