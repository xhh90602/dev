import './assets-analysis.scss';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperClass } from 'swiper';
import 'swiper/css';
import Loading from '@/platforms/mobile/components/loading/loading';
import AccountOverview from './views/account-overview/account-overview';
import GainLossAnalysis from './views/gain-loss-analysis/gain-loss-analysis';
import NewStocksGainLoss from './views/new-stocks-gain-loss/new-stocks-gain-loss';

// const AccountOverview = React.lazy(() => import('./account-overview'));
// const GainLossAnalysis = React.lazy(() => import('./gain-loss-analysis'));
// const NewStocksGainLoss = React.lazy(() => import('./new-stocks-gain-loss'));

const tabList = [
  { name: <FormattedMessage id="account_overview" />, key: 0, content: <AccountOverview /> },
  { name: <FormattedMessage id="profit_and_loss_analysis" />, key: 1, content: <GainLossAnalysis /> },
  { name: <FormattedMessage id="profit_and_loss_of_new_shares" />, key: 2, content: <NewStocksGainLoss /> },
];

const AssetsAnalysis = () => {
  const [activeKey, setActiveKey] = useState(0);
  const [swiperDom, setSwiperDom] = useState<SwiperClass>();

  return (
    <div styleName="container">
      <div styleName="tab-nav">
        {tabList.map((tab) => (
          <div
            key={tab.key}
            styleName={tab.key === activeKey ? 'active' : ''}
            onClick={() => {
              setActiveKey(tab.key);
              swiperDom?.slideTo(tab.key);
            }}
          >
            {tab.name}
          </div>
        ))}
      </div>
      <div styleName="content">
        <Swiper
          noSwiping
          spaceBetween={50}
          slidesPerView={1}
          initialSlide={0}
          onSlideChange={(v) => setActiveKey(v.activeIndex)}
          onSwiper={setSwiperDom}
        >
          {tabList.map((item) => (
            <SwiperSlide key={item.key}>
              {({ isActive }) => (<Loading isLoading={!isActive}>{item.content}</Loading>)}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default AssetsAnalysis;
