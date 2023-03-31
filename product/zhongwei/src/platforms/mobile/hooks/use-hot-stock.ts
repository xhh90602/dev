import { useSafeState } from 'ahooks';
import { useQuoteClient } from '@dz-web/quote-client-react';
import { PLUGIN_CODE } from '@dz-web/quote-client';

const useHotStock = () => {
  const { wsClient } = useQuoteClient();
  const [hotStockList, setHotStockList] = useSafeState<Record<string, any>[]>([]);

  /* 获取热门股票 */
  const fetchHotStock = (ID = '43000,1999,8400,8500') => {
    wsClient
      ?.send({
        ReqType: PLUGIN_CODE.HOT_STOCK,
        Data: { Count: 6, ID },
      })
      .then((res) => {
        setHotStockList(res.Data);
        console.log('fetchHotStock:', res);
      })
      .catch((err) => {
        console.log('获取热门股票 error -> ', err);
        setHotStockList([]);
      });
  };

  return {
    hotStockList,
    fetchHotStock,
  };
};

export default useHotStock;
