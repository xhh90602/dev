/* eslint-disable operator-linebreak */
import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import { getClassNameByPriceChange } from '@dz-web/quote-client';

import './index.scss';

const Table = memo((props: any) => {
  const { list } = props;
  const { formatMessage } = useIntl();

  const title = [
    formatMessage({ id: 'interval' }),
    formatMessage({ id: 'total_revenue' }),
    formatMessage({ id: 'maximum_drawdown' }),
  ];

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
        return str;
      }
      return str;
    }
    return 0;
  };

  // 区间转换
  const intervalEnum = {
    0: formatMessage({ id: 'nearly_a_week' }),
    1: formatMessage({ id: 'nearly_a_month' }),
    2: formatMessage({ id: 'last_two_months' }),
    3: formatMessage({ id: 'nearly_march' }),
    6: formatMessage({ id: 'last_six_months' }),
    12: formatMessage({ id: 'nearly_year' }),
    20: formatMessage({ id: 'created_so_far' }),
  };

  return (
    <div>
      <div styleName="table">
        <div styleName="title">
          {title.map((item) => (
            <div styleName="title-item" key={item}>
              {item}
            </div>
          ))}
        </div>
        <div>
          {
            list && list.length ?
              list.map(
                (item) => (
                  <div styleName="content" key={item.range}>
                    <span>{intervalEnum[item.range]}</span>
                    <span
                      className={getClassNameByPriceChange(item.profitRatio)}
                    >
                      {`${splitPercentage(item.profitRatio, true)}%`}
                    </span>
                    <span>{`${splitPercentage(item.retracement, true)}%`}</span>
                  </div>
                ),
              ) : null
          }
        </div>
      </div>
    </div>
  );
});

export default Table;
