import { remToPx } from '@/utils';

const colorList = [
  '#fab02f',
  '#80e09b',
  '#7879f1',
  '#ea8749',
  '#529af3',
  '#fa3135',
  '#eedaa3',
  '#feddb9',
  '#2e9cfb',
  '#e76147',
  '#1c3c61',
  '#633ae5',
  '#309bfb',
  '#fbb12d',
  '#f88684',
  '#13af94',
  '#9a60b4',
  '#ea7ccc',
  '#5da0db',
  '#e37b36',
];

export default function getOption({
  data,
  showLabel,
  colors = colorList,
  borderWidth = 0, // 饼状图之间的间隔
  radius = ['44%', '85%'],
  top = 20,
  bottom = 20,
}) {
  return {
    color: colors,
    series: [
      {
        type: 'pie',
        center: ['50%', '50%'],
        radius,
        clockwise: false, // 饼图的扇区是否是顺时针排布
        avoidLabelOverlap: true,
        startAngle: 90,
        top,
        bottom,
        label: {
          show: showLabel,
          position: 'center',
          formatter: '{d}%',
          fontSize: remToPx(0.3),
          fontWeight: 'bold',
          fontFamily: 'DIN',
        },
        itemStyle: {
          borderRadius: 0,
          borderColor: '#fff',
          borderWidth,
        },
        silent: true,
        labelLine: {
          length: 8,
          length2: 15,
          smooth: false,
        },
        data,

      },
    ],
  };
}
