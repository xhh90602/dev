import { useEffect, useMemo, useRef, useState } from 'react';
import { Modal } from 'antd-mobile';
import * as echarts from 'echarts/core';
import { GaugeChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { InformationCircleOutline } from 'antd-mobile-icons';
import { LEVEL } from '@/hooks/trade/use-get-capital';
import getOption from './helper/getOption';
import './index.scss';

echarts.use([GaugeChart, CanvasRenderer, GridComponent]);

const hintList = [
  {
    isTrue: (level: string) => level === LEVEL.L1,
    text: (
      <div>
        您的借款风险值为
        <span className="color-basic">【安全】</span>
        账户无平仓风险
      </div>
    ),
  },
  {
    isTrue: (level: string) => level === LEVEL.L2,
    text: (
      <div>
        您的借款风险值为
        <span className="color-basic">【低风险】</span>
        账户有较低平仓风险
      </div>
    ),
  },
  {
    isTrue: (level: string) => level === LEVEL.L3,
    text: (
      <div>
        您的借款风险值为
        <span className="color-basic">【中风险】</span>
        账户有较高平仓风险
      </div>
    ),
  },
  {
    isTrue: (level: string) => level === LEVEL.L4,
    text: (
      <div>
        您的借款风险值为
        <span className="color-basic">【中高风险】</span>
        账户有高平仓风险
      </div>
    ),
  },
  {
    isTrue: (level: string) => level === LEVEL.L5,
    text: (
      <div>
        您的借款风险值为
        <span className="color-basic">【高风险】</span>
        账户有极高平仓风险，请及时入金
      </div>
    ),
  },
  {
    isTrue: (level: string) => level === LEVEL.L6,
    text: (
      <div>
        您的借款风险值为
        <span className="color-basic">【危险】</span>
        账户即将出发平仓线，请及时入金
      </div>
    ),
  },
];

interface IProps {
  name?: string;
  detailOffsetY?: string;
  titleOffsetY?: string;
  showCharts?: boolean
  level?: string; // L1-L5
}

const BorrowingBalance: React.FC<IProps> = (props) => {
  const { detailOffsetY = '-10%', titleOffsetY = '-35%', showCharts = true, level = 'L1' } = props;
  const [value, setValue] = useState(30);
  const [visible, setVisible] = useState(false);
  const [myChartDom, setMyChartDom] = useState<any>(null);
  const chartRef: any = useRef();
  const listData = () => getOption({
    value,
    detailOffsetY,
    titleOffsetY,
  });

  const initEchart = () => {
    const myChart = echarts.init(chartRef.current);
    setMyChartDom(myChart);
    myChart.setOption(listData());

    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };

  const hintText = useMemo(() => hintList.find((item) => item.isTrue(level))?.text || '', [value]);

  useEffect(() => {
    if (value && showCharts) {
      if (myChartDom) {
        myChartDom.dispose();
      }
      initEchart();
    }
  }, [value]);

  return (
    <div className="flex-stretch-t flex-column">
      {showCharts && (
        <div styleName="borrowing-balance-charts-box">
          <div styleName="page">
            <div styleName="react-echart" ref={chartRef} />
            <div styleName="name" className="flex-c-between">
              借款风险值&nbsp;
              <InformationCircleOutline
                color="var(--adm-color-weak)"
                fontSize="0.22rem"
                onClick={() => {
                  setVisible(true);
                }}
              />
            </div>
          </div>
        </div>
      )}
      <div styleName="borrowing-balance-hint">{hintText}</div>
      <Modal
        visible={visible}
        content="风险说明"
        closeOnMaskClick
        onClose={() => setVisible(false)}
      />
    </div>
  );
};

export default BorrowingBalance;
