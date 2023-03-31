/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable operator-linebreak */
import React, { memo, useState, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { goToSymbolPage } from '@mobile/helpers/native/msg';
import Iconjt from '@/platforms/mobile/images/icon_jt.svg';
import IconSZ from '@/platforms/mobile/images/icon_SZ.svg';
import IconSH from '@/platforms/mobile/images/icon_SH.svg';
import IconHK from '@/platforms/mobile/images/icon_HK.svg';
import IconUS from '@/platforms/mobile/images/icon_US.svg';
import { toThousand } from '@dz-web/o-orange';
import IconMore from '@/platforms/mobile/images/icon_bot.svg';
import dayjs from 'dayjs';

import './index.scss';

const Table = memo((props: any) => {
  const { list, updateTime } = props;
  const [showMore, setShowMore] = useState(false);
  const { formatMessage } = useIntl();

  const title = [
    formatMessage({ id: 'name_code' }),
    `${formatMessage({ id: 'before_adjustment' })}　　　${formatMessage({ id: 'after_adjustment' })}`,
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
    return (str && toThousand(str)) || '--';
  };

  const dateFormat = (date) => {
    if (date) {
      return `${formatMessage({ id: 'adjustment_time' })}: ${dayjs(+date * 1000).format('MM/DD HH:mm:ss')}`;
    }
    return `${formatMessage({ id: 'adjustment_time' })}: ${dayjs().format('MM/DD HH:mm:ss')}`;
  };

  const goStock = ({ smallMarket, stockCode }) => {
    goToSymbolPage({ market: smallMarket, code: stockCode });
  };

  // 市场转换
  const tradeMarketTransform = { HKEX: IconHK, SZMK: IconSZ, SHMK: IconSH, USA: IconUS };

  // 显示列表 || 显示更多
  const moreList = useMemo(() => {
    if (!showMore) {
      const tempList = list && list.length > 5 ? list.slice(0, 5) : list;
      return tempList;
    }
    return list;
  }, [showMore]);

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

  return (
    <div styleName="table">
      <div
        styleName="tool-box"
      >
        <div styleName="update-time">{dateFormat(updateTime)}</div>
      </div>
      <div styleName="group-list">
        <div styleName="title">
          {title.map((item, idx) => (
            <div styleName={`title-item d${idx + 1}`} key={item}>
              {item}
            </div>
          ))}
        </div>
        <div styleName="table-list">
          {moreList && moreList.length ?
            moreList.map((item, index) => (
              <div styleName={item.orderStatus === null ? 'unsettled content' : 'content'} key={index}>
                <div styleName="item">
                  <div styleName="d1" onClick={() => goStock(item)}>
                    <div styleName="h-name">
                      {
                        item.orderStatus !== null ? (
                          item.bs === 'B' ? (
                            <span styleName="business buy">{formatMessage({ id: 'buy' })}</span>
                          ) : (
                            <span styleName="business sell">{formatMessage({ id: 'sell' })}</span>
                          )
                        ) : (
                          <span styleName="business" />
                        )
                      }
                      <div styleName="stock-name">{item.stockName}</div>
                    </div>
                    <div styleName={item.orderStatus === null ? 'market ml40' : 'market'}>
                      <img src={tradeMarketTransform[item.tradeMarket]} alt="" />
                      <div styleName="code">{item.stockCode}</div>
                    </div>
                  </div>
                  <div styleName="d2">
                    <div styleName="proportion">
                      <div styleName="s">{item?.beforeRatio || '　--'}</div>
                      <img src={Iconjt} alt="" />
                      <div styleName="s">{item?.afterRatio || '--'}</div>
                    </div>
                    <div styleName="refer-to">
                      {statusText(item.id, item.orderStatus, item.entrustPrice)}
                    </div>
                  </div>
                  <div styleName="d3">{toThousandFormat((+item.entrustBalance).toFixed(2))}</div>
                </div>
              </div>
            )) : null}
        </div>
      </div>
      {
        !showMore && list && list.length > 5 ? (
          <div styleName="expand-all" onClick={() => setShowMore(true)}>
            <div styleName="expand">{formatMessage({ id: 'expand_all' })}</div>
            <img styleName="more" src={IconMore} alt="" />
          </div>
        ) : null
      }
    </div>
  );
});

export default Table;
