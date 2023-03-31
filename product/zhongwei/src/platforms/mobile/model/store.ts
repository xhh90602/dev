import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux';
import { Action, AnyAction, configureStore, Dispatch } from '@reduxjs/toolkit';
import tradeReducer from './trade';
import tradeOrderReducer from './trade-order';
import IMReducer from './IM/reducer';
import appReducer from './app/reducer';

export const store = configureStore({
  reducer: {
    trade: tradeReducer,
    tradeOrder: tradeOrderReducer,
    IM: IMReducer,
    app: appReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware<any>({
    serializableCheck: false,
  }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: {
  <TDispatch = Dispatch<any>>(): TDispatch;
  <A extends Action<any> = AnyAction>(): Dispatch<A>;
} = useDispatch;

window.__store = store;
