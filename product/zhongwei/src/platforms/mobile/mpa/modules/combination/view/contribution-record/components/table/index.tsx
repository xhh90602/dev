/* eslint-disable operator-linebreak */
import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import IconSZ from '@/platforms/mobile/images/icon_SZ.svg';
import IconSH from '@/platforms/mobile/images/icon_SH.svg';
import IconHK from '@/platforms/mobile/images/icon_HK.svg';
import IconUS from '@/platforms/mobile/images/icon_US.svg';
import { toThousand } from '@dz-web/o-orange';
import { getClassNameByPriceChange } from '@dz-web/quote-client';

import './index.scss';

const Table = memo((props: any) => {
  const { list } = props;
  const { formatMessage } = useIntl();

  const title = [
    formatMessage({ id: 'bangdan' }),
    formatMessage({ id: 'profit_and_loss_ratio' }),
  ];

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
          const n = (+rs[0]) ? (+rs[0]) : 0;
          let result;
          if (isPrefix) {
            if (n > 0) {
              result = `+${n.toFixed(2)}%`;
            } else if (n < 0) {
              result = `${n.toFixed(2)}%`;
            } else {
              result = `${n.toFixed(2)}%`;
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

  // 市场转换
  const tradeMarketTransform = { HKEX: IconHK, SZMK: IconSZ, SHMK: IconSH, USA: IconUS };

  return (
    <div styleName="table">
      <div styleName="title">
        {title.map((item, idx) => (
          <div styleName={`title-item d${idx + 1}`} key={item}>
            {item}
          </div>
        ))}
      </div>
      <div styleName="table-list">
        {
          list && list.length ?
            list.map((item, idx) => (
              <div
                styleName="content"
                key={
                  `${item.costPrice}-
                  ${item.marketValue}-
                  ${item.nowPrice}-
                  ${item.stockCode}-
                  ${performance.now()}`
                }
              >
                <div styleName="item">
                  <div styleName="d1">
                    <div styleName="rank">{idx + 1}</div>
                    <div>
                      <div styleName="stock-name">{item.stockName}</div>
                      <div styleName="market">
                        <img src={tradeMarketTransform[item.tradeMarket]} alt="" />
                        <div styleName="code">{item.stockCode}</div>
                      </div>
                    </div>
                  </div>
                  <div styleName="d2">
                    <div
                      styleName="amount"
                      className={getClassNameByPriceChange(splitPercentage(item.profitLoss))}
                    >
                      {toThousandFormat(item.profitLoss)}
                    </div>
                    <div styleName="proportion">{`${splitPercentage(item.profitLossRatio, true)}`}</div>
                  </div>
                </div>
              </div>
            )) : null
        }
      </div>
    </div>
  );
});

export default Table;