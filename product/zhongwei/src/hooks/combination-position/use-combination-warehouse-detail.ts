import { useEffect, useMemo, useState } from 'react';
import { useSetState } from 'ahooks';
import { getUrlParam } from '@/utils';
import { getCombinationWarehouseDetail } from '@/api/module-api/combination-position';

interface IUseWarehouseRecord {
  isLoading: boolean;
  isExpandAll: boolean;
  recordList: Record<string, any>[];
  searchParams: Record<string, any>;
  handleExpand: (...args: any[]) => any;
}

const MAX_INDEX = 6;

export default function useCombinationWarehouseDetail(): IUseWarehouseRecord {
  const searchParams = getUrlParam();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [{ isExpandAll, warehouseRecords }, setWarehouseRecords] = useSetState<Record<string, any>>({
    isExpandAll: false,
    warehouseRecords: [],
  });

  const recordList = useMemo(() => {
    if (isExpandAll) {
      return warehouseRecords;
    }

    return warehouseRecords.slice(0, MAX_INDEX);
  }, [isExpandAll]);

  const handleExpand = () => {
    setWarehouseRecords({ isExpandAll: !isExpandAll });
  };

  useEffect(() => {
    getCombinationWarehouseDetail({
      pgId: searchParams.id,
      portfolioId: searchParams.pId,
    })
      .then((res) => {
        const { code, result = [] } = res;
        if (code !== 0) return;

        setWarehouseRecords({
          isExpandAll: result.length < MAX_INDEX,
          warehouseRecords: result,
        });
      })
      .catch((error) => {
        console.log('【组合调仓记录详情请求错误】', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return {
    isLoading,
    isExpandAll,
    recordList,
    searchParams,
    handleExpand,
  };
}
