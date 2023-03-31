import React, { useState, useRef, useEffect } from 'react';
import { useIntl } from 'react-intl';
import dayjs from 'dayjs';
import * as echarts from 'echarts/core';
import { LineChart, BarChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { normalToggleNativeGesture } from '@/platforms/mobile/helpers/native/msg';
import getLineOption from './helper/getLineOption';
import getBarOption from './helper/getBarOption';
import './index.scss';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  BarChart,
  CanvasRenderer,
]);

const Chart: React.FC<any> = (props) => {
  const { data = [], type, selectItem = null, names, title = '', colors, legend } = props;
  const { formatMessage } = useIntl();
  const [myChartDom, setMyChartDom] = useState<any>(null);
  const chartRef: any = useRef();

  // 字段类型格式化。 1: 保留2位小数；2：保留两位小数，并且加%；3：金额转换成万亿、亿、万，并且保留两位小数；4：日期格式化
  const fieldFormat = (val) => {
    const { formatType } = selectItem;
    if (val !== null && val !== '') {
      if (formatType === 1 || formatType === 2) {
        return val ? +val.toFixed(2) : 0.00;
      }
      if (formatType === 3) {
        return +(val / 100000000).toFixed(2); // 亿
      }
      return +val;
    }
    return 0;
  };

  const listData = () => {
    if (type === 'closPrice') {
      const value: any = [];
      const date: any = [];
      if (data && data.length) {
        data.forEach((item, idx) => {
          if (item && item.length) {
            const temp: any = [];
            item.forEach((ele: any) => {
              temp.push(fieldFormat(ele.mvol));
              if (idx === 0) {
                if (ele.endDate) {
                  date.push(dayjs(ele.endDate).format('YYYY/MM/DD'));
                } else {
                  date.push(dayjs().format('YYYY/MM/DD'));
                }
              }
            });
            value.push(temp);
          }
        });
      }
      if (date && date.length === 1) {
        value.forEach((item) => {
          if (item && item.length === 1) {
            item.unshift(0);
          }
        });
        date.unshift(date[0]);
      }
      return getLineOption({
        date,
        value: [...value],
        names,
        legend,
        colors,
        title,
        selectItem,
        formatMessage,
      });
    }
    if (type === 'turnover') {
      let temp: any = [];
      if (data && data.length) {
        temp = data.map((item) => fieldFormat(item?.mvol || 0));
        for (let i = temp.length; i < 3; i += 1) {
          temp.push(0);
        }
      }
      return getBarOption({
        data: [...temp],
        title,
        colors,
        legend,
        selectItem,
        formatMessage,
      });
    }
    return null;
  };

  const initEchart = () => {
    let myChart = myChartDom;
    if (myChartDom === null) {
      myChart = echarts.init(chartRef.current);
      setMyChartDom(myChart);
    }
    myChart.setOption(listData());
    window.addEventListener('resize', () => {
      myChart.resize();
    });
    // [本组合]不能被隐藏
    myChart.on('legendselectchanged', (params: any) => {
      const { name } = params;
      const LegendName = formatMessage({ id: 'zs1' });
      if (name === LegendName) {
        myChart.dispatchAction({
          type: 'legendSelect',
          name: LegendName,
        });
      }
    });
    // 隐藏 tooltip
    const bodyDom = document.body;
    bodyDom.addEventListener('touchend', () => {
      myChart.dispatchAction({ type: 'hideTip' });
      setTimeout(() => {
        myChart.dispatchAction({
          type: 'updateAxisPointer',
          currTrigger: 'leave',
        });
      }, 500);
    }, false);
  };

  useEffect(() => {
    if (myChartDom) {
      myChartDom.clear();
    }
    initEchart();
  }, [data, legend]);

  return (
    <div styleName="page">
      <div
        styleName="react-echart"
        ref={chartRef}
        onTouchStart={() => {
          normalToggleNativeGesture(0);
        }}
        onTouchEnd={() => {
          normalToggleNativeGesture(1);
        }}
      />
    </div>
  );
};

export default Chart;
