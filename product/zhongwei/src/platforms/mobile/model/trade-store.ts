import { JavaMarket } from '@/utils';
import create from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { ID_TYPE } from '@/constants/user';
import { ITradeUserConfig } from '../helpers/native/msg';

interface TradeStore {
  positionTotal: number; // 持仓列表总数
  setPositionTotal: (total: number) => void
  positionList: {
    all: any[],
    [JavaMarket.HKEX]: any[],
    [JavaMarket.MK]: any[],
  };
  setPositionList: (key: string, list: any[]) => void
  positionUpdate: number; // 触发刷新交易待成交订单
  setPositionUpdate: () => void;
  entrustUpdate: number; // 触发刷新交易待成交订单
  setEntrustUpdate: () => void;
  triggerUpdate: number; // 触发刷新待触发条件列表
  setTriggerUpdate: () => void;
  triggerList: any[],
  setTeiggerList: (list: any[]) => void;
  /* 用户交易设置 */
  userTradeConfigInfo: ITradeUserConfig;
  setUserTradeConfigInfo: (info: ITradeUserConfig) => void;
  /* 交易账户信息 */
  tradeAccountInfo: any;
  setTradeAccountInfo: (any) => void;
  /* 用户信息 */
  userInfo: any;
  setUserInfo: (any) => void;
  /* 是否大陆内地身份证开户 */
  isMainlandIdentityCard: boolean;
  /* 切换交易账号后更新 */
  tradeAccountUpdate: number;
  setTradeAccountUpdate: () => void;
}

export const useTradeStore = create(subscribeWithSelector<TradeStore>((set) => ({
  positionTotal: 0, // 持仓列表总数
  setPositionTotal: (total: number) => set(() => ({ positionTotal: total })),
  positionList: {
    all: [],
    [JavaMarket.HKEX]: [],
    [JavaMarket.MK]: [],
  },
  setPositionList: (key: any, list: any[]) => set((store) => ({
    positionList: { ...store.positionList, [key]: list },
  })),
  positionUpdate: 0,
  setPositionUpdate: () => set(() => ({ positionUpdate: Math.random() })),
  entrustUpdate: 0,
  setEntrustUpdate: () => set(() => ({ entrustUpdate: Math.random() })),
  triggerUpdate: 0,
  setTriggerUpdate: () => set(() => ({ triggerUpdate: Math.random() })),
  triggerList: [],
  setTeiggerList: (triggerList) => set(() => ({ triggerList })),

  tradeAccountInfo: {},
  setTradeAccountInfo: (tradeAccountInfo) => set(() => ({ tradeAccountInfo })),

  isMainlandIdentityCard: true,
  userInfo: {},
  setUserInfo: (userInfo) => {
    if (!userInfo) return;
    set({
      userInfo,
      isMainlandIdentityCard: userInfo?.openIdType === ID_TYPE.A,
    });
  },

  userTradeConfigInfo: {
    orderToConfirmByDialog: true,
    orderToConfirmByPwd: false,
    idleAutoLockDuration: '720m',
    searchMarketPreference: '',
    faceId: false,
  },
  setUserTradeConfigInfo: (userTradeConfigInfo) => set(() => ({ userTradeConfigInfo })),

  tradeAccountUpdate: 0,
  setTradeAccountUpdate: () => set(() => ({ tradeAccountUpdate: Math.random() })),
})));
