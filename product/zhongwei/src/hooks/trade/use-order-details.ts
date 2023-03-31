import { useEffect, useState } from 'react';
import { getUrlParam } from '@/utils';
import { useSetState } from 'ahooks';
import { isNaN, add } from 'lodash-es';
import { ORDER_TYPE_TRADE } from '@/constants/trade';
import { getCombiDetails } from '@/api/module-api/combination-position';
import { getOrderDetail, getTriggerDetail } from '@/api/module-api/trade';

interface IUseOrderDetails {
  isLoading: boolean;
  orderInfo: Record<string, any>;
  fetchData: (...args: any[]) => any;
}

export default function useOrderDetails(): IUseOrderDetails {
  const { market, orderNo, conditionNo, portfolioId } = getUrlParam();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orderInfo, setOrderInfo] = useSetState<Record<string, any>>({
    orderInfo: {},
    combineInfo: {},
    conditionsOrderInfo: {},
  });

  const fetchData = async () => {
    try {
      const result = { ...orderInfo };

      if (portfolioId) {
        const combineRes = await getCombiDetails({ portfolioId });
        result.combineInfo = combineRes?.result?.basicInfoVO || {};
      }

      const orderRes = await getOrderDetail({ orderNo });
      const orderDetails = orderRes?.result || {};

      let exchangeTotalFee = 0;
      let securitiesTotalFee = 0;

      const chargesMap = orderDetails.charges?.reduce((prev, curr) => {
        const { name, amt } = curr;
        const price = isNaN(amt) ? 0 : +amt;

        if (['_COMM_', 'Platform Fee(CVS)'].includes(name)) {
          securitiesTotalFee = add(securitiesTotalFee, price);
        } else {
          exchangeTotalFee = add(exchangeTotalFee, price);
        }

        prev[name] = price;
        return prev;
      }, {});

      if (orderDetails.type === ORDER_TYPE_TRADE.CONDITION) {
        console.log('【条件单】');
      }

      result.orderInfo = {
        ...orderDetails,
        smallMarket: market,
        chargesMap: {
          ...chargesMap,
          exchangeTotalFee,
          securitiesTotalFee,
          totalFee: add(exchangeTotalFee, securitiesTotalFee),
        },
      };
      setOrderInfo(result);
    } catch (error) {
      console.log('【获取交易订单详情请求失败】', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!orderNo) return;

    fetchData();
  }, [orderNo]);

  useEffect(() => {
    if (!conditionNo) return;

    getTriggerDetail({ conditionNo })
      .then((res) => {
        console.log('【订单详情】', res);
      })
      .catch((err) => {
        console.log('【获取交易条件单详情请求失败】', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [conditionNo]);

  return {
    isLoading,
    orderInfo,
    fetchData,
  };
}
