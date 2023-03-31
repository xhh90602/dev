import { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { useSetState, useLockFn, useLatest } from 'ahooks';
import { pick, isNaN, omit, isArray } from 'lodash-es';
import { Toast } from 'antd-mobile';
import { parseUrl, toFixed, toSlice, toThousand } from '@dz-web/o-orange';
import { useQuoteClient } from '@dz-web/quote-client-react';
import { QUOTE_CATEGORY_FIELD, querySnapshot, HK_MARKET, isCNSymbol, isUSSymbol } from '@dz-web/quote-client';
import { returnJavaMarket } from '@/utils';
import { editUrlParams } from '@/utils/navigate';
import { ID_TYPE } from '@/constants/user';
import { BS_DIRECTION, TRADE_ORDER_STATUS } from '@/constants/trade';
import { getTradeAccountInfo, getMoneyList } from '@/api/module-api/trade';
import { openNewPage, PageType } from '@mobile/helpers/native/msg';
import { ISearchStockProps, searchStockCallback } from '@mobile/helpers/native/register';
import { COMBINATION_POSITION_ROUTERS } from '@mobile-mpa/modules/combination-position/routers';
import {
  getActualEntrustDetail,
  setCombinationName,
  editCombination,
  combinationActualEntrust,
  getUserInfo,
} from '@/api/module-api/combination-position';

interface IHandle {
  index: number;
  info: Record<string, any>;
}

interface ICheckboxHandle extends IHandle {
  callback: (...args: any[]) => any;
}

interface IUseOrders {
  isLoading: boolean;
  combineInfo: Record<string, any>;
  stockList: Record<string, any>[];
  checkedList: Record<string, any>[];
  tradeAccountInfo: Record<string, any>;
  tradeMoneyInfo: Record<string, any>;
  tradeTotalAmount: Record<string, number>;
  modalVisible: Record<string, boolean>;
  quotaInputRef: any;
  setModalVisible: (...args: any[]) => any;
  setIsHoldings: (...args: any[]) => any;
  handleRename: (...args: any[]) => any;
  handleSetStockInfo: (...args: any[]) => any;
  handleChecked: (...args: any[]) => any;
  handleCalcNumber: (...args: any[]) => any;
  handleCalcRatio: (...args: any[]) => any;
  handleSubmit: (...args: any[]) => any;
  handleSupplementQuota: (...args: any[]) => any;
  handleSubmitOrder: (...args: any[]) => any;
}

export default function useCombinationPositionOrders(): IUseOrders {
  const { formatMessage } = useIntl();
  const { wsClient } = useQuoteClient();

  const navigate = useNavigate();
  const location = useLocation();
  const portfolioId = parseUrl(location.search, 'portfolioId');

  const quotaInputRef = useRef<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isHoldings, setIsHoldings] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<Record<string, boolean>>({
    quotaVisible: false,
    orderConfirmVisible: false,
  });

  const [
    { combineInfo, combineStockList, tradeAccountInfo, tradeMoneyInfo, isMainlandIdentity },
    setFirmOfferInfo,
  ] = useSetState<Record<string, any>>({
    combineInfo: {},
    combineStockList: [],
    tradeAccountInfo: {},
    tradeMoneyInfo: {},
    isMainlandIdentityCard: false,
  });
  const latestStockListRef = useLatest(combineStockList);

  useEffect(() => {
    if (!wsClient) return;

    const fetch = async () => {
      try {
        const { code, result = {} } = await getActualEntrustDetail({ portfolioId });
        if (code !== 0) return;

        const accountResponse = await getTradeAccountInfo();
        const moneyResponse = await getMoneyList({ currency: result.currency });
        const userInfoResponse = await getUserInfo({ clientId: accountResponse?.result?.clientId });

        // 是否大陆内地身份证开户
        const isMainlandIdentityCard = userInfoResponse?.result?.openIdType === ID_TYPE.A;

        let stockVOList = result?.stockVOList || [];
        // 组合下存在股票
        if (stockVOList.length !== 0) {
          // 从行情快照获取现价
          const symbols = result.stockVOList?.map((item: Record<string, any>) => [item.smallMarket, item.stockCode]);
          const snapshotList = await querySnapshot(wsClient, {
            fields: [QUOTE_CATEGORY_FIELD.INFO, QUOTE_CATEGORY_FIELD.QUOTE],
            symbols,
          });

          stockVOList = result.stockVOList?.map((item: Record<string, any>) => {
            const snapshotStock = snapshotList.find(
              (stock: Record<string, any>) => stock.marketId === item.smallMarket && stock.code === item.stockCode,
            );

            return {
              ...item,
              nowPrice: snapshotStock?.now
                ? toSlice(snapshotStock.now, { precision: snapshotStock.dec })
                : item.nowPrice,
              nowRatio: '',
              nowNumber: '',
            };
          });
        }

        setFirmOfferInfo({
          combineInfo: omit(result, ['stockVOList']),
          combineStockList: stockVOList,
          tradeAccountInfo: accountResponse.result || {},
          tradeMoneyInfo: moneyResponse.result || {},
          isMainlandIdentity: isMainlandIdentityCard,
        });
      } catch (error) {
        console.log('【实盘组合下单信息请求错误】', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, [wsClient]);

  useEffect(() => {
    if (!wsClient) return;

    // APP搜索股票回调
    searchStockCallback((stockInfo: ISearchStockProps) => {
      console.log('【添加股票响应】', stockInfo);

      const { market, code, name } = stockInfo;
      if (isUSSymbol(market)) {
        // 美股
        Toast.show({ content: formatMessage({ id: 'no_support_us_stocks_tips' }) });
        return;
      }

      const nowList = latestStockListRef.current;
      const isExist = nowList.find(
        (item: Record<string, any>) => item.smallMarket === market && item.stockCode === code,
      );

      if (isExist) {
        return;
      }

      // 获取现价
      querySnapshot(wsClient, {
        fields: [QUOTE_CATEGORY_FIELD.INFO, QUOTE_CATEGORY_FIELD.QUOTE],
        symbols: [[market, code]],
      })
        .then((res) => {
          console.log('【添加股票/查询现价响应】', res);

          if (!res || !isArray(res)) return;

          const checkedStock = nowList.find((item: Record<string, any>) => !!item.checked);
          const curTradeMarket = returnJavaMarket(market);
          const combineList = [
            ...nowList,
            {
              id: null,
              stockCode: code,
              stockName: name,
              smallMarket: market,
              bigMarket: res[0]?.exchangeId,
              tradeMarket: curTradeMarket,
              nowPrice: toSlice(res[0]?.now, { precision: 2 }),
              nowRatio: '',
              nowNumber: '',
              assetsRatio: 0,
              orderType: TRADE_ORDER_STATUS.MKT,
              checked: checkedStock ? checkedStock.tradeMarket === curTradeMarket : true,
            },
          ];

          setFirmOfferInfo({ combineStockList: combineList });
        })
        .catch((err) => {
          console.log('【请求行情快照错误】', err);
        });
    });
  }, [wsClient]);

  // 股票列表
  const stockList = useMemo(() => {
    if (isHoldings) {
      return combineStockList.filter((item: Record<string, any>) => item.qty);
    }
    return combineStockList;
  }, [combineStockList, isHoldings]);

  // 已选的股票列表
  const checkedList = useMemo(() => {
    const list = stockList.filter((item: Record<string, any>) => item.checked);
    return list;
  }, [stockList]);

  // 交易总金额
  const tradeTotalAmount = useMemo(() => {
    const dealAmount = { buyAmount: 0, sellAmount: 0, loanAmounts: 0, minAddQuota: 0 };

    checkedList.forEach((item) => {
      if (item.bs === BS_DIRECTION.BUY) {
        dealAmount.buyAmount += item.tradeAmount;
      }

      if (item.bs === BS_DIRECTION.SELL) {
        dealAmount.sellAmount += item.tradeAmount;
      }
    });

    const combineBalance = dealAmount.buyAmount - combineInfo.surplusCapital;
    const accountBalance = dealAmount.buyAmount - tradeMoneyInfo.buyingPower;

    if (combineBalance > 0) {
      // 组合待补充金额
      dealAmount.minAddQuota = Math.abs(combineBalance);
    }

    if (accountBalance > 0) {
      // 借款金额
      dealAmount.loanAmounts = Math.abs(accountBalance);
    }

    return dealAmount;
  }, [checkedList]);

  // 是否选择相同市场
  function handleIsSameMarket(info: Record<string, any>) {
    if (!checkedList.length) return true;

    const sameMarket = checkedList.find((item: Record<string, any>) => item.tradeMarket === info.tradeMarket);
    if (!sameMarket) {
      Toast.show({ content: formatMessage({ id: 'different_markets_are_not_supported_tips' }) });
      return false;
    }

    return true;
  }

  // 判断比例是否超出100%
  function handleValidRatio(ratio: number, index: number) {
    const totalRatio = combineStockList.reduce((total: number, current: Record<string, any>, currentIndex: number) => {
      const { checked, assetsRatio = 0, nowRatio = 0 } = current;

      if (currentIndex === index) {
        return total + Number(ratio);
      }

      if (checked) {
        return total + Number(nowRatio);
      }

      if (assetsRatio) {
        return total + Number(assetsRatio);
      }

      return total;
    }, 0);

    if (totalRatio > 100) {
      return false;
    }

    return true;
  }

  // 设置股票信息
  function handleSetStockInfo({ index, info }: IHandle) {
    const list = [...combineStockList];
    const stockInfo = list[index];
    list[index] = { ...stockInfo, ...info };

    setFirmOfferInfo({ combineStockList: list });
  }

  // 选择股票
  function handleChecked({ index, info, callback }: ICheckboxHandle) {
    const { checked, orderStatusFlag, smallMarket } = info;

    if (isUSSymbol(smallMarket)) {
      // 美股
      Toast.show({ content: formatMessage({ id: 'no_support_us_stocks_tips' }) });
      callback();
      return;
    }

    if (orderStatusFlag) {
      // 调仓中
      Toast.show({ content: formatMessage({ id: 'ordering_are_not_supported_tips' }) });
      callback();
      return;
    }

    if (isMainlandIdentity && [HK_MARKET.HK_BOUND_SSE, HK_MARKET.HK_BOUND_SZSE].includes(smallMarket)) {
      // 大陆内地身份证开户的客户，不允许交易A股通
      Toast.show({ content: formatMessage({ id: 'mainland_identity_card_tips' }) });
      callback();
      return;
    }

    const isSameMarket = handleIsSameMarket(info);
    if (!isSameMarket) {
      callback();
      return;
    }

    // A股不支持批量下单
    const stockIndex = checkedList.findIndex((item: Record<string, any>) => isCNSymbol(item.smallMarket));
    if (stockIndex !== -1) {
      Toast.show({ content: formatMessage({ id: 'not_support_bulk_orders' }) });
      callback();
      return;
    }

    handleSetStockInfo({ index, info: { checked } });
  }

  // 通过比例计算数量
  function handleCalcNumber({ index, info }: IHandle) {
    const { qty = 0, nowPrice = 0, nowRatio = 0 } = info;

    // 选择的是否相同市场
    const isSameMarket = handleIsSameMarket(info);
    if (!isSameMarket) {
      handleSetStockInfo({ index, info: { nowRatio: toFixed(0), nowNumber: 0 } });
      return;
    }

    // 比例是否超过100%
    const isValidRatio = handleValidRatio(nowRatio, index);
    if (!isValidRatio) {
      Toast.show({ content: formatMessage({ id: 'scale_value_exceeds' }) });
    }

    // 输入比例计算数量
    // 输入的比例 * 组合总资产 / 最新价 / 100, 结果取向下取整手数。
    const number = Math.floor((nowRatio * combineInfo.totalMarketValue) / nowPrice / 100);

    // 买卖
    const dealNumber = number - qty;
    const dealState = dealNumber > 0 ? BS_DIRECTION.BUY : BS_DIRECTION.SELL;

    handleSetStockInfo({
      index,
      info: {
        bs: dealState,
        checked: true,
        nowNumber: number,
        nowRatio: toFixed(nowRatio),
        dealNumber: Math.abs(dealNumber),
        tradeAmount: number * nowPrice,
      },
    });
  }

  // 通过数量计算比例
  function handleCalcRatio({ index, info }: IHandle) {
    const { qty = 0, assetsRatio = 0, nowPrice = 0, nowNumber = 0 } = info;

    // 选择的是否相同市场
    const isSameMarket = handleIsSameMarket(info);
    if (!isSameMarket) {
      handleSetStockInfo({ index, info: { nowRatio: toFixed(0), nowNumber: 0 } });
      return;
    }

    // 输入数量计算比例：
    // 第一步：计算调仓数量A = 输入的数量-持仓数量 ，结果为负为卖出，结果为正为买入
    const dealNumber = Math.abs(nowNumber) - qty;
    const dealState = dealNumber > 0 ? BS_DIRECTION.BUY : BS_DIRECTION.SELL;

    // 第二步：计算比例= 当前占比 +（A*最新价/总资产）* 100
    const ratioCalc = Math.abs(+toFixed((assetsRatio + (dealNumber * nowPrice) / combineInfo.totalMarketValue) * 100));

    // 比例是否超过100%
    const isValidRatio = handleValidRatio(+ratioCalc, index);
    if (!isValidRatio) {
      Toast.show({ content: formatMessage({ id: 'scale_value_exceeds' }) });
    }

    handleSetStockInfo({
      index,
      info: {
        bs: dealState,
        checked: true,
        nowRatio: toFixed(ratioCalc),
        nowNumber: Math.floor(+nowNumber),
        dealNumber: Math.abs(dealNumber),
        tradeAmount: nowNumber * nowPrice,
      },
    });
  }

  // 提交
  function handleSubmit() {
    const { buyAmount } = tradeTotalAmount;

    // 比例是否超过100%
    const isValidRatio = handleValidRatio(0, -1);
    if (!isValidRatio) {
      Toast.show({ content: formatMessage({ id: 'scale_value_exceeds' }) });
      return;
    }

    // 买入总金额 > 组合剩余可配置金额
    if (buyAmount > combineInfo.surplusCapital) {
      setModalVisible({ quotaVisible: true });
      return;
    }

    // 未设置调仓数量
    const hasEmptyStock = checkedList.find((item: Record<string, any>) => !item.dealNumber);
    if (hasEmptyStock) {
      const { stockName, stockCode } = hasEmptyStock;

      Toast.show({
        content: `${formatMessage({ id: 'please_enter' })}【${stockName} ${stockCode}】${formatMessage({
          id: 'warehouse_quantity_and_proportion',
        })}`,
      });
      return;
    }

    // 选择多支股票
    if (checkedList.length > 1) {
      setModalVisible({ orderConfirmVisible: true });
      return;
    }

    const { id, stockCode, smallMarket, dealNumber, bs } = checkedList[0];

    let tradeRoute = COMBINATION_POSITION_ROUTERS.COMBINATION_TRADE_BUY;
    if (bs === BS_DIRECTION.SELL) {
      tradeRoute = COMBINATION_POSITION_ROUTERS.COMBINATION_TRADE_SELL;
    }

    const route = editUrlParams(
      {
        id,
        pid: portfolioId,
        code: stockCode,
        market: smallMarket,
        qty: dealNumber,
      },
      tradeRoute,
    );

    navigate(route);
  }

  // 修改组合名称
  const handleRename = useLockFn(async (name: string, callback?: (...args: any[]) => any) => setCombinationName({
    name,
    portfolioId,
  })
    .then((res) => {
      if (res.code !== 0) return;

      if (callback) {
        callback();
      }

      Toast.show({ content: formatMessage({ id: 'modify_success' }) });
      setFirmOfferInfo({ combineInfo: { ...combineInfo, name } });
    })
    .catch((error) => {
      console.log('【修改持仓组合名称请求错误】', error);
    }));

  // 补充组合额度
  const handleSupplementQuota = useLockFn(async () => {
    const { value } = quotaInputRef.current;

    if (isNaN(parseFloat(value))) {
      Toast.show({ content: formatMessage({ id: 'please_enter_supplementary_quota' }) });
      return undefined;
    }

    if (value < tradeTotalAmount.minAddQuota) {
      Toast.show({
        content: `${formatMessage({ id: 'min_supplementary_quota' })}${toThousand(
          toFixed(tradeTotalAmount.minAddQuota),
        )}${combineInfo.currency}`,
      });
      return undefined;
    }

    const { surplusCapital, totalMarketValue } = combineInfo;
    // 补额后的剩余资金 = 组合的剩余额度 + 当前输入的补充额度
    const nowSurplusCapital = surplusCapital + parseFloat(value);
    // 组合总金额
    const nowTotalMarketValue = totalMarketValue + parseFloat(value);

    return editCombination({
      portfolioId,
      originalSurplusCapital: surplusCapital,
      surplusCapital: nowSurplusCapital,
    })
      .then((res) => {
        if (res.code !== 0) return;

        const list = combineStockList.map((item: Record<string, any>) => {
          const { qty, assetsRatio, nowPrice, nowNumber = 0 } = item;
          if (nowNumber) {
            const dealNumber = nowNumber - qty;
            item.nowRatio = toFixed(assetsRatio + (dealNumber * nowPrice) / nowTotalMarketValue);
          }

          return item;
        });

        setModalVisible({ quotaVisible: false, orderConfirmVisible: true });
        setFirmOfferInfo({
          combineInfo: {
            ...combineInfo,
            surplusCapital: nowSurplusCapital,
            totalMarketValue: nowTotalMarketValue,
            isUpdateInfo: true,
          },
          combineStockList: list,
        });

        quotaInputRef.current.value = '';
      })
      .catch((err) => {
        console.log('【组合补充额度请求错误】', err);
      });
  });

  // 提交调仓请求
  const handleSubmitOrder = useLockFn(async () => {
    const list = checkedList.map((item: Record<string, any>) => {
      const stock = pick(item, [
        'id',
        'nowPrice',
        'bs',
        'currency',
        'bigMarket',
        'smallMarket',
        'stockCode',
        'stockName',
        'tradeMarket',
      ]);

      return {
        ...stock,
        orderType: TRADE_ORDER_STATUS.MKT,
        bs: stock.bs,
        qty: item.dealNumber || 0,
        process: !!item.dealNumber,
        proportion: item.nowRatio / 100,
        originalProportion: item.assetsRatio,
      };
    });

    return combinationActualEntrust({ portfolioId, stockList: list })
      .then((res) => {
        if (res.code !== 0) return;

        Toast.show({
          maskClickable: false,
          content: formatMessage({ id: 'warehouse_success' }),
          afterClose: () => {
            const route = COMBINATION_POSITION_ROUTERS.COMBINATION_WAREHOUSE_RECORD;

            openNewPage({
              pageType: PageType.HTML,
              path: `combination-position.html#${route}?portfolioId=${portfolioId}`,
              replace: true,
              fullScreen: true,
            });
          },
        });

        setModalVisible({ orderConfirmVisible: false });
      })
      .catch((err) => console.log('【实盘组合调仓请求错误】', err));
  });

  return {
    isLoading,
    combineInfo,
    stockList,
    checkedList,
    tradeAccountInfo,
    tradeMoneyInfo,
    tradeTotalAmount,
    modalVisible,
    quotaInputRef,
    setModalVisible,
    setIsHoldings,
    handleRename,
    handleSetStockInfo,
    handleChecked,
    handleCalcNumber,
    handleCalcRatio,
    handleSubmit,
    handleSupplementQuota,
    handleSubmitOrder,
  };
}
