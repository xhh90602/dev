import React, { memo, useState, useEffect, useRef } from 'react';
import { getHistoryProfitRatio } from '@/api/module-api/combination';
import { useIntl } from 'react-intl';
import Empty from '@/platforms/mobile/components/combination/empty';
import dayjs from 'dayjs';
import Table from './table';
import './index.scss';

const Performance: React.FC<any> = memo((props) => {
  const { portfolioId } = props;
  const { formatMessage } = useIntl();
  const [data, setData] = useState<any>();
  const timer = useRef<any>(null);

  // 获取历史数据
  const getDetailHistoryProfitRatio = () => {
    getHistoryProfitRatio({
      portfolioId,
    }).then((res: any) => {
      if (res && res.code === 0 && res?.result) {
        setData(res.result);
      }
    });
  };

  const Interval = () => {
    setInterval(() => {
      getDetailHistoryProfitRatio();
    }, 300000);
  };

  useEffect(() => {
    clearInterval(timer.current);
    if (portfolioId) {
      getDetailHistoryProfitRatio();
      Interval();
    }
    return () => {
      clearInterval(timer.current);
    };
  }, [portfolioId]);

  const dateFormat = (date) => {
    if (date) {
      return `${dayjs(date).format('MM/DD HH:mm')}${formatMessage({ id: 'update' })}`;
    }
    return `${dayjs().format('MM/DD HH:mm')}${formatMessage({ id: 'update' })}`;
  };

  return (
    <div styleName="warp">
      <div styleName="title">
        <span styleName="title-header">{formatMessage({ id: 'history_performance' })}</span>
        <span styleName="title-month">{dateFormat((data && data[0] && data[0].updateTime) || null)}</span>
      </div>
      {
        data && data.length ? (
          <Table list={data} />
        ) : (
          <div styleName="empty-box"><Empty /></div>
        )
      }
    </div>
  );
});

export default Performance;
