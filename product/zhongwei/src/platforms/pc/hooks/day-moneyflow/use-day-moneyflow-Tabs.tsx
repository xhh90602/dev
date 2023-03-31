import { useState } from 'react';

export default function useTabs() {
  // tab切换数组
  const tabs = [
    { id: 0, tabText: '恒指', context: '恒指成分股', Code: 'HSI', BlockID: 7700, Market: 2005 },
    { id: 1, tabText: '国指', context: '国指成分股', Code: 'HSCEI', BlockID: 7702, Market: 2005 },
    { id: 2, tabText: '主板', context: '港股主板', Code: '102', BlockID: 1999, Market: 2998 },
    { id: 3, tabText: '港中资', context: '港中资成分股', Code: 'HSCCI', BlockID: 7701, Market: 2005 },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [indexStr, setIndexStr] = useState({
    Market: tabs[currentIndex].Market,
    Code: tabs[currentIndex].Code,
    BlockID: tabs[currentIndex].BlockID,
  }); // tabs切换索引
  // tab切换
  const CheckTabs = (item) => {
    setCurrentIndex(item.id);
    setIndexStr({ Market: item.Market, Code: item.Code, BlockID: item.BlockID });
  };

  return { CheckTabs, currentIndex, indexStr, tabs };
}
