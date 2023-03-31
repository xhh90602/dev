import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import OrderList from '@mobile-mpa/modules/trade/views/order-list/order-list';
import TriggerList from '@mobile-mpa/modules/trade/views/trigger-list/trigger-list';
import FullScreenPageView from '@/platforms/mobile/components/full-screen-page-view/full-screen-page-view';
import './my-order.scss';

const OrderTab: React.FC<{ activeKey: string; toggleTab: (key: string) => void }> = (props) => {
  const { toggleTab, activeKey } = props;
  const tabList = [
    { name: <FormattedMessage id="trade_indent" />, key: 'trade' },
    { name: <FormattedMessage id="condition_indent" />, key: 'trigger' },
  ];

  return (
    <div styleName="order-tab">
      {tabList.map((tab) => (
        <div styleName={tab.key === activeKey ? 'active' : ''} key={tab.key} onClick={() => toggleTab(tab.key)}>
          {tab.name}
        </div>
      ))}
    </div>
  );
};

const MyOrder = () => {
  const [activeKey, setActiveKey] = useState('trade');

  return (
    <FullScreenPageView title={<OrderTab activeKey={activeKey} toggleTab={setActiveKey} />}>
      {activeKey === 'trade' ? <OrderList /> : <TriggerList />}
    </FullScreenPageView>
  );
};

export default MyOrder;
