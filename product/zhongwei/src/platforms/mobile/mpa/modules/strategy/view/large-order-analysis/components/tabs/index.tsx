import React, { memo } from 'react';
import { Tabs } from 'antd-mobile';

import './index.scss';

const DelDialog = memo((props: any) => {
  const { tabList = [], defaultActiveKey, tabsChange = () => null } = props;

  return (
    <div styleName="tabs-box">
      <Tabs activeLineMode="fixed" defaultActiveKey={defaultActiveKey} onChange={(key) => tabsChange(key)}>
        {
          tabList.map((item) => (
            <Tabs.Tab title={item.name} key={item.id} />
          ))
        }
      </Tabs>
    </div>
  );
});

export default DelDialog;
