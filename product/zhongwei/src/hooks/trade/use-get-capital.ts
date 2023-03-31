import { getMoneyList } from '@/api/module-api/trade';
import { useTradeStore } from '@/platforms/mobile/model/trade-store';
import { useEffect, useState } from 'react';

export enum LEVEL {
  L1 = 'L1',
  L2 = 'L2',
  L3 = 'L3',
  L4 = 'L4',
  L5 = 'L5',
  L6 = 'L6',
}

export enum LEVELNAME {
  L1 = 'risk_grade_L1',
  L2 = 'risk_grade_L2',
  L3 = 'risk_grade_L3',
  L4 = 'risk_grade_L4',
  L5 = 'risk_grade_L5',
  L6 = 'risk_grade_L6',
}

/**
 * 获取资产信息
 * @returns moneyList 资产
 */
const useGetCapital = (currency = 'HKD', isInterval = false) => {
  const [moneyList, setMoneyList] = useState<{
    buyingPower?: number; // 最大购买力
    currency: string; // 币种
    debtAmount?: number; // 借款金额
    debtInterest?: number; // 借款应付利息
    debtLevel?: LEVEL; // 借款风险值 L1-L5
    holdAmount?: number; // 冻结金额
    ledgerBalace?: number; // 可用现金/賬面結餘
    marginableAmount?: number; // 可融资金额
    paymentAmount?: number; // 应还款金额
    profit: number; // 今日盈亏
    profitRatio: number; // 今日盈亏比例
    surpMarginableAmout?: number; // 剩余可用融资金额
    totalAsset?: number; // 总资产
    totalCostAmount?: number;
    totalIncome?: number; // 累计收益、持仓盈亏
    totalIncomeRatio?: number // 累计收益率
    totalMarketValue?: number; // 总市值
    withdrawableAmount?: number; // 可取金额/资金余额
  }>({
    currency,
    profit: 0,
    profitRatio: 0,
  });

  function getMoneyListData() {
    getMoneyList({
      currency,
    })
      .then((res) => {
        if (res.code === 0 && res.result) {
          const moneyListState = res.result;
          setMoneyList(moneyListState);
        }
      })
      .catch((err) => console.log(err));
  }

  const { tradeAccountUpdate } = useTradeStore();

  let interval: any = null;
  useEffect(() => {
    getMoneyListData();
    if (!interval && isInterval) {
      interval = setInterval(() => {
        getMoneyListData();
      }, window.GLOBAL_CONFIG.TRADE_CONFIG.tableUpdateTime);
    }

    return () => {
      clearInterval(interval);
    };
  }, [currency, tradeAccountUpdate]);

  return moneyList;
};

export default useGetCapital;
