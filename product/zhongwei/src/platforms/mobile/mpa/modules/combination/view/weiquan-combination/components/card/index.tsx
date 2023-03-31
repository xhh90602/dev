/* eslint-disable max-len */
/* eslint-disable operator-linebreak */
import React, { memo, useMemo } from 'react';
import { useIntl } from 'react-intl';
import IconShare from '@/platforms/mobile/images/icon_share_zh.svg';
import { toThousand } from '@dz-web/o-orange';
import { nativeOpenPage } from '@/platforms/mobile/helpers/native/url';
import { getClassNameByPriceChange } from '@dz-web/quote-client';
import dayjs from 'dayjs';

import './index.scss';
import { Toast } from 'antd-mobile/es';

const Table = memo((props: any) => {
  const { data } = props;
  const { formatMessage } = useIntl();

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

  // 字符串百分比，转成number
  const splitPercentage = (str, isPrefix = false) => {
    if (str) {
      if (typeof str === 'string') {
        if (str.indexOf('%') > -1) {
          const rs = str.split('%');
          const n = (rs[0]) ? (+rs[0]) : 0;
          let result;
          if (isPrefix) {
            if (n > 0) {
              result = `+${n.toFixed(2)}`;
            } else if (n < 0) {
              result = `${n.toFixed(2)}`;
            } else {
              result = `${n.toFixed(2)}`;
            }
          } else {
            result = n;
          }
          return result;
        }
        return +str;
      }
      return str;
    }
    return 0;
  };

  // 保留两位小数
  const fixed = (val = 0) => (val ? +(+val).toFixed(2) : 0);

  const dateFormat = (date) => {
    if (date) {
      return `${formatMessage({ id: 'combination_created' })}：${dayjs(date).format('YYYY/MM/DD')}`;
    }
    return '';
  };

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

  const toDetail = () => nativeOpenPage(`combination-details.html?portfolioId=${data.portfolioId}`);

  return (
    <div
      styleName="card-item"
    >
      <span styleName={`position-type ${positionType[+data.type].styleName}`}>
        {positionType[+data.type].text}
      </span>
      <div styleName="head-box">
        <div styleName="name-box">
          <div styleName="combination-name" onClick={() => toDetail()}>{data?.name || ''}</div>
          <img
            src={IconShare}
            alt=""
            onClick={() => Toast.show({ content: '待接入...' })}
          />
        </div>
        <div styleName="create-text" onClick={() => toDetail()}>
          {dateFormat(data?.createTime || '')}
        </div>
      </div>
      <div styleName="card-data" onClick={() => toDetail()}>
        <div styleName="card-line">
          <div styleName="item">
            <div
              styleName="value"
              className={getClassNameByPriceChange(splitPercentage((data?.totalProfitRatio) || 0))}
            >
              {data?.totalProfitRatio || '0.00%'}
            </div>
            <div styleName="label">{formatMessage({ id: 'combination_created_so_far' })}</div>
          </div>
          <div styleName="item">
            <div
              styleName="value"
              className={getClassNameByPriceChange((+data.netValue || 0))}
            >
              {fixed(data?.netValue)}
            </div>
            <div styleName="label">{formatMessage({ id: 'net_worth_combination' })}</div>
          </div>
          <div styleName="item">
            <div
              styleName="value"
              className={getClassNameByPriceChange((+data.profitLoss || 0))}
            >
              {data?.profitLoss || 0}
            </div>
            <div styleName="label">{formatMessage({ id: 'today_profit_and_loss' })}</div>
          </div>
        </div>
        <div styleName="card-line">
          <div styleName="item">
            <div
              styleName="value"
              className={getClassNameByPriceChange((+data.marketValue || 0))}
            >
              {toThousandFormat(data?.marketValue || 0)}
            </div>
            <div styleName="label">{formatMessage({ id: 'portfolio_total_assets' })}</div>
          </div>
          <div styleName="item">
            <div
              styleName="value"
              className={getClassNameByPriceChange((+data.marketValue || 0))}
            >
              {data?.position || '0.00%'}
            </div>
            <div styleName="label">{formatMessage({ id: 'combination_positions' })}</div>
          </div>
          <div styleName="item">
            <div
              styleName="value"
              className={getClassNameByPriceChange((+data.totalProfitLoss || 0))}
            >
              {toThousandFormat(data?.totalProfitLoss || 0)}
            </div>
            <div styleName="label">{formatMessage({ id: 'accumulated_profit_and_loss' })}</div>
          </div>
        </div>
      </div>
      <div styleName="bottom-box" onClick={() => toDetail()}>
        <div styleName="left">{`${data?.virtualCoin}${formatMessage({ id: 'wb' })}`}</div>
        <div styleName="right">
          {`${data?.subNum || 0}${formatMessage({ id: 'subscribe_p' })} | ${formatMessage({ id: 'ranking' })}${data?.sort || 0}`}
        </div>
      </div>
    </div>
  );
});

export default Table;
