/* eslint-disable no-restricted-globals */
import React, { memo, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { getClassNameByPriceChange } from '@dz-web/quote-client';
import { getCombiRanking } from '@/api/module-api/combination';
import IconMore from '@/platforms/mobile/images/icon_zh_more_right.svg';
import { openNativePage, PageType, NativePages } from '../../../helpers/native/msg';

import './index.scss';

const Ranking: React.FC<any> = memo((props) => {
  const { portfolioId = null } = props;
  const [data, setData] = useState<any>({
    daySort: '1',
    dayRatio: '15%',
    monthSort: '3',
    monthRatio: '30%',
    totalSort: '5',
    totalRatio: '90%',
  });
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
  const fixed = (val = 0) => (+val ? +(val * 100).toFixed(2) : 0.00);

  // 字符串百分比，转成number，数字加前缀
  const splitPercentage = (str, isPrefix = false, fd = 2) => {
    if (typeof str === 'string' && str.indexOf('*') > -1) return str;
    if (str) {
      let result;
      let val;
      if (typeof str === 'string') {
        if (str.indexOf('%') > -1) {
          const rs = str.split('%');
          val = (rs[0]) ? (+rs[0]) : 0;
        } else {
          val = +str;
        }
      } else {
        val = +str;
      }
      if (fd > 0) {
        val.toFixed(fd);
      }
      if (isPrefix) {
        if (val > 0) {
          result = `+${val}`;
        } else if (val < 0) {
          result = `${val}`;
        } else {
          result = `${val}`;
        }
      } else {
        result = val;
      }
      return result;
    }
    return str;
  };

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
          {`${splitPercentage(fixed(data?.dayRatio), true)}%`}
        </div>
      </div>
      <div styleName="item" onClick={() => goToBindSheet()}>
        <div styleName="name">{(data && data.monthSort) || 0}</div>
        <div styleName="option">{formatMessage({ id: 'month_ranking' })}</div>
        <div
          styleName="profit-ratio"
          className={getClassNameByPriceChange((data && data?.monthRatio) || 0)}
        >
          {`${splitPercentage(fixed(data?.monthRatio), true)}%`}
        </div>
      </div>
      <div styleName="item" onClick={() => goToBindSheet()}>
        <div styleName="name">{(data && data.totalSort) || 0}</div>
        <div styleName="option">{formatMessage({ id: 'total_ranking' })}</div>
        <div
          styleName="profit-ratio"
          className={getClassNameByPriceChange((data && data?.totalRatio) || 0)}
        >
          {`${splitPercentage(fixed(data?.totalRatio), true)}%`}
        </div>
      </div>
      <div styleName="more" onClick={() => goToBindSheet()}>
        <img src={IconMore} alt="" />
      </div>
    </div>
  );
});

export default Ranking;
