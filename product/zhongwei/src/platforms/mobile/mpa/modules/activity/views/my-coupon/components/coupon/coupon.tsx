import React, { useState, useEffect, useContext } from 'react';
import './coupon.scss';
import dayjs from 'dayjs';
import { openNewPage, PageType, goBack } from '@/platforms/mobile/helpers/native/msg';
import { userInfoContext } from '@/platforms/mobile/helpers/entry/native';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import { useIntl } from 'react-intl';
import MarketIcon from '../../images/market-cn.png';
import NoServantsIcon from '../../images/no-servants-cn.png';

const Coupon: React.FC<any> = (props) => {
  const { formatMessage } = useIntl();
  const { data, openWindow } = props;
  const userInfo = useContext<any>(userInfoContext);
  const [isShowRules, setIsShowRules] = useState(false);
  const timeRangeStr = `${dayjs(data.startTime).format('YYYY/MM/DD')}-${dayjs(data.endTime).format('YYYY/MM/DD')}`;
  const showBackgroundImage: any = (type) => {
    // couponUse
    if (type === 5 || type === 6 || type === 7) {
      return {
        text: '行情卡',
        backbround: { background: `url(${MarketIcon})`, backgroundSize: 'cover' },
      };
    } if (type === 1 || type === 2 || type === 3 || type === 4) {
      return {
        text: '免佣卡',
        backbround: { background: `url(${NoServantsIcon})`, backgroundSize: 'cover' },
      };
    }
    return {
      text: '',
      backbround: '',
    };
  };

  // 跳转到交易买入
  const goTradeBuyPage = () => {
    openNewPage({
      pageType: PageType.HTML,
      path: 'trade.html#/buy?market=2002&code=00700&name=腾讯控股',
      replace: false,
    });
  };
  // 跳转到交易卖出
  const goTradeSellPage = () => {
    openNewPage({
      pageType: PageType.HTML,
      path: 'trade.html#/sell?market=2002&code=00700&name=腾讯控股',
      replace: false,
    });
  };

  const couponUse = (type, usageScenario) => {
    if (type === 1 || type === 2 || type === 3 || type === 4) {
      if (!userInfo.tradeToken) {
        console.log('=============');
        openWindow();
      } else {
        if (usageScenario === 1) {
          goTradeBuyPage();
        }
        if (usageScenario === 2) {
          goTradeSellPage();
        }
      }
    }
  };
  return (
    <div styleName="coupon">
      <div styleName="coupon-top">
        <div styleName="coupon-card">
          <div styleName="coupon-icon" style={showBackgroundImage(Number(data.couponUse))?.backbround}>
            <span styleName="coupon-text">
              {/* {showBackgroundImage(Number(data.couponUse))?.text} */}
            </span>
          </div>
          <div>
            <div styleName="coupon-title">{data.couponName}</div>
            <div styleName="coupon-time">{timeRangeStr}</div>
          </div>
        </div>
        <div styleName="use-coupon" onClick={() => { couponUse(Number(data.couponUse), data.usageScenario); }}>去使用</div>
      </div>
      <div styleName="rlues-main">
        <span styleName="rules-intro">规则说明</span>
        <span styleName="drap-icon" onClick={() => setIsShowRules(!isShowRules)}>
          {
                isShowRules ? <UpOutline /> : <DownOutline />
              }
        </span>
      </div>
      {
        isShowRules && (
          <div styleName="rlues-content">
            {data.state}
          </div>
        )
      }
    </div>
  );
};

export default Coupon;
