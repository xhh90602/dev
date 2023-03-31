import React, { memo, useMemo } from 'react';
import { useIntl } from 'react-intl';
import cx from 'classnames';
import { getClassNameByPriceChange } from '@dz-web/quote-client';
import dayjs from 'dayjs';
import { toThousand } from '@dz-web/o-orange';
import SpaceBetween from '@/platforms/mobile/components/combination/space-between';
import { netValueJudge } from '@/utils/data-format';

import './index.scss';

const Card: React.FC<any> = memo((props) => {
  const { data } = props;
  const { formatMessage } = useIntl();

  /**
 * 模拟还是实盘
 */
  const positionType = useMemo(
    () => ({
      0: {
        styleName: 'simulation',
        text: formatMessage({ id: 'simulation' }),
      },
      1: {
        styleName: 'firm',
        text: formatMessage({ id: 'firm' }),
      },
    }),
    [],
  );

  // 字符串百分比，转成number
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

  const addCharacter = (str) => {
    if (str && +str) {
      const val = netValueJudge(str);
      if (val === 1) {
        return `+${str}`;
      }
      if (val === -1) {
        return `-${str}`;
      }
      if (val === 0) {
        return `${str}`;
      }
    }
    return 0;
  };

  // 千分位转换
  const toThousandFormat = (str) => {
    if (str && typeof str === 'string' && str.indexOf('*') > -1) {
      return str;
    }
    if (str && typeof str === 'string') {
      return toThousand(+str);
    }
    return (str && toThousand(str)) || 0;
  };

  return (
    <div styleName="warp">
      <div styleName={cx('position-type', positionType[(data && +data.type) || 0].styleName)}>
        {positionType[(data && +data.type) || 0].text}
      </div>
      <div styleName="top">
        {/* 组合名称 */}
        <div styleName="top-left">
          <div styleName="top-left-name">{(data && data.name) || ''}</div>
          <div styleName="top-left-option">{(data && data.sketch) || ''}</div>
        </div>
        {/* 订阅数 */}
        <div styleName="top-right">
          <div styleName="top-right-number">{(data && data.subNum) || 0}</div>
          <div styleName="top-right-option">{formatMessage({ id: 'subscription_number' })}</div>
        </div>
      </div>

      <div styleName="content">
        <div styleName="content-item">
          {/* 組合創建至今 */}
          <div styleName="content-item-name">
            {formatMessage({ id: 'combination' })}
            {formatMessage({ id: 'created_so_far' })}
          </div>
          <div
            styleName="content-item-value"
            className={getClassNameByPriceChange(splitPercentage((data && data?.totalProfitRatio) || 0))}
          >
            {`${splitPercentage(data?.totalProfitRatio || 0, true)}%`}
          </div>
          {/* 近30天收益率 */}
          <div styleName="content-item-option">
            <SpaceBetween
              left={formatMessage({ id: 'yield_in_the_last_30_days' })}
              className={getClassNameByPriceChange(splitPercentage((data && data?.nearly30Profit) || 0))}
              right={`${splitPercentage(data?.nearly30Profit || 0, true)}%`}
            />
          </div>
        </div>

        <div styleName="content-item">
          {/* 最新净值 */}
          <div styleName="content-item-name">
            {formatMessage({ id: 'latest_net_worth' })}
          </div>
          <div
            styleName="content-item-value"
            className={getClassNameByPriceChange(netValueJudge(data?.netValue || 0))}
          >
            {data?.netValue || 0}
          </div>
          {/* 创建日期 */}
          <div styleName="content-item-option">
            <SpaceBetween
              left={formatMessage({ id: 'date_created' })}
              right={data?.createTime ? dayjs(data?.createTime).format('MM/DD/YYYY') : '--'}
            />
          </div>
        </div>
      </div>

      <div styleName="bottom">
        {/* 累计盈亏 */}
        <div styleName="bottom-item">
          <SpaceBetween
            left={formatMessage({ id: 'accumulated_profit_and_loss' })}
            className={getClassNameByPriceChange((data && data?.totalProfitLoss) || 0)}
            right={`${splitPercentage(data && data?.totalProfitLoss, true) || '--'}`}
          />
        </div>
        {/* 组合仓位 */}
        <div styleName="bottom-item">
          <SpaceBetween
            left={formatMessage({ id: 'combination_positions' })}
            right={`${data && data?.position ? `${splitPercentage(data?.position)}%` : '--'}`}
          />
        </div>
        {/* 组合总资产 */}
        <div styleName="bottom-item">
          <SpaceBetween
            left={formatMessage({ id: 'portfolio_total_assets' })}
            right={`${(data && toThousandFormat(data?.marketValue)) || '--'}`}
          />
        </div>
      </div>
    </div>
  );
});

export default Card;
