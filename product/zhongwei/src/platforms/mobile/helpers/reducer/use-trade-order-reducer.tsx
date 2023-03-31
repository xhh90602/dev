import { TRADE_ORDER_TYPE, VALIDITY_DATA } from '@/constants/trade';
import { useReducer } from 'react';

export interface IOrderSetState {
  price: string;
  qty: string;
  orderType: string;
  inactiveFlag: VALIDITY_DATA;
  market: string;
  code: string;
  bs: TRADE_ORDER_TYPE;
}

const initState: IOrderSetState = {
  market: '',
  code: '',
  orderType: '',
  price: '',
  qty: '',
  inactiveFlag: VALIDITY_DATA.N,
  bs: TRADE_ORDER_TYPE.BUY,
};

interface ITradeAction {
  type: 'set' | 'reset';
  key: string;
  value: any;
}

interface ITradeAction {
  type: 'set' | 'reset';
  resetObj: Record<string, any>;
}

function reducer(state, action: Partial<ITradeAction>) {
  const { key = '', value = '', type = 'set', resetObj = {} } = action;

  if (type === 'reset') {
    return {
      ...initState,
      ...resetObj,
    };
  }

  return {
    ...state,
    [key]: value,
  };
}

interface IProps {
  market: string;
  code: string;
  orderType: string;
  bs: TRADE_ORDER_TYPE;
  name: string;
}

/**
 * 交易表单数据管理
 * @returns {
 *  state, 表单数据
 *  setState, 配置表单数据
 *  resetState, 重置表单
 * }
 */
const useTradeOrderReducer = (props: IProps) => {
  const { market, code, orderType, name, bs } = props;

  const [state, dispatch] = useReducer(reducer, {
    ...initState,
    market,
    code,
    bs,
    stockName: name,
    orderType,
  });

  return {
    state,
    resetState: (resetObj: Record<string, any>) => {
      dispatch({
        type: 'reset',
        resetObj,
      });
    },
    setState: (obj: { key: string, value: any }) => {
      dispatch({
        type: 'set',
        ...obj,
      });

      return state;
    },
  };
};

export default useTradeOrderReducer;
