import React, { memo, useState, useEffect } from 'react';
import { getEntrustRecord } from '@/api/module-api/combination';
import { useIntl } from 'react-intl';
import IconLock from '@/platforms/mobile/images/icon_lock.svg';
import Empty from '@/platforms/mobile/components/combination/empty';
import Table from './table';

import './index.scss';

const WarehouseRecord: React.FC<any> = memo((props) => {
  const { portfolioId = null, userSub = '-1', subClick = () => null, isSelf = false } = props;
  const [list, setList] = useState<any>([1, 2]);
  const { formatMessage } = useIntl();

  // 获取持仓个股

  return (
    <div styleName="warp">
      <div styleName="title">
        <span styleName="title-header">持仓个股</span>
      </div>
      {
        list && list.length ? (
          <div styleName="table-list-box">
            <div styleName={userSub === '-1' || userSub === '0' ? 'img-mask' : ''}>
              <Table list={list} userSub={userSub} isSelf={isSelf} />
            </div>
            {
              userSub === '-1' || userSub === '0' || userSub === '1' ? (
                <div styleName="mask-box">
                  <img styleName="lock" src={IconLock} alt="" />
                  <div styleName="sub-unlock-all-data">订阅解锁账户持仓</div>
                  {/* <div styleName="sub-unlock-all-data">登录交易解锁账户持仓</div> */}
                </div>
              ) : null
            }
          </div>
        ) : (
          <div styleName="empty-box"><Empty /></div>
        )
      }
    </div>
  );
});

export default WarehouseRecord;
