import { getTriggerOrderList } from '@/api/module-api/trade';
import { useTradeStore } from '@/platforms/mobile/model/trade-store';
import { useDeepCompareEffect } from 'ahooks';
import { useState, useMemo } from 'react';

/**
 * A待触发，B已触发，C已失效（到期+撤销）
 */
export enum TRIGGER_TYPE {
  pending = 'A',
  finish = 'B',
  error = 'C',
}

export enum TRIGGER_NAME {
  A = '待触发',
  B = '已触发',
  C = '已失效',
}

interface IListObject {
  bs: string;
  conditionNo: number;
  currency: string;
  dealStatus: string;
  executeInfo: ExecuteInfo;
  failureStatus: string;
  orderNo: string;
  orderSell: OrderSell2;
  qty: number;
  smallMarket: number;
  stockCode: number;
  stockName: string;
  tradeMarket: string;
  trigger: Trigger;
}

interface OrderSell2 {
  executeInfo: OrderSell;
  sellSwitch: string;
  trigger: Trigger;
}

interface Trigger {
  lOption: string;
  lPrice: number;
  lRatio: number;
  lType: string;
  lTypePrice: number;
  rLowestRise: number;
  rTopLower: number;
  rprice: number;
  sOption: string;
  sPrice: number;
  type: string;
}

interface OrderSell {
  executDate: string;
  executeAmount: number;
  executeDateType: string;
  executePrice: number;
  executeSellQty: number;
  executeType: string;
}

interface ExecuteInfo {
  executeAmount: number;
  executeDateType: string;
  executePrice: number;
  executeSellQty: number;
  executeType: string;
}

const useGetTrigger = ({ status = TRIGGER_TYPE.pending, update = 0 }) => {
  const [list, setList] = useState<IListObject[]>([]);
  const [loading, setLoading] = useState(false);
  const { tradeAccountUpdate, setTeiggerList } = useTradeStore();

  const length = useMemo(() => list.length, [list]);
  function getData() {
    getTriggerOrderList({
      status,
    })
      .then((res) => {
        const { result } = res;

        if (result?.conditionOrderInfos) {
          setList(result.conditionOrderInfos);
          setTeiggerList(result.conditionOrderInfos);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  let interval: any = null;
  useDeepCompareEffect(() => {
    setLoading(true);
    getData();

    if (!interval) {
      interval = setInterval(() => {
        getData();
      }, window.GLOBAL_CONFIG.TRADE_CONFIG.tableUpdateTime);
    }

    return () => {
      clearInterval(interval);
    };
  }, [update, status, tradeAccountUpdate]);

  return {
    list,
    length,
    loading,
  };
};

export default useGetTrigger;
