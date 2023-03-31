/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-irregular-whitespace */
import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import { useSearchParam } from 'react-use';
import { goToSymbolPage } from '@mobile/helpers/native/msg';
import Iconjt from '@/platforms/mobile/images/icon_jt.svg';
import IconSZ from '@/platforms/mobile/images/icon_SZ.svg';
import IconSH from '@/platforms/mobile/images/icon_SH.svg';
import IconHK from '@/platforms/mobile/images/icon_HK.svg';
import IconUS from '@/platforms/mobile/images/icon_US.svg';
import { nativeOpenPage } from '@/platforms/mobile/helpers/native/url';
import { toThousand } from '@dz-web/o-orange';
import IconMore from '@/platforms/mobile/images/icon_zh_more.svg';
import dayjs from 'dayjs';

import './index.scss';

const Table = memo((props: any) => {
  const portfolioId = Number(useSearchParam('portfolioId')) || 0;
  const { list } = props;
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
      return `${dayjs(date).format('MM/DD HH:mm:ss')}`;
    }
    return `${dayjs().format('MM/DD HH:mm:ss')}`;
  };

  const goDetail = ({ surplusCapital, id, updateTime }) => {
    if (surplusCapital !== null) {
      nativeOpenPage(`adjustment-record-details.html?portfolioId=${portfolioId}&id=${id}&updateTime=${dayjs(updateTime).unix()}`);
    }
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

  const showFormat = (num, arr) => {
    const bool = arr.some((ele) => ele.orderStatus === 'PENDING_TRANSACTIONS');
    if (bool) return '--';
    return toThousandFormat(num || 0);
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
      {
        list && list.length ? list.map((ele) => (
          <div styleName="group-list" key={ele.id}>
            <div
              styleName="tool-box"
              onClick={
                () => goDetail({ surplusCapital: ele?.surplusCapital, id: ele?.id, updateTime: ele?.updateTime })
              }
            >
              <div styleName="update-time">{dateFormat(ele?.updateTime)}</div>
              {
                ele?.surplusCapital !== null ? (
                  <img styleName="jt" src={IconMore} alt="" />
                ) : null
              }
            </div>
            <div styleName="table-list">
              {ele?.entrustRecordVOList && ele?.entrustRecordVOList.length
                ? ele?.entrustRecordVOList.map((item, idx) => (
                  // 默认只展示两条
                  idx <= 1 ? (
                    <div styleName="content" key={`${item.id}-${idx}`}>
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
                        <div
                          styleName="d2"
                          onClick={
                            () => goDetail({ surplusCapital: ele?.surplusCapital, id: ele?.id, updateTime: ele?.updateTime })
                          }
                        >
                          <div styleName="proportion">
                            <div styleName="s">{item?.beforeRatio || '　--'}</div>
                            <img src={Iconjt} alt="" />
                            <div styleName="s">{item?.afterRatio || '--'}</div>
                          </div>
                          <div styleName="refer-to">
                            {statusText(item.id, item.orderStatus, item.entrustPrice)}
                          </div>
                        </div>
                        <div
                          styleName="d3"
                          onClick={
                            () => goDetail({ surplusCapital: ele?.surplusCapital, id: ele?.id, updateTime: ele?.updateTime })
                          }
                        >
                          {toThousandFormat((+item.entrustBalance || 0).toFixed(2))}
                        </div>
                      </div>
                    </div>
                  ) : null
                )) : null}
            </div>
            {
              ele?.entrustRecordVOList.length > 2 && (<div styleName="more-dian">……</div>)
            }
            {
              ele.surplusCapital !== null && (
                <div styleName="balance-text">
                  <div styleName="label">{formatMessage({ id: 'balance' })}</div>
                  <div styleName="proportion">
                    <div styleName="s">{ele?.beforeRatio || '　--'}</div>
                    <img src={Iconjt} alt="" />
                    <div styleName="s">{ele?.afterRatio || '--'}</div>
                  </div>
                  <div styleName="d3">{showFormat(ele.surplusCapital, (ele?.entrustRecordVOList || []))}</div>
                </div>
              )
            }
          </div>
        )) : null
      }
    </div>
  );
});

export default Table;
