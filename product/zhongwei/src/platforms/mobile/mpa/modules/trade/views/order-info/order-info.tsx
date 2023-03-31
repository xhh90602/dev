import { useEffect, useMemo } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Collapse, Toast } from 'antd-mobile';
import { toFixed, toPlaceholder, toThousand } from '@dz-web/o-orange';

import { TRADE_ROUTERS } from '@mobile-mpa/modules/trade/routers';
import { BS_DIRECTION, TRADE_ORDER_STATUS, TRADE_ORDER_STATUS_LANG_DOCT } from '@/constants/trade';
import { getOrderStatus, ORDER_STATUS_ALL, ORDER_STATUS_LANG_DICT } from '@/constants/combination';
import {
  settingNavigationTitle,
  settingHeaderButton,
  openNewPage,
  PageType,
  goToSymbolPage,
} from '@mobile/helpers/native/msg';
import {
  transactionTime,
  transactionNumber,
  transactionPrice,
  transactionAmount,
} from '@mobile-mpa/modules/combination-position/components/table-column/table-column';

import Loading from '@mobile/components/loading/loading';
import TableList from '@mobile/components/table-list/table-list';
import NoMessage from '@mobile/components/no-message/no-message';
import BasicModal from '@mobile/components/basic-modal/basic-modal';

import useOrderDetails from '@/hooks/trade/use-order-details';
import useRevocationOrders from '@/hooks/combination-position/use-revocation-orders';
import IconArrowUp from '@mobile/images/icon_arrow_up.svg';
import IconArrowDown from '@mobile/images/icon_arrow_down.svg';
import './order-info.scss';

const orderCfg = [
  {
    key: 'stock_code',
    label: <FormattedMessage id="stock_code" />, // 股票代码
    render: (info: Record<string, any>) => {
      const { stockName, stockCode, smallMarket = '' } = info;

      return (
        <p styleName="arrow-right" onClick={() => goToSymbolPage({ market: +smallMarket, code: stockCode })}>
          {`${stockName} ${stockCode}`}
        </p>
      );
    },
  },
  {
    key: 'trade_direction',
    label: <FormattedMessage id="trade_direction" />, // 交易方向
    render: (info: Record<string, any>) => {
      const isBuy = info.bs === BS_DIRECTION.BUY;

      return (
        <p styleName={isBuy ? 'buy-text' : 'sell-text'}>
          <FormattedMessage id={isBuy ? 'buying' : 'sale'} />
        </p>
      );
    },
  },
  {
    key: 'entrust_number',
    label: <FormattedMessage id="entrust_number" />, // 委托数量
    render: (info: Record<string, any>) => <p styleName="font-bold">{toPlaceholder(info.qty)}</p>,
  },
  {
    key: 'order_type',
    label: <FormattedMessage id="order_type" />, // 订单类型
    render: (info: Record<string, any>) => {
      const { orderType } = info;
      if (orderType) {
        return <FormattedMessage id={TRADE_ORDER_STATUS_LANG_DOCT[info.orderType]} />;
      }

      return <span>--</span>;
    },
  },
  {
    key: 'entrust_price',
    label: <FormattedMessage id="entrust_price" />, // 委托价格
    render: (info: Record<string, any>) => (
      <p styleName="font-bold">
        {toPlaceholder(info.price)}
      </p>
    ),
  },
  {
    key: 'deadline',
    label: <FormattedMessage id="deadline" />, // 有效期
    render: (info: Record<string, any>) => (
      <FormattedMessage id={info.term === '1' ? 'this_date_only' : 'valid_until_withdrawal'} />
    ),
  },
];

const transactionCfg = [
  {
    key: 'transaction_average_price',
    label: <FormattedMessage id="transaction_average_price" />, // 成交均价
    render: (info: Record<string, any>) => <p styleName="font-bold">{toPlaceholder(toFixed(info.execPrice))}</p>,
  },
  {
    key: 'transaction_number',
    label: <FormattedMessage id="transaction_number" />, // 成交数量
    render: (info: Record<string, any>) => <p styleName="font-bold">{toPlaceholder(info.execQty)}</p>,
  },
];

const securitiesTraderFeeCfg = [
  {
    key: 'securities_businesses',
    label: <FormattedMessage id="securities_businesses" />, // 中薇证券
    // eslint-disable-next-line max-len
    render: (info: Record<string, any>) => (
      <p styleName="font-bold">{toPlaceholder(toFixed(info.securitiesTotalFee))}</p>
    ),
  },
  {
    key: 'commission',
    label: <FormattedMessage id="commission" />, // 佣金
    render: (info: Record<string, any>) => <p>{toPlaceholder(toFixed(info._COMM_))}</p>,
  },
  {
    key: 'platform_licensing',
    label: <FormattedMessage id="platform_licensing" />, // 平台使用费
    render: (info: Record<string, any>) => <p>{toPlaceholder(toFixed(info['Platform Fee(CVS)']))}</p>,
  },
];

const exchangeFeeCfg = [
  {
    key: 'exchange_brokerage',
    label: <FormattedMessage id="exchange_brokerage" />, // 交易所费用
    render: (info: Record<string, any>) => <p styleName="font-bold">{toPlaceholder(toFixed(info.exchangeTotalFee))}</p>,
  },
  {
    key: 'transaction_system_use_fee',
    label: <FormattedMessage id="transaction_system_use_fee" />, // 交易系统使用费
    render: (info: Record<string, any>) => <p>{toPlaceholder(toFixed(info['Platform Fee']))}</p>,
  },
  {
    key: 'central_settlement_fee',
    label: <FormattedMessage id="central_settlement_fee" />, // 中央结算费
    render: (info: Record<string, any>) => <p>{toPlaceholder(toFixed(info['4CCASS']))}</p>,
  },
  {
    key: 'stamp_duty',
    label: <FormattedMessage id="stamp_duty" />, // 印花税
    render: (info: Record<string, any>) => <p>{toPlaceholder(toFixed(info['3STAMP']))}</p>,
  },
  {
    key: 'transaction_fee',
    label: <FormattedMessage id="transaction_fee" />, // 交易费
    render: (info: Record<string, any>) => <p>{toPlaceholder(toFixed(info['1TFEE']))}</p>,
  },
  {
    key: 'transaction_levy',
    label: <FormattedMessage id="transaction_levy" />, // 交易征费
    render: (info: Record<string, any>) => <p>{toPlaceholder(toFixed(info['2LEVY']))}</p>,
  },
  {
    key: 'cfa_transaction_levy',
    label: <FormattedMessage id="cfa_transaction_levy" />, // 财汇局交易征费
    render: (info: Record<string, any>) => <p>{toPlaceholder(toFixed(info.FINTRADE))}</p>,
  },
];

const conditionCfg = [
  {
    key: 'condition',
    label: <FormattedMessage id="condition" />, // 条件
    render: () => <p>按股票价格，价格达到180.00</p>,
  },
  {
    key: 'execute',
    label: <FormattedMessage id="execute" />, // 执行
    render: () => <p>以触发价181.00买入</p>,
  },
  {
    key: 'state',
    label: <FormattedMessage id="state" />, // 状态
    render: () => <p styleName="font-bold">已触发</p>,
  },
  {
    key: 'condition_expiration_date',
    label: <FormattedMessage id="condition_expiration_date" />, // 条件到期日
    render: () => <p>01-13-2022 16:00:00失效</p>,
  },
];

const revokeCfg = [
  {
    key: 'name',
    label: <FormattedMessage id="name" />, // 名称
    render: (info: Record<string, any>) => <p>{info.stockName}</p>,
  },
  {
    key: 'code',
    label: <FormattedMessage id="code" />, // 代码
    render: (info: Record<string, any>) => <p>{info.stockCode}</p>,
  },
  {
    key: 'entrust_price',
    label: <FormattedMessage id="entrust_price" />, // 委托价格
    render: (info: Record<string, any>) => <p>{info.price}</p>,
  },
  {
    key: 'revoke_number',
    label: <FormattedMessage id="revoke_number" />, // 撤单数量
    render: (info: Record<string, any>) => {
      const { qty, execQty } = info;

      return (
        <p>
          <span>{`${qty - execQty}`}</span>
          <span>
            (
            <FormattedMessage id="reference" />
            )
          </span>
        </p>
      );
    },
  },
];

const StockOrderDetail: React.FC = () => {
  const { formatMessage } = useIntl();

  const { modalInfo, setModalInfo, handleRevokeOrders } = useRevocationOrders();
  const {
    isLoading,
    orderInfo: { orderInfo = {}, combineInfo = {}, conditionsOrderInfo = {} },
    fetchData,
  } = useOrderDetails();

  const isConditionOrder = useMemo(() => {
    const hasKey = Object.keys(conditionsOrderInfo).length;

    if (hasKey || orderInfo.orderType === TRADE_ORDER_STATUS.CONDITION) {
      return true;
    }

    return false;
  }, [orderInfo, conditionsOrderInfo]);

  const orderInfoCfg = useMemo(() => {
    if (isConditionOrder) {
      const arr = orderCfg.slice(0, 4);
      return arr;
    }

    return orderCfg;
  }, [isConditionOrder]);

  const isSupportRevoke = useMemo(() => {
    const { orderStatus } = orderInfo;

    return [
      ORDER_STATUS_ALL.WAIT_REPORT,
      ORDER_STATUS_ALL.WAIT_TRANSACTION,
      ORDER_STATUS_ALL.PORTION_TRANSACTION,
    ].includes(+orderStatus);
  }, [orderInfo.orderStatus]);

  const hasCombine = useMemo(() => {
    if (combineInfo.portfolioId) return true;

    return false;
  }, [combineInfo]);

  function handleOpen(path: string) {
    return openNewPage({
      replace: false,
      pageType: PageType.HTML,
      path,
    });
  }

  function handleAgainOrder() {
    const { bs, stockCode, smallMarket, orderType } = orderInfo;

    const isBuy = bs === BS_DIRECTION.BUY;
    const tradeRoute = isBuy ? TRADE_ROUTERS.BUY : TRADE_ROUTERS.SELL;

    return openNewPage({
      replace: false,
      pageType: PageType.HTML,
      path: `/trade.html#${tradeRoute}?code=${stockCode}&market=${smallMarket}&active_key=${orderType}`,
    });
  }

  useEffect(() => {
    settingNavigationTitle({ name: formatMessage({ id: 'order_details' }) });

    settingHeaderButton([
      {
        index: 1,
        icon: 'back',
        position: 'left',
        onClickCallbackEvent: 'back',
      },
    ]);
  }, []);

  return (
    <Loading isLoading={isLoading}>
      <div styleName="order-detail-box">
        {hasCombine && (
          <div
            styleName="basis-box combination-box"
            onClick={() => {
              const path = `combination-position.html#/combination-detail?portfolioId=${combineInfo.portfolioId}`;
              handleOpen(path);
            }}
          >
            <div>
              <p styleName="combination-name">{combineInfo.name}</p>
              <p>{formatMessage({ id: 'current_combination' })}</p>
            </div>
          </div>
        )}

        <div styleName="basis-box order-status-box">
          <p styleName="order-no">
            <span styleName="order-no-label">{formatMessage({ id: 'order_number' })}</span>
            <span>{orderInfo.orderNo}</span>
          </p>
          <p styleName="order-status">
            {orderInfo.orderStatus
              ? formatMessage({ id: ORDER_STATUS_LANG_DICT[getOrderStatus(+orderInfo.orderStatus)] })
              : formatMessage({ id: 'wait_trigger' })}
          </p>
          <p styleName="order-time">
            <span styleName="order-time-label">{formatMessage({ id: 'order_time' })}</span>
            <span>{orderInfo.createTime}</span>
          </p>
        </div>

        <div styleName="basis-box order-info-box">
          {orderInfoCfg.map((item) => (
            <div styleName="info-item" key={item.key}>
              <div styleName="label">{item.label}</div>
              <div styleName="content">{item.render(orderInfo)}</div>
            </div>
          ))}

          {isConditionOrder && (
            <div styleName="conditions-box">
              {conditionCfg.map((item) => (
                <div styleName="info-item" key={item.key}>
                  <div styleName="label">{item.label}</div>
                  <div styleName="content">{item.render()}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div styleName="basis-box clinch-deal-box">
          {transactionCfg.map((item) => (
            <div styleName="info-item" key={item.key}>
              <div styleName="label">{item.label}</div>
              <div styleName="content">{item.render(orderInfo)}</div>
            </div>
          ))}

          <div styleName="transaction-detail">
            <Collapse accordion defaultActiveKey="1">
              <Collapse.Panel
                key="1"
                title={(
                  <div styleName="collapse-transaction-title font-bold">
                    {formatMessage({ id: 'transaction_detail' })}
                  </div>
                )}
                // eslint-disable-next-line react/no-unstable-nested-components
                arrow={(active: boolean) => <img src={active ? IconArrowUp : IconArrowDown} alt="" />}
              >
                <div styleName="detail-table">
                  <TableList
                    data={orderInfo.dealDetailList || []}
                    columns={[transactionTime(), transactionNumber(), transactionPrice(), transactionAmount()]}
                    hiddenBox={<NoMessage />}
                  />
                </div>
              </Collapse.Panel>
            </Collapse>
          </div>
        </div>

        <div styleName="basis-box fee-box">
          <Collapse accordion defaultActiveKey="1">
            <Collapse.Panel
              key="1"
              title={<div styleName="collapse-fee-title font-bold">{formatMessage({ id: 'expense_detail' })}</div>}
              // eslint-disable-next-line react/no-unstable-nested-components
              arrow={(active: boolean) => <img src={active ? IconArrowUp : IconArrowDown} alt="" />}
            >
              <div styleName="fee-item">
                {securitiesTraderFeeCfg.map((item) => (
                  <div styleName="info-item" key={item.key}>
                    <div styleName="label">{item.label}</div>
                    <div styleName="content">{item.render(orderInfo.chargesMap || {})}</div>
                  </div>
                ))}
              </div>

              <div styleName="fee-item exchange-fee-box">
                {exchangeFeeCfg.map((item) => (
                  <div styleName="info-item" key={item.key}>
                    <div styleName="label">{item.label}</div>
                    <div styleName="content">{item.render(orderInfo.chargesMap || {})}</div>
                  </div>
                ))}
              </div>

              <div styleName="info-item fee-total-box">
                <div styleName="label">{formatMessage({ id: 'total_cost' })}</div>
                <div styleName="content font-bold">
                  {toPlaceholder(toThousand(toFixed(orderInfo.chargesMap?.totalFee)))}
                </div>
              </div>
            </Collapse.Panel>
          </Collapse>
        </div>

        <div styleName="btn-box">
          {isSupportRevoke ? (
            <button type="button" styleName="revoke-btn" onClick={() => setModalInfo({ visible: true, orderInfo })}>
              {formatMessage({ id: 'revoke' })}
            </button>
          ) : (
            <button type="button" styleName="orders-btn" onClick={handleAgainOrder}>
              {formatMessage({ id: 'again_order' })}
            </button>
          )}
        </div>

        <BasicModal
          visible={modalInfo.visible}
          title={formatMessage({ id: 'revoke_confirmed' })}
          cancelText={formatMessage({ id: 'cancel' })}
          confirmText={formatMessage({ id: 'determine' })}
          onCancel={() => setModalInfo({ visible: false })}
          onConfirm={() => handleRevokeOrders(() => {
            Toast.show({ content: formatMessage({ id: 'revoke_successed' }) });
            fetchData();
          })}
        >
          <div styleName="revoke-box">
            {revokeCfg.map((item) => (
              <div styleName="info-item revoke-item" key={item.key}>
                <div styleName="label">{item.label}</div>
                <div styleName="content">{item.render(orderInfo)}</div>
              </div>
            ))}
          </div>
        </BasicModal>
      </div>
    </Loading>
  );
};

export default StockOrderDetail;
