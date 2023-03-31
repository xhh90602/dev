import React, { memo, useMemo } from 'react';
import { nativeOpenPage } from '@/platforms/mobile/helpers/native/url';
import { useIntl } from 'react-intl';
import { goToSymbolPage } from '@/platforms/mobile/helpers/native/msg';
import IconAddStock from '@/platforms/mobile/images/icon_add-stock.svg';
import IconStockClose from '@/platforms/mobile/images/icon_stock_close.svg';

import './index.scss';

const StockItemCard: React.FC<any> = memo((props: any) => {
  const { list = [], colors, stockDel = () => null } = props;
  const { formatMessage } = useIntl();

  // 添加股票
  const goToAddStockFilter = () => {
    nativeOpenPage('add-stock-filter.html?source=pk', false, true);
  };

  // 跳转到股票详情
  const goStock = ({ marketId, code }) => {
    goToSymbolPage({ market: marketId, code });
  };

  const emptyList = useMemo(() => {
    const temp: any = [];
    for (let i = 4; i > list.length; i -= 1) {
      temp.push(i);
    }
    return temp;
  }, [list]);

  return (
    <div styleName="stock-item-card-box">
      {
        list.map((item, index) => (
          <div styleName="item-card" key={item.code} onClick={() => goStock(item)}>
            <div styleName="name">{item.name}</div>
            <div styleName="code">{item.code}</div>
            <div styleName="d" style={{ backgroundColor: colors[index] }} />
            <img styleName="close" src={IconStockClose} alt="" onClick={() => stockDel(index)} />
          </div>
        ))
      }
      {
        emptyList.map((item) => (
          <div styleName="empty-item-card" key={item} onClick={() => goToAddStockFilter()}>
            <img src={IconAddStock} alt="" />
            <p>{formatMessage({ id: 'add_stock_text' })}</p>
          </div>
        ))
      }
    </div>
  );
});

export default StockItemCard;
