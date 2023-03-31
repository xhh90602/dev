import { createSlice } from '@reduxjs/toolkit';

export enum statusType {
  'now' = 'now',
  'handMove' = 'handMove',
}

interface ITradeOrder {
  /** 委托类型 */
  entrustValue: string;
  /** 委托价格 */
  price: string;
  market: string;
  code: string;
  /** 委托数量 */
  stockNumber: string;
  /** 委托触发价 */
  stopPrice: string;
  /** 每手股数 */
  stockChangeNumber: number;
  priceChangeNumber: number[];
  /** 生效状态 */
  statusLimit: keyof typeof statusType;

  /** 指定到期时间 */
  diyDate: any;
  orderPrice: string;
  orderStockNumber: string;
  orderStockChangeNumber: number;
}

const initialState = {
  market: '',
  code: '',
  entrustValue: '',
  price: '',
  stockNumber: '',
  statusLimit: 'now',
  diyDate: '',
  stopPrice: '',
  stockChangeNumber: 1,
  priceChangeNumber: [0.01],
  orderPrice: '',
  orderStockNumber: '',
  orderStockChangeNumber: 1,
  stockInfo: {},
} as ITradeOrder;

export const TradeSlice = createSlice({
  name: 'trade',
  initialState: JSON.parse(JSON.stringify(initialState)),
  reducers: {
    setTradeOrder: (state, action: any) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    checkChangeOrCancelTab: (state) => {
      state.code = '';
      state.market = '';
      state.stockInfo = {};
    },
    clearTradeOrder: (state) => {
      Object.keys(initialState).forEach((key) => {
        if (key !== 'entrustValue') state[key] = initialState[key];
      });
    },
  },
});

export enum TradeOrderListType {
  entrustValue = 'entrustValue',
  price = 'price',
  market = 'market',
  code = 'code',
  stockNumber = 'stockNumber',
  stopPrice = 'stopPrice',
  stockChangeNumber = 'stockChangeNumber',
  statusLimit = 'statusLimit',
  diyDate = 'diyDate',
  priceChangeNumber = 'priceChangeNumber',
  orderPrice = 'orderPrice',
  orderStockNumber = 'orderStockNumber',
  orderStockChangeNumber = 'orderStockChangeNumber',
}

export const { setTradeOrder, clearTradeOrder, checkChangeOrCancelTab } = TradeSlice.actions;

export default TradeSlice.reducer;
