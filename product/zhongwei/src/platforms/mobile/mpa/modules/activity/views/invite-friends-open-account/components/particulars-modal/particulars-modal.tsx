/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import './particulars-modal.scss';
import { Mask } from 'antd-mobile';
import { CloseOutline } from 'antd-mobile-icons';
import { useIntl } from 'react-intl';
import { getinviteOpenAccountAward } from '@/api/module-api/activity';

const ParticularsModal: React.FC<any> = (props: any) => {
  const { visible, setVisible, userId, activityId } = props;
  const { formatMessage } = useIntl();
  const [data, setData] = useState<any>();

  useEffect(() => {
    if (!userId || !activityId) return;
    getinviteOpenAccountAward({
      activityId, // 活动id,邀请好友开户固定为2
      fromUser: userId, // 邀请人用户id
    }).then((res) => {
      if (res.code === 0) {
        console.log('res===>', res);
        setData(res.result);
      }
    }).catch((err) => {
      console.log('err', err);
    });
  }, [userId, activityId]);

  return (
    <Mask visible={visible} onMaskClick={() => setVisible(false)}>
      <div styleName="modal">
        <div styleName="head">
          <div styleName="img" onClick={() => setVisible(false)}><CloseOutline fontSize={18} /></div>
          <div styleName="title">
            {/* 奖励明细 */}
            {
              `${formatMessage({ id: 'reward' })}${formatMessage({ id: 'particulars' })}`
            }
          </div>
        </div>
        <div styleName="main">
          {
            data && data.coinNumber ? (
              <div styleName="item">
                <div styleName="intro">
                  {`${data.coinNumber}${formatMessage({ id: 'wei_coin' })}`}
                  {/* 薇幣 */}
                </div>
                <div styleName="time">{data.getTime || '--'}</div>
              </div>
            ) : null
          }
          {
            data && data.marketName ? (
              <div styleName="item">
                <div styleName="intro">{data.marketName}</div>
                <div styleName="time">{data.getTime || '--'}</div>
              </div>
            ) : null
          }

          {
            data && data.couponList.length ? data.couponList.map((item, index) => (
              <div styleName="item" key={index}>
                <div styleName="intro">{item.couponName}</div>
                <div styleName="time">{data.getTime || '--'}</div>
              </div>
            )) : null
          }
        </div>
      </div>
    </Mask>
  );
};

export default ParticularsModal;
