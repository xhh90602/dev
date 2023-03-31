import React, { memo, useState, useEffect } from 'react';
import { Tabs } from 'antd-mobile';

import './index.scss';

interface IProps {
  tabItems: {
    type: number;
    key: string;
    title: string;
    el: JSX.Element;
  }[];
  className?: string;
  activeKey?: string;
  switchTab?: any;
}

const Tab: React.FC<IProps> = (props) => {
  const { tabItems, className, activeKey, switchTab = () => null } = props;
  const [key, setKey] = useState<string>('');

  useEffect(() => {
    if (activeKey) {
      setKey(activeKey);
    }
  }, [activeKey]);

  return (
    <Tabs
      activeLineMode="fixed"
      className={className}
      styleName="my-tabs"
      activeKey={key}
      style={{ '--fixed-active-line-width': '0px' }}
      onChange={(val: any) => {
        const item = tabItems.filter(((ele) => ele.key === val));
        switchTab(item[0].key);
      }}
    >
      {tabItems.map((item) => (
        <Tabs.Tab title={item.title} key={item.key} destroyOnClose>
          {item.el}
        </Tabs.Tab>
      ))}
    </Tabs>
  );
};

Tab.defaultProps = {
  className: '',
  activeKey: '',
  switchTab: () => null,
};

export default memo(Tab);
