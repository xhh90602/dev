import { useIntl } from 'react-intl';
import Tabs from '@mobile/components/tabs/tabs';
import AssociatedOrderTabsWait from '../associated-order-tabs-wait/associated-order-tabs-wait';
import AssociatedOrderTabsHistory from '../associated-order-tabs-history/associated-order-tabs-history';
import './associated-order-tabs.scss';

interface IProps {
  refNo?: string;
  stockCode?: string;
  tradeMarket?: string;
  portfolioId?: number;
}

const AssociatedOrderTabs: React.FC<IProps> = (props) => {
  const { formatMessage } = useIntl();

  const tabList = [
    {
      key: '0',
      title: formatMessage({ id: 'waiting_order' }),
      children: <AssociatedOrderTabsWait {...props} />,
    },
    {
      key: '1',
      title: formatMessage({ id: 'history_order' }),
      children: <AssociatedOrderTabsHistory {...props} />,
    },
  ];

  return (
    <div styleName="associated-order-tabs">
      <div styleName="title">{formatMessage({ id: 'associated_order' })}</div>

      <Tabs list={tabList} />
    </div>
  );
};

export default AssociatedOrderTabs;
