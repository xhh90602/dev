/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable max-len */
import React, { useState, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useSearchParam } from 'react-use';
import { Stepper, Toast } from 'antd-mobile';
import { getSimulateCombinationAdjustment, saveSimulatedRebalancing, deleteStock } from '@/api/module-api/combination';
import { nativeOpenPage } from '@/platforms/mobile/helpers/native/url';
import IconRefresh from '@/platforms/mobile/images/icon_refresh.svg';
import IconDel from '@/platforms/mobile/images/icon_del.svg';
import IconAdd from '@/platforms/mobile/images/icon_zh_add.svg';
import PieChart from '@/platforms/mobile/components/combination/pieChart';
import Decimal from 'decimal.js';
import { settingHeaderButton, goBack, settingNavigationTitle, goToSymbolPage } from '@mobile/helpers/native/msg';
import { headerButtonCallBack, headerButtonCallComplete, pageOnShow } from '@mobile/helpers/native/register';
import { useGetState } from 'ahooks';
import Empty from '@/platforms/mobile/components/combination/empty';
import Dialog from './dialog';

import './simulate-combination-adjustment.scss';

const colors = [
  '#fab02f',
  '#80e09b',
  '#7879f1',
  '#ea8749',
  '#529af3',
  '#fa3135',
  '#eedaa3',
  '#feddb9',
  '#2e9cfb',
  '#e76147',
  '#1c3c61',
  '#633ae5',
  '#309bfb',
  '#fbb12d',
  '#f88684',
  '#13af94',
  '#9a60b4',
  '#ea7ccc',
  '#5da0db',
  '#e37b36',
];

const AppHome: React.FC = () => {
  const portfolioId = Number(useSearchParam('portfolioId')) || null;
  const [data, setData] = useState<any>(null);
  const [groupList, setGroupList, getGroupList] = useGetState<any>([]);
  const [chartList, setChartList] = useState<any>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ratio, setRatio, getRatio] = useGetState<any>(null);
  const { formatMessage } = useIntl();
  const [isRefresh, setRefresh] = useState<boolean>(false);
  const [tipText, setTipText] = useState('');
  const [show, setShow] = useState<boolean>(false);
  const [dialogType, setDialogType] = useState('');
  const [stockInfo, setStockInfo] = useState<any>(null);
  const [isChange, setisChange, getisChange] = useGetState(false);
  const [isFocusIdx, setFocusIdx] = useState<any>(null);

  // 保留两位小数
  const fixed = (val = 0) => (val !== null ? +(val).toFixed(2) : 0);

  // 转换成百分比
  const ratioTransform = (val) => (val ? fixed(val * 100) : 0);

  // 数据格式化
  const dataFormat = (list) => {
    const temp: any = [];
    if (getRatio() && Object.keys(getRatio()).length) {
      if (list && list.length) {
        const totalRatio: any = [];
        list.forEach((item) => {
          if (item?.stockVOList && item.stockVOList.length) {
            item.stockVOList.forEach((ele) => {
              const { stockName, assetsRatio, adjustmentRatio } = ele;
              const obj: any = {};
              obj.name = stockName;
              obj.value = adjustmentRatio !== null ? adjustmentRatio : ratioTransform(assetsRatio);
              temp.push(obj);
              totalRatio.push(adjustmentRatio === null ? ratioTransform(assetsRatio) : fixed(adjustmentRatio));
            });
          }
        });
        const total = totalRatio.reduce((prev, cur) => prev + cur);
        const availableRatio = fixed(100 - total);
        temp.unshift({ name: formatMessage({ id: 'configurable_amount' }), value: availableRatio });
      }
    } else {
      const obj: any = {};
      obj.name = formatMessage({ id: 'configurable_amount' });
      if (list && list.length) {
        obj.value = data?.surplusCapital || 0;
      } else {
        obj.value = data?.capitalScale || 0;
      }
      obj.unit = 'HKD';
      temp.push(obj);
    }
    return temp;
  };

  // 计算组合总资产
  const calCombiTotal = (list, marketValueTotal) => {
    const { capitalScale, totalCostAmount } = data;
    // 调仓金额 = 组合总资产 * 仓位变化
    // 组合总资产 = 资金规模(capitalScale) - 总成本(totalCostAmount) + 所有股票的市值(marketValue)
    // 仓位变化 = 调仓后比例 - 调仓前比例
    const total = capitalScale - totalCostAmount + marketValueTotal;
    list.forEach((item) => {
      if (item?.stockVOList && item.stockVOList.length) {
        item.stockVOList.forEach((ele) => {
          if (ele?.adjustmentRatio !== null) {
            ele.ajAmount = ele.adjustmentRatio ? fixed(total * (((ele.adjustmentRatio / 100) || 0) - (ele?.assetsRatio || 0))) : 0;
          } else {
            ele.ajAmount = null;
          }
        });
      }
    });
    return list;
  };

  // 数据格式化
  const transformArray = (list) => {
    // let marketValueTotal = 0;
    if (list && list.length) {
      // const marketValueArr: any = [];
      list.forEach((item) => {
        if (item?.stockVOList && item.stockVOList.length) {
          item.stockVOList.forEach((ele) => {
            if (getRatio() && Object.keys(getRatio()).length) {
              if (!(Object.keys(getRatio()).includes((ele.id).toString())) || (getRatio()[ele.id] === null && getRatio()[ele.id] !== 0)) {
                ele.adjustmentRatio = null;
              } else {
                ele.adjustmentRatio = getRatio()[ele.id];
                // ele.adjustmentRatio = (fixed(getRatio()[ele.id] / 100));
              }
            } else {
              ele.adjustmentRatio = null;
            }
            // marketValueArr.push(ele.marketValue);
          });
        }
      });
      // marketValueTotal = marketValueArr.reduce((prev, cur) => prev + cur);
    }
    return calCombiTotal(list, fixed(data.totalMarketValue || 0));
  };

  // 获取模拟调仓信息
  let flag = true;
  const getCombinationData = (t = '') => {
    if (!flag) return;
    flag = false;
    getSimulateCombinationAdjustment({
      portfolioId,
    }).then((res: any) => {
      if (res && res.code === 0 && res?.result) {
        const {
          capitalScale,
          classifyStockVO,
          currency,
          freezeCapital,
          positionProportion,
          share,
          surplusCapital,
          totalCostAmount,
        } = res.result;
        setData({
          capitalScale,
          classifyStockVO,
          currency,
          freezeCapital,
          positionProportion,
          share,
          surplusCapital,
          totalCostAmount,
        });
        if (t === 'refresh') {
          Toast.show({
            content: formatMessage({ id: 'refresh_success' }),
          });
        }
      } else {
        Toast.show({
          content: res?.message || formatMessage({ id: 'api_error' }),
        });
      }
      flag = true;
      setRefresh(false);
    }).catch(() => {
      flag = true;
      setRefresh(false);
    });
  };

  // 调仓的总比例：所有调仓后的 + 所有上未调仓的
  const getAdjustmentRatio = (list) => {
    let totalRatio = 0;
    if (list && list.length) {
      const ajAmountArr: any = [];
      list.forEach((item) => {
        const totalProportionArr: any = [];
        if (item?.stockVOList && item.stockVOList.length) {
          item.stockVOList.forEach((ele) => {
            if (ele?.adjustmentRatio !== null) {
              ajAmountArr.push(ele?.adjustmentRatio || 0);
              totalProportionArr.push((ele.adjustmentRatio / 100) || 0);
            } else {
              ajAmountArr.push(ratioTransform(ele?.assetsRatio || 0));
              totalProportionArr.push(ele.assetsRatio || 0);
            }
          });
        }
        item.totalProportion = totalProportionArr.reduce((prev, cur) => (prev + cur));
      });
      totalRatio = ajAmountArr.reduce((prev, cur) => prev + cur);
    }
    return totalRatio;
  };

  // 计算可调仓范围（调仓比列总和）
  const calcAdjustmentScope = useMemo(() => fixed(getAdjustmentRatio(getGroupList())), [getGroupList()]);

  // 校验数据的是否合法
  const checkData = () => {
    if (fixed(100 - calcAdjustmentScope) > 100 || fixed(100 - calcAdjustmentScope) < 0) {
      return false;
    }
    return true;
  };

  // 保存的数据格式化
  const saveData = (list, type) => {
    const temp: any = [];
    list.forEach((item) => {
      if (item?.stockVOList && item.stockVOList.length) {
        item.stockVOList.forEach((ele) => {
          const {
            bigMarket, // 大市场
            costPrice, // 成本价
            currency, // 股票币种
            id,
            nowPrice, // 最新价
            assetsRatio, // 原始比例
            smallMarket, // 小市场
            stockCode, // 股票编码
            stockName, // 股票名称
            tradeMarket, // 交易市场
            adjustmentRatio, // 调仓比例
          } = ele;
          const obj: any = {};
          obj.bigMarket = bigMarket;
          obj.costPrice = costPrice;
          obj.currency = currency;
          obj.id = id;
          obj.nowPrice = nowPrice;
          obj.originalProportion = assetsRatio; // 原始资产占比，初始调仓传0
          obj.process = type === 'del' ? true : (adjustmentRatio !== null && adjustmentRatio !== assetsRatio); //  true 调仓 false 不调仓
          obj.proportion = type === 'del' ? 0 : ((adjustmentRatio !== null && adjustmentRatio !== assetsRatio) ? new Decimal(adjustmentRatio).div(new Decimal(100)).toNumber() : assetsRatio); // 新资产占比，不调仓传原始资产占比
          obj.smallMarket = smallMarket;
          obj.stockCode = stockCode;
          obj.stockName = stockName;
          obj.tradeMarket = tradeMarket;
          temp.push(obj);
        });
      }
    });
    return temp;
  };

  // 保存模拟组合调仓
  let sflag = true;
  const save = (type = '') => {
    if (!sflag) return;
    const subData = saveData(getGroupList(), type);
    const _bool = subData.every((item) => !item.process);
    if (_bool) {
      Toast.show({
        content: formatMessage({ id: 'adjustment_tip_text' }),
      });
      return;
    }
    sflag = false;
    try {
      saveSimulatedRebalancing({ portfolioId, stockList: [...subData] }).then((res: any) => {
        if (res && res.code === 0) {
          getCombinationData();
          setisChange(false);
          setShow(false);
          Toast.show({
            icon: 'success',
            content: formatMessage({ id: 'operation_success' }),
          });
          if (!type) {
            setTimeout(() => {
              nativeOpenPage(`combination-details.html?portfolioId=${portfolioId}`, true);
            }, 1200);
          }
        } else {
          Toast.show({ content: res.message });
        }
        sflag = true;
      }).catch(() => {
        sflag = true;
        Toast.show({
          icon: 'fail',
          content: formatMessage({ id: 'interface_exception' }),
        });
      });
    } catch (err) {
      sflag = true;
      Toast.show({
        icon: 'fail',
        content: formatMessage({ id: 'interface_exception' }),
      });
    }
  };

  // 删除没调仓的股票
  let dflag = true;
  const delAdjustmentStock = (id) => {
    if (!dflag || !id) return;
    dflag = false;
    try {
      deleteStock({
        portfolioId,
        stockDTOList: [id],
      }).then((res: any) => {
        if (res && res.code === 0) {
          Toast.show({
            icon: 'success',
            content: formatMessage({ id: 'save_success' }),
          });
          getCombinationData();
        } else {
          Toast.show({ content: res.message });
        }
        dflag = true;
      }).catch(() => {
        dflag = true;
        Toast.show({
          icon: 'fail',
          content: formatMessage({ id: 'interface_exception' }),
        });
      });
    } catch (err) {
      dflag = true;
      Toast.show({
        icon: 'fail',
        content: formatMessage({ id: 'interface_exception' }),
      });
    }
  };

  // 暂存输入的数据
  const inputChange = (val, row) => {
    const { id } = row;
    setRatio({ ...getRatio(), [id]: val === null ? null : val >= 0 ? val : null });
  };

  // 失去焦点【数据合并】
  const inputBlur = () => {
    const { classifyStockVO } = data;
    const result = transformArray(classifyStockVO);
    setGroupList([...result] || []);
    setChartList([...dataFormat(result)]);
    setisChange(true);
  };

  // 计算可配置金额
  const getConfigAmount = (gList): number => {
    const listArray: any = [];
    if (gList && gList.length) {
      gList.forEach((item) => {
        if (item?.stockVOList && item.stockVOList.length) {
          item.stockVOList.forEach((ele) => {
            listArray.push(fixed(ele?.ajAmount));
          });
        }
      });
      const totalAssets = listArray.reduce((prev, cur) => prev + cur);
      return fixed(totalAssets);
    }
    return 0;
  };

  // 获取可配置总金额
  const getTotalAmount = useMemo(() => {
    if (getGroupList() && getGroupList().length) {
      const surplusCapital = data?.surplusCapital || 0;
      if (getRatio() && Object.keys(getRatio()).length) {
        const arrList: any = [];
        Object.keys(getRatio()).forEach((ele) => {
          arrList.push(getRatio()[ele] || 0);
        });
        const totalAssets = arrList.reduce((prev, cur) => prev + cur);
        const total = fixed(surplusCapital - (totalAssets / 100) * surplusCapital);
        return total;
      }
      return surplusCapital;
    }
    return data?.capitalScale || 0;
  }, [getGroupList()]);

  const saveClick = () => {
    if (getGroupList().length <= 0) return;
    if (checkData()) {
      save();
    } else {
      Toast.show({ content: formatMessage({ id: 'beyond_max_text' }) });
    }
  };

  // 刷新
  const refreshClick = () => {
    getCombinationData('refresh');
    setRefresh(true);
  };

  // 获取数据
  useEffect(() => {
    if (portfolioId) {
      getCombinationData();
    }
  }, [portfolioId]);

  useEffect(() => {
    if (data) {
      const { classifyStockVO } = data;
      setGroupList(classifyStockVO || []);
      setChartList(dataFormat(transformArray(classifyStockVO)));
    }
  }, [data]);

  // Table 头部
  const tableHeadList = [
    formatMessage({ id: 'name_code' }),
    formatMessage({ id: 'asset_ratio' }),
    formatMessage({ id: 'to_adjustment' }),
    `${formatMessage({ id: 'adjustment_amount' })}(${formatMessage({ id: 'estimate' })})`,
  ];

  // 市场
  const marketEnume = {
    USD: formatMessage({ id: 'USD' }),
    CNY: formatMessage({ id: 'CNY' }),
    HKD: formatMessage({ id: 'HKD' }),
  };

  // 合计汇总金额
  const totalAmount = useMemo(() => getConfigAmount(getGroupList()), [getGroupList()]);

  // 是否删除股票
  const delStockClick = (row) => {
    const { stockName } = row;
    setTipText(formatMessage({ id: 'del_stock_tip' }, { value: stockName }));
    setDialogType('del');
    setStockInfo(row);
    setShow(true);
  };

  // 弹窗确认
  const confirmClick = () => {
    if (dialogType === 'del') {
      const stockId = stockInfo?.id;
      const { assetsRatio } = stockInfo;
      if (assetsRatio > 0) {
        save('del');
      } else {
        delAdjustmentStock(stockId);
      }
    } else if (checkData()) {
      save();
    } else {
      Toast.show({ content: formatMessage({ id: 'beyond_max_text' }) });
    }
    setShow(false);
  };

  // 弹窗取消
  const cancelClick = () => {
    setShow(false);
    if (dialogType === 'save') {
      nativeOpenPage(`combination-details.html?portfolioId=${portfolioId}`, true);
    }
  };

  // 右上角 完成 按钮
  const FinishCallback = (res) => {
    if (res === 'finish') {
      if (getGroupList().length <= 0) return;
      if (checkData()) {
        save();
      } else {
        Toast.show({ content: formatMessage({ id: 'beyond_max_text' }) });
      }
    } else if (res === 'back') {
      if (getisChange()) {
        setTipText(formatMessage({ id: 'save_tip' }));
        setDialogType('save');
        setShow(true);
      } else {
        nativeOpenPage(`combination-details.html?portfolioId=${portfolioId}`, true);
      }
    }
  };

  useEffect(() => {
    // 设置【返回】按钮
    settingHeaderButton([{
      icon: 'back', // 返回
      position: 'left',
      index: 1,
      onClickCallbackEvent: 'headerButtonCallBack',
    },
    {
      text: formatMessage({ id: 'finish' }), // 完成
      textColor: '#fa6d16',
      textFontSize: 30,
      position: 'right',
      index: 2,
      onClickCallbackEvent: 'headerButtonCallComplete',
    },
    ]).then((res) => {
      console.log('设置返回按钮', res);
    });
    // 设置页面标题
    settingNavigationTitle({ name: formatMessage({ id: 'simulate_adjustment_combination' }) });
    // 【返回】回调
    headerButtonCallBack(() => FinishCallback('back'));
    // 【完成】回调
    headerButtonCallComplete(() => FinishCallback('finish'));
    pageOnShow(() => {
      getCombinationData();
    });
  }, []);

  const goStock = ({ smallMarket, stockCode }) => {
    goToSymbolPage({ market: smallMarket, code: stockCode });
  };

  return (
    <>
      <div styleName="simulate-combination-adjustment">
        <div styleName="head-chart">
          <div styleName="hs-trend-box">
            <div styleName="hs-trend-chart">
              <PieChart data={chartList} colors={colors} />
            </div>
            {
              chartList && chartList.length ? (
                <div styleName="hs-trend-list">
                  <div styleName="hs-trend-list-box">
                    {
                      chartList.map((item, idx) => (
                        <div styleName="item" key={item.name}>
                          <div styleName="stock-name-box">
                            <span style={{ backgroundColor: colors[idx] }} />
                            <div styleName="stock-name">{item.name}</div>
                          </div>
                          <div styleName="stock-ratio">
                            {`${item.value}${item?.unit ? item.unit : '%'}`}
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              ) : null
            }
          </div>
          <div styleName="configurable-amount">
            <div styleName="left">
              <div styleName="label">{formatMessage({ id: 'configurable_amount' })}</div>
              {`${getTotalAmount} HKD`}
            </div>
            <div styleName="right" onClick={() => refreshClick()}>
              <img styleName={`${isRefresh ? 'refresh' : ''}`} src={IconRefresh} alt="" />
              {formatMessage({ id: 'refresh' })}
            </div>
          </div>
        </div>
        <div styleName="simulate-combination-adjustment-list">
          <div styleName="table-head-box">
            {
              tableHeadList.map((item, idx) => (
                <div styleName={`t${idx + 1} item`} key={item}>{item}</div>
              ))
            }
          </div>
          <div styleName="table-list-box">
            {
              groupList && groupList.length ? groupList.map((item, index) => (
                <div styleName="table-list" key={`${item.market}-${index}`}>
                  <div styleName="group-name">
                    {marketEnume[item?.market] || '--'}
                    {' '}
                    {`${ratioTransform(item.totalProportion)}%`}
                  </div>
                  {
                    item.stockVOList && item.stockVOList.length ? item.stockVOList.map((ele, idx) => (
                      <div styleName="line-item" key={ele.id}>
                        <div styleName="code-name">
                          <img src={IconDel} alt="" onClick={() => delStockClick(ele)} />
                          <div styleName="label-box" onClick={() => goStock(ele)}>
                            <div styleName="name">{ele?.stockName || '--'}</div>
                            <div styleName="code-price">
                              <div styleName="code">{ele?.stockCode || '--'}</div>
                              <div styleName="price">{ele?.nowPrice || '--'}</div>
                            </div>
                          </div>
                        </div>
                        <div styleName="asset-ratio">
                          <div styleName="ratio">{`${ratioTransform(ele?.assetsRatio || 0)}%`}</div>
                          {
                            ele.orderStatusFlag && (
                              <div styleName="status">{formatMessage({ id: 'pending_transaction' })}</div>
                            )
                          }
                        </div>
                        <div styleName="adjustment-to">
                          <div styleName={isFocusIdx === `${index}-${idx}` ? 'ipnut-box active' : 'ipnut-box'}>
                            <Stepper
                              step={0.01}
                              min={0}
                              max={100}
                              digits={2}
                              allowEmpty
                              defaultValue={ele.orderStatusFlag ? fixed((ele.planRatio || 0) * 100) : null}
                              style={{
                                '--input-background-color': '#fff',
                              }}
                              onBlur={() => { inputBlur(); setFocusIdx(null); }}
                              onFocus={() => setFocusIdx(`${index}-${idx}`)}
                              onChange={(val) => inputChange(val, ele)}
                            />
                            <span styleName="unit">%</span>
                          </div>
                          {
                            fixed(100 - calcAdjustmentScope) < 0 && getRatio()[ele.id] ? (
                              <div styleName="tip red">{formatMessage({ id: 'beyond_max_text' })}</div>
                            ) : (
                              <div styleName="tip">{`0 ~ ${fixed(100 - calcAdjustmentScope) >= 0 ? fixed(100 - calcAdjustmentScope) : 0}%`}</div>
                            )
                          }
                        </div>
                        <div styleName="amount">
                          {ele.ajAmount !== null ? ele.ajAmount : '--'}
                        </div>
                      </div>
                    )) : null
                  }
                </div>
              )) : (
                <div styleName="empty-box">
                  <Empty />
                </div>
              )
            }
          </div>
        </div>
        {
          groupList && groupList.length ? (
            <div styleName="total-amount">
              <div styleName="label-text">{formatMessage({ id: 'total_amount' })}</div>
              <div styleName="value">{isChange ? totalAmount : '--'}</div>
            </div>
          ) : null
        }
      </div>
      {/* 添加股票 */}
      <div
        styleName="bot-btn"
        onClick={() => nativeOpenPage(`add-stock-filter.html?portfolioId=${portfolioId}&source=zuhe`, true, true)}
      >
        <img styleName="icon-add" src={IconAdd} alt="" />
        {formatMessage({ id: 'add_stock_text' })}
      </div>
      <Dialog show={show} text={tipText} cancelClick={() => cancelClick()} confirmClick={() => confirmClick()} />
      {
        process.env.NODE_ENV === 'development' ? (
          <div styleName="btn-box">
            <div styleName="btn" onClick={() => saveClick()}>{formatMessage({ id: 'save_combination' })}</div>
          </div>
        ) : null
      }
    </>
  );
};

export default AppHome;
