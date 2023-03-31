import React, { memo, useState } from 'react';
import { useIntl } from 'react-intl';
import { Toast } from 'antd-mobile';
import { getClassNameByPriceChange } from '@dz-web/quote-client';
import IconMoney from '@/platforms/mobile/images/icon_money.png';
import IconClose from '@/platforms/mobile/images/icon_close_01.svg';
import IconHK from '@/platforms/mobile/images/icon_HK.svg';
import IconSZ from '@/platforms/mobile/images/icon_SZ.svg';
import IconUS from '@/platforms/mobile/images/icon_US.svg';
import IconSH from '@/platforms/mobile/images/icon_SH.svg';
import Iconzx from '@/platforms/mobile/images/icon_not_select_stock.svg';
import Iconqx from '@/platforms/mobile/images/icon_self_select_stock.svg';
import DefaultAvatar from '@/platforms/mobile/images/default_avatar.svg';
import IconYes from '@/platforms/mobile/images/icon_yes.svg';
import Icontag from '@/platforms/mobile/images/icon_tag02.svg';

import './index.scss';

const Dialog = memo((props: any) => {
  const {
    show = false,
    data = null,
    list = [1, 2, 3, 4, 5],
    type = 'bg-fall', // bg-rise , bg-fall
    closeClick = () => null,
  } = props;
  const { formatMessage } = useIntl();

  return show && (
    <div styleName="dialog">
      <div styleName="mask" />
      <div styleName={`dialog-box ${type}`}>
        <img styleName="icon-money" src={IconMoney} alt="" />
        <div styleName="icon-close-box">
          <img styleName="icon-close" src={IconClose} alt="" onClick={() => closeClick()} />
        </div>
        <div styleName="stock-box">
          <div styleName="stock-title">15次推荐</div>
          <div styleName="row">
            <div styleName="item">
              <div styleName="l">
                <div styleName="stock-name">阿里巴巴</div>
                <div styleName="stock-info">
                  <img src={IconHK} alt="" />
                  090988
                </div>
              </div>
              <div styleName="r">
                <div styleName="box">
                  <div
                    styleName="ups-and-downs-num"
                    className={getClassNameByPriceChange(20)}
                  >
                    21.23%
                  </div>
                  <div styleName="text">本月涨幅</div>
                </div>
                <img src={Iconzx} alt="" />
              </div>
            </div>
          </div>
        </div>
        <div styleName="fxs-box">
          <div styleName="fxs-title">分析师观点</div>
          <div styleName="fxs-row">
            {
              [1, 2, 3, 5, 6, 7, 8].map((item) => (
                <div styleName="item" key={item}>
                  <div styleName="user-box">
                    <div styleName="l">
                      <div styleName="avatar-box">
                        <img styleName="avatar" src={DefaultAvatar} alt="" />
                        <img styleName="avatar-tag" src={Icontag} alt="" />
                      </div>
                      <div styleName="user-info">
                        <div styleName="name">Lisa</div>
                        {
                          item === 1 && <div styleName="type-text">金牌分析师</div>
                        }
                        {
                          item === 2 && <div styleName="type-text">特邀分析师</div>
                        }
                        {
                          item >= 3 && <div styleName="type-text">投资顾问总监</div>
                        }
                      </div>
                    </div>
                    <div styleName="r">
                      <div styleName="btn">{formatMessage({ id: 'focus_on' })}</div>
                      {/* <div styleName="btn active">
                        <img src={IconYes} alt="" />
                        关注
                      </div> */}
                    </div>
                  </div>
                  <div styleName="content-text">擅长多因子选股策略，包括宏观因子、微观因子、流动性因子，基本面因子、技术因子等策略技术因子...</div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
});

export default Dialog;
