import Tabs from '@/platforms/mobile/components/tabs/tabs';
import TriggerTable from '@/platforms/mobile/containers/trigger-table/trigger-table';
import { useState } from 'react';

import './trigger-list.scss';
import { TRIGGER_TYPE } from '@/hooks/trade/use-get-trigger';
import { FormattedMessage } from 'react-intl';

const triggerList = [
  {
    title: <FormattedMessage id="wait_trigger" />,
    key: TRIGGER_TYPE.pending,
  },
  {
    title: <FormattedMessage id="triggered" />,
    key: TRIGGER_TYPE.finish,
  },
  {
    title: <FormattedMessage id="invalid" />,
    key: TRIGGER_TYPE.error,
  },
];

const TriggerList = () => {
  const [status, setStatus] = useState(TRIGGER_TYPE.pending);

  const tabChange = (key) => {
    setStatus(key);
  };

  return (
    <div styleName="contain">
      <Tabs
        styleName="tab"
        activeKey={status}
        list={triggerList}
        className="bold-bg basic-card"
        onChange={tabChange}
      />
      <div styleName="list">
        <TriggerTable status={status} />
      </div>
    </div>
  );
};

export default TriggerList;
