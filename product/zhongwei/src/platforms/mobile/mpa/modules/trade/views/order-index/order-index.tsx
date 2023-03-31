import { TRADE_ORDER_TYPE } from '@/constants/trade';
import TradeOrder from '@/platforms/mobile/containers/trade-order/trade-order';
import { useEffect } from 'react';

import './order-index.scss';
import { settingNavigationTitle } from '@mobile/helpers/native/msg';
import { useIntl } from 'react-intl';

const OrderIndex = (props: { type: TRADE_ORDER_TYPE }) => {
  const { type } = props;
  const { formatMessage } = useIntl();
  useEffect(() => {
    settingNavigationTitle({
      name: formatMessage({ id: type === TRADE_ORDER_TYPE.BUY ? 'order_buy' : 'order_sell' }),
    });
  }, [type]);

  return (
    <div styleName="container">
      <TradeOrder type={type} />
    </div>
  );
};

export default OrderIndex;
