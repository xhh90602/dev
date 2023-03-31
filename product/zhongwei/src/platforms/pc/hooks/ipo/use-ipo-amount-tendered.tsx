import { useContext, useEffect, useState } from 'react';
import { useDebounceFn } from 'ahooks';
import { userConfigContext } from '@/platforms/pc/helpers/entry/native';
import { getAmountTenderedList } from '@/api/module-api/ipo';

export interface IUseIpo {
  isLoading: boolean,
  amountTenderedList: any[];
  run: (...args: any[]) => any,
}

export default function useIpoAmountTendered(): IUseIpo {
  const { language } = useContext(userConfigContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAllLoaded, setIsAllLoaded] = useState<boolean>(false);

  const [pageSize, setPageSize] = useState<number>(30);
  const [amountTenderedList, setAmountTenderedList] = useState<any[]>([]);

  // 表格滚动到底部, 加载更多数据
  const { run } = useDebounceFn(
    () => {
      if (isAllLoaded) {
        return;
      }

      const { scrollHeight, clientHeight, scrollTop }: any = document.querySelector('#table .ant-table-body');
      if (scrollHeight - clientHeight - scrollTop < 2) {
        setPageSize((old: number) => old + 30);
      }
    },
    {
      wait: 200,
    },
  );

  useEffect(() => {
    setIsLoading(true);

    getAmountTenderedList({
      language,
      page_num: 1,
      page_size: pageSize,
    }).then((res) => {
      if (res?.code !== 0) {
        return;
      }

      const { result = [] } = res;

      if (result.length < pageSize) {
        setIsAllLoaded(true);
      }

      setAmountTenderedList(result);
    }).finally(() => {
      setIsLoading(false);
    });
  }, [pageSize]);

  return {
    isLoading,
    amountTenderedList,
    run,
  };
}
