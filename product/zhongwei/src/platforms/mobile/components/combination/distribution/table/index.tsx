import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { getClassNameByPriceChange } from '@dz-web/quote-client';
import IconSortDefault from '@/platforms/mobile/images/icon_sort_default.png';
import IconSortAsc from '@/platforms/mobile/images/icon_sort_asc.png';
import IconSortDesc from '@/platforms/mobile/images/icon_sort_desc.png';
import Empty from '@/platforms/mobile/components/combination/empty';

import './index.scss';

const Table: React.FC<any> = (props: any) => {
  const { list } = props;
  const [data, setData] = useState<any>([]);
  const [sort, setSort] = useState<string>('');
  const [field, setField] = useState<string>('');
  const { formatMessage } = useIntl();
  const [titleList, setTitleList] = useState<any>([
    { name: formatMessage({ id: 'name_code' }) },
    { name: formatMessage({ id: 'current_price_cost_price' }) },
    {
      name: formatMessage({ id: 'rate_of_return' }),
      field: 'profitRatio',
      sort: true,
      sortType: 'default',
      icon: IconSortDefault,
    },
    {
      name: formatMessage({ id: 'asset_ratio' }),
      field: 'ratio',
      sort: true,
      sortType: 'default',
      icon: IconSortDefault,
    },
    {
      name: formatMessage({ id: 'positions' }),
      field: 'amount',
      sort: true,
      sortType: 'default',
      icon: IconSortDefault,
    },
  ]);

  const sortClick = (idx, str) => {
    if (!str) return;
    titleList.forEach((item, index) => {
      if (item.sort && index === idx) {
        if (item.sortType === 'default') {
          item.sortType = 'asc';
          item.icon = IconSortAsc;
          setSort('asc');
        } else if (item.sortType === 'asc') {
          item.sortType = 'desc';
          item.icon = IconSortDesc;
          setSort('desc');
        } else if (item.sortType === 'desc') {
          item.sortType = 'default';
          item.icon = IconSortDefault;
          setSort('default');
        }
      } else {
        item.sortType = 'default';
        item.icon = IconSortDefault;
      }
    });
    setField(str);
    setTitleList([...titleList]);
  };

  const toNum = (str) => {
    if (typeof str === 'string' && str.indexOf('%') > -1) {
      const rs = str.split('%');
      return (rs[0]) ? (+rs[0]) : 0;
    }
    return str;
  };

  const isCodeFun = (str) => str.indexOf('*') > -1;

  const fixed = (str) => {
    if (str && typeof str === 'string' && str.indexOf('*') > -1) {
      return str;
    }
    return (+str * 100).toFixed(2);
  };

  useEffect(() => {
    const tempList = data.filter((item) => !item.hide);
    if (tempList && tempList.length) {
      if (sort !== 'default') {
        const isCode = isCodeFun(tempList[0][field]);
        if (!isCode) {
          let temp = [];
          if (sort === 'asc') {
            temp = tempList.sort((a, b) => toNum(a[field]) - toNum(b[field]));
          } else {
            temp = tempList.sort((a, b) => toNum(b[field]) - toNum(a[field]));
          }
          setData([...temp]);
        }
      }
    }
  }, [titleList]);

  useEffect(() => {
    if (list && list.length) {
      setData([...list]);
    }
  }, [list]);

  return (
    <div styleName="table-list-box">
      {/* 表格头部 */}
      {
        data && data.length ? (
          <>
            <div styleName="table-header">
              {
                titleList.map((item, idx) => (
                  <div
                    styleName={`title-item d${idx + 1}`}
                    key={`${item.name}-${item.stockCode}`}
                    onClick={() => sortClick(idx, item.field)}
                  >
                    {item.name}
                    {
                      item.sort && <img src={item.icon} alt="" />
                    }
                  </div>
                ))
              }
            </div>
            <div styleName="table-list">
              {
                data.map((item) => (
                  !item.hide ? (
                    <div styleName="item" key={item.name}>
                      <div styleName="d1">
                        <div styleName="stock-name">{item.name}</div>
                        <div styleName="stock-info">
                          <img src={item.MarketIMG} alt="" />
                          <span>{item.stockCode}</span>
                        </div>
                      </div>
                      <div styleName="d2">
                        <div styleName="now-price">{item.nowPrice}</div>
                        <div styleName="cost-price">{item.costPrice}</div>
                      </div>
                      <div
                        styleName="d3"
                        className={getClassNameByPriceChange(item.profitRatio)}
                      >
                        {item.profitRatio}
                      </div>
                      <div
                        styleName="d4"
                      >
                        {item.ratio}
                      </div>
                      <div
                        styleName="d5"
                      >
                        {item.amount}
                      </div>
                    </div>
                  ) : null
                ))
              }
            </div>
          </>
        ) : (
          <div styleName="empty-box"><Empty /></div>
        )
      }
    </div>
  );
};

export default Table;
