import { useEffect } from 'react';
import create from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import useSubscribeComponent from '../hooks/use-subscribe-component';

interface IStockStore {
  stockInfo: Record<string, any>;
  setStockInfo: (obj: Record<string, any>) => void;
}

export const useStockInfoStore = create(subscribeWithSelector<IStockStore>((set) => ({
  stockInfo: {},
  setStockInfo: (obj: Record<string, any>) => {
    set(() => ({ stockInfo: obj }));
  },
})));

interface IParams {
  code: string;
  market: number;
}

let time;

/**
 * 初始化订阅行情信息
 */
export const useSubscribeInfo = (params: IParams) => {
  const stockInfo = useStockInfoStore((state) => state.stockInfo);
  const setStockInfo = useStockInfoStore((state) => state.setStockInfo);

  const info = useSubscribeComponent({
    market: params?.market,
    code: params?.code,
  }) as Record<string, any>;

  useEffect(() => {
    clearTimeout(time);
    time = setTimeout(() => {
      setStockInfo(info);
    }, 200);

    return () => {
      clearTimeout(time);
    };
  }, [info]);

  return stockInfo;
};
