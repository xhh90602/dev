import React, { useState, useRef, useEffect } from 'react';
import * as echarts from 'echarts/core';
import { GaugeChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import getFunnelChartOption from './get-funnel-chart-option';
import './index.scss';

echarts.use([GaugeChart, CanvasRenderer]);

const AirTemperatureInstrumentChart: React.FC<any> = (props) => {
  const { warrantAndCBBCHSInfo, formatMessage, theme } = props;
  const [myChartDom, setMyChartDom] = useState<any>(null);
  const chartRef: any = useRef();

  const initEchart = () => {
    const myChart = echarts.init(chartRef.current);
    myChart.setOption(getFunnelChartOption(warrantAndCBBCHSInfo, formatMessage, theme));
    setMyChartDom(myChart);
    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };

  useEffect(() => {
    if (warrantAndCBBCHSInfo) {
      if (myChartDom) {
        myChartDom.dispose();
      }
      initEchart();
    }
  }, [warrantAndCBBCHSInfo]);

  return (
    <div styleName="air-temperature-page">
      <div styleName="react-echart" ref={chartRef} />
    </div>
  );
};

export default AirTemperatureInstrumentChart;
