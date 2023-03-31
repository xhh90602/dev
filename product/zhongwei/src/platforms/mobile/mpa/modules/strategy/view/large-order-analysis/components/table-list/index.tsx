import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import { goToSymbolPage } from '@/platforms/mobile/helpers/native/msg';
import { getMarketCategoryTag } from '@dz-web/quote-client';
import IconSZ from '@/platforms/mobile/images/icon_SZ.svg';
import IconSH from '@/platforms/mobile/images/icon_SH.svg';
import IconHK from '@/platforms/mobile/images/icon_HK.svg';
import IconUS from '@/platforms/mobile/images/icon_US.svg';
import './index.scss';

const TableList: React.FC<any> = memo((props: any) => {
  const { list, label = '', field } = props;
  const { formatMessage } = useIntl();

  const fixed = (value = 0) => {
    if (field === 'ExBigChange' || field === 'BigChange') {
      return `${(value ? (value * 100).toFixed(2) : 0.00)}%`;
    }
    if (field === 'ExBigBuyAmount' || field === 'BigBuyAmount' || field === 'AmountPerTrade') {
      return `${(value ? (value / 10000).toFixed(2) : 0.00)}`;
    }
    if (field === 'BuyRate') {
      return `${(value ? (value).toFixed(2) : 0.00)}%`;
    }
    return `${(value ? (value / 10000).toFixed(2) : 0)}`;
  };

  // 市场转换
  const tradeMarketTransform = { HK: IconHK, SZ: IconSZ, SH: IconSH, US: IconUS };

  const goStock = ({ Market, Code }) => {
    goToSymbolPage({ market: Market, code: Code });
  };

  return (
    <div styleName="table-list">
      <div styleName="content">
        <div styleName="header">
          <div styleName="item c1">{formatMessage({ id: 'ranking' })}</div>
          <div styleName="item c2">{formatMessage({ id: 'name_code' })}</div>
          <div styleName="item c3">{label}</div>
        </div>
        <div styleName="box">
          <div styleName="item-box">
            {
              list.map((item, idx) => (
                <div styleName="item" key={`${item.name}-${item.Market}-${item.Code}-${performance.now()}`}>
                  <div styleName="ranking c1">
                    {
                      idx <= 2 ? (
                        <span styleName={`d${idx + 1}`}>{idx + 1}</span>
                      ) : (
                        <span>{idx + 1}</span>
                      )
                    }
                  </div>
                  <div styleName="stock-info c2" onClick={() => goStock({ ...item })}>
                    <div styleName="name">{item.Name}</div>
                    <div styleName="market-code">
                      <img
                        styleName="market"
                        src={tradeMarketTransform[getMarketCategoryTag(item?.Market) || '']}
                        alt=""
                      />
                      <div styleName="code">{item.Code}</div>
                    </div>
                  </div>
                  <div styleName="value c3">{fixed(item[field])}</div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
});

export default TableList;
