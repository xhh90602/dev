import React, { memo, useMemo } from 'react';
import { useIntl } from 'react-intl';
import cx from 'classnames';
import { getClassNameByPriceChange } from '@dz-web/quote-client';
import dayjs from 'dayjs';
import { toThousand } from '@dz-web/o-orange';
import IconSubscribe from '@/platforms/mobile/images/icon_subscribe.png';
import IconNoSubscribe from '@/platforms/mobile/images/icon_no_subscribe.png';

import './account-card.scss';

const AccoundCard: React.FC<any> = memo((props) => {
  const { data } = props;
  const { formatMessage } = useIntl();
  const addFriends = () => {
    console.log('加薇友');
  };
  return (
    <div styleName="warp">
      <div styleName="top">
        {/* 组合名称 */}
        <div styleName="top-left">
          <div styleName="head-logo"><img src="" alt="" /></div>
          <div styleName="top-left-name">
            {/* {(data && data.name) || ''} */}
            Aaron
          </div>
          <div styleName="add-wei" onClick={() => addFriends}>+薇友</div>
        </div>
        {/* 订阅数 */}
        <div styleName="top-right">
          <div styleName="top-right-number">{(data && data.subNum) || 0}</div>
          <div styleName="top-right-option">{formatMessage({ id: 'subscription_number' })}</div>
        </div>
      </div>
      <div styleName="main">
        <div styleName="main-left">
          <div styleName="main-num">-10.54%</div>
          <div styleName="main-data">
            <span styleName="main-data-txt">持仓盈虧</span>
            <span styleName="main-data-info">******</span>
          </div>
        </div>
        <div styleName="main-left">
          <div styleName="main-num">-10.54%</div>
          <div styleName="main-data">
            <span styleName="main-data-txt">持仓盈虧</span>
            <span styleName="main-data-info">******</span>
          </div>
        </div>
      </div>
      <div styleName="footer">
        <div styleName="footer-option">
          <img src={IconSubscribe} alt="" />
          <span styleName="footer-option-intro">訂閱可查看持倉變動</span>
        </div>
        <div styleName="footer-option">
          <img src={IconNoSubscribe} alt="" />
          <span styleName="footer-option-intro">訂閱可查看盈亏金額</span>
        </div>
      </div>
    </div>
  );
});

export default AccoundCard;
