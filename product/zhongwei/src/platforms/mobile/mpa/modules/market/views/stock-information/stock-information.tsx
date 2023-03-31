import React, { useEffect } from 'react';
import './stock-information.scss';
import StockDetailTabs from '@mobile/mpa/modules/market/components/stock-detail-tabs/stock-detail-tabs';

const tabData = [
  {
    value: 0,
    label: '要闻',
  },
  {
    value: 1,
    label: '异动',
  },
  {
    value: 2,
    label: '公告',
  },
  {
    value: 3,
    label: '研报',
  },
];

const StockInformation:React.FC = () => {
  function getValue(val :string) {
    console.log(val);
  }
  useEffect(() => {
    console.log('初始化');
  }, []);

  return (
    <div styleName="page-wrapper">
      <div styleName="tab-box">
        <StockDetailTabs tabData={tabData} onChange={(value) => getValue(value)} />
      </div>
      <div>
        <div styleName="info-item">
          <div styleName="left-content">
            <div styleName="content-box">国家主席习近平日前同阿根廷总统费尔南德斯互致信函国家主席习近平日前同阿根廷总统费尔南德斯互致信函</div>
            <div styleName="date-box">
              <span>鳳凰網港股</span>
              <span>03/04  17:30</span>
            </div>
          </div>
          <div styleName="right-img">
            <img src="" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockInformation;
