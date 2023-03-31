/* eslint-disable @typescript-eslint/no-shadow */
import { isHKTradeMarket } from '@/platforms/mobile/containers/trade-order/trade-order';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchStockGroups } from '@/api/module-api/combination';
import { getTriggerDetail } from '@/api/module-api/trade';
import { TRADE_ORDER_TYPE, VALIDITY_DATA } from '@/constants/trade';
import { getUrlParam, initCountPrice, returnJavaMarket } from '@/utils';
import { useSetState, useUpdateEffect } from 'ahooks';
import { useEffect, useMemo, useState } from 'react';
import { isEmpty } from 'lodash-es';
import {
  TRIGGER_EXECUTE_TYPE,
  TRIGGER_L_OPTION,
  TRIGGER_L_TYPE,
  TRIGGER_S_OPTION,
  TRIGGER_TYPE,
} from '@/constants/trigger-trade';

let stockCode = '';

interface IResetTradeForm {
  id?: string;
  edit?: boolean;
  code: string;
  market: number;
  stockInfo: any;
  noGroup: boolean;
  tradeType: TRADE_ORDER_TYPE;
  resetEditCallBack?: () => void;
}

interface RootObject {
  id: number;
  portfolioName: string;
  portfolioId: number;
  nowPrice: number;
  qty: number;
  qtyMax: number;
  stockCode: string;
  tradeMarket: string;
}

export interface Trigger {
  lOption: TRIGGER_L_OPTION;
  lPrice: string;
  lRatio: number;
  lType: TRIGGER_L_TYPE;
  lTypePrice: string;
  rLowestRise: number;
  rTopLower: number;
  rprice: string;
  sOption: TRIGGER_S_OPTION;
  sPrice: string;
  type: TRIGGER_TYPE;
}

export interface Execute {
  executeAmount: string | number;
  executeDateType: VALIDITY_DATA;
  executeDate: Date;
  executePrice: string | number;
  executeSellQty: string;
  executeBuyQty: string;
  executeType: TRIGGER_EXECUTE_TYPE;
  qty: string | number;
}

/**
 * 重置交易表单
 * @param market 股票市场
 * @param code 股票代码
 * @param stockInfo 行情数据
 * @param noGroup 是否需要获取组合列表信息
 * @return {
 *  defaultForm 初始化表单
 *  groupList 组合列表
 *  hasGroupList 是否有组合
 * }
 */

const useResetTradeForm = (props: IResetTradeForm) => {
  const { code, market, stockInfo, noGroup, id, edit, resetEditCallBack } = props;
  const [isFirst, setIsFirst] = useState(false);
  const params = getUrlParam();
  /** 默认表单用于reset */
  const [defaultForm, setDefaultForm] = useSetState({
    price: '',
    qty: '',
    inactiveFlag: VALIDITY_DATA.N,
  });

  const defaultExecute: () => Execute = () => ({
    executeAmount: '',
    executeDateType: VALIDITY_DATA.N,
    executeDate: new Date(),
    executePrice: defaultForm?.price || '',
    executeSellQty: defaultForm?.qty || '',
    executeBuyQty: defaultForm?.qty || '',
    executeType: isHKTradeMarket()
      ? TRIGGER_EXECUTE_TYPE.S
      : TRIGGER_EXECUTE_TYPE.C,
    qty: defaultForm?.qty || '',
  });

  const defaultTrigger: (isBuy?: boolean) => Trigger = (isBuy = true) => ({
    lOption: TRIGGER_L_OPTION.U, // 涨跌幅 - 选项
    lPrice: '', // 涨跌幅 - 触发价格
    lRatio: 0, // 涨跌幅 - 比例
    lType: TRIGGER_L_TYPE.N, // 涨跌幅-类型：N现价、Y昨收、O开盘价 ,示例值(N)
    lTypePrice: '', // 涨跌幅-价格（类型） ,示例值(100)

    rLowestRise: 0, // 最低价上涨幅度；简称最低上涨 ,示例值(2)
    rTopLower: 0, // 最高价至最低价下跌幅度；简称最高下跌 ,示例值(10)
    rprice: '', // 基准价

    sOption: isBuy ? TRIGGER_S_OPTION.U : TRIGGER_S_OPTION.D, // 股价条件选项：U价格达到、D价格下跌 ,示例值(U)
    sPrice: defaultForm?.price || '', // 股价条件-触发价格（同价格）,示例值(100)

    type: TRIGGER_TYPE.L, // 触发类型：L涨跌幅、S股价条件、R反弹买入/回落卖出（三选一，录入后面的数值）,示例值(L)
  });

  const [trigger, setTrigger] = useSetState(defaultTrigger());
  const [sellTrigger, setSellTrigger] = useSetState(defaultTrigger(false));
  const [execute, setExecute] = useSetState(defaultExecute());
  const [sellExecute, setSellExecute] = useSetState(defaultExecute());
  const [sellSwitch, setSellSwitch] = useState(false);
  const [portfolioOrders, setPortfolioOrders] = useState([]);
  /** 条件单默认表单数据 */
  const [defaultTriggerForm, setDefaultTriggerForm] = useSetState({
    trigger,
    sellTrigger,
    execute,
    sellExecute,
    sellSwitch,
  });

  /** 初始化 */
  useUpdateEffect(() => {
    setDefaultTriggerForm({
      trigger,
      sellTrigger,
      execute,
      sellExecute,
      sellSwitch,
    });
  }, [trigger, sellTrigger, execute, sellExecute, sellSwitch]);

  useUpdateEffect(() => {
    setTrigger({ sPrice: defaultForm?.price || '' });
    setSellTrigger({ sPrice: defaultForm?.price || '' });
    setExecute({
      executeBuyQty: defaultForm?.qty || '',
      executeSellQty: defaultForm?.qty || '',
      executePrice: defaultForm?.price || '',
      qty: defaultForm?.qty || '',
    });
    setSellExecute({
      executeBuyQty: defaultForm?.qty || '',
      executeSellQty: defaultForm?.qty || '',
      executePrice: defaultForm?.price || '',
      qty: defaultForm?.qty || '',
    });
    setSellSwitch(false);
  }, [defaultForm]);

  const location = useLocation();
  const navigate = useNavigate();

  /** 切换委托类型重置表单 */
  useUpdateEffect(() => {
    setTrigger(defaultTrigger());
    setSellTrigger(defaultTrigger(false));
    setExecute(defaultExecute());
    setSellExecute(defaultExecute());
    setSellSwitch(false);
  }, [location]);

  /* 修改表单时初始化，目前只有条件单修改 */
  useEffect(() => {
    if (!id || !edit) return;
    // eslint-disable-next-line no-unused-expressions
    (resetEditCallBack && resetEditCallBack());
    getTriggerDetail({ conditionNo: id }).then((res) => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { code, result } = res;
      if (code === 0) {
        console.log('getTriggerDeatail:', res);
        try {
          const {
            orderInfo: { executeInfo = defaultExecute() },
            trigger = defaultTrigger(),
            orderSell = {},
          } = result;
          setExecute({
            ...executeInfo,
            qty: result.bs === 'B' ? executeInfo.executeBuyQty : executeInfo.executeSellQty,
          });
          setTrigger(trigger);
          /** 条件单买入，卖出数据不为空 */
          if (result.bs === 'B' && !isEmpty(orderSell)) {
            const {
              executeInfo: sellExecuteInfo = defaultExecute(),
              trigger: sellTrigger = defaultTrigger(),
              sellSwitch = 'N',
              portfolioOrders = [],
            } = orderSell;
            setSellExecute({
              ...sellExecuteInfo,
              qty: sellExecuteInfo.executeSellQty,
            });
            setSellTrigger(sellTrigger);
            setSellSwitch(sellSwitch === 'Y');
            setPortfolioOrders(portfolioOrders);
          }
        } catch (e) {
          console.log(e);
        }
      }
    });
  }, [id, edit, navigate]);

  /** 获取组信息 */
  const [groupList, setGroupList] = useState<RootObject[]>([]);

  useEffect(() => {
    if (!noGroup || !code || !market) {
      setGroupList([]);
      return;
    }

    searchStockGroups({
      stockCode: code,
      tradeMarket: returnJavaMarket(market),
    }).then((res) => {
      if (res && res.code === 0) {
        const list = res.result
          .filter((item) => item.qty)
          .map((item) => ({
            ...item,
            qtyMax: item.qty,
          }));

        setGroupList(list);
      }
    });
  }, [noGroup, code, market]);

  useEffect(() => {
    if (stockInfo.now) {
      // 是否首次变更code
      if (!isFirst) {
        if (stockInfo.code === stockCode) {
          setIsFirst(true);
        }
        setDefaultForm({ qty: params?.qty || stockInfo?.lotSize || 0 });

        initCountPrice(returnJavaMarket(market), stockInfo, (v) => {
          setDefaultForm({ price: v });
        });
      }
    }
  }, [stockInfo, isFirst]);

  useEffect(() => {
    if (stockCode !== code) {
      setIsFirst(false);
      stockCode = code;
    }
  }, [code]);

  const [groupCheck, setGroupCheck] = useState(groupList.length ? [true, ...groupList.map(() => false)] : [true]);

  useEffect(() => {
    portfolioOrders.forEach((item: any) => {
      const index = groupList.findIndex((v) => v.portfolioId === item.portfolioNo);
      groupList[index] = { ...groupList[index], qty: item.qty };
      groupCheck[index + 1] = true;
    });
    setGroupCheck(groupCheck);
    setGroupList(groupList);
  }, [groupList, portfolioOrders]);

  const groups = useMemo(
    () => (groupList.length
      ? groupList.map((g, i) => ({
        state: g,
        setState: ({ key, value }) => {
          setGroupList(
            groupList.map((v, ii) => {
              if (i === ii) {
                v[key] = value;

                return v;
              }
              return v;
            }),
          );
        },
      }))
      : []),
    [groupList],
  );

  const groupCheckProxy = useMemo(
    () => new Proxy(groupCheck, {
      get(obj, prop) {
        return obj[prop];
      },
      set(obj, prop, value) {
        const arr = [...obj.slice(0, Number(prop)), value, ...obj.slice(Number(prop) + 1, obj.length)];

        setGroupCheck(arr);

        return true;
      },
    }),
    [groupCheck],
  );

  return {
    defaultForm, // 普通单
    defaultTriggerForm, // 条件单
    groupList,
    hasGroup: !!groupList.length,
    groupCheckProxy,
    groups,
    setGroupCheck,
  };
};

export default useResetTradeForm;
