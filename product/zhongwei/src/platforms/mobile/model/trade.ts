import { createSlice } from '@reduxjs/toolkit';
import { JavaMarket } from '@/utils/trade';

type Account = Record<string, string>;

/**
 * @param positionList 持仓列表
 * @param entrustList 委托列表
 * @param triggerList 待触发列表
 * @param userQuo 行情套餐
 * @param currentOrder 选中委托
 * @param entrustUpdate 更新委托
 * @param accountList 子账号列表
 * @param currentAccount 当前子账号
 * @param accountType 当前子账号id
 */
interface ITradeState {
  positionList: Record<string, string>[];
  entrustList: Record<string, string>[];
  triggerList: Record<string, string>[];
  userQuo: Record<string, any>;
  currentOrder: Record<string, any>;
  stockInfo: any;
  currentMarket: JavaMarket;
  entrustUpdate: number;
  accountList: Account[];
  currentAccount: Account;
  accountType: string;
  currencyType: string;
}

const initialState = {
  positionList: [],
  entrustList: [],
  triggerList: [],
  userQuo: {},
  stockInfo: {},
  currentOrder: {},
  currentMarket: JavaMarket.HKEX,
  entrustUpdate: 0,
  accountList: [],
  currentAccount: {},
  accountType: localStorage.getItem('accountType') || '',
  currencyType: localStorage.getItem('currencyType') || 'HKD',
} as ITradeState;

export const TradeSlice = createSlice({
  name: 'trade',
  initialState,
  reducers: {
    setStore: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    setLocalStorageStore: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    },
    updateEntrust: (state) => {
      state.entrustUpdate = Math.random();
    },
    setCurrentAccount: (state, actions) => {
      state.currentAccount = actions.payload;
      const tradingAccSeq = actions.payload?.tradingAccSeq || '';
      state.accountType = tradingAccSeq;
      localStorage.setItem('accountType', tradingAccSeq);
    },
  },
});

/**
 * @name TradeSlice.actions
 * @return {
 *  setLocalStorageStore 设置需要缓存redux数据
 *  setStore 设置本地redux数据
 *  updateEntrust 表格更新
 *  setCurrentAccount 设置当前账号
 * }
 */
export const { setStore, updateEntrust, setCurrentAccount, setLocalStorageStore } = TradeSlice.actions;

export default TradeSlice.reducer;
