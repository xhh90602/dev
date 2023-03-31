import React, { useState, useEffect, useRef } from 'react';
import { useSearchParam } from 'react-use';
import dayjs from 'dayjs';
import { useIntl } from 'react-intl';
import { getStockContribution } from '@/api/module-api/combination';
import { settingHeaderButton, goBack, settingNavigationTitle } from '@mobile/helpers/native/msg';
import { headerButtonCallBack } from '@mobile/helpers/native/register';
import Empty from '@/platforms/mobile/components/combination/empty';
import Table from './components/table';

import './contribution-record.scss';

const AppHome: React.FC = () => {
  const portfolioId = Number(useSearchParam('portfolioId')) || 0;
  const [data, setData] = useState<any>();
  const { formatMessage } = useIntl();
  const timer = useRef<any>(null);

  // 获取个股收益贡献数据
  const getStockContributionList = () => {
    getStockContribution({
      portfolioId,
    }).then((res: any) => {
      if (res && res.code === 0) {
        setData(res?.result || null);
      }
      return [];
    });
  };

  const Interval = () => {
    setInterval(() => {
      getStockContributionList();
    }, 300000);
  };

  useEffect(() => {
    clearInterval(timer.current);
    if (portfolioId) {
      getStockContributionList();
      Interval();
    }
    return () => {
      clearInterval(timer.current);
    };
  }, [portfolioId]);

  useEffect(() => {
    // 设置【返回】按钮
    settingHeaderButton([{
      icon: 'back', // 返回
      position: 'left',
      index: 1,
      onClickNativeAction: 'back',
      onClickCallbackEvent: 'headerButtonCallBack',
    }]).then((res) => {
      console.log('设置返回按钮', res);
    });
    headerButtonCallBack(() => {
      goBack();
    });
    // 设置页面标题
    settingNavigationTitle({ name: formatMessage({ id: 'revenue_contribution' }) });
  }, []);

  const dateFormat = (date) => {
    if (date) {
      return `${formatMessage({ id: 'update_time' })}：${dayjs(date).format('MM/DD/YYYY HH:mm:ss')}`;
    }
    return `${formatMessage({ id: 'update_time' })}：${dayjs().format('MM/DD/YYYY HH:mm:ss')}`;
  };

  const textFormat = (dataItem) => {
    if (dataItem && dataItem?.totalProfitLoss.indexOf('*') > -1) {
      return `${((dataItem && dataItem?.totalProfitLoss) || 0)}`;
    }
    return `${((dataItem && dataItem?.totalProfitLoss) || 0)}${((dataItem && dataItem?.currency) || '')}`;
  };

  return (
    <div styleName="contribution-record">
      <div styleName="update-time">{`${dateFormat((data && data?.updateTime)) || null}`}</div>
      <div styleName="warp">
        <div styleName="grand-total-box">
          <div styleName="grand-total-name">
            {formatMessage({ id: 'accumulated_profit_and_loss' })}
          </div>
          <div styleName="grand-total-amount">
            {textFormat(data || null)}
          </div>
        </div>
      </div>
      <div styleName="warp">
        {
          data && data?.stockContributeVOList && data?.stockContributeVOList.length ? (
            <Table list={(data && data?.stockContributeVOList) || []} />
          ) : (
            <div styleName="empty-box"><Empty /></div>
          )
        }
      </div>
    </div>
  );
};

export default AppHome;
