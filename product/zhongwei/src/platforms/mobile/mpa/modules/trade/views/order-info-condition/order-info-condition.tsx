import { useEffect } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { toFixed, toPlaceholder, toThousand } from '@dz-web/o-orange';

import { BS_DIRECTION, TRADE_ORDER_STATUS, TRADE_ORDER_STATUS_LANG_DOCT } from '@/constants/trade';
import { getOrderStatus, ORDER_STATUS_LANG_DICT } from '@/constants/combination';
import { settingNavigationTitle, settingHeaderButton, goToSymbolPage } from '@mobile/helpers/native/msg';

import Loading from '@mobile/components/loading/loading';
import BasicModal from '@mobile/components/basic-modal/basic-modal';

import useOrderDetailsCondition from '@/hooks/trade/use-order-details-condition';
import './order-info-condition.scss';

const orderInfoCfg = [
  {
    key: 'stock_code',
    label: <FormattedMessage id="stock_code" />,
    render: (info: Record<string, any>) => {
      const { stockName, stockCode, smallMarket } = info;

      return (
        <p styleName="arrow-right" onClick={() => goToSymbolPage({ market: smallMarket, code: stockCode })}>
          {`${stockName} ${stockCode}`}
        </p>
      );
    },
  },
  {
    key: 'trade_direction',
    label: <FormattedMessage id="trade_direction" />,
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
    key: 'order_type',
    label: <FormattedMessage id="order_type" />,
    render: () => <FormattedMessage id={TRADE_ORDER_STATUS_LANG_DOCT[TRADE_ORDER_STATUS.CONDITION]} />,
  },
  {
    key: 'entrust_number',
    label: <FormattedMessage id="entrust_number" />,
    render: (info: Record<string, any>) => <p styleName="font-bold">{toPlaceholder(info.qty)}</p>,
  },
];

const conditionCfg = [
  {
    key: 'condition',
    label: <FormattedMessage id="condition" />,
    render: () => <p>按股票价格，价格达到180.00</p>,
  },
  {
    key: 'execute',
    label: <FormattedMessage id="execute" />,
    render: () => <p>以触发价181.00买入</p>,
  },
  {
    key: 'state',
    label: <FormattedMessage id="state" />,
    render: () => <p styleName="font-bold">已触发</p>,
  },
  {
    key: 'condition_expiration_date',
    label: <FormattedMessage id="condition_expiration_date" />,
    render: () => <p>01-13-2022 16:00:00失效</p>,
  },
];

const OrderInfoCondition: React.FC = () => {
  const { formatMessage } = useIntl();

  const {
    isLoading,
    conditionOrderInfo,
    conditionOrderInfo: { orderInfo = {} },
  } = useOrderDetailsCondition();

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
        <div styleName="basis-box order-status-box">
          <p styleName="order-no">
            <span styleName="order-no-label">{formatMessage({ id: 'order_number' })}</span>
            <span>{conditionOrderInfo.conditionNo}</span>
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

          <div styleName="conditions-box">
            {conditionCfg.map((item) => (
              <div styleName="info-item" key={item.key}>
                <div styleName="label">{item.label}</div>
                <div styleName="content">{item.render()}</div>
              </div>
            ))}
          </div>
        </div>

        <div styleName="btn-box">
          <button type="button" styleName="revoke-btn" onClick={() => console.log('【onCancel】')}>
            {formatMessage({ id: 'revoke' })}
          </button>
        </div>

        <BasicModal
          visible={false}
          title="终止确认"
          cancelText={formatMessage({ id: 'cancel' })}
          confirmText={formatMessage({ id: 'determine' })}
          onCancel={() => console.log('【onCancel】')}
          onConfirm={() => console.log('【onConfirm】')}
        >
          <div styleName="revoke-box">确认要终止当前条件单吗</div>
        </BasicModal>
      </div>
    </Loading>
  );
};

export default OrderInfoCondition;
