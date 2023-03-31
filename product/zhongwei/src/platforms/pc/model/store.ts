import { configureStore } from '@reduxjs/toolkit';
import tradeReducer from './trade';
import tradeOrderReducer from './trade-order';

export const store = configureStore({
  reducer: {
    trade: tradeReducer,
    tradeOrder: tradeOrderReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware<any>(),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
