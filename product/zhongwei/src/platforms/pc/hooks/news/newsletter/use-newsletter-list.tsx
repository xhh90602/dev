import { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { getNewsList } from '@/api/module-api/news';

export default function useGetList(code) {
  const [loading, setLoading] = useState(false);

  const domRef = useRef<HTMLDivElement | null>(null); // 下拉dom对象
  const timerRef: any = useRef(null); // 定时器

  const getData = async (pageParams) => {
    if (!pageParams) return null;

    const res: any = await getNewsList({ pageNum: pageParams, pageSize: 15, categoryCode: code });
    // console.log(res, '----------res');

    const { infos, pageNum } = res;

    let nextCursor: any;
    if (!infos.length && pageParams > 1) {
      nextCursor = undefined;
    } else {
      nextCursor = pageNum + 1;
    }
    return { data: infos, nextCursor, prevCursor: pageNum };
  };

  const { data, fetchNextPage, isLoading, hasNextPage, isError, refetch } = useInfiniteQuery(
    code,
    ({ pageParam = 1 }) => getData(pageParam),
    {
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      getPreviousPageParam: (firstPage) => firstPage?.prevCursor,
      select: (pageData) => {
        const currentData: any = [];
        const { pages } = pageData;
        pages.forEach((item: any) => {
          currentData.push(...item.data);
        });

        return { ...pageData, pages: currentData };
      },
    },
  );
  useEffect(() => {
    const listDom: any = domRef?.current;

    const scrollHandle = (e) => {
      e.stopPropagation();
      if (!data?.pages?.length || isError) return;

      const { scrollTop, scrollHeight, clientHeight } = listDom;
      if (!(scrollHeight > clientHeight)) return;

      clearTimeout(timerRef.current);

      if (scrollTop + clientHeight + 50 > scrollHeight) {
        setLoading(true);
        timerRef.current = setTimeout(() => {
          fetchNextPage()
            .then((res) => {
              console.log(res, '<---下拉加载成功');
              if (res.status) setLoading(false);
            })
            .catch((err) => {
              console.log(err, '<---err');
            });
        }, 300);
      }
    };
    listDom.addEventListener('scroll', scrollHandle);

    return () => {
      listDom.addEventListener('scroll', scrollHandle);
    };
  }, [code, hasNextPage]);

  return { data, isLoading, isError, refetch, domRef, loading };
}
