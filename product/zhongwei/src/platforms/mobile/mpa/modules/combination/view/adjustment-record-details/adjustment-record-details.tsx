import React, { useState, useEffect } from 'react';
import { useSearchParam } from 'react-use';
import { useIntl } from 'react-intl';
import { settingNavigationTitle } from '@mobile/helpers/native/msg';
import { getAdjustmentRecordDetail } from '@/api/module-api/combination';
import Empty from '@/platforms/mobile/components/combination/empty';
import Table from './components/table';

import './adjustment-record-details.scss';

const AppHome: React.FC = () => {
  const pgId = Number(useSearchParam('id')) || 0;
  const portfolioId = Number(useSearchParam('portfolioId')) || 0;
  const updateTime = useSearchParam('updateTime') || null;
  const [list, setList] = useState<any>([]);
  const { formatMessage } = useIntl();

  // 获取调仓记录详情
  const getAdjustmentRecordDetailList = () => {
    getAdjustmentRecordDetail({
      pgId,
      portfolioId,
    }).then((res: any) => {
      if (res && res.code === 0 && res?.result) {
        setList(res?.result || null);
      }
      return [];
    });
  };

  useEffect(() => {
    // 设置页面标题
    settingNavigationTitle({ name: formatMessage({ id: 'adjustment_record_detail' }) });
    if (pgId && portfolioId) {
      getAdjustmentRecordDetailList();
    }
  }, []);

  return (
    <div styleName="adjustment-record">
      {
        list && list.length > 0 ? (
          <Table
            list={list || []}
            updateTime={updateTime}
          />
        ) : (
          <div styleName="empty-box">
            <Empty />
          </div>
        )
      }
    </div>
  );
};

export default AppHome;
