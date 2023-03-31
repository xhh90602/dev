/* eslint-disable consistent-return */
/* eslint-disable quotes */
import React, { useState, useEffect, useContext } from 'react';
import { useIntl } from 'react-intl';
import { useSearchParam } from 'react-use';
import { getMarketCategoryTag } from '@dz-web/quote-client';
import FilterStock from '@mobile/containers/filter-stock/filter-stock';
import { addStockApi } from '@/platforms/mobile/mpa/modules/combination/view/add-stock/common';
import { CommonApi } from '@/api/module-api/strategy';
import {
  settingNavigationTitle,
  settingHeaderButton,
  sessionStorageSetItem,
  sessionStorageGetItem,
  goBack,
  addOptionalList,
} from '@mobile/helpers/native/msg';
import { Toast } from 'antd-mobile';
import { useGetState } from 'ahooks';
import { userConfigContext } from '@/platforms/mobile/helpers/entry/native';
import { headerButtonCallBack, headerButtonCallCancel } from '@mobile/helpers/native/register';
import IconZx from '@/platforms/mobile/images/icon_add_optional.svg';
import IconDb from '@/platforms/mobile/images/icon_pk.svg';
import IconAdd from '@/platforms/mobile/images/icon_add_combination.svg';
import { nativeOpenPage } from '@/platforms/mobile/helpers/native/url';
import { useConditionStore } from '@/platforms/mobile/containers/filter-stock/model/index';
import StrategyDialog from './components/strategyDialog';
import CombinationDialog from './components/combinationDialog';
import CreateCombinDialog from './components/createCombinDialog';
import './add-stock.scss';

const currency = {
  HK: 'HKD',
  US: 'USD',
  CN: 'CNY',
  SH: 'CNY',
  SZ: 'CNY',
};

const AppHome: React.FC = () => {
  const portfolioId = Number(useSearchParam('portfolioId')) || 0;
  const strategyId = Number(useSearchParam('strategyId')) || 0;
  const source = String(useSearchParam('source')) || 'zuhe'; // 组合 || 策略
  const [isEdit, setIsEdit] = useState(false);
  const [isShowFilterResult, setIsShowFilterResult, getisShowFilterResult] = useGetState(false);
  const [strategyDialog, setStrategyDialog] = useState(false);
  const valueList = useConditionStore((state) => state.valueList);
  const region = useConditionStore((state) => state.region);
  const setCondition = useConditionStore((state) => state.setCondition);
  const [isSelectAll, setSelectAll] = useState(false);
  const [addType, setAddType] = useState<string>('');
  const [stockList, setStockList] = useState<any>([]);
  const userConfig = useContext<any>(userConfigContext);
  const [lang, setLang] = useState<string>('zh-CN');
  const [combinationDialog, setCombinationDialog] = useState<boolean>(false);
  const [createDialog, setCreateDialog] = useState<boolean>(false);
  const [conditions, setConditions] = useState<any>([]);
  const { formatMessage } = useIntl();

  // 反显选股器条件
  const reverseConditions = (conditionsList) => {
    if (conditionsList && conditionsList.length) {
      const temp: any = {};
      conditionsList.forEach((item: any) => {
        const {
          dimension,
          title,
          text,
          val,
          periodText,
          conditionName,
          shortConditionName,
          list,
          period,
          subDim,
          range,
          type,
          point,
        } = item;
        const obj: any = { ...item };
        if (item.dimension === 'subMarket' || item.dimension === 'indexs') {
          obj.value = val && Array.isArray(val) ? val.join(',') : '';
        } else if (item.dimension === 'industry') {
          obj.shortConditionName = text;
          obj.list = list || [];
        } else if (item?.conditions && range) {
          if (item.conditions === 'thousand') {
            obj.range = [+(range.min / 10000).toFixed(0), +(range.max / 10000).toFixed(0)];
          } else if (item.conditions === 'million') {
            obj.range = [+(range.min / 100000000).toFixed(0), +(range.max / 100000000).toFixed(0)];
          }
        } else {
          obj.value = val && Array.isArray(val) ? [...val] : val;
          obj.range = (range && [range.min, range.max]) || null;
        }
        obj.point = point || '';
        obj.title = title;
        obj.dimension = dimension;
        obj.conditions = item?.conditions || '';
        obj.periodText = periodText || '';
        obj.shortConditionName = shortConditionName || '';
        obj.conditionName = conditionName || '';

        obj.period = period;
        obj.subDim = subDim;
        obj.type = type;
        const arr = ['ma', 'macd', 'boll', 'rsi', 'kdj'];
        let key = item.dimension;
        if (arr.includes(item.dimension)) {
          key = `${item.dimension}-${item.subDim[0]}`;
        }
        temp[key] = { ...obj };
      });
      setCondition({ ...temp });
    }
  };

  // 格式化选股器参数
  const conditionsFilter = (conditionsList) => {
    const temp: any = [];
    if (conditionsList && conditionsList.length) {
      conditionsList.forEach((item) => {
        const obj: any = { ...item };
        if (item?.dimension === 'region') {
          obj.val = item.val;
        } else if (item?.list) {
          obj.val = item.list.map((ele) => ele.code) || [];
          obj.list = item.list;
        } else if (item?.conditions && item?.range) {
          let newRange: any = [];
          if (item.range.constructor === Array) {
            newRange = [item.range[0], item.range[1]];
          } else if (item.range.constructor === Object) {
            newRange = [item.range.min, item.range.max];
          }
          if (item.conditions === 'thousand') {
            obj.range = { min: +(newRange[0] * 10000).toFixed(0), max: +(newRange[1] * 10000).toFixed(0) };
          } else if (item.conditions === 'million') {
            obj.range = { min: +(newRange[0] * 100000000).toFixed(0), max: +(newRange[1] * 100000000).toFixed(0) };
          } else {
            obj.range = { min: newRange[0], max: newRange[1] };
          }
        } else if (item?.subDim && item?.range) {
          let newRange: any = [];
          if (item.range.constructor === Array) {
            newRange = [item.range[0], item.range[1]];
          } else if (item.range.constructor === Object) {
            newRange = [item.range.min, item.range.max];
          }
          obj.range = { min: newRange[0], max: newRange[1] };
        } else if (item?.value) {
          if (Array.isArray(item.value)) {
            obj.val = item.value;
          } else {
            obj.val = [item.value];
          }
        } else {
          obj.val = item.subDim || '';
          obj.range = (item?.range && { min: item.range[0], max: item.range[1] }) || null;
        }
        if (item?.period) {
          obj.period = item?.period;
        }
        if (item?.subDim) {
          obj.subDim = item?.subDim;
        }
        if (item?.dimension) {
          obj.dimension = item?.dimension;
        }
        if (item?.conditions) {
          obj.conditions = item?.conditions;
        }
        if (item?.title) {
          obj.title = item?.title;
        }
        if (item?.periodText) {
          obj.periodText = item?.periodText;
        }
        if (item?.shortConditionName) {
          obj.shortConditionName = item?.shortConditionName;
        }
        if (item?.conditionName) {
          obj.conditionName = item?.conditionName;
        }
        if (item?.type) {
          obj.type = item?.type;
        }
        if (item?.point) {
          obj.point = item?.point;
        }
        obj.text = `${item?.periodText || ''}${item?.shortConditionName || item?.conditionName || ''}`;
        temp.push(obj);
      });
      return temp;
    }
    return temp;
  };

  // 获取选择后的股票
  const getFilterResult = (dataList: any[]) => {
    console.log('dataList', dataList);
    const temp: any = [];
    if (dataList && dataList.length) {
      dataList.forEach((item) => {
        const idx = stockList.findIndex((ele) => item.code === ele.code && item.marketId === ele.marketId);
        if (idx === -1) {
          const { code, marketId, name, trName } = item;
          const market = getMarketCategoryTag(marketId);
          const obj: any = {};
          obj.code = code;
          obj.name = lang === 'zh-CN' ? name : trName;
          obj.marketId = marketId;
          obj.market = market === 'SH' || market === 'SZ' ? 'CN' : market;
          obj.currencyCode = currency[market || ''];
          temp.push(obj);
        }
      });
    }
    setStockList([...stockList, ...temp]);
  };

  // 股票保存到组合【接口】
  const addStockToCombination = async (id) => {
    if (!stockList || !stockList.length) return;
    const res = await addStockApi(stockList, id);
    if (res && res.code === 0) {
      Toast.show({ content: formatMessage({ id: 'add_success' }) });
      if (source === 'zuhe') {
        setTimeout(() => {
          nativeOpenPage(`simulate-combination-adjustment.html?portfolioId=${portfolioId}`, true);
        }, 1200);
      }
    } else {
      Toast.show({ content: res.message });
    }
    setCombinationDialog(false);
  };

  // 非组合进来，底部按钮点击事件
  const btnOnClick = (ts) => {
    setStockList([]);
    if (ts === 'zx') {
      setIsEdit(true);
      setHeaderCancel(); // 设置顶部“取消”按钮
      setAddType(ts);
    }
    if (ts === 'pk') {
      sessionStorageGetItem({ key: 'stockList' }).then((res) => {
        if (res && res?.key && res?.value) {
          setStockList(res?.value || []);
        }
      });
      setIsEdit(true);
      setHeaderCancel(); // 设置顶部“取消”按钮
      setAddType(ts);
    }
    if (ts === 'zh') {
      setIsEdit(true);
      setHeaderCancel(); // 设置顶部“取消”按钮
      setAddType(ts);
    }
    if (ts === 'cl') {
      if (strategyId) {
        editStrategySave();
      } else {
        setStrategyDialog(true);
      }
    }
  };

  // 取消按钮回调
  const cancelCallback = () => {
    setIsEdit(false);
    setStrategyDialog(false);
    setAddType('');
  };

  // 设置取消按钮
  const setHeaderCancel = () => {
    settingHeaderButton([{
      text: formatMessage({ id: 'cancelText' }),
      textColor: '#011628',
      textFontSize: 28,
      position: 'right',
      index: 1,
      onClickCallbackEvent: 'headerButtonCallBack',
    }]).then((res) => {
      console.log('设置取消按钮', res);
    });
    headerButtonCallBack(() => cancelCallback());
  };

  // 跳转到【我的策略】
  const goToMyStrategy = () => {
    nativeOpenPage('my-strategy.html', true);
  };

  // 左上角 返回 按钮
  const goCallback = () => {
    if (getisShowFilterResult()) {
      setIsShowFilterResult(false);
    } else {
      goBack();
    }
  };

  // 设置 我的策略 按钮
  const setHeaderMyStrategy = () => {
    settingHeaderButton([
      {
        icon: 'back', // 返回
        position: 'left',
        index: 1,
        onClickCallbackEvent: 'headerButtonCallBack',
      },
      {
        text: formatMessage({ id: 'my_strategy' }),
        textColor: '#011628',
        textFontSize: 28,
        position: 'right',
        index: 2,
        onClickCallbackEvent: 'headerButtonCallCancel',
      },
    ]).then((res) => {
      console.log('设置取消按钮', res);
    });
    headerButtonCallBack(() => goCallback());
    headerButtonCallCancel(() => goToMyStrategy());
  };

  // 全选
  const selectAllClick = () => {
    setSelectAll(!isSelectAll);
  };

  // 策略修改【保存】
  const editStrategySave = () => {
    try {
      CommonApi({
        mf: 9,
        sf: 13,
        body: {
          strategyId,
          conditions: JSON.stringify({ conditions: conditionsFilter([...valueList]) }),
        },
      }).then((res) => {
        if (res && res.code === 0) {
          setTimeout(() => {
            goBack();
          }, 1200);
          Toast.show({ content: formatMessage({ id: 'edit_success' }) });
        } else {
          Toast.show({ content: `${formatMessage({ id: 'edit_error' })}` });
        }
      }).catch((err) => {
        Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err.message}` });
      });
    } catch (err) {
      Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err}` });
    }
  };

  // 新增策略【保存】
  const addStrategySave = (name) => {
    try {
      CommonApi({
        mf: 9,
        sf: 11,
        body: {
          name,
          region,
          conditions: JSON.stringify({ conditions: conditionsFilter([...valueList]) }),
        },
      }).then((res) => {
        if (res && res.code === 0) {
          Toast.show({ content: formatMessage({ id: 'save_success' }) });
          setTimeout(() => {
            nativeOpenPage('my-strategy.html');
          }, 1200);
        } else {
          Toast.show({ content: `${formatMessage({ id: 'add_strategy_error' })}` });
        }
      }).catch((err) => {
        Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err.message}` });
      });
    } catch (err) {
      Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err}` });
    }
  };

  // 添加至组合 || 保存策略
  const btnToolClick = (ts) => {
    if (ts !== 'cl' && (!stockList || !stockList.length)) {
      Toast.show({ content: formatMessage({ id: 'add_stock_tip' }) });
      return;
    }
    if (ts === 'zx') {
      const list: any = stockList.map((item) => ({
        code: item.code,
        smallMarket: item.marketId,
      }));
      addOptionalList([...list]);
    }
    if (ts === 'pk') {
      if (stockList && stockList.length > 4) {
        return Toast.show({ content: '最多添加4只股票' });
      }
      sessionStorageSetItem({ key: 'stockList', value: stockList }); // 只有策略才缓存
      nativeOpenPage('stock-pk.html');
    }
    if (ts === 'zh') {
      if (portfolioId) {
        addStockToCombination(portfolioId);
      } else {
        setCombinationDialog(true);
      }
    }
    if (ts === 'cl') {
      if (strategyId) {
        editStrategySave();
      } else {
        setStrategyDialog(true);
      }
    }
  };

  const confirmCombinationClick = (id) => {
    addStockToCombination(id);
  };

  // [弹出框]保存策略点击
  const confirmClick = (name) => {
    addStrategySave(name);
    setStrategyDialog(false);
  };

  // 获取选股条件
  const getConditions = async () => {
    try {
      await CommonApi({ mf: 9, sf: 19, body: { id: strategyId } }).then((res: any) => {
        if (res && res.code === 0 && res?.body) {
          const { name } = res.body;
          settingNavigationTitle({ name });
          const conditionsTemp: any = JSON.parse(res.body.conditions)?.conditions || [];
          setConditions([...conditionsTemp]);
        }
      }).catch((err) => {
        Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err.message}` });
      });
    } catch (err: any) {
      Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err}` });
    }
  };

  useEffect(() => {
    if (conditions && conditions.length) {
      reverseConditions(conditions);
    }
  }, [conditions]);

  // 获取语言
  useEffect(() => {
    if (userConfig) {
      const { language } = userConfig;
      setLang(language || 'zh-CN');
    }
  }, [userConfig]);

  useEffect(() => {
    if (strategyId) {
      getConditions();
    }
  }, [strategyId]);

  useEffect(() => {
    if (isShowFilterResult) {
      settingNavigationTitle({ name: formatMessage({ id: 'stock_selection_results' }) });
    } else {
      settingNavigationTitle({ name: formatMessage({ id: 'stock_picker' }) });
    }
  }, [isShowFilterResult]);

  useEffect(() => {
    setHeaderMyStrategy();
  }, []);

  return (
    <div styleName="add-stock-box">
      <FilterStock
        isEdit={isEdit}
        isSelectAll={isSelectAll}
        limitSelectStock={addType === 'pk' ? 4 : -1}
        isShowFilterResult={isShowFilterResult}
        setIsShowFilterResult={setIsShowFilterResult}
        filterResultCallback={getFilterResult}
      />
      {/* 策略进来显示的【所有】 */}
      {
        source === 'celue' && isShowFilterResult ? (
          <div styleName="strategy-btn-box">
            <div styleName="tool-btn" onClick={() => btnOnClick('zx')}>
              <img src={IconZx} alt="" />
              <p>{formatMessage({ id: 'add_optional' })}</p>
            </div>
            <div styleName="tool-btn" onClick={() => btnOnClick('pk')}>
              <img src={IconDb} alt="" />
              <p>{formatMessage({ id: 'stock_contrast' })}</p>
            </div>
            <div styleName="tool-btn" onClick={() => btnOnClick('zh')}>
              <img src={IconAdd} alt="" />
              <p>{formatMessage({ id: 'add_combination' })}</p>
            </div>
            <div styleName="save-strategy-btn" onClick={() => btnOnClick('cl')}>
              {formatMessage({ id: 'save_strategy' })}
            </div>
          </div>
        ) : null
      }
      {/* 组合进来显示的 */}
      {
        portfolioId && isShowFilterResult && !addType && source === 'zuhe' ? (
          <div styleName="combination-btn-box">
            <div
              styleName="btn"
              onClick={() => btnOnClick('zh')}
            >
              {formatMessage({ id: 'add_to_combination' })}
            </div>
            <div
              styleName="btn"
              onClick={() => btnOnClick('cl')}
            >
              {formatMessage({ id: 'save_strategy' })}
            </div>
          </div>
        ) : null
      }
      {/* 股票pk进来显示的 */}
      {
        isShowFilterResult && !addType && source === 'pk' ? (
          <div styleName="combination-btn-box">
            <div
              styleName="btn active-btn"
              onClick={() => btnOnClick('pk')}
            >
              {formatMessage({ id: 'stock_contrast' })}
            </div>
            <div
              styleName="btn active-btn"
              onClick={() => btnOnClick('cl')}
            >
              {formatMessage({ id: 'save_strategy' })}
            </div>
          </div>
        ) : null
      }
      {/* 结果 添加至组合 || 股票pk || 添加自选 */}
      {
        addType && (
          <div styleName="combination-btn-box">
            {
              addType !== 'pk' && (
                isSelectAll ? (
                  <div
                    styleName="btn active-btn"
                    onClick={() => selectAllClick()}
                  >
                    {formatMessage({ id: 'cancel_all_select' })}
                  </div>
                ) : (
                  <div
                    styleName="btn active-btn"
                    onClick={() => selectAllClick()}
                  >
                    {formatMessage({ id: 'all_select' })}
                  </div>
                )
              )
            }
            {/* 添加至组合 */}
            {
              addType === 'zh' && (
                <div
                  styleName={stockList && stockList.length ? 'btn active-btn' : 'btn'}
                  onClick={() => btnToolClick('zh')}
                >
                  {
                    `
                  ${formatMessage({ id: 'add_combination' })}
                  (${(stockList && stockList.length) || 0})
                  `
                  }
                </div>
              )
            }
            {/* 股票pk 最多可以选择4只股票 */}
            {
              addType === 'pk' && (
                <>
                  <div styleName="text">
                    {formatMessage({ id: 'kexuan' })}
                    <span>{`${stockList.length}/4`}</span>
                    {formatMessage({ id: 'zhi_stock' })}
                  </div>
                  <div
                    styleName={stockList && stockList.length ? 'btn active-btn' : 'btn'}
                    onClick={() => btnToolClick('pk')}
                  >
                    {formatMessage({ id: 'start_pk' })}
                  </div>
                </>
              )
            }
            {/* 添加自选 */}
            {
              addType === 'zx' && (
                <div
                  styleName={stockList && stockList.length ? 'btn active-btn' : 'btn'}
                  onClick={() => btnToolClick('zx')}
                >
                  {`${formatMessage({ id: 'confirm_add_self' }, { value: stockList.length })}`}
                </div>
              )
            }
          </div>
        )
      }
      {/* 输入策略名称弹窗 */}
      <StrategyDialog
        show={strategyDialog}
        confirmClick={(name) => confirmClick(name)}
        cancelClick={() => setStrategyDialog(false)}
      />
      {/* 选择组合分组 */}
      <CombinationDialog
        show={combinationDialog}
        closeClick={() => setCombinationDialog(false)}
        confirmClick={(id) => confirmCombinationClick(id)}
        createClick={() => {
          setCreateDialog(true);
          setCombinationDialog(false);
        }}
      />
      {/* 快捷创建组合 */}
      <CreateCombinDialog
        show={createDialog}
        region={region}
        closeClick={() => {
          setCreateDialog(false);
          setCombinationDialog(true);
        }}
        confirmClick={() => {
          setCreateDialog(false);
          setCombinationDialog(true);
        }}
      />
    </div>
  );
};

export default AppHome;
