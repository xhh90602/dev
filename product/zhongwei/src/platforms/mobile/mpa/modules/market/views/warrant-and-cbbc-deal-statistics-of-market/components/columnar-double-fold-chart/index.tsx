import React, { useState, useRef, useEffect } from 'react';
import * as echarts from 'echarts/core';
import { ToolboxComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { BarChart, LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import getHSTrendChartOption from './get-hs-trend-chart-option';
import 'echarts/lib/component/dataZoom';
import './index.scss';

echarts.use([
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
]);

const ColumnarDoubleFold: React.FC<any> = (props) => {
  const { warrantAndCBBCHSInfo, formatMessage, tabName, theme } = props;
  const [chartDom, setChartDom] = useState<any>(null);
  const myChartRef: any = useRef();

  const initEchart = () => {
    const myChart = echarts.init(myChartRef.current);
    myChart.setOption(getHSTrendChartOption(warrantAndCBBCHSInfo, formatMessage, tabName, theme));
    setChartDom(myChart);
    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };

  useEffect(() => {
    if (warrantAndCBBCHSInfo) {
      if (chartDom) {
        chartDom.dispose();
      }
      initEchart();
    }
  }, [warrantAndCBBCHSInfo, formatMessage, tabName, theme]);

  return (
    <div styleName="echarts-page-con">
      <div styleName="react-echart" ref={myChartRef} />
    </div>
  );
};

export default ColumnarDoubleFold;
