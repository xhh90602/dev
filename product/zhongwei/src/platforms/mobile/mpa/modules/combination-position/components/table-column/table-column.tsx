import { FormattedMessage } from 'react-intl';
import { Popover } from 'antd-mobile';
import { isNaN, isNil } from 'lodash-es';
import { BS_DIRECTION } from '@/constants/trade';
import { isTrue, toFixed, toPercent, toSlice, toThousand } from '@dz-web/o-orange';
import { getClassNameByPriceChange } from '@dz-web/quote-client';
import { JavaMarket, setPositiveSign } from '@/utils';
import { ORDER_STATUS, ORDER_STATUS_LANG_DICT, getOrderStatus } from '@/constants/combination';
import { goToSymbolPage } from '@mobile/helpers/native/msg';

import dayjs from 'dayjs';
import classNames from 'classnames';
import AdaptiveText from '@/components/adaptive-text/adaptive-text';
import QuoteMarketTypeTag from '@mobile/components/quote-market-type-tag/quote-market-type-tag';
import './table-column.scss';

interface IColumnProps {
  fixed?: boolean;
  width?: string;
  align?: string;
  sortable?: boolean;
  domRef?: any;
  callback?: (...args: any[]) => any;
}

interface IParcel {
  orderInfo: Record<string, any>;
  sName?: string;
  children: any;
}

const ColumnParcel: React.FC<IParcel> = (props) => {
  const { orderInfo, sName, children } = props;

  return (
    <div
      styleName={sName}
      className={classNames({
        'column-gray-bg': !orderInfo?.orderStatus,
      })}
    >
      {children}
    </div>
  );
};

const actions = [
  {
    key: 'ALL',
    text: (
      <span className="t-normal">
        <FormattedMessage id="all_market" />
      </span>
    ),
  },
  { key: JavaMarket.HKEX, text: <FormattedMessage id="hk_stocks" /> },
  { key: JavaMarket.A, text: <FormattedMessage id="shanghai_and_shenzhen" /> },
  { key: JavaMarket.USA, text: <FormattedMessage id="us_stocks" /> },
];

function handleToStockDetail(info: Record<string, any>) {
  const { smallMarket, stockCode } = info;

  return goToSymbolPage({ market: smallMarket, code: stockCode });
}

/**
 * 全部市场
 */
// eslint-disable-next-line default-param-last
export const marketCodeName = ({
  fixed = true,
  width = '25%',
  align = 'left',
  domRef,
  callback,
}: IColumnProps = {}) => ({
  fixed,
  align,
  width,
  dataKey: 'stockCode',
  label: (
    <Popover.Menu
      trigger="click"
      actions={actions}
      onAction={(node) => {
        if (callback) callback(node.key);
      }}
      getContainer={() => domRef.current}
      placement="bottom-start"
    >
      <div styleName="th-all-market-box">
        <FormattedMessage id="all_market" />
      </div>
    </Popover.Menu>
  ),
  render: ({ rowData }) => {
    const { stockCode, stockName, smallMarket } = rowData;

    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          handleToStockDetail(rowData);
        }}
      >
        <div styleName="content-bold stock-name">{stockName}</div>
        <div styleName="second-level-content" className="flex-l-c">
          <QuoteMarketTypeTag market={smallMarket} />
          {stockCode}
        </div>
      </div>
    );
  },
});

/**
 * 现价|成本
 */
export const currentPriceAndCost = ({
  fixed = false,
  width = '20%',
  align = 'right',
  sortable = false,
}: IColumnProps = {}) => ({
  fixed,
  align,
  width,
  sortable,
  dataKey: 'nowPrice',
  label: <FormattedMessage id="current_price_and_cost" />,
  render: ({ rowData }) => {
    const { nowPrice, costPrice } = rowData;

    return (
      <div>
        <div styleName="content">
          {toSlice(nowPrice, {
            precision: 3,
          })}
        </div>
        <div styleName="second-level-content">
          {toSlice(costPrice, {
            precision: 3,
          })}
        </div>
      </div>
    );
  },
});

/**
 * 持仓|可用
 */
export const positionHeldAvailable = ({
  fixed = false,
  width = '20%',
  align = 'right',
  sortable = false,
}: IColumnProps = {}) => ({
  fixed,
  align,
  width,
  sortable,
  dataKey: 'position',
  label: <FormattedMessage id="position_held_available" />,
  render: ({ rowData }) => {
    const { position, available } = rowData;

    return (
      <div>
        <div styleName="content">{toThousand(position)}</div>
        <div styleName="second-level-content">{toThousand(available)}</div>
      </div>
    );
  },
});

/**
 * 持仓盈亏
 */
export const opsitionGainAndLoss = ({
  fixed = false,
  width = '20%',
  align = 'right',
  sortable = true,
}: IColumnProps = {}) => ({
  fixed,
  align,
  width,
  sortable,
  dataKey: 'totalProfitLoss',
  label: <FormattedMessage id="position_gain_and_loss" />,
  render: ({ rowData }) => {
    const { totalProfitLoss, totalProfitLossRatio } = rowData;

    return (
      <div>
        <p styleName="content" className={`${getClassNameByPriceChange(totalProfitLoss)}`}>
          {toThousand(setPositiveSign(totalProfitLoss))}
        </p>
        <p styleName="second-level-content" className={`${getClassNameByPriceChange(totalProfitLoss)}`}>
          {setPositiveSign(totalProfitLossRatio)}
        </p>
      </div>
    );
  },
});

/**
 * 今日盈亏
 */
export const todayProfitAndLoss = ({
  fixed = false,
  width = '20%',
  align = 'right',
  sortable = true,
}: IColumnProps = {}) => ({
  fixed,
  align,
  width,
  sortable,
  dataKey: 'profitLoss',
  label: <FormattedMessage id="today_profit_and_loss" />,
  render: ({ rowData }) => {
    const { profitLoss, profitLossRatio } = rowData;

    return (
      <div>
        <p styleName="content" className={`${getClassNameByPriceChange(profitLoss)}`}>
          {setPositiveSign(profitLoss)}
        </p>
        <p styleName="second-level-content" className={`${getClassNameByPriceChange(profitLoss)}`}>
          {setPositiveSign(profitLossRatio)}
        </p>
      </div>
    );
  },
});

/**
 * 市值
 */
export const marketValue = ({
  fixed = false,
  width = '25%',
  align = 'right',
  sortable = false,
}: IColumnProps = {}) => ({
  fixed,
  align,
  width,
  sortable,
  dataKey: 'marketValue',
  label: <FormattedMessage id="market_value" />,
  render: ({ value }) => (
    <div styleName="content">{isNil(value) ? toFixed(0) : <AdaptiveText text={toThousand(value)} fontSize={27} />}</div>
  ),
});

/**
 * 资产占比
 */
export const assetsAccountedFor = ({
  fixed = false,
  width = '20%',
  align = 'right',
  sortable = false,
}: IColumnProps = {}) => ({
  fixed,
  align,
  width,
  sortable,
  dataKey: 'assetsRatio',
  label: <FormattedMessage id="assets_accounted_for" />,
  render: ({ value }) => <div styleName="content">{value}</div>,
});

/**
 * 来源组合
 * 占比
 */
export const proportionoOfSourceCombination = ({
  fixed = false,
  width = '20%',
  align = 'right',
  sortable = false,
}: IColumnProps = {}) => ({
  fixed,
  align,
  width,
  sortable,
  dataKey: 'sourceAssetsRatio',
  label: (
    <div>
      <p>
        <FormattedMessage id="source_combination" />
      </p>
      <p>
        <FormattedMessage id="take_proportion" />
      </p>
    </div>
  ),
  render: ({ rowData }) => {
    const { sourceAssetsRatio } = rowData;

    return (
      <ColumnParcel orderInfo={rowData} sName="content">
        {sourceAssetsRatio}
      </ColumnParcel>
    );
  },
});

/**
 * 差异
 */
export const difference = ({ fixed = false, width = '20%', align = 'right', sortable = false }: IColumnProps = {}) => ({
  fixed,
  align,
  width,
  sortable,
  dataKey: 'diffAssetsRatio',
  label: <FormattedMessage id="difference" />,
  render: ({ rowData }) => {
    const { diffAssetsRatio } = rowData;

    return (
      <ColumnParcel orderInfo={rowData} sName="content difference-text">
        {diffAssetsRatio ? setPositiveSign(diffAssetsRatio) : toPercent(+toFixed(0))}
      </ColumnParcel>
    );
  },
});

/**
 * 名称|代码
 */
export const nameAndCode = ({ fixed = true, width = '30%', align = 'left', sortable = false }: IColumnProps = {}) => ({
  fixed,
  align,
  width,
  sortable,
  dataKey: 'stockCode',
  label: <FormattedMessage id="name_and_code" />,
  render: ({ rowData }) => {
    const { showEllipsis, addColumn, bs, stockCode, stockName, smallMarket } = rowData;
    const isBuy = bs === BS_DIRECTION.BUY;

    if (showEllipsis) {
      return <div styleName="content">.... </div>;
    }

    if (addColumn) {
      return (
        <div styleName="content-bold">
          <FormattedMessage id="remaining_configurable_amount" />
        </div>
      );
    }

    return (
      <ColumnParcel orderInfo={rowData}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleToStockDetail(rowData);
          }}
        >
          {bs ? (
            <div styleName="deal-icon-box">
              <p styleName={classNames(['deal-icon', bs === BS_DIRECTION.BUY ? 'buy-icon' : 'sell-icon'])}>
                <FormattedMessage id={isBuy ? 'buy' : 'sell'} />
              </p>
              <p styleName="content-bold stock-name">{stockName}</p>
            </div>
          ) : (
            <div styleName="content-bold stock-name">{stockName}</div>
          )}

          <div styleName="second-level-content" className="flex-l-c">
            <QuoteMarketTypeTag market={smallMarket} />
            {stockCode}
          </div>
        </div>
      </ColumnParcel>
    );
  },
});

/**
 * 现价/委托
 */
export const nowAndOrderPrice = ({
  fixed = false,
  width = '25%',
  align = 'right',
  sortable = false,
}: IColumnProps = {}) => ({
  fixed,
  align,
  width,
  sortable,
  dataKey: 'nowPrice',
  label: <FormattedMessage id="current_price_and_entrust" />,
  render: ({ rowData }) => {
    const { nowPrice, entrustPrice, price, dec = 3 } = rowData;

    return (
      <div>
        <div styleName="content">
          {toSlice(nowPrice, {
            precision: dec,
          })}
        </div>
        <div styleName="second-level-content">
          {toSlice(entrustPrice || price, {
            precision: dec,
          })}
        </div>
      </div>
    );
  },
});

/**
 * 委托|成交均价
 */
export const entrustAndTradeAveragePrice = ({
  fixed = false,
  width = '25%',
  align = 'right',
  sortable = false,
}: IColumnProps = {}) => ({
  fixed,
  align,
  width,
  sortable,
  dataKey: 'nowPrice',
  label: <FormattedMessage id="entrust_and_trade_average_price" />,
  render: ({ rowData }) => {
    const { price, execPrice, dec = 2 } = rowData;

    return (
      <div>
        <div styleName="content">
          {toSlice(price, {
            precision: dec,
          })}
        </div>
        <div styleName="second-level-content">
          {toSlice(execPrice, {
            precision: dec,
          })}
        </div>
      </div>
    );
  },
});

/**
 * 委托数量|已成交
 */
export const qtyAndFilledQty = ({
  fixed = false,
  width = '30%',
  align = 'right',
  sortable = false,
}: IColumnProps = {}) => ({
  fixed,
  align,
  width,
  sortable,
  dataKey: 'entrustQty',
  label: <FormattedMessage id="quantity_entrusted_and_done" />,
  render: ({ rowData }) => {
    const { entrustQty, filledQty, qty, execQty } = rowData;

    return (
      <div>
        <div styleName="content">{isTrue(entrustQty) ? entrustQty : qty}</div>
        <div styleName="second-level-content">{isTrue(filledQty) ? filledQty : execQty}</div>
      </div>
    );
  },
});

/**
 * 方向|状态
 */
export const bsAndStatus = ({
  fixed = false,
  width = '30%',
  align = 'right',
  sortable = false,
}: IColumnProps = {}) => ({
  fixed,
  align,
  width,
  sortable,
  dataKey: 'bs',
  label: <FormattedMessage id="direction_and_state" />,
  render: ({ rowData }) => {
    const { bs, orderStatus } = rowData;
    const isBuy = bs === BS_DIRECTION.BUY;

    const isNotNumber = isNaN(parseFloat(orderStatus));
    const status = isNotNumber ? orderStatus : getOrderStatus(+orderStatus);

    return (
      <div>
        <div styleName="content">
          <span styleName="deal-direction" className={isBuy ? 'orange-color' : 'blue-color'}>
            <FormattedMessage id={isBuy ? 'buy_text' : 'sell_text'} />
          </span>
        </div>
        <div
          styleName={classNames({
            'second-level-content': true,
            'wait-status': status === ORDER_STATUS.WAITING_FOR_TRANSACTION,
          })}
        >
          <FormattedMessage id={ORDER_STATUS_LANG_DICT[status]} />
        </div>
      </div>
    );
  },
});

/**
 * 来源组合（调仓前占比）
 */
export const sourceCombination = ({
  fixed = false,
  width = '30%',
  align = 'right',
  sortable = false,
}: IColumnProps = {}) => ({
  fixed,
  align,
  width,
  sortable,
  dataKey: 'sourceAssetsRatio',
  label: (
    <div>
      <p>
        <FormattedMessage id="source_combination" />
      </p>
      <p>
        <FormattedMessage id="proportion_before_warehouse_adjustment" />
      </p>
    </div>
  ),
  render: ({ value }) => <div styleName="content">{value}</div>,
});

/**
 * 当前组合（调仓前占比）
 */
export const currentCombination = ({
  fixed = false,
  width = '30%',
  align = 'right',
  sortable = false,
}: IColumnProps = {}) => ({
  fixed,
  align,
  width,
  sortable,
  dataKey: 'beforeRatio',
  label: (
    <div>
      <p>
        <FormattedMessage id="current_combination" />
      </p>
      <p>
        <FormattedMessage id="proportion_before_warehouse_adjustment" />
      </p>
    </div>
  ),
  render: ({ value }) => <div styleName="content">{value}</div>,
});

/**
 * 调仓至
 */
export const warehouseTo = ({
  fixed = false,
  width = '25%',
  align = 'right',
  sortable = false,
}: IColumnProps = {}) => ({
  fixed,
  align,
  width,
  sortable,
  dataKey: 'planRatio',
  label: (
    <div>
      <p>
        <FormattedMessage id="warehouse_to" />
      </p>
      <p>
        <FormattedMessage id="plan" />
      </p>
    </div>
  ),
  render: ({ value }) => <div styleName="content">{value}</div>,
});

/**
 * 调仓时间
 */
export const warehouseTime = ({
  fixed = true,
  width = '30%',
  align = 'left',
  sortable = false,
}: IColumnProps = {}) => ({
  fixed,
  align,
  width,
  sortable,
  dataKey: 'createTime',
  label: <FormattedMessage id="warehouse_time" />,
  render: ({ rowData }) => {
    const { bs, createTime } = rowData;
    const isBuy = bs === BS_DIRECTION.BUY;

    return (
      <div>
        <div styleName="deal-icon-box">
          <p styleName={classNames(['deal-icon', bs === BS_DIRECTION.BUY ? 'buy-icon' : 'sell-icon'])}>
            <FormattedMessage id={isBuy ? 'buy' : 'sell'} />
          </p>

          <p styleName="content">
            <AdaptiveText text={dayjs(createTime).format('YYYY/MM/DD')} fontSize={27} />
          </p>
        </div>

        <p styleName="second-level-content">{dayjs(createTime).format('HH:mm:ss')}</p>
      </div>
    );
  },
});

/**
 * 调仓前 -> 调仓至(计划)
 */
export const warehouseToRatio = ({
  fixed = false,
  width = '35%',
  align = 'center',
  sortable = false,
}: IColumnProps = {}) => ({
  fixed,
  align,
  width,
  sortable,
  dataKey: 'beforeRatio',
  label: (
    <div styleName="warehouse-to-title">
      <p styleName="before-text">
        <FormattedMessage id="before_adjustment" />
      </p>
      <div>
        <p>
          <FormattedMessage id="warehouse_to" />
        </p>
        <p>
          <FormattedMessage id="plan" />
        </p>
      </div>
    </div>
  ),
  render: ({ rowData }) => {
    const { showEllipsis, addColumn, beforeRatio, planRatio, entrustPrice, orderStatus } = rowData;

    if (showEllipsis) {
      return <div />;
    }

    function getStatusNode() {
      if ([ORDER_STATUS.ALL_TRANSACTIONS, ORDER_STATUS.PARTIAL_TRANSACTION].includes(orderStatus)) {
        return (
          <>
            <FormattedMessage id="reference_transaction_price" />
            <span styleName="entrust-price">{toFixed(entrustPrice)}</span>
          </>
        );
      }

      if ([ORDER_STATUS.CANCELLED_ORDER, ORDER_STATUS.ORDER_FAILED, ORDER_STATUS.INVALID].includes(orderStatus)) {
        return <FormattedMessage id="canceled" />;
      }

      if ([ORDER_STATUS.WAITING_FOR_TRANSACTION].includes(orderStatus)) {
        return <FormattedMessage id="wait_trans" />;
      }

      return <FormattedMessage id="not_warehouse" />;
    }

    return (
      <ColumnParcel orderInfo={rowData} sName="warehouse-to-content">
        <div styleName="content ratio-box">
          <p styleName="before-ratio">{beforeRatio || toFixed(0)}</p>
          <p>{planRatio || toFixed(0)}</p>
        </div>

        {!addColumn && <div styleName="second-level-content">{getStatusNode()}</div>}
      </ColumnParcel>
    );
  },
});

/**
 * 调仓金额（计划）
 */
export const warehouseAmountPlan = ({
  fixed = false,
  width = '20%',
  align = 'center',
  sortable = false,
}: IColumnProps = {}) => ({
  fixed,
  align,
  width,
  sortable,
  dataKey: 'planAmount',
  label: (
    <div>
      <p>
        <FormattedMessage id="adjustment_amount" />
      </p>
      <p>
        <FormattedMessage id="plan" />
      </p>
    </div>
  ),
  render: ({ rowData }) => {
    const { showEllipsis, planAmount } = rowData;

    if (showEllipsis) {
      return <div />;
    }

    return (
      <ColumnParcel orderInfo={rowData} sName="content">
        {isNil(planAmount) ? toFixed(0) : <AdaptiveText text={toThousand(toFixed(planAmount))} fontSize={27} />}
      </ColumnParcel>
    );
  },
});

/**
 * 调仓数量（计划）
 */
export const warehouseNumberPlan = ({
  fixed = false,
  width = '20%',
  align = 'center',
  sortable = false,
}: IColumnProps = {}) => ({
  fixed,
  align,
  width,
  sortable,
  dataKey: 'planQty',
  label: (
    <div>
      <p>
        <FormattedMessage id="warehouse_number" />
      </p>
      <p>
        <FormattedMessage id="plan" />
      </p>
    </div>
  ),
  render: ({ rowData }) => {
    const { addColumn, showEllipsis, planQty } = rowData;

    if (addColumn || showEllipsis) {
      return (
        <ColumnParcel orderInfo={rowData} sName="content">
          <span />
        </ColumnParcel>
      );
    }

    return (
      <ColumnParcel orderInfo={rowData} sName="content">
        {isNil(planQty) ? 0 : <AdaptiveText text={`${Math.floor(planQty)}`} fontSize={27} />}
      </ColumnParcel>
    );
  },
});

/**
 * 调仓后比例（实际）
 */
export const warehouseAfterRatio = ({
  fixed = false,
  width = '20%',
  align = 'center',
  sortable = false,
}: IColumnProps = {}) => ({
  fixed,
  align,
  width,
  sortable,
  dataKey: 'actualRatio',
  label: (
    <div>
      <p>
        <FormattedMessage id="after_adjustment" />
      </p>
      <p>
        <FormattedMessage id="practical" />
      </p>
    </div>
  ),
  render: ({ rowData }) => {
    const { actualRatio } = rowData;

    return (
      <ColumnParcel orderInfo={rowData} sName="content">
        {isNil(actualRatio) ? toPercent(0) : <AdaptiveText text={actualRatio} fontSize={27} />}
      </ColumnParcel>
    );
  },
});

/**
 * 调仓金额（实际）
 */
export const warehouseAmountPractical = ({
  fixed = false,
  width = '20%',
  align = 'center',
  sortable = false,
}: IColumnProps = {}) => ({
  fixed,
  align,
  width,
  sortable,
  dataKey: 'actualAmount',
  label: (
    <div>
      <p>
        <FormattedMessage id="adjustment_amount" />
      </p>
      <p>
        <FormattedMessage id="practical" />
      </p>
    </div>
  ),
  render: ({ rowData }) => {
    const { actualAmount } = rowData;

    return (
      <ColumnParcel orderInfo={rowData} sName="content">
        {isNil(actualAmount) ? toFixed(0) : <AdaptiveText text={toThousand(toFixed(actualAmount))} fontSize={27} />}
      </ColumnParcel>
    );
  },
});

/**
 * 调仓数量（实际）
 */
export const warehouseNumberPractical = ({
  fixed = false,
  width = '20%',
  align = 'center',
  sortable = false,
}: IColumnProps = {}) => ({
  fixed,
  align,
  width,
  sortable,
  dataKey: 'actualQty',
  label: (
    <div>
      <p>
        <FormattedMessage id="warehouse_number" />
      </p>
      <p>
        <FormattedMessage id="practical" />
      </p>
    </div>
  ),
  render: ({ rowData }) => {
    const { actualQty } = rowData;

    return (
      <ColumnParcel orderInfo={rowData} sName="content">
        {isNil(actualQty) ? 0 : <AdaptiveText text={`${Math.floor(actualQty)}`} fontSize={27} />}
      </ColumnParcel>
    );
  },
});

/**
 * 成交时间
 */
export const transactionTime = ({
  fixed = false,
  width = '20%',
  align = 'left',
  sortable = false,
}: IColumnProps = {}) => ({
  fixed,
  align,
  width,
  sortable,
  dataKey: 'dealTime',
  label: <FormattedMessage id="transaction_time" />,
  render: ({ value }) => (
    <div styleName="content">
      <p>{dayjs(value).format('MM-DD-YYYY')}</p>
      <p>{dayjs(value).format('hh:mm:ss')}</p>
    </div>
  ),
});

/**
 * 成交数量
 */
export const transactionNumber = ({
  fixed = false,
  width = '20%',
  align = 'right',
  sortable = false,
}: IColumnProps = {}) => ({
  fixed,
  align,
  width,
  sortable,
  dataKey: 'transactionNumber',
  label: <FormattedMessage id="transaction_number" />,
  render: ({ value }) => (
    <div styleName="content">{isNil(value) ? 0 : <AdaptiveText text={value} fontSize={27} />}</div>
  ),
});

/**
 * 成交价格
 */
export const transactionPrice = ({
  fixed = false,
  width = '20%',
  align = 'right',
  sortable = false,
}: IColumnProps = {}) => ({
  fixed,
  align,
  width,
  sortable,
  dataKey: 'transactionPrice',
  label: <FormattedMessage id="transaction_price" />,
  render: ({ value }) => <div styleName="content">{value}</div>,
});

/**
 * 成交金额
 */
export const transactionAmount = ({
  fixed = false,
  width = '25%',
  align = 'right',
  sortable = false,
}: IColumnProps = {}) => ({
  fixed,
  align,
  width,
  sortable,
  dataKey: 'transactionAmount',
  label: <FormattedMessage id="transaction_amount" />,
  render: ({ value }) => (
    <div styleName="content">{isNil(value) ? toFixed(0) : <AdaptiveText text={toThousand(value)} fontSize={27} />}</div>
  ),
});
