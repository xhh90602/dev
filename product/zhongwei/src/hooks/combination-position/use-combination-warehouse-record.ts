import { useEffect, useState } from 'react';
import { useSetState } from 'ahooks';
import { useLocation } from 'react-router-dom';
import { parseUrl } from '@dz-web/o-orange';
import { getCombinationWarehouseRecord } from '@/api/module-api/combination-position';

interface IUseWarehouseRecord {
  isLoading: boolean;
  portfolioId: number;
  warehouseRecords: Record<string, any>;
  handleLoadMore: (...age: any[]) => any;
}

export default function useCombinationWarehouseRecord(): IUseWarehouseRecord {
  const location = useLocation();
  const portfolioId = +parseUrl(location.search, 'portfolioId');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [warehouseRecords, setWarehouseRecords] = useSetState<Record<string, any>>({
    pageNum: 1,
    pageSize: 10,
    records: [],
    hasMore: false,
  });

  const fetchData = (num = 1) => {
    const { pageSize, records = [] } = warehouseRecords;

    getCombinationWarehouseRecord({ pageNum: num, pageSize, portfolioId })
      .then((res) => {
        if (res.code !== 0) return;

        const list = res.result?.data.map((item) => {
          const len = item.entrustRecordVOList.length;
          const nowList = item.entrustRecordVOList.slice(0, 2);
          if (len > 2) {
            nowList.push({
              showEllipsis: true,
            });
          }

          nowList.push({
            addColumn: true,
            beforeRatio: item.beforeRatio,
            planRatio: item.afterRatio,
            planAmount: item.surplusCapital,
          });

          return { ...item, nowList };
        });

        setWarehouseRecords({ records: records.concat(list), pageNum: num });
      })
      .catch((error) => {
        console.log('【组合调仓记录列表请求错误】', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleLoadMore = () => {
    const { pageNum } = warehouseRecords;
    return fetchData(pageNum + 1);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    isLoading,
    portfolioId,
    warehouseRecords,
    handleLoadMore,
  };
}
