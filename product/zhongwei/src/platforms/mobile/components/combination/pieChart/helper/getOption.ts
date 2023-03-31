const colorList = [
  '#fab02f',
  '#80e09b',
  '#7879f1',
  '#ea8749',
  '#529af3',
  '#eedaa3',
  '#fa3135',
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
        startAngle: 45,
        top: 20,
        bottom: 20,
        label: {
          show: showLabel,
          formatter: (params) => {
            const {
              data: { name, value = 0, unit = '%' },
            } = params;
            if (name.indexOf('*') > -1) {
              return `{name|${name}}\n{value|******}`;
            }
            return `{name|${name}}\n{value|${value}${unit}}`;
          },
          rich: {
            name: {
              color: '#1f2d56',
              fontSize: 10,
              fontWeight: 400,
              lineHeight: 16,
            },
            value: {
              color: '#717686',
              fontSize: 10,
              fontWeight: 400,
              lineHeight: 16,
            },
          },
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
        // data: [
        //   { value: 10, name: '建设银行' },
        //   { value: 10, name: '新基建啊' },
        //   { value: 30, name: '对外贸易' },
        // ],
      },
    ],
  };
}
