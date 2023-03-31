/* eslint-disable react/no-array-index-key */
/* eslint-disable react/require-default-props */
import { Grid } from 'antd-mobile';
import { useEffect, useMemo, useState } from 'react';
import { TRADE_ORDER_TYPE, TRADE_ORDER_STATUS, TRADE_ACCOUNT_TYPE } from '@/constants/trade';

import './trade-form.scss';
import { mul, strToNumber, sub } from '@/utils';
import { useLocation } from 'react-router-dom';
import { useUpdateEffect } from 'ahooks';
import { sellPositionNum } from './component/sell-position-num';
import buyEloFn from './mixin/buy-elo-fn';
import sellEloFn from './mixin/sell-elo-fn';
import buyMktFn from './mixin/buy-mkt-fn';
import sellMktFn from './mixin/sell-mkt-fn';
import buyAoFn from './mixin/buy-ao-fn';
import sellAoFn from './mixin/sell-ao-fn';
import buyConditionFn from './mixin/buy-condition-fn';
import sellConditionFn from './mixin/sell-condition-fn';
import { useStockInfoStore } from '../../model/stock-info-store';
import { useTradeStore } from '../../model/trade-store';

export interface IFormList {
  label?: string | JSX.Element; // 标题
  content?: JSX.Element; // 表单内容
  line?: boolean; // 下方分割线
  extraContent?: any; // 需要额外渲染部分
}

type RuleNum = {
  countMax: StrNumber;
  financeMax: StrNumber;
  cashMax: StrNumber;
  sellMax: number;
  costPrice: number;
  maxPrice: number;
}

export interface ITradeRender<T = Record<string, any>> {
  tradeType: TRADE_ORDER_TYPE;
  orderType: TRADE_ORDER_STATUS;
  state: T;
  setState: (...arg) => void;
  code: string;
  market: number;
  groupCheckProxy: boolean[];
  groups: any[];
}

/**
 * 表单渲染
 * @param tradeType {TRADE_ORDER_TYPE} 买卖方向
 * @param orderType {TRADE_ORDER_STATUS} 委托类型
 * @param state {T} 数据源
 * @param setState {(...arg) => void} change数据源
 * @param code {string} 股票代码
 * @param market {number} 股票市场
 * @param groupCheckProxy {boolean[]} 组合选中数组
 * @param groups {any[]} 组合
 * @param countMax {StrNumber} 最大可买|卖
 * @param financeMax {StrNumber} 融资可买
 * @param cashMax {StrNumber} 现金可买
 * @param sellMax {number} 可卖总数量
 * @param costPrice {number} 持仓成本
 */
const TradeForm: React.FC<ITradeRender & Partial<RuleNum>> = (props) => {
  const {
    orderType,
    tradeType,
    state,
    setState,
    code,
    market,
    groupCheckProxy,
    groups,
    countMax = '',
    cashMax = '',
    financeMax = '',
    sellMax = 0,
    costPrice = 0,
    maxPrice = 0,
  } = props;

  const stockInfo = useStockInfoStore((s) => s.stockInfo);
  const { tradeAccountInfo } = useTradeStore();

  const isFinan = useMemo(() => tradeAccountInfo.accountType === TRADE_ACCOUNT_TYPE.FINANCING, [tradeAccountInfo]);

  /** 借款金额提示 */
  const [hasTip, setHasTip] = useState('');
  /** 下单金额超出资金的比例 */
  const [excessRatio, setExcessRatio] = useState(0);
  /** 竞价买入需要使用 */
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setState({ openAoBidPrice: checked });
  }, [checked]);

  const location = useLocation();

  /** 切换tab 重置表单 */
  useEffect(() => {
    setHasTip('');
    setChecked(false);
  }, [location]);

  useUpdateEffect(() => {
    if (!checked && stockInfo?.now) {
      setState({ price: Number(stockInfo.now).toFixed(3) });
    }
  }, [checked]);

  const isBuy = tradeType === TRADE_ORDER_TYPE.BUY;
  /** 市价 */
  const isMKT = orderType === TRADE_ORDER_STATUS.MKT;
  /** 竞价 */
  const isAO = [TRADE_ORDER_STATUS.AO, TRADE_ORDER_STATUS.AL].includes(orderType);
  /** 条件单 */
  const isCONDITION = orderType === TRADE_ORDER_STATUS.CONDITION;
  /** 是否有组合 */
  const hasGroup = groups.length > 0;
  /** 可卖持仓数量 */
  const { render: sellPositionNumRender } = sellPositionNum({
    num: sellMax,
    costPrice,
  }, hasGroup);

  useEffect(() => {
    let count;
    if (!isBuy) {
      setExcessRatio(0);
      setHasTip('');
      return;
    }

    if (isCONDITION) {
      /** 条件单金额 */
      if (!strToNumber(state.executePrice) || !strToNumber(state.qty)) return;
      count = mul(state.executePrice, state.qty);
    } else {
      /** 普通单金额 */
      if (!strToNumber(state.price) || !strToNumber(state.qty)) return;
      count = mul(state.price, state.qty);
    }

    setExcessRatio(((count - maxPrice) / (maxPrice || 1)) * 100);

    /** 是否需要校验需要下单借款 */
    if (isFinan) {
      if (count && count > maxPrice) {
        setHasTip(sub(count, maxPrice).toString());
      } else {
        setHasTip('');
      }
    }
  }, [state, maxPrice, state.qty, state.price, state.executePrice, isBuy, isCONDITION]);

  const commonOption = {
    code,
    hasTip,
    market,
    countMax,
    financeMax,
    cashMax,
    costPrice,
    isFinan,
    excessRatio,
  };

  const commonGroup = {
    groupList: groups || [],
    groupCheckProxy,
  };

  /** 限价买入模板 */
  const buyELO = buyEloFn({
    ...commonOption,
    state,
    setState: ({ key, value }) => {
      setState({ [key]: value });
    },
  });
  /** 市价买入模板 */
  const buyMKT = buyMktFn({
    ...commonOption,
    state,
    setState: ({ key, value }) => {
      setState({ [key]: value });
    },
  });
  /** 竞价买入模板 */
  const buyAO = buyAoFn({
    ...commonOption,
    state,
    setState: ({ key, value }) => {
      setState({ [key]: value });
    },
    checked,
    setChecked,
  });
  /** 条件单买入模板 */
  const buyCONDITION = buyConditionFn({
    ...commonOption,
    state,
    setState,
  });

  /** 限价卖出模板 */
  const sellELO = sellEloFn({
    ...commonOption,
    ...commonGroup,
    sellPositionNumRender,
    state,
    setState: ({ key, value }) => {
      setState({ [key]: value });
    },
  });

  /** 市价卖出模板 */
  const sellMKT = sellMktFn({
    ...commonOption,
    ...commonGroup,
    sellPositionNumRender,
    state,
    setState: ({ key, value }) => {
      setState({ [key]: value });
    },
  });
  /** 竞价卖出模板 */
  const sellAO = sellAoFn({
    ...commonOption,
    ...commonGroup,
    sellPositionNumRender,
    state,
    setState: ({ key, value }) => {
      setState({ [key]: value });
    },
  });

  /** 条件单卖出模板 */
  const sellCONDITION = sellConditionFn({
    ...commonOption,
    ...commonGroup,
    state,
    setState,
  });

  const formList = () => {
    if (isBuy) {
      if (isMKT) return buyMKT;

      if (isAO) return buyAO;

      if (isCONDITION) return buyCONDITION;

      return buyELO;
    }

    if (isMKT) return sellMKT;

    if (isAO) return sellAO;

    if (isCONDITION) return sellCONDITION;

    return sellELO;
  };

  return (
    <Grid columns={10}>
      {formList().map((item, i) => {
        if (!item) return null;

        return (
          <>
            {
              item.label && (
                <Grid.Item key={`label_${i}`} span={item.content ? 4 : 10}>
                  {item.label}
                </Grid.Item>
              )
            }
            {
              item.content && (
                <Grid.Item key={`content_${i}`} span={6}>
                  {item.content}
                </Grid.Item>
              )
            }
            {
              item.extraContent && item.extraContent
            }
            {
              item.line && (
                <Grid.Item key={`line_${i}`} span={10}>
                  <div className="line m-b-5" />
                </Grid.Item>
              )
            }
          </>
        );
      })}
    </Grid>
  );
};

export default React.memo(TradeForm);
