import React, { useState, useEffect } from 'react';
import { useSearchParam } from 'react-use';
import { getAdjustmentRecord } from '@/api/module-api/combination';
import { InfiniteScroll, DotLoading } from 'antd-mobile';
import { useIntl } from 'react-intl';
import { settingNavigationTitle } from '@mobile/helpers/native/msg';
import Empty from '@/platforms/mobile/components/combination/empty';
import Table from './components/table';

import './adjustment-record.scss';

const AppHome: React.FC = () => {
  const portfolioId = Number(useSearchParam('portfolioId')) || 0;
  const [list, setList] = useState<any>([]);
  const [pages, setPages] = useState<any>({ pageNum: 0, pageSize: 10 });
  const [hasMore, setHasMore] = useState(true);
  const { formatMessage } = useIntl();

  // 获取调仓记录
  let flag = true;
  const getAdjustmentRecordList = () => {
    if (!flag) return;
    flag = false;
    try {
      getAdjustmentRecord({
        portfolioId,
        ...pages,
        pageNum: (pages.pageNum + 1),
      }).then((res: any) => {
        if (res && res.code === 0 && res?.result) {
          const { pageNum, pageSize } = res.result;
          const temp = list.concat(res?.result?.data || []);
          setList(temp);
          setPages({ pageNum, pageSize });
        }
        setHasMore(false);
        flag = true;
        return [];
      }).catch(() => {
        flag = true;
        setHasMore(false);
      });
    } catch (error) {
      flag = true;
      setHasMore(false);
    }
  };

  useEffect(() => {
    // 设置页面标题
    settingNavigationTitle({ name: formatMessage({ id: 'adjustment_record' }) });
  }, []);

  return (
    <div styleName="adjustment-record">
      {
        list && list.length > 0 ? (
          <Table
            list={list || []}
          />
        ) : (
          <div styleName="empty-box">
            <Empty />
          </div>
        )
      }
      <InfiniteScroll loadMore={async () => getAdjustmentRecordList()} hasMore={hasMore}>
        {
          hasMore && (
            <>
              <span>{formatMessage({ id: 'loading' })}</span>
              <DotLoading />
            </>
          )
        }
        {
          list && list.length > 0 && !hasMore && (
            <span>
              ~
              {formatMessage({ id: 'notMore' })}
              ~
            </span>
          )
        }
      </InfiniteScroll>
    </div>
  );
};

export default AppHome;
