/* eslint-disable react/no-array-index-key */
import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import { goToSymbolPage } from '@/platforms/mobile/helpers/native/msg';
import Iconjt from '@/platforms/mobile/images/icon_jt.svg';
import IconSZ from '@/platforms/mobile/images/icon_SZ.svg';
import IconSH from '@/platforms/mobile/images/icon_SH.svg';
import IconHK from '@/platforms/mobile/images/icon_HK.svg';
import IconUS from '@/platforms/mobile/images/icon_US.svg';
import { toFixed, toThousand } from '@dz-web/o-orange';

import './index.scss';

const Table = memo((props: any) => {
  const { list, userSub, isSelf } = props;
  const { formatMessage } = useIntl();

  const title = [
    formatMessage({ id: 'name_code' }),
    `${formatMessage({ id: 'before_adjustment' })} -> ${formatMessage({ id: 'after_adjustment' })}`,
    formatMessage({ id: 'adjustment_amount' }),
  ];

  // 千分位转换
  const toThousandFormat = (str) => {
    if (str && typeof str === 'string' && str.indexOf('*') > -1) {
      return str;
    }
    if (str && typeof str === 'string') {
      return toThousand(+str);
    }
    return (str && toThousand(str)) || toFixed(0);
  };

  // 市场转换
  const tradeMarketTransform = { HKEX: IconHK, SZMK: IconSZ, SHMK: IconSH, USA: IconUS };

  // 状态
  const statusText = (id, orderStatus, entrustPrice) => {
    if (id && orderStatus === 'CLOSED') {
      return `${formatMessage({ id: 'reference_cost_price' })}  ${entrustPrice}`; // 已成交（参考成交价）
    }
    if (id && orderStatus === 'PENDING_TRANSACTIONS') {
      return formatMessage({ id: 'pending_transaction' }); // 待成交
    }
    if (id && orderStatus === 'CANCELLED') {
      return formatMessage({ id: 'cancelled' }); // 已取消
    }
    return formatMessage({ id: 'not_rebalancing' }); // 未调仓
  };

  const goStock = ({ smallMarket, stockCode }) => {
    goToSymbolPage({ market: smallMarket, code: stockCode });
  };

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
          list && list.length
            ? list.map((item, index) => (
              index <= 2 ? (
                <div styleName="content" key={`${item.id}-${item.entrustBalance}-${index}`}>
                  <div styleName="item">
                    <div styleName="d1" onClick={() => goStock(item)}>
                      <div styleName="h-name">
                        {
                          (userSub === null || userSub === '10' || isSelf) && (
                            item.bs === 'B' ? (
                              <span styleName="business buy">{formatMessage({ id: 'buy' })}</span>
                            ) : (
                              <span styleName="business sell">{formatMessage({ id: 'sell' })}</span>
                            )
                          )
                        }
                        <div styleName="stock-name">{item.stockName}</div>
                      </div>
                      <div styleName="market">
                        <img src={tradeMarketTransform[item.tradeMarket]} alt="" />
                        <div styleName="code">{item.stockCode}</div>
                      </div>
                    </div>
                    <div styleName="d2">
                      <div styleName="proportion">
                        <div styleName="s">{item.beforeRatio}</div>
                        <img src={Iconjt} alt="" />
                        <div styleName="s">{item.afterRatio}</div>
                      </div>
                      <div styleName="refer-to">
                        {statusText(item.id, item.orderStatus, item.entrustPrice)}
                      </div>
                    </div>
                    <div styleName="d3">{toThousandFormat(item.entrustBalance)}</div>
                  </div>
                </div>
              ) : null
            )) : null
        }
      </div>
    </div>
  );
});

export default Table;
