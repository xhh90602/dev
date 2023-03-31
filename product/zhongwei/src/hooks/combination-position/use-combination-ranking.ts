import { useState, useMemo } from 'react';
import { useLockFn } from 'ahooks';
import { getCombiRanking, joinRanking } from '@/api/module-api/combination-position';

interface IUseCombinationRanking {
  isLoading: boolean;
  rankingData: Record<string, any>;
  rankingList: Record<string, any>[];
  handleRanking: (...args: any[]) => any;
  fetchCombinationRanking: (...args: any[]) => any;
}

export default function useCombinationRanking(): IUseCombinationRanking {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [rankingData, setRankingData] = useState<Record<string, any>>({});

  // 排行数据列表
  const rankingList = useMemo(
    () => [
      {
        key: 'day_ranking',
        value: rankingData?.dayRVO || {},
      },
      {
        key: 'month_ranking',
        value: rankingData?.monthRVO || {},
      },
      {
        key: 'total_ranking',
        value: rankingData?.totalRVO || {},
      },
    ],
    [rankingData],
  );

  const fetchCombinationRanking = (cid: number, callback?: (...args: any[]) => any) => {
    getCombiRanking({ portfolioId: cid })
      .then((res) => {
        if (res.code !== 0) return;

        if (callback) callback();

        setRankingData(res.result || {});
      })
      .catch((err) => {
        console.log('【交易持仓组合 -> 请求排行信息错误】', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleRanking = useLockFn(async (cid: number, callback?: (...args: any[]) => any) => {
    try {
      const result = await joinRanking({ portfolioId: cid });

      if (result.code === 0) {
        return fetchCombinationRanking(cid, callback);
      }
    } catch (error) {
      console.log('【交易持仓组合 -> 请求参与排行错误】', error);
    }

    return false;
  });

  return {
    isLoading,
    rankingData,
    rankingList,
    handleRanking,
    fetchCombinationRanking,
  };
}
