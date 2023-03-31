import React, { useState, useRef, useEffect } from 'react';
import { useIntl } from 'react-intl';
import dayjs from 'dayjs';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { normalToggleNativeGesture } from '@/platforms/mobile/helpers/native/msg';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import getOption from './helper/getOption';
import './index.scss';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
]);

const Chart: React.FC<any> = (props) => {
  const { data, title = '' } = props;
  const { formatMessage } = useIntl();
  const [myChartDom, setMyChartDom] = useState<any>(null);
  const chartRef: any = useRef();

  const listData = () => {
    const value: any = [];
    const names: any = [];
    if (data && data.length) {
      data.forEach((item) => {
        names.push(item.name);
        value.push(item.value);
      });
    } else {
      names.push(formatMessage({ id: 'zs1' }));
      value.push([0]);
    }
    const nowDate = dayjs().format('YYYY-MM-DD');
    let date: any = null;
    if (data[0]?.date) {
      if (data[0]?.date.length === 0) {
        date = [nowDate, null];
      }
      if (data[0]?.date.length === 1) {
        date = [data[0]?.date, nowDate];
      }
      date = data[0].date;
    } else {
      date = [nowDate, null];
    }
    return getOption({
      date,
      value,
      names,
      title,
    });
  };

  const initEchart = () => {
    let myChart = myChartDom;
    if (myChart === null) {
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
    if (data) {
      initEchart();
    } else if (myChartDom) {
      myChartDom.clear();
    }
  }, [data]);

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
