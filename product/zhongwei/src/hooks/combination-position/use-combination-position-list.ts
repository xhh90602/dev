import { useEffect, useState } from 'react';
import { useLockFn, useRequest, useSetState } from 'ahooks';
import { getCombinationList } from '@/api/module-api/combination-position';
import { getMsgListByType, readAll } from '@/api/module-api/message';
import { useGetUserInfo } from '@/helpers/multi-platforms';
import { pageOnShow } from '@mobile/helpers/native/register';

interface IUseCombination {
  isLoading: boolean;
  queryInfo: Record<string, any>;
  fetchDataHandle: (...args: any[]) => any;
  readAllHandle: (...args: any[]) => any;
}

const DEFAULT_PAGE = 1;
const { errorRetryCount = -1, updateFrequency = 0 } = window.GLOBAL_CONFIG?.COMBINATION_POSITION || {};

export default function useCombinationPositionList(): IUseCombination {
  const userInfo = useGetUserInfo();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [queryInfo, setQueryInfo] = useSetState<Record<string, any>>({
    pageNum: DEFAULT_PAGE,
    pageSize: 10,
    portfolioList: [],
    hasMore: false,
  });

  const fetchDataHandle = async (num = DEFAULT_PAGE, size = queryInfo.pageSize) => {
    try {
      const { portfolioList } = queryInfo;

      const response = await getCombinationList({ listType: 4, pageNum: num, pageSize: size });
      const responseMsg = await getMsgListByType({
        group: 'portfolioId',
        subMsgTypes: ['ZHTC'],
        deviceNo: userInfo.deviceNo,
      });

      const combinationList = response?.result?.data || [];
      const messageList = responseMsg?.result || [];

      let currentList = combinationList;
      if (num > DEFAULT_PAGE) {
        currentList = portfolioList.concat(combinationList);
      }

      currentList.forEach((portfolio: Record<string, any>) => {
        const messageInfo = messageList.find((item: Record<string, any>) => {
          const pId = +item.p_portfolioId.replace(/[^0-9]/g, '');
          return pId === portfolio.parentPortfolioId;
        });

        if (messageInfo) {
          portfolio.messageMap = messageInfo;
        }
      });

      setQueryInfo({ portfolioList: currentList, pageNum: num, hasMore: false });
    } catch (error) {
      throw new Error(`【持仓组合列表请求失败】=> ${error}`);
    } finally {
      if (isLoading) setIsLoading(false);
    }
  };

  const { runAsync, cancel } = useRequest(
    async () => {
      const { pageNum, pageSize, portfolioList = [] } = queryInfo;
      await fetchDataHandle(pageNum, portfolioList.length || pageSize);
    },
    {
      manual: true,
      pollingInterval: updateFrequency,
      pollingErrorRetryCount: errorRetryCount,
    },
  );

  useEffect(() => {
    pageOnShow(() => {
      fetchDataHandle();
    });
  }, []);

  useEffect(() => {
    runAsync();

    return () => {
      cancel();
    };
  }, []);

  const readAllHandle = useLockFn(async ({ pId, type }, callback) => readAll({
    subMsgType: type,
    exps: [
      {
        pk: 'portfolioId',
        pv: `'${pId}'`,
      },
    ],
    deviceNo: userInfo.deviceNo,
  })
    .then((res) => {
      if (res.code === 0 && callback) {
        callback();
      }
    })
    .catch((err) => {
      console.log('【持仓组合/读取消息请求错误】', err);
    }));

  return {
    isLoading,
    queryInfo,
    fetchDataHandle,
    readAllHandle,
  };
}
