import React, { useState, useEffect } from 'react';
import './no-data.scss';
import { useIntl } from 'react-intl';
import { openNewPage, PageType } from '@/platforms/mobile/helpers/native/msg';
import noCouponIcon from './images/icon_no_coupon.png';

const NoCoupon: React.FC = () => {
  const { formatMessage } = useIntl();

  // 跳转到活动中心
  const goActivityCenterPage = () => {
    openNewPage({
      pageType: PageType.HTML,
      path: 'activity-center.html',
      replace: false,
    });
    return false;
  };
  return (
    <div styleName="no-coupon">
      <div styleName="no-coupon-icon">
        <img src={noCouponIcon} alt="" />
      </div>
      <div styleName="no-coupon-text">
        暂无卡券
        <br />
        请到
        <a styleName="link" onClick={() => goActivityCenterPage()}>活动中心</a>
        看看吧
      </div>
    </div>
  );
};

export default NoCoupon;
