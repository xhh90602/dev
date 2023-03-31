import React, { memo, useState } from 'react';
import { Tabs } from 'antd-mobile';

import './index.scss';

interface IProps {
  tabItems: {
    key: string;
    title: string;
    el: JSX.Element;
  }[];
  className?: string;
  defaultActiveKey?: string;
}

const Tab: React.FC<IProps> = (props) => {
  const { tabItems, className, defaultActiveKey } = props;

  return (
    <Tabs
      activeLineMode="fixed"
      className={className}
      styleName="my-tabs"
      defaultActiveKey={defaultActiveKey}
      style={{ '--fixed-active-line-width': '0px' }}
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
  defaultActiveKey: '',
  className: '',
};

export default memo(Tab);
