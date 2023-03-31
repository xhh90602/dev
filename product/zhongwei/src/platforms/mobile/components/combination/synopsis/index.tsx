/* eslint-disable max-len */
import React, { memo, useEffect, useState } from 'react';
import Tab from '@/platforms/mobile/components/combination/detail-tab';
import { useIntl } from 'react-intl';
import ReactPlayer from 'react-player';

import './index.scss';

const list = {
  1: 'synopsis',
  2: 'bright',
  3: 'logic',
};

const Synopsis: React.FC<any> = memo((props) => {
  const { data } = props;
  const [tabItems, setTabItem] = useState<any>(null);
  const [activeKey, setActiveKey] = useState<string>('synopsis');
  const { formatMessage } = useIntl();

  const tempItem = [
    { type: 1, key: 'synopsis', title: formatMessage({ id: 'portfolio_introduction' }), el: '' },
    { type: 2, key: 'bright', title: formatMessage({ id: 'portfolio_highlights' }), el: '' },
    { type: 3, key: 'logic', title: formatMessage({ id: 'stock_selection_logic' }), el: '' },
  ];

  const switchTab = (key) => {
    setActiveKey(key);
  };

  // 组合介绍 + 视频 特殊处理
  const investmentResume = (text: any, url) => (
    <>
      {text && text}
      {url && (
        <ReactPlayer
          url={url}
          controls
          playsinline
          width="100%"
          height="182px"
        />
      )}
    </>
  );

  useEffect(() => {
    if (data) {
      const { introduce, videoUrl, sellingPoint, stockSelLogic } = data;
      const temp: any = [];
      tempItem.forEach((item: any) => {
        if (item.key === 'synopsis' && (introduce || videoUrl)) {
          item.el = investmentResume(introduce, videoUrl);
          temp.push(item);
        }
        if (item.key === 'bright' && sellingPoint) {
          item.el = sellingPoint;
          temp.push(item);
        }
        if (item.key === 'logic' && stockSelLogic) {
          item.el = stockSelLogic;
          temp.push(item);
        }
      });
      setTabItem(temp);
    }
  }, [data]);

  return (
    tabItems && tabItems.length ? (
      <div styleName="warp">
        <Tab tabItems={tabItems || []} activeKey={activeKey} className="toggle-tab" switchTab={(key) => switchTab(key)} />
      </div>
    ) : null
  );
});

export default Synopsis;
