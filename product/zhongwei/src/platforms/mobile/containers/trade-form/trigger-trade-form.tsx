/* eslint-disable react/require-default-props */
/* eslint-disable react/destructuring-assignment */
import { Execute, Trigger } from '@/hooks/trade/use-reset-trade-form';
import { TRADE_ORDER_TYPE, TRADE_ORDER_STATUS } from '@/constants/trade';
import { Switch, Toast, SpinLoading } from 'antd-mobile';
import { useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDeepCompareEffect, useSetState, useUpdateEffect } from 'ahooks';
import { addTriggerOrder, editTriggerOrder } from '@/api/module-api/trade';
import { mul, returnJavaMarket, toFixed } from '@/utils';
import useGetMaxBuy from '@/hooks/trade/use-get-max-buy';
import dayjs from 'dayjs';
import useModalHint from '@/hooks/trade/use-modal-hint';
import BasicCard from '../../components/basic-card/basic-card';
import Handicap from '../handicap/handicap';
import './trade-form.scss';
import '../trade-order/trade-order.scss';
import TradeForm from './trade-form';
import TriggerModal from './modal-template/trigger-modal';
import TriggerBox from '../trigger-box/trigger-box';
import QuoteModal from '../../components/quote-modal/quote-modal';
import { useTradeStore } from '../../model/trade-store';
import { PageType, openNewPage, tradeCheckPwd } from '../../helpers/native/msg';

const { flowCapitalServer } = window.GLOBAL_CONFIG.COMMON_SERVERS;

interface IProps {
  tradeType: TRADE_ORDER_TYPE; // 买卖方向
  code: string;
  market: number;
  defaultTriggerForm: {
    trigger: Trigger;
    sellTrigger: Trigger;
    execute: Execute;
    sellExecute: Execute;
    sellSwitch: boolean;
  };
  groupCheckProxy: boolean[];
  filterGroups: any[];
  combination: any;
  amountMax: number;
  groups: any[];
  edit?: boolean;
  id: string;
  isOptionalTradeMarket: boolean;
  name: string;
  maxPrice: number;
  countMax: number;
  sellMax: number;
  costPrice: number;
  stockInfo: any;
  color: string;
  setQuoteVisable: (v: boolean) => void
}

const TriggerTradeForm = (props: IProps) => {
  const { formatMessage } = useIntl();

  const {
    tradeType, // 买卖方向
    code,
    market,
    defaultTriggerForm,
    groupCheckProxy,
    filterGroups,
    combination,
    amountMax,
    groups,
    edit = false,
    id,
    isOptionalTradeMarket,
    name,
    maxPrice,
    stockInfo,
    color,
  } = props;

  const [executeInfo, setExecuteInfo] = useSetState(defaultTriggerForm.execute);

  const [sellExecuteInfo, setSellExecuteInfo] = useSetState(defaultTriggerForm.sellExecute);

  const [trigger, setTrigger] = useSetState(defaultTriggerForm.trigger);

  const [sellTrigger, setSellTrigger] = useSetState(defaultTriggerForm.sellTrigger);

  const [sellSwitch, setSellSwitch] = useState(defaultTriggerForm.sellSwitch);

  const [visible, setVisible] = useState(false);

  /** 金额预估：数量 * 价格 */
  useDeepCompareEffect(() => {
    setExecuteInfo({ executeAmount: Number(executeInfo.qty) * Number(executeInfo.executePrice) });
  }, [executeInfo]);
  useDeepCompareEffect(() => {
    setSellExecuteInfo({ executeAmount: Number(sellExecuteInfo.qty) * Number(sellExecuteInfo.executePrice) });
  }, [sellExecuteInfo]);

  useUpdateEffect(() => {
    console.log('executeInfo', executeInfo);
  }, [executeInfo]);

  useUpdateEffect(() => {
    console.log('sellExecuteInfo', sellExecuteInfo);
  }, [sellExecuteInfo]);

  useUpdateEffect(() => {
    console.log('trigger', trigger);
  }, [trigger]);

  useUpdateEffect(() => {
    console.log('sellTrigger', sellTrigger);
  }, [sellTrigger]);

  const isBuy = tradeType === TRADE_ORDER_TYPE.BUY;
  const [quoteVisable, setQuoteVisable] = useState(false);
  const optionalTradeMarket = useRef('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    /** 买入下单，触发条件为市价时，更新下单价为行情现价 */
    if (isBuy && executeInfo.executeType === 'S') {
      setExecuteInfo({ executePrice: toFixed(stockInfo?.now, 2) });
    }
  }, [stockInfo?.now, executeInfo.executeType]);

  const quoteCancel = () => {
    setQuoteVisable(false);
  };

  const {
    countMax,
    financeMax,
    cashMax,
    sellMax,
    costPrice,
  } = useGetMaxBuy({
    code,
    market,
    isBuy,
    price: executeInfo.executePrice,
    qty: executeInfo.qty,
    // now: stockInfo.now,
    // lotSize: stockInfo.lotSize,
  });

  useUpdateEffect(() => {
    setExecuteInfo(defaultTriggerForm.execute);
    setSellExecuteInfo(defaultTriggerForm.sellExecute);
    setTrigger(defaultTriggerForm.trigger);
    setSellTrigger(defaultTriggerForm.sellTrigger);
    setSellSwitch(defaultTriggerForm.sellSwitch);
  }, [defaultTriggerForm]);

  useEffect(() => {
    const { executePrice, qty } = executeInfo;

    const cost = executePrice && qty && amountMax && combination;

    if (cost && mul(executePrice, qty) > amountMax) {
      Toast.show(formatMessage({ id: 'the_scale_value_exceeds_100' }));
    }
  }, [executeInfo.executePrice, executeInfo.qty, amountMax, combination]);

  const commonBody = {
    bs: tradeType,
    orderInfo: {
      executeInfo: {
        ...executeInfo,
        executeDate: dayjs(executeInfo.executeDate).format('YYYY-MM-DD'),
        executeBuyQty: executeInfo.qty,
        executeSellQty: executeInfo.qty,
      },
      // ordinaryOrder: {
      //   qty: executeInfo.qty,
      // },
      portfolioOrders: filterGroups.map((v) => ({
        portfolioName: v.portfolioName,
        portfolioNo: v.portfolioId,
        qty: v.qty,
      })),
      stockCode: code,
      stockName: name,
      tradeMarket: isOptionalTradeMarket ? optionalTradeMarket.current : returnJavaMarket(market),
    },
    trigger,
    orderSell: {
      sellSwitch: sellSwitch ? 'Y' : 'N',
      executeInfo: {
        ...sellExecuteInfo,
        executeDate: dayjs(sellExecuteInfo.executeDate).format('YYYY-MM-DD'),
        executeBuyQty: sellExecuteInfo.qty,
        executeSellQty: sellExecuteInfo.qty,
      },
      trigger: sellTrigger,
    },
  };

  const { setTriggerUpdate, userTradeConfigInfo } = useTradeStore();

  const submitCallBack = () => {
    setLoading(false);
    setVisible(false);
    setTriggerUpdate();
  };

  const submit = () => {
    setLoading(true);
    addTriggerOrder(commonBody).then((res) => {
      if (res.code === 0) {
        Toast.show(formatMessage({ id: 'submit_success' }));
      } else {
        Toast.show(res.message);
      }
      submitCallBack();
    });
  };

  const editSubmit = () => {
    setLoading(true);
    editTriggerOrder({ ...commonBody, conditionNo: id }).then((res) => {
      if (res.code === 0) {
        Toast.show(formatMessage({ id: 'submit_success' }));
      } else {
        Toast.show(res.message);
      }
      submitCallBack();
    });
  };

  const modalCallback = async () => {
    /* 交易密码二次确认 */
    if (userTradeConfigInfo.orderToConfirmByPwd) {
      try {
        const { status = -1 } = await tradeCheckPwd();
        console.log('🚀 ~ file: trigger-trade-form.tsx ~ line 189 ~ modalCallback ~ status', status);
        if (status === -1) {
          Toast.show({
            content: formatMessage({ id: 'transaction_password_error' }),
          });
          return;
        }
      } catch (e) {
        console.log('校验密码报错', e);
        return;
      }
    }
    (edit ? editSubmit : submit)();
  };

  const tradeAgainConfirm = () => {
    if (userTradeConfigInfo.orderToConfirmByDialog) {
      /* 交易下单二次弹窗确认 */
      setVisible(true);
    } else {
      modalCallback();
    }
  };

  const quoteConfirm = (m) => {
    optionalTradeMarket.current = m;
    quoteCancel();
    tradeAgainConfirm();
  };

  const { mainlandIdentityCardAndATradeHint, underfundedModalHint } = useModalHint();

  const confirmOrder = async () => {
    if (loading) return;
    if (!code) {
      Toast.show({
        content: formatMessage({ id: 'please_select_stock' }),
      });
      return;
    }
    /** 未选中任何股票 */
    if (!groupCheckProxy.find((g) => g)) return;
    if (isOptionalTradeMarket) {
      setQuoteVisable(true);
      return;
    }

    if (mainlandIdentityCardAndATradeHint()) return;

    /** 买入下单判断金额够不够 */
    if (isBuy) {
      const nextType = await underfundedModalHint(
        Number(executeInfo.executePrice) * Number(executeInfo.qty),
        maxPrice,
      );

      if (nextType === 'saveMoney') {
        openNewPage({
          pageType: PageType.HTML,
          path: `${flowCapitalServer}/#/home`,
          title: formatMessage({ id: 'capital_deposit' }),
        }, false);
        return;
      }
    }

    tradeAgainConfirm();
  };

  const handSet = (v, buy) => {
    (buy ? setExecuteInfo : setSellExecuteInfo)(v);
  };

  return (
    <>
      {/* 行情鏈接不穩定提示彈窗 */}
      <QuoteModal
        visible={quoteVisable}
        onClose={quoteCancel}
        callback={quoteConfirm}
      />
      <BasicCard className="m-t-15">
        <TriggerBox
          bs={tradeType}
          state={trigger}
          setState={setTrigger}
          execute={executeInfo}
          setExecute={setExecuteInfo}
          market={market}
          code={code}
        />
      </BasicCard>
      <BasicCard className="m-t-15">
        <div styleName="order-from">
          <TradeForm
            key="buy"
            tradeType={tradeType}
            orderType={TRADE_ORDER_STATUS.CONDITION}
            state={{
              ...executeInfo,
              ...trigger,
            }}
            setState={setExecuteInfo}
            market={market}
            code={code}
            groupCheckProxy={groupCheckProxy}
            groups={groups}
            {...{
              countMax: (combination && !isBuy) ? props.countMax : countMax, // 最大可买|卖
              sellMax: combination ? props.sellMax : sellMax, // 可卖总数量
              costPrice: combination ? props.costPrice : costPrice, // 持仓成本
              financeMax,
              cashMax,
              maxPrice,
            }
            }
          />
          <Handicap
            state={{
              code,
              market,
            }}
            setState={(v) => handSet(v, isBuy)}
          />
        </div>
      </BasicCard>
      {
        isBuy && (
          <>
            <BasicCard className="m-t-15">
              <div
                className="flex-c-between"
                styleName="order-from"
              >
                <div className="t-normal f-bold f-s-30">
                  <FormattedMessage id="set_selling_conditions_after_all_transactions" />
                </div>
                <Switch checked={sellSwitch} onChange={(v) => setSellSwitch(v)} />
              </div>
            </BasicCard>
            {
              sellSwitch && (
                <>
                  <BasicCard className="m-t-15">
                    <TriggerBox
                      bs={TRADE_ORDER_TYPE.SELL}
                      state={sellTrigger}
                      setState={setSellTrigger}
                      execute={sellExecuteInfo}
                      setExecute={setSellExecuteInfo}
                      market={market}
                      code={code}
                    />
                  </BasicCard>
                  <BasicCard className="m-t-15">
                    <div styleName="order-from">
                      <TradeForm
                        key="sell"
                        tradeType={TRADE_ORDER_TYPE.SELL}
                        orderType={TRADE_ORDER_STATUS.CONDITION}
                        state={{
                          ...sellExecuteInfo,
                          ...sellTrigger,
                        }}
                        setState={setSellExecuteInfo}
                        market={market}
                        code={code}
                        groupCheckProxy={groupCheckProxy}
                        groups={groups}
                        countMax={executeInfo.qty}
                      />
                      <Handicap
                        state={{
                          code,
                          market,
                        }}
                        setState={(v) => handSet(v, false)}
                      />
                    </div>
                  </BasicCard>
                </>
              )
            }
          </>
        )
      }
      <TriggerModal
        confirmLoading={loading}
        visible={visible}
        bs={tradeType}
        onClose={() => {
          setVisible(false);
        }}
        stockCheck={groupCheckProxy[0]}
        groups={filterGroups}
        state={{
          executeInfo,
          sellExecuteInfo,
          trigger,
          sellTrigger,
          sellSwitch,
          name,
          code,
        }}
        callback={() => {
          if (loading) return;
          modalCallback();
        }}
        color={color}
      />
      <div
        className="flex-c-c"
        styleName="order-button"
        style={{
          '--bg': color,
        }}
        onClick={confirmOrder}
      >
        {loading && <SpinLoading className="m-r-10" color="#fff" style={{ '--size': '1em' }} />}
        <FormattedMessage id={edit ? 'submit' : 'submit_condition_order'} />
      </div>
    </>
  );
};

export default React.memo(TriggerTradeForm);
