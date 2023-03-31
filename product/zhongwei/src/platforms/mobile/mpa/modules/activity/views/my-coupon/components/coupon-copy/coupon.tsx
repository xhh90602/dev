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
  const { data } = props;

  return (
    <div styleName="coupon">
      <div styleName="card">
        <div styleName="card-stock">港股</div>
        <div styleName="card-intro">免佣卡</div>
      </div>
      <div>
        <p>180天5折免傭卡</p>
        <p>优惠到期时间2022/07/10</p>
      </div>
      <div>
        <div>去使用</div>
      </div>
    </div>
  );
};

export default Coupon;
