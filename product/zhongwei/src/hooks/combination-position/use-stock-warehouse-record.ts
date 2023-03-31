import { useEffect, useState } from 'react';
import { getUrlParam } from '@/utils';
import { getStockWarehouseRecord } from '@/api/module-api/combination-position';

interface IUseWarehouseRecord {
  isLoading: boolean;
  searchParams: Record<string, any>;
  warehouseRecords: Record<string, any>[];
}

export default function useStockWarehouseRecord(): IUseWarehouseRecord {
  const searchParams = getUrlParam();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [warehouseRecords, setWarehouseRecords] = useState<Record<string, any>[]>([]);

  useEffect(() => {
    getStockWarehouseRecord({ portfolioId: searchParams.pid, psId: searchParams.id })
      .then((res) => {
        if (res.code !== 0) return;

        setWarehouseRecords(res.result);
      })
      .catch((error) => {
        console.log('【个股调仓记录列表请求错误】', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return {
    isLoading,
    searchParams,
    warehouseRecords,
  };
}
