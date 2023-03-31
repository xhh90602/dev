import React, { RefObject, useEffect, useRef, useState } from 'react';
import echarts, { ReactECharts } from '@/components/echarts/line-bar-chart';
import './hk-share-holding-analyze.scss';
import { remToPx } from '@/utils';

type ECharts = InstanceType<typeof ReactECharts>;
const LegendController: React.FC<{ echartRef: RefObject<ECharts> }> = (props) => {
  const { echartRef } = props;

  const [legend, setLegend] = useState([
    { name: '收盤價', show: true },
    { name: '持股比例', show: true },
    { name: '淨買賣股數', show: true },
  ]);
  const triggerLegend = (index: number) => {
    const echart = echartRef.current?.getEchartsInstance();
    legend[index].show = !legend[index].show;
    setLegend([...legend]);
    echart?.dispatchAction({ type: 'legendToggleSelect', name: legend[index].name });
    console.log('legend:', legend);
  };

  return (
    <div styleName="legend">
      <div styleName="circle" onClick={() => triggerLegend(0)}>
        <span style={{ backgroundColor: legend[0].show ? '#FA6D16' : '#8f95a8' }} />
        {legend[0].name}
      </div>
      <div styleName="circle" onClick={() => triggerLegend(1)}>
        <span style={{ backgroundColor: legend[1].show ? '#5B2FFA' : '#8f95a8' }} />
        {legend[1].name}
      </div>
      <div styleName={`round-rect ${legend[2].show ? '' : 'hide'}`} onClick={() => triggerLegend(2)}>
        <span />
        <span />
        {legend[2].name}
      </div>
    </div>
  );
};

const LineCharts: React.FC<any> = () => {
  const xAxisData = [
    '09/30',
    '10/11',
    '10/20',
    '10/28',
    '11/05',
    '11/13',
    '11/22',
    '09/30',
    '10/11',
    '10/20',
    '10/28',
    '11/05',
    '11/13',
    '11/22',
  ];
  const seriesData = [-9, 9.5, -11, -10.5, 12, 11.4, -10.1, -9, 9.5, -11, -10.5, 12, 11.4, -10.1];
  const option = {
    textStyle: {
      fontSize: '0.22rem',
      fontFamily: 'DIN',
      fontWeight: 400,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        animation: false,
      },
    },
    axisPointer: {
      link: [
        {
          xAxisIndex: 'all',
        },
      ],
    },
    legend: {
      top: -9999,
    },
    grid: [
      {
        top: '8%',
        bottom: remToPx(1.98),
        left: 0,
        right: 0,
        containLabel: true,
      },
      {
        top: remToPx(4.59),
        bottom: remToPx(0.2),
        right: remToPx(0.57),
      },
    ],
    xAxis: [
      {
        type: 'category',
        data: xAxisData,
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          color: '#8F95A8',
          fontSize: '0.22rem',
        },
      },
      {
        gridIndex: 1,
        type: 'category',
        data: xAxisData,
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: '#F2F5FF',
          },
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        max: 12,
        min: 8,
        axisLine: {
          color: 'red',
        },
        axisLabel: {
          formatter: '{value}.00',
          color: '#8F95A8',
          fontSize: '0.22rem',
          verticalAlign: 'bottom',
        },
        axisPointer: {
          show: false,
        },
        axisTick: {
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
      },
      {
        type: 'value',
        axisLabel: {
          margin: 0,
          color: '#8F95A8',
          formatter: '{value}.00',
          fontSize: '0.22rem',
          verticalAlign: 'bottom',
        },
        axisTick: {
          show: true,
          length: 27,
          lineStyle: {
            color: '#F2F5FF',
          },
        },
        splitLine: {
          lineStyle: {
            color: '#F2F5FF',
          },
        },
        axisPointer: {
          show: false,
        },
        max: 15,
        min: 11,
      },
      {
        gridIndex: 1,
        type: 'value',
        name: '4000\n萬股',
        nameLocation: 'top',
        nameGap: 30,
        nameTextStyle: {
          color: '#8F95A8',
          align: 'right',
          padding: [0, remToPx(0.1), remToPx(0.2), 0],
        },
        axisLabel: {
          formatter: '00.00',
          margin: 999,
          fontSize: '0.22rem',
        },
        axisPointer: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: '收盤價',
        data: [9, 9.5, 11, 10.5, 12, 11.4, 10.1, 9, 9.5, 11, 10.5, 12, 11.4, 10.1],
        type: 'line',
        color: '#FA6D16',
        symbol: 'none',
      },
      {
        name: '持股比例',
        data: [11.2, 11.5, 12, 13.5, 13, 12, 14.5, 11.2, 11.5, 12, 13.5, 13, 12, 14.5],
        type: 'line',
        color: '#5B2FFA',
        yAxisIndex: 1,
        symbol: 'none',
      },
      {
        yAxisIndex: 2,
        xAxisIndex: 1,
        name: '淨買賣股數',
        data: seriesData.map((value) => ({
          value,
          itemStyle: {
            borderRadius: value > 0 ? [2, 2, 0, 0] : [0, 0, 2, 2],
          },
        })),
        type: 'bar',
        itemStyle: {
          color: (params) => (params.value > 0 ? '#DA070E' : '#06B899'),
        },
      },
    ],
  };

  const echartRef = useRef<ECharts>(null);

  return (
    <>
      <div className="flex-between-center num-font">
        <span>持股比例(%)</span>
        <span>價格(HKD)</span>
      </div>
      <div styleName="number-strands-split-line" />
      <div styleName="line-charts">
        <ReactECharts
          ref={echartRef}
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
        <LegendController echartRef={echartRef} />
      </div>
    </>
  );
};

const ShareHoldingRatio: React.FC = () => {
  useEffect(() => {
    console.log('初始化');
  }, []);

  return (
    <div styleName="module-box share-holding-ratio">
      <div styleName="module-header">
        <span styleName="module-title">港股通持股比例</span>
        <span styleName="module-sub-title" className="num-font">
          2021/12/21更新
        </span>
      </div>
      <LineCharts />
    </div>
  );
};

export default ShareHoldingRatio;
