import React, { useState, useEffect } from 'react';
import { useSearchParam } from 'react-use';
import { pageOnShow, commonCallBack } from '@/platforms/mobile/helpers/native/register';
import Tab from '@/platforms/mobile/components/combination/tab';
import { useIntl } from 'react-intl';
import Card from './components/card';
import './combination.scss';

export enum ListType {
  choiceness = 1,
  my = 2,
  subscription = 3,
}

const list = {
  1: 'choiceness',
  2: 'my',
  3: 'subscription',
};

const Combination: React.FC = () => {
  const { formatMessage } = useIntl();
  const type = useSearchParam('type') || 1;
  const [activeKey, setActiveKey] = useState<string>('');

  const switchTab = (key) => {
    setActiveKey(list[key]);
  };

  useEffect(() => {
    if (type) {
      setActiveKey(list[type]);
    }
  }, [type]);

  useEffect(() => {
    // 注册事件，后 拿到跟app交互返回过来的参数，再去请求相关的接口
    commonCallBack((res: any) => {
      if (res && res?.callbackEventName === 'combination') {
        setActiveKey(list[res?.type || 1]);
      }
    });

    pageOnShow(() => {
      commonCallBack((res: any) => {
        if (res && res?.callbackEventName === 'combination') {
          setActiveKey(list[res?.type || 1]);
        }
      });
    });
  }, []);

  const tabItems = [
    {
      type: 1,
      key: 'choiceness',
      title: formatMessage({ id: 'featured_combination' }),
      el: <Card type={ListType.choiceness} />,
    },
    {
      type: 3,
      key: 'subscription',
      title: formatMessage({ id: 'subscription_combination' }),
      el: <Card type={ListType.subscription} switchTab={(key) => switchTab(key)} />,
    },
    {
      type: 2,
      key: 'my',
      title: formatMessage({ id: 'mine_combination' }),
      el: <Card type={ListType.my} />,
    },
  ];

  return (
    <Tab
      tabItems={tabItems}
      activeKey={activeKey}
      className="combination"
      switchTab={(key) => switchTab(key)}
    />
  );
};

export default Combination;
