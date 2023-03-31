import React, { useState, useEffect } from 'react';
import './no-data.scss';
import { useIntl } from 'react-intl';
import { openNewPage, PageType } from '@/platforms/mobile/helpers/native/msg';
import noCouponIcon from './images/icon_no_coupon.png';

const NoCoupon: React.FC = () => {
  const { formatMessage } = useIntl();

  // 跳转到历史卡券
  const goPage = () => {
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
        {formatMessage({ id: 'no_coupon' })}
        {/* 暂无卡券 */}
        <br />
        {formatMessage({ id: 'please_go' })}
        {/* 请到 please_go */}
        <a styleName="link" onClick={goPage}>
          {formatMessage({ id: 'activity_center' })}
          {/* 活动中心 activity_center */}
        </a>
        看看吧
      </div>
    </div>
  );
};

export default NoCoupon;
