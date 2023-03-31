import React, { useState, useEffect } from 'react';
import './coupon.scss';
import dayjs from 'dayjs';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import { useIntl } from 'react-intl';
import usedIcon from '../../images/icon_used.png';
import expiredIcon from '../../images/icon_expired.png';

const Coupon: React.FC = (props: any) => {
  const { data, type } = props;
  const { formatMessage } = useIntl();
  const [isShowRules, setIsShowRules] = useState(false);

  const timeRangeStr = `${dayjs(data.startTime).format('YYYY/MM/DD')}-${dayjs(data.endTime).format('YYYY/MM/DD')}`;
  return (
    <div styleName="coupon">
      <div styleName="coupon-top">
        <div styleName="coupon-card">
          <div styleName="coupon-icon">
            <span styleName="coupon-text">免佣卡</span>
          </div>
          <div>
            <div styleName="coupon-title">{data.couponName}</div>
            <div styleName="coupon-time">{timeRangeStr}</div>
          </div>
        </div>
        <div styleName="use-coupon">
          {
            type === 1 ? (<img src={usedIcon} alt="" />) : <img src={expiredIcon} alt="" />
          }
        </div>
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
