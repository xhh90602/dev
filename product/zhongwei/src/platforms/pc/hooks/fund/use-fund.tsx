import { useEffect, useState } from 'react';
import { getFundFlow } from '@/api/module-api/trade';

export interface IFund {
  isLoading: boolean;
  fundList: any[];
  params: any;
  setParams: any;
}

export interface IRequestFastest {
  endDate?: string;
  startDate?: string;
  type?: string[] | string;
  inType?: string;
}

export default function useFund(): IFund {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fundList, setFundList] = useState<any[]>([]);
  const [params, setParams] = useState({});
  useEffect(() => {
    setIsLoading(true);
    getFundFlow(params)
      .then((res) => {
        if (res?.code !== 0) {
          return;
        }
        const { result = [] } = res;
        setFundList(result);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [params]);

  return {
    isLoading,
    fundList,
    params,
    setParams,
  };
}
