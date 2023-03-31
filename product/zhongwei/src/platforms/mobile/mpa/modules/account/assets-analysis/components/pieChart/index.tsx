import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import getOption from './helper/getOption';
import './index.scss';

echarts.use([PieChart, CanvasRenderer]);

const MyEcharts = (props) => {
  const { data, showLabel = false, radius, borderWidth, top = 10, bottom = 10, colors } = props;
  const [myChartDom, setMyChartDom] = useState<any>(null);
  const chartRef: any = useRef();
  const listData = () => getOption({
    data,
    radius,
    showLabel,
    borderWidth,
    top,
    bottom,
    colors,
  });

  const initEchart = () => {
    const myChart = echarts.init(chartRef.current);
    setMyChartDom(myChart);
    myChart.setOption(listData());

    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };

  useEffect(() => {
    if (data) {
      if (myChartDom) {
        myChartDom.dispose();
      }
      initEchart();
    }
  }, [data]);

  return (
    <div styleName="page">
      <div styleName="react-echart" ref={chartRef} />
    </div>
  );
};

export default MyEcharts;
