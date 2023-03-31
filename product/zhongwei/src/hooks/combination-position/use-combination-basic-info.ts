import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { parseUrl } from '@dz-web/o-orange';
import { getCombiDetails } from '@/api/module-api/combination-position';

interface IUseCombination {
  isLoading: boolean;
  combinationInfo: Record<string, any>;
  getCombinationInfo: (...args: any[]) => any;
}

export default function useCombinationBasicInfo(): IUseCombination {
  const location = useLocation();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [combinationInfo, setCombinationInfo] = useState<Record<string, any>>({});

  const getCombinationInfo = () => {
    getCombiDetails({ portfolioId: parseUrl(location.search, 'portfolioId') })
      .then((res) => {
        if (res.code !== 0) return;

        setCombinationInfo(res.result);
      })
      .catch((err) => {
        console.log('【交易持仓组合 ->  -> 请求基本信息错误】', err);
      })
      .finally(() => {
        if (isLoading) setIsLoading(false);
      });
  };

  useEffect(() => {
    getCombinationInfo();
  }, []);

  return {
    isLoading,
    combinationInfo,
    getCombinationInfo,
  };
}
