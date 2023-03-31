import React from 'react';
import echarts, { ReactECharts } from '@/components/echarts/line-bar-chart';
import 'echarts/lib/component/dataZoom';
import './line-bar-charts.scss';
import { remToPx } from '@/utils';
import { identifyIosSystem } from '@mobile/mpa/modules/market/utils/identify-ios-system';

const LineBarCharts: React.FC<{ data: Record<string, any>; options:any }> = (props) => {
  const { data, options = {} } = props;
  const option = {
    textStyle: {
      fontFamily: 'DIN',
      fontWeight: 400,
      fontSize: '0.22rem',
      color: '#8F95A8',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        animation: false,
      },
    },
    legend: {
      bottom: remToPx(0.03),
      padding: 0,
      height: remToPx(0.27),
      itemHeight: remToPx(0.12),
      itemWidth: remToPx(0.12),
      itemGap: identifyIosSystem() ? 100 : 50,
      // itemGap: 60,
      data: data.map((item) => ({
        name: item.legendName,
        icon: 'circle',
      })),
      textStyle: {
        color: '#8F95A8',
        padding: [0, 0, 0, remToPx(0.1)],
      },
    },
    grid: {
      top: '5%',
      bottom: remToPx(0.52),
      left: identifyIosSystem() ? '7%' : 0,
      right: identifyIosSystem() ? '7%' : 0,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: data[0].xAxisData,
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        fontSize: '0.22rem',
        color: '#8F95A8',
        interval: data[0].xAxisData.length > 4 ? 3 : 0,
      },
    },
    yAxis: data.map((item) => ({
      type: 'value',
      scale: true,
      splitNumber: 4,
      axisLabel: {
        fontSize: '0.22rem',
        verticalAlign: 'bottom',
        formatter: item.yLabelFormatter,
      },
      axisPointer: {
        show: false,
      },
      axisTick: {
        length: remToPx(0.55),
        show: true,
        lineStyle: {
          color: '#F7F8FC',
        },
      },
      splitLine: {
        lineStyle: {
          color: '#F7F8FC',
        },
      },
    })),
    series: data.map((item) => ({ name: item.legendName, ...item.series })),
    ...options,
  };

  return (
    <>
      <div className="flex-between-center num-font">
        {data.map((item) => (
          <span>{item.yAxisName}</span>
        ))}
      </div>
      <div styleName="line-bar-charts">
        <ReactECharts
          echarts={echarts}
          option={option}
          style={{ height: '100%', width: '100%' }}
          notMerge
          lazyUpdate
          opts={{ renderer: 'svg' }}
          loadingOption={{
            text: '',
            lineWidth: 2,
            spinnerRadius: 15,
          }}
        />
      </div>
    </>
  );
};

export default LineBarCharts;
