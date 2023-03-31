import { useState } from 'react';
import { useIntl } from 'react-intl';
import Tabs from '@mobile/components/tabs/tabs';

import usePositionList from '@/hooks/combination-position/use-combination-position-table';
import Loading from '@mobile/components/loading/loading';
import CombinationPositionTable from '../combination-position-table/combination-position-table';
import CombinationWaitWarehouseTable from '../combination-wait-warehouse-table/combination-wait-warehouse-table';
import './combination-list-item-tabs.scss';

interface IProps {
  data: Record<string, any>;
  pid: number;
}

const CombinationListItemTabs: React.FC<IProps> = (props) => {
  const { pid, data } = props;

  const { formatMessage } = useIntl();
  const [activeKey, setActiveKey] = useState<string>('position');
  const { isLoading, positionList = [], waitWarehouseList = [], fetchOrderList } = usePositionList({
    cid: data.portfolioId,
  });

  const tabList = [
    {
      key: 'position',
      title: `${formatMessage({ id: 'position' })}(${positionList.length})`,
      children: <CombinationPositionTable pid={pid} list={positionList} />,
    },
    {
      key: 'backlogOrder',
      title: `${formatMessage({ id: 'warehouse_backlog_order' })}(${waitWarehouseList.length})`,
      children: <CombinationWaitWarehouseTable pid={pid} list={waitWarehouseList} getOrderList={fetchOrderList} />,
    },
  ];

  return (
    <Loading isLoading={isLoading}>
      <Tabs
        styleName="combination-tabs"
        list={tabList}
        activeKey={activeKey}
        onChange={(key) => setActiveKey(key)}
      />
    </Loading>
  );
};

export default CombinationListItemTabs;
