import React, { memo, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { getClassNameByPriceChange } from '@dz-web/quote-client';
import { getCombiRanking } from '@/api/module-api/combination';
import IconMore from '@/platforms/mobile/images/icon_zh_more_right.svg';
import { openNativePage, PageType, NativePages } from '../../../helpers/native/msg';

import './index.scss';

const AccountRanking: React.FC<any> = memo((props) => {
  const { portfolioId } = props;
  const [data, setData] = useState<any>(null);
  const { formatMessage } = useIntl();

  // 获取排行
  const getCombiRankingInfo = () => {
    getCombiRanking({
      portfolioId,
    }).then((res: any) => {
      if (res && res.code === 0 && res?.result) {
        const { dayRVO, monthRVO, totalRVO } = res.result;
        const daySort = dayRVO?.sort || 0;
        const dayRatio = dayRVO?.profitRatio || 0;
        const monthSort = monthRVO?.sort || 0;
        const monthRatio = monthRVO?.profitRatio || 0;
        const totalSort = totalRVO?.sort || 0;
        const totalRatio = totalRVO?.profitRatio || 0;
        setData({ daySort, dayRatio, monthSort, monthRatio, totalSort, totalRatio });
      }
    });
  };

  useEffect(() => {
    if (portfolioId) {
      getCombiRankingInfo();
    }
  }, [portfolioId]);

  // 保留两位小数
  const fixed = (val = 0) => (val !== null ? +(val * 100).toFixed(2) : 0);

  // 跳转至组合盈亏榜单
  const goToBindSheet = () => {
    openNativePage({
      pageType: PageType.NATIVE,
      path: NativePages.bangdan,
      fullScreen: true,
      data: { portfolioId },
    });
  };

  return (
    <div styleName="warp">
      <div styleName="item" onClick={() => goToBindSheet()}>
        <div styleName="name">{(data && data.daySort) || 0}</div>
        <div styleName="option">{formatMessage({ id: 'day_ranking' })}</div>
        <div
          styleName="profit-ratio"
          className={getClassNameByPriceChange((data && data?.dayRatio) || 0)}
        >
          {`${fixed(data && data?.dayRatio)}%`}
        </div>
      </div>
      <div styleName="item" onClick={() => goToBindSheet()}>
        <div styleName="name">{(data && data.monthSort) || 0}</div>
        <div styleName="option">{formatMessage({ id: 'month_ranking' })}</div>
        <div
          styleName="profit-ratio"
          className={getClassNameByPriceChange((data && data?.monthRatio) || 0)}
        >
          {`${fixed(data && data?.monthRatio)}%`}
        </div>
      </div>
      <div styleName="item" onClick={() => goToBindSheet()}>
        <div styleName="name">{(data && data.totalSort) || 0}</div>
        <div styleName="option">{formatMessage({ id: 'total_ranking' })}</div>
        <div
          styleName="profit-ratio"
          className={getClassNameByPriceChange((data && data?.totalRatio) || 0)}
        >
          {`${fixed(data && data?.totalRatio)}%`}
        </div>
      </div>
      <div styleName="more" onClick={() => goToBindSheet()}>
        <img src={IconMore} alt="" />
      </div>
    </div>
  );
});

export default AccountRanking;
