import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { JavaMarket } from '@/utils/trade';

/**
 * @param positionList 持仓列表
 * @param dealList 成交列表
 * @param userQuo 行情套餐信息
 */

interface ITradeState {
  positionList: Record<string, string>[];
  dealList: Record<string, string>[];
  userQuo: Record<string, any>;
  currentOrder: Record<string, any>;
  stockInfo: any;
  currentMarket: JavaMarket;
  entrustUpdate: number;
}

const initialState = {
  positionList: [],
  dealList: [],
  userQuo: {},
  stockInfo: {},
  currentOrder: {},
  currentMarket: JavaMarket.HKEX,
  entrustUpdate: 0,
} as ITradeState;

export const TradeSlice = createSlice({
  name: 'trade',
  initialState,
  reducers: {
    setStore: (
      state,
      action: PayloadAction<{
        key: keyof ITradeState;
        value: any;
      }>,
    ) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    updateEntrust: (state) => {
      state.entrustUpdate = Math.random();
    },
  },
});

export const { setStore, updateEntrust } = TradeSlice.actions;

export default TradeSlice.reducer;
