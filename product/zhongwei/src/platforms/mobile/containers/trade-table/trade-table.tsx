import Tabs from '@mobile/components/tabs/tabs';
import PositionTable from '@mobile/components/position-table/position-table';
import EntrustTable from '@mobile/components/entrust-table/entrust-table';
import { useIntl } from 'react-intl';

import './trade-table.scss';
import { memo, useState } from 'react';
import { useSetState, useUpdateEffect } from 'ahooks';
import TriggerTable from '../trigger-table/trigger-table';
import { useTradeStore } from '../../model/trade-store';

const TradeTable = (props) => {
  const { className } = props;
  const [lens, setLen] = useSetState({
    position: 0,
    entrust: 0,
    condition: 0,
  });

  const { formatMessage } = useIntl();

  const tabList = [
    {
      title: `${formatMessage({ id: 'position' })}(${lens.position})`,
      key: 'position',
      forceRender: true,
      children: (<PositionTable setLen={(num) => { setLen({ position: num }); }} />),
    },
    {
      title: `${formatMessage({ id: 'await_make_bargain_order' })}(${lens.entrust})`,
      key: 'entrust',
      forceRender: true,
      children: (<EntrustTable
        type="today"
        setLen={(num) => { setLen({ entrust: num }); }}
        templateCode="order-entrust"
      />),
    },
    {
      title: `${formatMessage({ id: 'await_trigger_condition' })}(${lens.condition})`,
      key: 'condition',
      forceRender: true,
      children: (<TriggerTable className="contain-bg" setLen={(num) => { setLen({ condition: num }); }} />),
    },
  ];

  const [activeKey, setActiveKey] = useState(tabList[0].key);
  const positionUpdate = useTradeStore((s) => s.positionUpdate);
  const entrustUpdate = useTradeStore((s) => s.entrustUpdate);
  const triggerUpdate = useTradeStore((s) => s.triggerUpdate);
  const setPositionUpdate = useTradeStore((s) => s.setPositionUpdate);
  const setEntrustUpdate = useTradeStore((s) => s.setEntrustUpdate);
  const setTriggerUpdate = useTradeStore((s) => s.setTriggerUpdate);

  const onChange = (key: string) => {
    switch (key) {
      case tabList[0].key:
        setPositionUpdate();
        break;
      case tabList[1].key:
        setEntrustUpdate();
        break;
      case tabList[2].key:
        setTriggerUpdate();
        break;
      default:
        break;
    }
  };

  useUpdateEffect(() => {
    setActiveKey(tabList[0].key);
  }, [positionUpdate]);
  useUpdateEffect(() => {
    setActiveKey(tabList[1].key);
  }, [entrustUpdate]);
  useUpdateEffect(() => {
    setActiveKey(tabList[2].key);
  }, [triggerUpdate]);

  return (
    <div className={`basic-card ${className}`} styleName="trade-table">
      <div styleName="table-tabs">
        <Tabs list={tabList} activeKey={activeKey} onChange={onChange} />
      </div>
    </div>
  );
};

export default memo(TradeTable);
