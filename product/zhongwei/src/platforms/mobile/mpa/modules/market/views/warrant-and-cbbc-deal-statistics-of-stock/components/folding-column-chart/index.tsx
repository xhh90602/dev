import React, { useState, useRef, useEffect } from 'react';
import * as echarts from 'echarts/core';
import { ToolboxComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { BarChart, LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import getMoneyFlowChartOption from './get-money-flow-option';
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

const FoldingColumnChart: React.FC<any> = (props) => {
  const { chartData, formatMessage, quoteChangeColor, theme } = props;
  const [myChartDom, setMyChartDom] = useState<any>(null);
  const chartRef: any = useRef();

  const initEchart = () => {
    const myChart = echarts.init(chartRef.current);
    myChart.setOption(getMoneyFlowChartOption(chartData, formatMessage, quoteChangeColor, theme));
    setMyChartDom(myChart);
    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };

  useEffect(() => {
    if (chartData) {
      if (myChartDom) {
        myChartDom.dispose();
      }
      initEchart();
    }
  }, [chartData]);

  return (
    <div styleName="echarts-page-con">
      <div styleName="react-echart" ref={chartRef} />
    </div>
  );
};

export default FoldingColumnChart;
