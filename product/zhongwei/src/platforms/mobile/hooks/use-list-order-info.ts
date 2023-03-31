import { getAgreeInfo, getEntrustedInfo } from '@/api/module-api/trade';
import { useEffect, useState } from 'react';

const useListOrderInfo = (type: 'entrust' | 'deal', order: string) => {
  const [infoList, setInfoList] = useState<Record<string, any>>({});

  function getInfo(orderNo) {
    const api = type !== 'entrust' ? getAgreeInfo : getEntrustedInfo;
    api({ orderNo }).then((res) => {
      if (res.code !== 0) return;

      setInfoList(res.result);
    });
  }

  useEffect(() => {
    if (order) getInfo(order);
  }, [order]);

  return {
    infoList,
  };
};

export default useListOrderInfo;
