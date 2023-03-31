import * as React from 'react';
import { useContext, useEffect, useRef } from 'react';
import { userConfigContext } from '@mobile/helpers/entry/native';
import { toUnit } from '@dz-web/o-orange';

import echarts from '@/components/echarts/pie-chart';
import { amountFormatToCN } from '@/platforms/mobile/mpa/modules/market/utils/amount-format-cn';
import { useIntl } from 'react-intl';
import './shareholder-chart.scss';

interface IProps {
  shareStructureData: any,
  allShare:number
  bigMarket: string
}

const colorObj = {
  hk_share: '#5B2FFA',
  // other_share: '#fec722',
  other_share: '#FAB02F',
  org_share: '#FAB02F',
  fund_share: '#80E09B',
  mng_share: '#7879F1',
};

const getText = (market) :string => {
  if (market === 'USA') return 'UsaAllShare';
  return 'HkexAllShare';
};

const getSubText = (market):string => {
  if (market === 'USA') return '(股)';
  return '';
};

const ShareholderChart:React.FC<IProps> = ({ shareStructureData, allShare, bigMarket }) => {
  const { formatMessage } = useIntl();
  const chartRef = useRef<HTMLInputElement | null>(null);
  const userConfig = useContext<any>(userConfigContext);
  const { language } = userConfig;

  function getOptions(Data, theme) {
    const legendArr = Data.map((item) => ({
      name: formatMessage({ id: item.key }),
      icon: 'circle',
    }));
    const dataValue = Data.map((item) => ({ name: formatMessage({ id: item.key }),
      value: item.issue_share,
      itemStyle: {
        color: colorObj[item.key],
      } }));
    console.log(dataValue, 'dataValue');
    console.log(bigMarket, 'bigMarket');
    console.log(allShare, 'allShare');
    return {
      title: {
        subtext: formatMessage({ id: getText(bigMarket) }),
        text: `${toUnit(allShare, { lanType: language })}${getSubText(bigMarket)}`,
        left: bigMarket === 'USA' ? 18 : 25, // 对齐方式居中
        top: '45%', // 距离顶部
        textStyle: {
          // 文字配置
          color: theme === 'black' ? '#1F2D56' : '#1F2D56', // 文字颜色
          fontSize: 13, // 字号
          align: 'center', // 对齐方式
        },
        subtextStyle: {
          color: theme === 'black' ? '#8F95A8' : '#8F95A8',
          fontSize: 10, // 字号
          align: 'center', // 对齐方式
        },
        itemGap: 5,
      },
      grid: {
        width: '180px',
        height: '180px',
      },
      legend: {
        orient: 'vertical',
        align: 'left',
        itemHeight: 8,
        itemWidth: 8,
        right: -5,
        top: '30%',
        itemStyle: {
          borderCap: 'round',
        },
        borderRadius: '2',
        // left: 0,
        icon: 'rect',
        textStyle: {
          // color: theme === 'black' ? '#999' : '#666',
          fontSize: 24,

          rich: {
            name: {
              color: '#1F2D56',
              lineHeight: 10,
              fontSize: 14,
              // padding: [0, 0, 0, 10],
            },
            share: {
              color: '#717686',
              lineHeight: 10,
              // padding: 0,
              padding: [0, 10, 0, 10],
              fontSize: 14,
            },
            value: {
              color: '#717686',
              lineHeight: 10,
              fontSize: 14,
              padding: [0, 5, 0, 0],
            },
          },
        },
        data: legendArr,
        formatter(name) {
          const item = dataValue.find((el) => el.name === name);

          return [
            `{name|${item.name}}`,
            `{share|${((item.value / allShare) * 100).toFixed(2)}%}`,
            `{value|${toUnit(item.value, { lanType: language })}}`,
          ].join('');
        },
      },
      series: [
        {
          type: 'pie',
          top: 18,
          label: {
            show: false,
            textBorderColor: 'none',
            color: theme === 'black' ? '#ddd' : '#212121',
            textBorderWidth: 0,
            formatter({ value }) {
              return `${((value / allShare) * 100).toFixed(2)}%\n${amountFormatToCN(`${value}`)}`;
            },
            lineHeight: 16,
          },
          startAngle: 120,
          emphasis: {
            scale: false,
          },
          slient: true,
          data: dataValue,
          center: ['16%', '50%'],
          radius: ['60%', '80%'],
          labelLine: {
            show: false,
          },
        },
      ],
    };
  }

  useEffect(() => {
    console.log(shareStructureData, '<---shareStructureData');
    if (!shareStructureData) return;
    const { height, width } = chartRef.current;
    if (chartRef.current) {
      const dom = echarts.init(chartRef.current, null, {
        height,
        width,
      });
      dom.setOption(getOptions(shareStructureData, userConfig.theme));
    }
  }, [shareStructureData, userConfig.theme, language]);

  return <div styleName="chart-box" ref={chartRef} />;
};

export default ShareholderChart;
