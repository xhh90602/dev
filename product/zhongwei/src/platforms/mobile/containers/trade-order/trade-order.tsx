/* eslint-disable camelcase */
/* eslint-disable react/require-default-props */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import StockSearch from '@/platforms/mobile/components/stock-search/stock-search';
import BasicCard from '@mobile/components/basic-card/basic-card';
import LiveQuote from '@mobile/components/live-quote/live-quote';
import TradeForm from '@mobile/containers/trade-form/trade-form';
import Tabs from '@mobile/components/tabs/tabs';
import Handicap from '@mobile/containers/handicap/handicap';
import TradeTable from '@mobile/containers/trade-table/trade-table';
import TradeTip from '@mobile/components/trade-tip/trade-tip';

import { orderType as orderTypeHK, orderTypeA } from '@mobile/constants/trade-order-type';

import './trade-order.scss';
import {
  TRADE_ORDER_TYPE,
  TRADE_ORDER_STATUS,
  TRADE_STATUS_TEXT,
  VALIDITY_DATA,
  TRADE_ACCOUNT_TYPE,
} from '@/constants/trade';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUrlParam, editUrlParams } from '@/utils/navigate';
import TradeBasicModal from '@mobile/components/trade-basic-modal/trade-basic-modal';
import QuoteChart from '@mobile/components/quote/quote-chart/quote-chart';

import { buyStock } from '@/api/module-api/trade';
import { MarketCurrency, mul, returnCurrency, returnJavaMarket, toFixed } from '@/utils';
import { Toast, SpinLoading } from 'antd-mobile';
import { isHKSymbol, isSSESymbol, isSZSESymbol } from '@dz-web/quote-client';
import { useQuoteClient } from '@dz-web/quote-client-react';
import useResetTradeForm from '@/hooks/trade/use-reset-trade-form';
import { useSetState } from 'ahooks';
import { stockTradeEntrust } from '@/api/module-api/combination';
import useGetMaxBuy from '@/hooks/trade/use-get-max-buy';
import { isNumber } from 'lodash-es';
import useModalHint from '@/hooks/trade/use-modal-hint';
import useTradeTime from '@/hooks/trade/use-trade-time';
import useMoneyInfo from '@/hooks/trade/use-money-info';
import useGetCapital from '@/hooks/trade/use-get-capital';
import TriggerTradeForm from '../trade-form/trigger-trade-form';
import normalTemplate from '../trade-form/modal-template/normal-template';
import { useSubscribeInfo } from '../../model/stock-info-store';
import QuoteModal from '../../components/quote-modal/quote-modal';
import { useTradeStore } from '../../model/trade-store';
import { PageType, openNewPage, tradeCheckPwd } from '../../helpers/native/msg';

interface IProps {
  type?: TRADE_ORDER_TYPE;
  combinationInfo?: Record<string, any>;
  combination?: boolean;
  InsetComponent?: any;

  /** close 关闭弹窗 */
  callback?: (t, close) => void;
}

const { flowCapitalServer } = window.GLOBAL_CONFIG.COMMON_SERVERS;

/** 当前股票的交易市场是否为港股 */
export function isHKTradeMarket() {
  const params = getUrlParam();
  return params.market ? isHKSymbol(params.market) : false;
}

/** 当前股票的交易市场是否为A股 */
export function isATradeMarket() {
  const params = getUrlParam();
  return params.market
    ? isSZSESymbol(params.market) || isSSESymbol(params.market)
    : false;
}

/** 获取tab订单类型 */
export function getActive(transform = true) {
  const params = getUrlParam();

  let { active_key = TRADE_ORDER_STATUS.LMT } = params;

  if (params.code && params.market) {
    if (isHKTradeMarket()) {
      if (TRADE_ORDER_STATUS.LMT === params.active_key) {
        active_key = TRADE_ORDER_STATUS.ELO;
      }
      if (TRADE_ORDER_STATUS.ELO === params.active_key) {
        active_key = TRADE_ORDER_STATUS.ELO;
      }
    }
    if (params.active_key !== TRADE_ORDER_STATUS.CONDITION && !isHKTradeMarket()) {
      active_key = TRADE_ORDER_STATUS.LMT;
    }
  }

  // 特殊转换
  if (transform) {
    if (TRADE_ORDER_STATUS.AL === params.active_key) {
      active_key = TRADE_ORDER_STATUS.AO;
    }
  }

  if (!params?.active_key && isHKSymbol(params.market || 2002)) {
    active_key = TRADE_ORDER_STATUS.ELO;
  }

  return active_key?.toLocaleUpperCase();
}

/**
 * 交易下单容器
 * @param {TRADE_ORDER_TYPE} type 交易类型
 * @param {number} amountMax 最大输入数量
 * @param {function} callback 提交回调函数
 * @param {boolean} combination 组合个股下单
 */
const TradeOrder = (props: IProps) => {
  const {
    type = TRADE_ORDER_TYPE.BUY,
    combination = false,
    combinationInfo = {},
    callback = () => undefined,
    InsetComponent = () => null,
  } = props;

  const { formatMessage } = useIntl();

  const location = useLocation();
  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement|null>(null);

  const [activeKey, setActiveKey] = useState(getActive());

  const params: Record<string, any> = useMemo(
    () => ({ ...getUrlParam(), name: decodeURI(getUrlParam().name || '') }),
    [location],
  );

  const [visible, setVisible] = useState(false);

  /** 行情是否连接中 */
  const { isWsClientReady } = useQuoteClient();

  /** 弹窗自选市场 */
  const [quoteVisable, setQuoteVisable] = useState(false);
  const optionalTradeMarket = useRef('');
  const isOptionalTradeMarket = useMemo(
    () => !isWsClientReady || params.market === '' || !isNumber(Number(params.market)),
    [isWsClientReady, params.market],
  );

  const quoteCancel = () => {
    setQuoteVisable(false);
  };

  const { setEntrustUpdate, userTradeConfigInfo, tradeAccountInfo } = useTradeStore();

  /** 订阅股票行情 */
  const stockInfo = useSubscribeInfo({
    market: params?.market,
    code: params?.code,
  });

  /** 为修改单时，页面回到顶部 */
  const resetEditCallBack = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  };

  /** 更换股票重置 */
  const {
    defaultForm, // 普通单
    defaultTriggerForm, // 条件单
    groupList,
    groupCheckProxy,
    groups,
    hasGroup,
    setGroupCheck,
  } = useResetTradeForm({
    id: params.id,
    edit: params.edit === 'true',
    tradeType: type,
    code: params.code,
    market: params?.market || 2002,
    stockInfo,
    noGroup: type === TRADE_ORDER_TYPE.SELL && !combination,
    resetEditCallBack,
  });

  const isBuy = useMemo(() => type === TRADE_ORDER_TYPE.BUY, [type]);

  /** 委托类型列表 */
  const typeList = useMemo(() => (isHKSymbol(params?.market || 2002)
    ? orderTypeHK : orderTypeA), [params]);

  useEffect(() => {
    const key = getActive();
    setActiveKey(key);
  }, [location]);

  const [normalTradeForm, setNormalTradeForm] = useSetState({
    price: '',
    qty: '',
    inactiveFlag: VALIDITY_DATA.N,
    openAoBidPrice: false, // 竞价单是否打开指定价
  });

  const orderType = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    let type = getActive(false);

    if (normalTradeForm.openAoBidPrice) {
      type = TRADE_ORDER_STATUS.AL;
    }

    console.log('🚀 ~ file: trade-order.tsx:216 ~ orderType ~ type:', type);

    return type;
  }, [activeKey, normalTradeForm.openAoBidPrice]);

  /** 是否竞价单（指定价） */
  const isAL = useMemo(
    () => normalTradeForm.openAoBidPrice || orderType === TRADE_ORDER_STATUS.AL,
    [normalTradeForm.openAoBidPrice, orderType],
  );

  /* 是否竞价单（市价） */
  const isAO = useMemo(
    () => !normalTradeForm.openAoBidPrice && orderType === TRADE_ORDER_STATUS.AO,
    [normalTradeForm.openAoBidPrice, orderType],
  );

  /** 是否市价单 */
  const isMKT = useMemo(
    () => orderType === TRADE_ORDER_STATUS.MKT,
    [orderType],
  );

  /** 是否限价单 */
  const isELOLMT = useMemo(
    () => [TRADE_ORDER_STATUS.ELO, TRADE_ORDER_STATUS.LMT].includes(orderType),
    [orderType],
  );

  /** 是否条件单 */
  const isCondition = useMemo(() => orderType === TRADE_ORDER_STATUS.CONDITION, [orderType]);

  useEffect(() => {
    /** 市价单、竞价单非指定价，更新下单股价行情现价 */
    if (isMKT || isAO) {
      setNormalTradeForm({ price: toFixed(stockInfo?.now, stockInfo?.dec) });
    }
  }, [stockInfo?.now, orderType]);

  /** 组合个股下单判断 最大买入 */
  useEffect(() => {
    const { price, qty } = normalTradeForm;

    const cost = price && qty && combinationInfo?.amountMax && combination;

    if (cost && mul(price, qty) > combinationInfo?.amountMax) {
      Toast.show(formatMessage({ id: 'the_scale_value_exceeds_100' }));
    }
  }, [normalTradeForm.price, normalTradeForm.qty, combinationInfo?.amountMax, combination]);

  const normalReset = () => {
    setNormalTradeForm({
      price: defaultForm?.price || '',
      qty: defaultForm?.qty || '',
      inactiveFlag: defaultForm?.inactiveFlag || VALIDITY_DATA.N,
    });

    /** test 更新选中状态 */
    setGroupCheck(groupList.length ? [true, ...groupList.map(() => false)] : [true]);
  };

  useEffect(() => {
    normalReset();
  }, [defaultForm, location]);

  /** 切换委托类型 */
  const tabChange = useCallback((key) => {
    const url = editUrlParams(
      {
        active_key: key,
      },
      location.pathname,
    );

    navigate(url, { replace: true });
  }, [location.pathname]);

  const color = isBuy ? 'var(--orange-color)' : 'var(--blue-color)';

  const {
    countMax,
    financeMax,
    cashMax,
    sellMax,
    costPrice,
  } = useGetMaxBuy({
    code: params.code,
    market: params.market,
    isBuy,
    price: normalTradeForm.price,
    qty: normalTradeForm.qty,
    // now: stockInfo.now,
    // lotSize: stockInfo.lotSize,
  });

  const tradeMarket = useMemo(
    () => (isOptionalTradeMarket ? optionalTradeMarket.current : returnJavaMarket(Number(params?.market))),
    [isOptionalTradeMarket, optionalTradeMarket, params.market],
  );

  const { tradeTime, closeOrderTradeHint } = useTradeTime(tradeMarket);

  const [update, setUpdate] = useState(0);

  const [loading, setLoading] = useState(false);

  const submitCallBack = () => {
    setVisible(false);
    setLoading(false);
    setEntrustUpdate();
    setUpdate(Math.random());
  };

  /** 普通提交 */
  const normalSubmit = () => {
    const body: any = {
      tradeMarket,
      stockCode: params?.code || '',
      qty: normalTradeForm.qty,
      orderType,
      price: normalTradeForm.price,
      bs: type,
      inactiveFlag: normalTradeForm.inactiveFlag !== VALIDITY_DATA.N,
    };

    if (isMKT || isAO) {
      body.price = String(stockInfo.now);
    }

    if (isELOLMT && normalTradeForm.inactiveFlag === VALIDITY_DATA.E) {
      body.gtd = 'GTC';
    }

    buyStock(body).then((res) => {
      if (res.code === 0) {
        Toast.show(formatMessage({ id: 'submit_success' }));
      } else {
        Toast.show(res.message);
      }
      submitCallBack();
    });
  };
  /** 个股组合提交 */
  const combinationSubmit = () => {
    let { price } = normalTradeForm;

    if (isMKT || isAO) {
      price = String(stockInfo.now);
    }

    callback({
      nowPrice: price,
      orderType,
      qty: normalTradeForm.qty,
      stockCode: params.code,
      tradeMarket,
    }, submitCallBack);
  };

  /** 普通 | 普通 + 组合 | 个股组合 提交 */
  const submit = async () => {
    /* 交易密码二次确认 */
    if (userTradeConfigInfo.orderToConfirmByPwd) {
      try {
        const { status = -1 } = await tradeCheckPwd();
        console.log('🚀 ~ file: trade-order.tsx ~ line 313 ~ submit ~ status', status);
        if (Number(status) === -1) {
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

    setLoading(true);

    if (combination) {
      combinationSubmit();
      return;
    }

    const submitGroupList = groupCheckProxy.slice(1);
    if (groupList.length && submitGroupList.find((g) => g)) {
      stockTradeEntrust({
        stockList: filterGroups.map((b: any) => (
          {
            ...b,
            id: b.stockId,
            bs: type,
            orderType,
            nowPrice: stockInfo.now,
          }
        )),
      }).then((res) => {
        if (res && res.code === 0) {
          Toast.show(formatMessage({ id: 'submit_success' }));
        } else {
          Toast.show(res.message);
        }
        submitCallBack();
      });
    }

    /** 普通股票下单 */
    if (groupCheckProxy[0]) {
      normalSubmit();
    }
  };

  const tradeAgainConfirm = () => {
    if (userTradeConfigInfo.orderToConfirmByDialog) {
      /* 交易下单二次弹窗确认 */
      setVisible(true);
    } else {
      submit();
    }
  };

  const quoteConfirm = (market) => {
    optionalTradeMarket.current = market;
    quoteCancel();
    tradeAgainConfirm();
  };

  const { mainlandIdentityCardAndATradeHint, underfundedModalHint } = useModalHint();

  const moneyList = useGetCapital(returnCurrency(params.market, MarketCurrency.HKEX));
  const { currencyMoney } = useMoneyInfo({ update, currency: returnCurrency(params.market, MarketCurrency.HKEX) });

  // 最大可买金额，用来判断金额够不够
  const maxPrice = useMemo(
    () => (
      tradeAccountInfo.accountType === TRADE_ACCOUNT_TYPE.FINANCING
        ? moneyList?.buyingPower
        : currencyMoney?.ledgerBalace
    ) || 0,
    [currencyMoney, moneyList, tradeAccountInfo.accountType],
  );

  const confirmOrder = async () => {
    if (loading) return;
    if (!params?.code) {
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
        Number(normalTradeForm.price) * Number(normalTradeForm.qty),
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

  /** TODO: 需求待确认 组合优先级弹窗 start */
  const [filterGroups, setFilterGroups] = useState([]);

  useEffect(() => {
    const arr = [] as any;
    const submitGroupList = groupCheckProxy.slice(1);
    if (groupList.length && submitGroupList.find((g) => g)) {
      submitGroupList.forEach((f, i) => {
        if (f) {
          arr.push(groupList[i]);
        }
      });
    }

    setFilterGroups(arr);
  }, [groupList, groupCheckProxy]);

  const stockPriceAndLot = useMemo(() => ({
    lotSize: stockInfo.lotSize,
    now: stockInfo.now,
  }), [stockInfo?.lotSize, stockInfo?.now]);

  // const [priorityVisible, setPriorityVisible] = useState(false);
  /** TODO: 需求待确认 组合优先级弹窗 end */

  const formCommonOption = {
    tradeType: type, // 买卖方向
    orderType, // 委托类型
    stockInfo: stockPriceAndLot, // 行情
    financeMax, // 融资可买
    cashMax, // 现金可买
    countMax: (combination && !isBuy) ? combinationInfo?.qty : countMax, // 最大可买|卖
    sellMax: combination ? combinationInfo?.qty : sellMax, // 可卖总数量
    costPrice: combination ? combinationInfo?.costPrice : costPrice, // 持仓成本
    groupCheckProxy, // 组合选中
    groups, // 组合列表
    hasGroup, // 是否存在组合
    code: params.code,
    market: params.market,
    edit: params.edit,
    name: params?.name || stockInfo?.name,
    maxPrice,
  };

  return (
    <div className="trade" ref={containerRef}>
      {/* 行情鏈接不穩定提示彈窗 */}
      <QuoteModal
        visible={quoteVisable}
        onClose={quoteCancel}
        callback={quoteConfirm}
      />
      {/** TODO: 需求待确认 组合优先级弹窗 */}
      {/* <PriorityLevelModal
        visible={priorityVisible}
        onClose={() => {
          setPriorityVisible(false);
        }}
        stockName={params?.name || stockInfo?.name}
        list={filterGroups}
        callback={(list) => {
          setFilterGroups(list);
        }}
      /> */}
      {/* 弹窗引入 */}
      <TradeBasicModal
        isCenter={false}
        confirmLoading={loading}
        state={{
          ...normalTradeForm,
          orderType,
          code: params.code,
          name: params?.name || stockInfo?.name,
          bs: type,
        }}
        visible={visible}
        list={normalTemplate({
          type: orderType.toLocaleUpperCase(),
          groups: filterGroups,
          stockCheck: groupCheckProxy[0],
        })}
        callback={() => {
          if (loading) return;
          submit();
        }}
        onClose={() => {
          setVisible(false);
        }}
        color={color}
      />

      {/* 搜索框、分时、实时行情 */}
      <BasicCard className="orange-low-bg">
        <div className="basic-card" styleName="search">
          <StockSearch
            type={type}
            code={params.code}
            name={params?.name || stockInfo?.name}
            market={params?.market}
            finance={10}
            readOnly={params.edit || combination}
          />
          <div className="line" />
          {/* <Chart market={state.market} code={state.code} isLive /> */}
          <LiveQuote>
            <QuoteChart
              market={params?.market}
              code={params?.code}
            />
          </LiveQuote>
        </div>
        {groupList.length
          ? <TradeTip close={false} openTip tip={formatMessage({ id: 'tip_enable_mult_stock' })} />
          : null}
      </BasicCard>

      {/* 插入 */}
      {combination && (
      <InsetComponent
        {...(!isCondition ? normalTradeForm : defaultForm)}
      />
      )}

      {/* 委托类型切换 */}
      {!params.edit && (
      <BasicCard className="m-t-20 orange-low-bg">
        <Tabs
          activeKey={activeKey}
          className="bold-bg basic-card"
          list={typeList}
          onChange={tabChange}
        />
        {/* 非交易时间段提示 */}
        {!tradeTime.tradeOrNot && !isCondition && !closeOrderTradeHint && (
          <TradeTip
            openTip
            tip={
              formatMessage({ id: (isAL || isAO)
                ? 'trade_or_not_oa'
                : 'trade_or_not',
              })
            }
          />
        )}
      </BasicCard>
      )}

      {/* 条件单 or 普通\组合 表单 */}
      {isCondition ? (
        <TriggerTradeForm
          {...formCommonOption}
          {...{
            combination,
            amountMax: combinationInfo?.amountMax || 0,
            callback,
          }}
          defaultTriggerForm={defaultTriggerForm}
          filterGroups={filterGroups}
          color={color}
          id={params.id}
          isOptionalTradeMarket={isOptionalTradeMarket}
          setQuoteVisable={setQuoteVisable}
        />
      ) : (
        <BasicCard className="m-t-15">
          <div styleName="order-from">
            <TradeForm
              {...formCommonOption}
              state={normalTradeForm}
              setState={setNormalTradeForm}
            />
            <div
              styleName="order-button"
              className="flex-c-c"
              style={{ '--bg': color }}
              onClick={confirmOrder}
            >
              {loading && <SpinLoading className="m-r-10" color="#fff" style={{ '--size': '1em' }} />}
              {TRADE_STATUS_TEXT[orderType]}
              <FormattedMessage id={isBuy ? 'buying' : 'sale'} />
            </div>
            <Handicap state={params} setState={setNormalTradeForm} />
          </div>
        </BasicCard>
      )}

      {/* 组合个股下单不需要展示持仓数据 */}
      {
        !combination && (
          <BasicCard className="bold-bg m-t-20 m-b-30">
            <TradeTable />
          </BasicCard>
        )
      }
    </div>
  );
};

export default TradeOrder;
