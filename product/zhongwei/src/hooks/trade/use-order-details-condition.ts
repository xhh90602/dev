import { useEffect, useState } from 'react';
import { getUrlParam } from '@/utils';
import { getTriggerDetail } from '@/api/module-api/trade';

interface IUseOrderDetails {
  isLoading: boolean;
  conditionOrderInfo: Record<string, any>;
}

export default function useOrderDetailsCondition(): IUseOrderDetails {
  const { conditionNo } = getUrlParam();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [conditionOrderInfo, setConditionOrderInfo] = useState<Record<string, any>>({});

  const fetchData = async () => {
    getTriggerDetail({ conditionNo })
      .then((res) => {
        if (res.code !== 0) return;

        setConditionOrderInfo(res.result || {});
      })
      .catch((err) => {
        console.log('【获取交易条件单详情请求失败】', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (!conditionNo) return;

    fetchData();
  }, [conditionNo]);

  return {
    isLoading,
    conditionOrderInfo,
  };
}
