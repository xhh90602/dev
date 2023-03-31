import { BS_DIRECTION } from '@/constants/trade';
import { JavaMarket, thousandsChange } from '@/utils';
import { toFixed, toThousand } from '@dz-web/o-orange';
import { getClassNameByPriceChange } from '@dz-web/quote-client';
import { FormattedMessage } from 'react-intl';
import { Popover } from 'antd-mobile';
import QuoteMarketTypeTag from '@mobile/components/quote-market-type-tag/quote-market-type-tag';
import { find, get } from 'lodash-es';
import { useMemo } from 'react';
import { ITableItemColumns } from '../table-list/table-list';
import IconSvg from '../icon-svg';

import './table-column-item.scss';
import { goToSymbolPage } from '../../helpers/native/msg';
// import useSubscribeComponent from '../../hooks/use-subscribe-component';

const actions = [
  {
    key: `${JavaMarket.HKEX}-${JavaMarket.A}`,
    text: (
    // <span className="t-normal">
      <FormattedMessage id="all_market" />
    // </span >
    ),
  },
  { key: JavaMarket.HKEX, text: <FormattedMessage id="hk_stock" /> },
  { key: JavaMarket.A, text: <FormattedMessage id="sh_sz" /> },
  // { key: JavaMarket.USA, text: <FormattedMessage id="美股" /> },
];

const mergeItem = {
  titleClassName: 'padding-th-column',
  className: 'padding-column',
  align: 'right',
};

const getText = (item) => {
  let str = '--';
  if (String(item).indexOf('-') > -1) {
    str = `-${thousandsChange(Number(String(item).slice(1)))}`;
  } else {
    str = thousandsChange(Number(item));
  }

  return str;
};

type ColumnItem = (props?: {
  width?: string;
  fixed?: boolean;
  type?: string;
}) => ITableItemColumns

/**
 * 全部市场
 */
// eslint-disable-next-line default-param-last
export const marketCodeName = (
  domRef,
  setMarket:(val) => void = () => undefined,
  market: JavaMarket[] = [],
  props = { width: '25%' },
) => {
  const Menu = () => {
    const render = useMemo(() => {
      if (!market.length) return <FormattedMessage id="all_market" />;

      const node = actions.find((item) => item.key === market.join('-'));

      const { id } = node?.text?.props || { id: 'all_market' };
      const marketName = id;

      return (
        <div className="padding-th-column">
          <FormattedMessage id={marketName} />
          <span className="arrow" />
        </div>
      );
    }, [market]);

    return (
      <Popover.Menu
        getContainer={() => domRef.current}
        actions={actions}
        placement="bottom-start"
        onAction={(node) => {
          console.log(`选择了 ${node.text}`, node);
          if (node.key) setMarket(String(node.key).split('-'));
        }}
        trigger="click"
      >
        {render}
      </Popover.Menu>
    );
  };

  return {
    ...mergeItem,

    titleClassName: '',
    fixed: true,
    label: <Menu />,
    dataKey: 'stockCode',
    width: props.width,
    align: 'left',
    render: ({ rowData }) => {
      const { stockCode = '', stockName = '', smallMarket } = rowData;

      return (
        <div>
          {/* <span className="">
          <IconSvg path="icon_condition_order" />
        </span> */}
          <div styleName="import-text" className="f-bold">
            {stockName}
          </div>
          <div className="flex-l-c f-s-22">
            <QuoteMarketTypeTag market={smallMarket} />
            {stockCode}
          </div>
        </div>
      );
    },
  };
};

export const CodeName = (props = { width: '25%' }) => ({
  ...mergeItem,

  titleClassName: '',
  fixed: true,
  label: (
    <div className="padding-th-column">
      <FormattedMessage id="stock_and_code" />
    </div>
  ),
  dataKey: 'stockCode',
  width: props.width,
  align: 'left',
  render: ({ rowData }) => {
    const { stockCode = '', stockName = '', smallMarket } = rowData;

    return (
      <div onClick={() => {
        console.log('跳转个股详情---->', rowData);
        goToSymbolPage({ market: Number(smallMarket), code: stockCode });
      }}
      >
        <div styleName="import-text" className="f-bold">
          {stockName}
        </div>
        <div className="flex-l-c f-s-22">
          <QuoteMarketTypeTag market={smallMarket} />
          {stockCode}
        </div>
      </div>
    );
  },
});

/**
 * 现价/成本
 */
export const nowAndLastPrice: ColumnItem = (props = { width: '25%' }) => ({
  ...mergeItem,

  label:
  (
    <div>
      <FormattedMessage id="current_price" />
      |
      <FormattedMessage id="cost" />
    </div>
  ),
  dataKey: 'lastPrice',
  width: props.width,
  render: ({ rowData }) => {
    const { lastPrice = '', costPrice = '' } = rowData;

    return (
      <div>
        <div styleName="import-text">
          {toFixed(lastPrice, {
            precision: 3,
          })}
        </div>
        <div>
          {toFixed(costPrice, {
            precision: 3,
          })}
        </div>
      </div>
    );
  },
});

/**
 * 市值
 */
export const marketValue: ColumnItem = (props = { width: '25%' }) => ({
  ...mergeItem,

  label: <FormattedMessage id="market_value" />,
  dataKey: 'marketValue',
  width: props.width,
  render: ({ value }) => <div styleName="import-text">{Number(value) === 0 ? '--' : getText(value)}</div>,
});

/**
 * 持仓/可用
 */
export const currentAndEnableQty: ColumnItem = (props = { width: '25%' }) => ({
  ...mergeItem,

  label:
  (
    <div>
      <FormattedMessage id="position" />
      |
      <FormattedMessage id="available" />
    </div>
  ),
  dataKey: 'currentQty',
  width: props.width,
  render: ({ rowData }) => {
    const { currentQty = '', enableQty = '' } = rowData;

    return (
      <div className="lh_1 stock_title_style">
        <div styleName="import-text">{toThousand(currentQty || undefined)}</div>
        <div>{toThousand(enableQty || undefined)}</div>
      </div>
    );
  },
});

/**
 * 持仓盈亏
 */
export const fundInCom: ColumnItem = (props = { width: '25%' }) => ({
  ...mergeItem,

  label: <FormattedMessage id="position_income" />,
  dataKey: 'totalPL',
  sortable: false,
  width: props.width,
  render: ({ rowData }) => (
    <div styleName="main-text" className={`${getClassNameByPriceChange(rowData.totalPL)}`}>
      <div styleName="import-text">
        {getText(rowData.totalPL)}
      </div>
      <div>
        {rowData.totalPLPercent}
      </div>
    </div>
  ),
});

/**
 * 今日盈亏
 */
export const todayFundInCom: ColumnItem = (props = { width: '25%' }) => ({
  ...mergeItem,

  label: <FormattedMessage id="today_income" />,
  dataKey: 'floatingPL',
  sortable: false,
  width: props.width,
  render: ({ value }: { value: StrNumber }) => (
    <div styleName="main-text" className={`${getClassNameByPriceChange(value)}`}>
      {getText(value)}
    </div>
  ),
});

/**
 * 持仓占比
 */
export const holdRatio: ColumnItem = (props = { width: '25%' }) => ({
  ...mergeItem,

  label: <FormattedMessage id="position_ratio" />,
  dataKey: 'holdRatio',
  width: props.width,
  render: ({ value }) => (
    <div styleName="main-text" className={getClassNameByPriceChange(parseFloat(value))}>
      {value || '--'}
    </div>
  ),
});

/**
 * 委托|成交均价
 */
export const orderAndAveragePrice: ColumnItem = (props = { width: '25%' }) => ({
  ...mergeItem,

  label: (
    <div>
      <FormattedMessage id="entrust" />
      |
      <FormattedMessage id="make_bargain_average_price" />
    </div>
  ),
  dataKey: 'price',
  width: props.width,
  render: ({ rowData }) => {
    const { orderType, price, execPrice } = rowData;

    const orderPriceText = () => {
      if (orderType === 'MKT') return <FormattedMessage id="MKT" />;
      if (orderType === 'AO') return <FormattedMessage id="AO" />;
      return toFixed(price, {
        precision: 3,
      });
    };

    return (
      <div>
        <div styleName="import-text">{orderPriceText()}</div>
        <div>
          {toFixed(execPrice || 0, {
            precision: 3,
          })}
        </div>
      </div>
    );
  },
});

/**
 * 委托数量|已成交
 */
export const qtyAndFilledQty: ColumnItem = (props = { width: '30%' }) => ({
  ...mergeItem,

  label: (
    <div>
      <FormattedMessage id="entrust_qty" />
      |
      <FormattedMessage id="already_make_bargain" />
    </div>
  ),
  dataKey: 'qty',
  width: props.width,
  render: ({ rowData }) => {
    const { qty, execQty } = rowData;

    return (
      <div>
        <div styleName="import-text">{toThousand(qty)}</div>
        <div>{toThousand(execQty || undefined)}</div>
      </div>
    );
  },
});

/**
 * 方向|状态
 */
export const bsAndStatus: ColumnItem = (props = { width: '25%', type: 'entrust' }) => ({
  ...mergeItem,

  label: <FormattedMessage id="direction_and_status" />,
  dataKey: 'statusDescription',
  width: props.width,
  render: ({ rowData }) => {
    const { bs, status } = rowData;

    const statusOptions = [
      { name: 'already_appointment', value: '0', icon: 'icon_order_status_appointment' },
      { name: 'await_make_bargain', value: '1', icon: 'icon_order_status_await' },
      {
        name: 'part_make_bargain',
        value: '2',
        icon: props.type === 'entrust' ? 'icon_order_status_await' : 'icon_order_status_finish',
      },
      { name: 'all_make_bargain', value: '3', icon: 'icon_order_status_finish' },
      { name: 'already_revoke', value: '4', icon: 'icon_order_status_cancel' },
      { name: 'already_lose_efficacy', value: '5', icon: 'icon_order_status_cancel' },
      { name: 'order_fail', value: '6' },
    ];

    const currentStatus = find(statusOptions, (v) => v.value === status);

    const isBuy = bs === BS_DIRECTION.BUY;

    return (
      <div>
        <div styleName="main-text">
          <span className={isBuy ? 'orange-color' : 'blue-color'}>
            <FormattedMessage id={isBuy ? 'buying' : 'sale'} />
          </span>
        </div>
        <div className="flex-r-c">
          {currentStatus?.icon && <IconSvg path={currentStatus.icon} />}
          <FormattedMessage id={currentStatus?.name} />
        </div>
      </div>
    );
  },
});

/**
 * 下单时间
 */
export const orderTime: ColumnItem = (props = { width: '25%' }) => ({
  ...mergeItem,

  label: <FormattedMessage id="order_date" />,
  dataKey: 'orderTime',
  width: props.width,
  className: 'padding-column',
  render: ({ value }) => {
    const time = value.split(' ');

    return (
      <div>
        <div styleName="import-text">
          {time[0]}
        </div>
        <div>
          {time[1]}
        </div>
      </div>
    );
  },
});

const orderTypeAction = [
  {
    key: 'all',
    text: <FormattedMessage id="all" />,
  },
  {
    key: '1',
    text: <FormattedMessage id="individual_share" />,
  },
  {
    key: '2',
    text: <FormattedMessage id="condition" />,
  },
  {
    key: '3',
    text: <FormattedMessage id="combination" />,
  },
];
/**
 * 历史订单 名称|代码
 */
export const historyNameAndCode = (
  domRef,
  orderType = 'all',
  setOrderType: (type: string) => void = (type) => undefined,
  props = { width: '25%' },
) => {
  const Menu = () => {
    const render = useMemo(() => {
      const orderTypeText = get(
        orderTypeAction.find((item) => item.key === orderType),
        'text',
        <FormattedMessage id="all" />,
      );

      return (
        <div styleName="name-and-code">
          {orderTypeText}
          <FormattedMessage id="order" />
          <span className="arrow" />
        </div>
      );
    }, [orderType]);

    return (
      <Popover.Menu
        getContainer={() => domRef.current}
        actions={orderTypeAction}
        placement="bottom-start"
        onAction={(node) => {
          if (node.key) setOrderType(String(node.key));
        }}
        trigger="click"
      >
        {render}
      </Popover.Menu>
    );
  };

  return {
    ...mergeItem,
    label: <Menu />,
    dataKey: 'stockCode',
    width: props.width,
    align: 'left',
    render: ({ rowData }) => {
      const { type, stockCode = '', stockName = '', smallMarket } = rowData;

      return (
        <div
          styleName="name-and-code"
          onClick={(e) => {
            goToSymbolPage({ market: Number(smallMarket), code: stockCode });
            e.stopPropagation();
          }}
        >
          <span styleName="order-icon">
            {type === '2' && <IconSvg path="icon_condition_order" />}
            {type === '3' && <IconSvg path="icon_combination_order" />}
          </span>
          <div styleName="import-text" className="f-bold">
            {stockName}
          </div>
          <div className="flex-l-c">
            <QuoteMarketTypeTag market={smallMarket} />
            {stockCode}
          </div>
        </div>
      );
    },
  };
};

/**
 * 名称|代码
 */
export const nameAndCode = (props = { width: '25%' }) => ({
  ...mergeItem,

  label: (
    <div styleName="name-and-code">
      <FormattedMessage id="stock_and_code" />
    </div>
  ),
  dataKey: 'stockCode',
  width: props.width,
  align: 'left',
  render: ({ rowData }) => {
    const { type, stockCode = '', stockName = '', smallMarket } = rowData;

    return (
      <div
        styleName="name-and-code"
        onClick={(e) => {
          goToSymbolPage({ market: Number(smallMarket), code: stockCode });
          e.stopPropagation();
        }}
      >
        <span styleName="order-icon">
          {type === '2' && <IconSvg path="icon_condition_order" />}
          {type === '3' && <IconSvg path="icon_combination_order" />}
        </span>
        <div styleName="import-text" className="f-bold">
          {stockName}
        </div>
        <div className="flex-l-c">
          <QuoteMarketTypeTag market={smallMarket} />
          {stockCode}
        </div>
      </div>
    );
  },
});

/**
 * 现价/委托
 */
export const nowAndOrderPrice: ColumnItem = (props = { width: '20%' }) => ({
  ...mergeItem,

  label:
    (
      <div>
        <FormattedMessage id="current_price" />
        |
        <FormattedMessage id="entrust" />
      </div>
    ),
  dataKey: 'nowPrice',
  width: props.width,
  render: ({ rowData }) => {
    const { orderType, nowPrice = '', price = '' } = rowData;

    const orderPriceText = () => {
      if (orderType === 'MKT') return <FormattedMessage id="MKT" />;
      if (orderType === 'AO') return <FormattedMessage id="AO" />;
      return toFixed(price, {
        precision: 3,
      });
    };

    return (
      <div>
        <div styleName="import-text">
          {toFixed(nowPrice, {
            precision: 3,
          })}
        </div>
        <div>{orderPriceText()}</div>
      </div>
    );
  },
});
