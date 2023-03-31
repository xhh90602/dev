/* eslint-disable implicit-arrow-linebreak */
import { ensure, toPositiveSign } from '@dz-web/o-orange';
import { getUnit } from '@mobile/helpers/native/unit';
import { getClassNameByPriceChange, getMarketCategoryTag, MARKET_TYPE_TAG } from '@dz-web/quote-client';

import IconSZ from '@/platforms/mobile/images/icon_SZ.svg';
import IconSH from '@/platforms/mobile/images/icon_SH.svg';
import IconHK from '@/platforms/mobile/images/icon_HK.svg';
import IconUS from '@/platforms/mobile/images/icon_US.svg';

import './get-column.scss';

const listTypeLabel = {
  1: '',
  2: '',
  3: 'average',
  4: 'average',
  5: 'take',
  6: 'take',
};

export default function getDefaultColumn(formatMessage, typeValue, raise = 'red'): any[] {
  const marketTypeTag = {
    [MARKET_TYPE_TAG.hk]: IconHK,
    [MARKET_TYPE_TAG.sh]: IconSH,
    [MARKET_TYPE_TAG.sz]: IconSZ,
    [MARKET_TYPE_TAG.us]: IconUS,
  };

  const showRender = ({ value }) => {
    const { unit, multi } = getUnit(value, formatMessage);
    return ensure(value, undefined, () => (
      <div className="content-item">
        {/* {`${toPositiveSign((value / multi).toFixed(2))}${unit}`} */}
        {`${(value / multi).toFixed(2)}${unit}`}
      </div>
    ));
  };

  const changeColumns = [
    {
      // 卖空数量
      label: `${listTypeLabel[typeValue] ? formatMessage({ id: listTypeLabel[typeValue] }) : ''}${formatMessage({
        id: 'short_sales_number',
      })}`,
      sortable: true,

      dataKey: 'ss_volume',
      width: '25%',
      align: 'left',
      titleClassName: 'table-header-cell',
      className: 'table-body-cell',
      render: showRender,
    },
    {
      // 卖空比例
      label: `${listTypeLabel[typeValue] ? formatMessage({ id: listTypeLabel[typeValue] }) : ''}${formatMessage({
        id: 'short_sales_ratio',
      })}`,
      sortable: true,

      dataKey: 'ss_turnover_per',
      width: '25%',
      align: 'left',
      titleClassName: 'table-header-cell',
      className: 'table-body-cell',
      render: ({ value }) =>
        ensure(value, undefined, () => (
          <div className={`content-item ${getClassNameByPriceChange(value)}`}>
            {toPositiveSign(value)}
            %
          </div>
        )),
    },
  ];

  const changeColumnsRender = () => {
    if ([2, 4, 6].indexOf(typeValue) > -1) {
      return changeColumns.reverse();
    }
    return changeColumns;
  };

  return [
    {
      label: formatMessage({ id: 'stock_name' }),
      fixed: true,
      dataKey: 'name',
      width: '25%',
      align: 'left',
      titleClassName: 'table-header-cell',
      className: 'table-body-cell',
      render: ({ rowData }) => (
        <div styleName="name-code-info">
          <div styleName="name-style">{rowData.name}</div>
          {/* <span styleName="other-name"> */}
          {/* {rowData.otherName} */}
          {/* </span> */}
          <div styleName="tag">
            <img src={marketTypeTag.HK} alt="" styleName="market-tag" />
            {/* <img src={
              marketTypeTag[getMarketCategoryTag(rowData?.marketId) || '']} alt="" styleName="market-tag" /> */}
            <span styleName="code-style">{rowData.stk_uni_id.split('.')[0]}</span>
          </div>
        </div>
      ),
    },
    // ...changeColumns,
    ...changeColumnsRender(),
    {
      label: formatMessage({ id: 'turnover' }),
      sortable: true,

      dataKey: 'ss_turnover',
      width: '25%',
      align: 'left',
      titleClassName: 'table-header-cell',
      className: 'table-body-cell',
      render: showRender,
    },
    {
      label: formatMessage({ id: 'nominal' }),
      sortable: true,

      dataKey: 'last_nominal',
      width: '25%',
      align: 'left',
      titleClassName: 'table-header-cell',
      className: 'table-body-cell',
      render: ({ value }) => ensure(value, undefined, () => <div className="content-item">{value}</div>),
    },
    {
      label: formatMessage({ id: 'rise_fall' }),
      sortable: true,

      dataKey: 'last_change',
      width: '25%',
      align: 'left',
      titleClassName: 'table-header-cell',
      className: 'table-body-cell',
      render: ({ value }) =>
        ensure(value, undefined, () => (
          <div className={`content-item ${getClassNameByPriceChange(value)}`}>
            {toPositiveSign(value)}
            %
          </div>
        )),
    },
  ];
}
