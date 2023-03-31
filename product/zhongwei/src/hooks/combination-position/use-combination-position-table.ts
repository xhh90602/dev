import { useEffect, useState } from 'react';
import { useSafeState, useRequest } from 'ahooks';
import { getPositionList, getWaitWarehouseList } from '@/api/module-api/combination-position';

interface IProps {
  cid: number;
}

interface IUseCombinationTable {
  isLoading: boolean;
  positionList: Record<string, any>[];
  waitWarehouseList: Record<string, any>[];
  fetchOrderList: (...args: any[]) => any;
}

const { errorRetryCount = -1, updateFrequencyOrder = 0 } = window.GLOBAL_CONFIG?.COMBINATION_POSITION || {};

export default function useCombinationPositionTable(props: IProps): IUseCombinationTable {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [{ positionList, waitWarehouseList }, setTableList] = useSafeState<Record<string, any>>({
    positionList: [],
    waitWarehouseList: [],
  });

  async function fetchOrderList() {
    try {
      const params = { portfolioId: props.cid };

      const response = await getPositionList(params);
      const responseWait = await getWaitWarehouseList(params);

      setTableList({
        positionList: response?.result || [],
        waitWarehouseList: responseWait?.result || [],
      });
    } catch (error) {
      console.log('【交易持仓组合 -> 请求表格数据错误】', error);
    } finally {
      if (isLoading) setIsLoading(false);
    }
  }

  const { runAsync, cancel } = useRequest(fetchOrderList, {
    manual: true,
    pollingErrorRetryCount: errorRetryCount,
    pollingInterval: updateFrequencyOrder,
  });

  useEffect(() => {
    runAsync();

    return () => {
      cancel();
    };
  }, []);

  return {
    isLoading,
    positionList,
    waitWarehouseList,
    fetchOrderList,
  };
}
