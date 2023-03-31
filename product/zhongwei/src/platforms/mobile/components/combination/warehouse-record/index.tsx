import React, { memo, useState, useEffect } from 'react';
import { getEntrustRecord } from '@/api/module-api/combination';
import { useIntl } from 'react-intl';
import { PORTFOLIO_TYPE } from '@/constants/combination';
import { nativeOpenPage } from '@/platforms/mobile/helpers/native/url';
import { COMBINATION_POSITION_ROUTERS } from '@mobile-mpa/modules/combination-position/routers';
import IconMore from '@/platforms/mobile/images/icon_zh_more.svg';
import IconLock from '@/platforms/mobile/images/icon_lock.svg';
import Empty from '@/platforms/mobile/components/combination/empty';
import Table from './table';

import './index.scss';

const WarehouseRecord: React.FC<any> = memo((props) => {
  const { portfolioId, userSub, subClick = () => null, isSelf = false, portfolioType } = props;

  const [list, setList] = useState<any>([]);
  const { formatMessage } = useIntl();

  // 获取调仓记录
  const getEntrustRecordList = () => {
    getEntrustRecord({
      portfolioId,
    }).then((res: any) => {
      if (res && res.code === 0) {
        setList(res?.result || []);
      }
      return [];
    });
  };

  const sendSubClick = () => {
    if (userSub === '-1' || userSub === '0') {
      subClick();
    }
  };

  const goAdjustmentRecord = () => {
    const hasMore = userSub === null || userSub === '10';

    if (!list?.length || !hasMore) {
      return;
    }

    if (!portfolioType || portfolioType === PORTFOLIO_TYPE.SIMULATE) {
      nativeOpenPage(`adjustment-record.html?portfolioId=${portfolioId}`);
      return;
    }

    const hash = COMBINATION_POSITION_ROUTERS.COMBINATION_WAREHOUSE_RECORD;
    nativeOpenPage(`combination-position.html#${hash}?portfolioId=${portfolioId}`);
  };

  useEffect(() => {
    getEntrustRecordList();
  }, []);

  return (
    <div styleName="warp">
      <div styleName="title" onClick={() => goAdjustmentRecord()}>
        <span styleName="title-header">{formatMessage({ id: 'adjustment_record' })}</span>
        {list && list.length && (userSub === null || userSub === '10') ? (
          <img styleName="go-detail" src={IconMore} alt="" />
        ) : (
          ''
        )}
      </div>
      {list && list.length ? (
        <div styleName="table-list-box">
          <div styleName={userSub === '-1' || userSub === '0' ? 'img-mask' : ''}>
            <Table list={list} userSub={userSub} isSelf={isSelf} />
          </div>
          {userSub === '-1' || userSub === '0' || userSub === '1' ? (
            <div styleName="mask-box" onClick={() => sendSubClick()}>
              <img styleName="lock" src={IconLock} alt="" />
              <div styleName="sub-unlock-all-data">{formatMessage({ id: 'sub_after_unlock_all_data' })}</div>
              {userSub === '1' ? (
                <div styleName="sub-btn">{formatMessage({ id: 'subscriptioning' })}</div>
              ) : (
                <div styleName="sub-btn">{formatMessage({ id: 'subscription' })}</div>
              )}
            </div>
          ) : null}
        </div>
      ) : (
        <div styleName="empty-box">
          <Empty />
        </div>
      )}
    </div>
  );
});

export default WarehouseRecord;
