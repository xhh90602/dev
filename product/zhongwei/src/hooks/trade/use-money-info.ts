import { getMoneyInfo } from '@/api/module-api/trade';
import { get } from 'lodash-es';
import { useEffect, useState, useMemo, useCallback } from 'react';

interface Money {
  currency: string; // 币种
  totalAsset: number; // 净资产
  buyingPower: number; // 最大购买力
  totalMarketValue: number; // 总市值
  ledgerBalace: number; // 可用现金
  withdrawableBalance: number; // 可取金额
  floatingPL: number; // 浮动盈亏
  floatingPLPercent: number; // 浮动盈亏比
}

type itemKey = 'totalAsset'
  | 'buyingPower'
  | 'totalMarketValue'
  | 'ledgerBalace'
  | 'withdrawableBalance'
  | 'floatingPL'
  | 'floatingPLPercent'

const useMoneyInfo = (props: { update?: number; currency: string }) => {
  const { update = 0, currency } = props;
  const [moneyInfo, setMoneyInfo] = useState<Money[]>([]);

  const fetchBalance = async () => {
    try {
      const { code, result } = await getMoneyInfo({});
      if (code === 0) {
        setMoneyInfo(result);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [update]);

  const currencyMoney = useMemo(
    () => moneyInfo.find((money) => money.currency === currency),
    [moneyInfo, currency],
  );

  const getMoneyItem = useCallback((key: itemKey) => get(currencyMoney, key, 0), [currencyMoney]);

  return {
    moneyInfo,
    currencyMoney,
    getMoneyItem,
  };
};

export default useMoneyInfo;
