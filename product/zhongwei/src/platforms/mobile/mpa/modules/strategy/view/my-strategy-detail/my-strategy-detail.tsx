/* eslint-disable camelcase */
import React, { useState, useRef, useEffect, useContext } from 'react';
import { useIntl } from 'react-intl';
import { InfiniteScroll, PullToRefresh, Popover, Toast } from 'antd-mobile';
import { sleep } from 'antd-mobile/es/utils/sleep';
import { useSearchParam } from 'react-use';
import { getClassNameByPriceChange, getMarketCategoryTag } from '@dz-web/quote-client';
import { addStockApi } from '@/platforms/mobile/mpa/modules/combination/view/add-stock/common';
import {
  goBack,
  openNewPage,
  PageType,
  sessionStorageSetItem,
  goToSymbolPage,
  addOptionalList,
} from '@/platforms/mobile/helpers/native/msg';
import { CommonApi, getQuoData } from '@/api/module-api/strategy';
import IconBack from '@/platforms/mobile/images/icon_back_black.svg';
import IconNew from '@/platforms/mobile/images/icon_new.png';
import IconAddOptional from '@/platforms/mobile/images/icon_add_optional.svg';
import IconPK from '@/platforms/mobile/images/icon_pk.svg';
import { userConfigContext } from '@/platforms/mobile/helpers/entry/native';
import IconAddCombination from '@/platforms/mobile/images/icon_add_combination.svg';
import IconNotSelect from '@/platforms/mobile/images/icon_not_select.svg';
import IconSelect from '@/platforms/mobile/images/icon_select.svg';
import Loading from '@/platforms/mobile/components/combination/loading';
import Empty from '@/platforms/mobile/components/combination/empty';
import CombinationDialog from '@/platforms/mobile/mpa/modules/combination/view/add-stock/components/combinationDialog';
import CreateCombinDialog from
  '@/platforms/mobile/mpa/modules/combination/view/add-stock/components/createCombinDialog';
import './my-strategy-detail.scss';
import { useGetState } from 'ahooks';
import dayjs from 'dayjs';

const currencyList = {
  HK: 'HKD',
  US: 'USD',
  CN: 'CNY',
  SH: 'CNY',
  SZ: 'CNY',
};

const StrategyHome: React.FC = () => {
  const safeAreaTop = Number(useSearchParam('safeAreaTop')) || 0;
  const strategyId = Number(useSearchParam('strategyId')) || 0;
  const last10DaysInDate = Number(useSearchParam('last10DaysInDate')) || 0;
  const [list, setList] = useState<any>([]);
  const [hasMore, setHasMore] = useState(true);
  const [pages, setPages, getPages] = useGetState<any>({ pageNum: 0, pageSize: 20 });
  const cardRef = useRef(null);
  const conditionRef = useRef(null);
  const [btnType, setBtnType] = useState<string>('');
  const { formatMessage } = useIntl();
  const [stockList, setStockList] = useState<any>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState(0);
  const userConfig = useContext<any>(userConfigContext);
  const [lang, setLang] = useState<string>('zh-CN');
  const [conditions, setConditions] = useState<any>([]);
  const [groupId, setGroupId] = useState<any>();
  const [data, setData] = useState<any>();
  const [combinationDialog, setCombinationDialog] = useState<boolean>(false);
  const [createDialog, setCreateDialog] = useState<boolean>(false);

  const listBoxRef = useRef<any>(null);

  const fixed = (num) => (+num ? +(+num * 100).toFixed(2) : 0);

  const dataFormat = (num) => {
    if (+num) {
      if (+num > 0) {
        return `+${(+num).toFixed(2)}%`;
      }
      return `${(+num).toFixed(2)}%`;
    }
    return '0.00%';
  };

  // 获取选股条件
  const getConditions = async () => {
    try {
      await CommonApi({ mf: 9, sf: 19, body: { id: strategyId } }).then((res: any) => {
        if (res && res.code === 0 && res?.body) {
          const { id, name, region } = res.body;
          setData({ id, name, region });
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

  // 请求参数格式化
  const getStockParamsFormat = (res) => {
    const temp: any = [];
    if (res && res.length) {
      res.forEach((item) => {
        const obj: any = {};
        obj.Code = item.code;
        obj.Market = item.subMarket;
        temp.push(obj);
      });
      return temp;
    }
    return temp;
  };

  // 获取股票信息
  let flag = true;
  const getStockInfo = (params) => {
    try {
      getQuoData({
        ReqType: 1200,
        ReqID: 1,
        Data: getStockParamsFormat(params),
      }).then((res: any) => {
        if (res && res.Status === 0 && res?.Data && res?.Data.length) {
          const resData = res.Data;
          params.forEach((item) => {
            const idx = resData.findIndex(
              (a) => `${a.Market}` === `${item.subMarket}` && `${a.Code}` === `${item.code}`,
            );
            if (idx > -1) {
              item.Name = resData[idx].Name;
              item.Name_T = resData[idx].Name_T;
              item.Price = resData[idx].Price;
              item.RiseRate = resData[idx].RiseRate || 0;
            }
          });
          setList([...list, ...params]);
        }
        setLoading(false);
        flag = true;
      }).catch((err) => {
        flag = true;
        setLoading(false);
        setHasMore(false);
        Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err.message}` });
      });
    } catch (err: any) {
      flag = true;
      setLoading(false);
      setHasMore(false);
      Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err}` });
    }
  };

  // 获取我的策略股票列表
  const getList = async () => {
    if (!hasMore || !flag) return;
    flag = false;
    try {
      const { pageSize, pageNum } = getPages();
      const num = pageNum + 1;
      await CommonApi({ mf: 9, sf: 16, body: { pageSize, pageNum: num, strategyId } }).then((res: any) => {
        if (res && res.code === 0 && res?.body) {
          if (res?.body?.stocks.length) {
            getStockInfo(res.body.stocks);
          } else {
            flag = false;
            setHasMore(false);
          }
          setTotal(res?.body?.total || 0);
          setPages({ pageSize, pageNum: num });
        } else {
          setHasMore(false);
        }
        setLoading(false);
      }).catch((err) => {
        flag = true;
        setLoading(false);
        setHasMore(false);
        Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err.message}` });
      });
    } catch (err: any) {
      flag = true;
      setLoading(false);
      setHasMore(false);
      Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err}` });
    }
  };

  // 下拉刷新
  const onRefresh = async () => {
    await sleep(500);
    window.location.reload();
  };

  // 跳转到股票对比
  const stockPK = () => {
    openNewPage({
      fullScreen: true,
      pageType: PageType.HTML,
      path: 'stock-pk.html',
      replace: false,
    });
  };

  // 取消点击事件
  const qxClick = () => {
    setBtnType('');
    setStockList([]);
  };

  // 选择股票
  const selectClick = (d) => {
    if (!btnType) return;
    const temp: any = [...stockList];
    const idx = temp.findIndex(({ code, subMarket }) => code === d.code && subMarket === d.subMarket);
    if (idx > -1) {
      temp.splice(idx, 1);
    } else if (btnType === 'pk' && temp.length > 4) {
      Toast.show({ content: '最多添加4只股票' });
      return;
    } else {
      temp.push({ ...d });
    }
    setStockList([...temp]);
  };

  // 判断是否已选择
  const isSelect = (d) => {
    const idx = stockList.findIndex(({ code, subMarket }) => code === d.code && subMarket === d.subMarket);
    if (idx > -1) {
      return true;
    }
    return false;
  };

  // 多语言
  const getStockName = (d) => {
    if (lang === 'zh-CN') {
      return d?.Name;
    }
    return d?.Name_T;
  };

  // 添加自选【接口】
  const saveSelf = async () => {
    const selfList = stockList.map((item) => ({
      code: item.code,
      smallMarket: item.subMarket,
    }));
    addOptionalList([...selfList]);
  };

  const addStockFormat = (tList) => {
    const temp: any = [];
    if (tList && tList.length) {
      tList.forEach((item) => {
        const { Name, Name_T, code, subMarket } = item;
        const market = getMarketCategoryTag(subMarket);
        const obj: any = {};
        obj.currencyCode = currencyList[market || ''];
        obj.marketId = subMarket;
        obj.name = lang === 'zh-CN' ? Name : Name_T;
        obj.code = code;
        temp.push(obj);
      });
    }
    return temp;
  };

  // 股票保存到组合
  const addStockToCombination = async (portfolioId) => {
    const res = await addStockApi(addStockFormat(stockList), portfolioId);
    if (res && res.code === 0) {
      setStockList([]);
      Toast.show({ content: formatMessage({ id: 'add_success' }) });
    } else {
      Toast.show({ content: res.message });
    }
    setCombinationDialog(false);
  };

  // 股票pk数据格式化
  const getFilterResult = (d: any[]) => {
    const temp: any = [];
    if (d && d.length) {
      d.forEach((item) => {
        const { code, subMarket, Name, Name_T } = item;
        const market = getMarketCategoryTag(subMarket);
        const obj: any = {};
        obj.code = code;
        obj.name = lang === 'zh-CN' ? Name : Name_T;
        obj.marketId = subMarket;
        obj.market = market === 'SH' || market === 'SZ' ? 'CN' : market;
        obj.currencyCode = currencyList[market || ''];
        temp.push(obj);
      });
    }
    return temp;
  };

  const btnClick = (type) => {
    if (type === 'all') {
      if (list.length === stockList.length) {
        setStockList([]);
      } else {
        setStockList([...list]);
      }
    }
    if (!stockList.length) return;
    if (type === 'zx') {
      saveSelf();
    }
    if (type === 'pk') {
      if (stockList && stockList.length > 4) {
        Toast.show({ content: '最多添加4只股票' });
        return;
      }
      sessionStorageSetItem({ key: 'stockList', value: getFilterResult(stockList) }); // 只有策略才缓存
      stockPK();
    }
    if (type === 'zh') {
      setCombinationDialog(true);
    }
  };

  // 跳转到股票详情
  const goStock = ({ subMarket, code }) => {
    goToSymbolPage({ market: subMarket, code });
  };

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

  const selectDom = () => {
    if (btnType === 'zx') {
      // 添加自选
      return (
        <div styleName="select-bar">
          {/* 全选 */}
          <div styleName="all-text" onClick={() => btnClick('all')}>
            {formatMessage({ id: 'all_select' })}
          </div>
          {/* 添加至 */}
          <div styleName={stockList.length ? 'add-text active' : 'add-text'} onClick={() => btnClick('zx')}>
            {formatMessage({ id: 'add_to' })}
            {`(${stockList.length})`}
          </div>
        </div>
      );
    } if (btnType === 'pk') {
      // 股票对比
      return (
        <div styleName="select-bar">
          {/* 可选0/4只股票 */}
          <div styleName="all-text">
            {formatMessage({ id: 'kexuan' })}
            <span>{`${stockList.length}/4`}</span>
            {formatMessage({ id: 'zhi_stock' })}
          </div>
          {/* 股票pk */}
          <div styleName={stockList.length ? 'add-text active' : 'add-text'} onClick={() => btnClick('pk')}>
            {formatMessage({ id: 'start_pk' })}
          </div>
        </div>
      );
    }
    return (
      // 添加至组合
      <div styleName="select-bar">
        {/* 全选 */}
        <div styleName="all-text" onClick={() => btnClick('all')}>
          {formatMessage({ id: 'all_select' })}
        </div>
        {/* 添加至组合 */}
        <div styleName={stockList.length ? 'add-text active' : 'add-text'} onClick={() => btnClick('zh')}>
          {formatMessage({ id: 'add_combination' })}
          {`(${stockList.length})`}
        </div>
      </div>
    );
  };

  const tipDom = () => {
    if (isLoading) {
      return (
        <div styleName="loading-page">
          <Loading text="" />
        </div>
      );
    }
    return (
      <div styleName="empty-box">
        <Empty type="strategy" />
      </div>
    );
  };

  useEffect(() => {
    let height = 0;
    if (conditions && conditions.length) {
      height = window.innerHeight - 254 - safeAreaTop;
    } else {
      height = window.innerHeight - 186 - safeAreaTop;
    }
    listBoxRef.current.style.height = `${height}px`;
  }, [conditions]);

  return (
    <div styleName="my-strategy-detail" style={{ paddingTop: `${+safeAreaTop}px` }}>
      <div styleName="head-top" ref={cardRef}>
        <img styleName="back" src={IconBack} alt="" onClick={() => goBack()} />
        <div styleName="title">{data?.name || ''}</div>
        <div styleName={btnType ? 'qx-btn active' : 'qx-btn'} onClick={() => qxClick()}>取消</div>
      </div>
      <PullToRefresh onRefresh={async () => onRefresh()}>
        <div styleName="content-box">
          {
            conditions && conditions.length ? (
              <div styleName="strategy-condition-box" ref={conditionRef}>
                {
                  conditions.map((item) => (
                    <div styleName="strategy-item-box" key={`${item.title}-${item.text}-${item.value}`}>
                      <Popover
                        styleName="popover-tip"
                        content={`${item.title}:${item.text}`}
                        trigger="click"
                        placement="bottom-start"
                        getContainer={conditionRef.current}
                      >
                        <div styleName="item">
                          <div styleName="name">{item.title}</div>
                          <div styleName="text">{item.text}</div>
                        </div>
                      </Popover>
                    </div>
                  ))
                }
              </div>
            ) : null
          }
          <div styleName="stock-box">
            <div styleName="condition-box">
              <div styleName="text">
                共
                <span>4</span>
                {formatMessage({ id: 'in_total_text' })}
                <span>{total || 0}</span>
                只票
              </div>
              {
                last10DaysInDate ? (
                  <div styleName="last-update">
                    {`最近更新 ${dayjs(last10DaysInDate).format('YYYY/MM/DD')}`}
                  </div>
                ) : null
              }
            </div>
            <div styleName="stock-list-box">
              <div styleName="head">
                <div styleName="item d1">{formatMessage({ id: 'name_code' })}</div>
                <div styleName="item d2">{formatMessage({ id: 'latest_price' })}</div>
                <div styleName="item d3">{formatMessage({ id: 'rise_and_fall' })}</div>
              </div>
              <div styleName="list-box" ref={listBoxRef}>
                {
                  list && list.length ? list.map((item) => (
                    <div styleName="row" key={`${item.code}-${item.subMarket}-${performance.now()}`}>
                      <div styleName="item d1">
                        {
                          btnType && (
                            <div styleName="select-box" onClick={() => selectClick(item)}>
                              {
                                isSelect(item) ? (
                                  <img styleName="icon-select" src={IconSelect} alt="" />
                                ) : (
                                  <img styleName="icon-select" src={IconNotSelect} alt="" />
                                )
                              }
                            </div>
                          )
                        }
                        <div styleName="left" onClick={() => goStock(item)}>
                          <div styleName="name">{getStockName(item)}</div>
                          <div styleName="code-new">
                            {item.code}
                            {
                              item?.isNew ? (<img styleName="new-tag" src={IconNew} alt="" />) : null
                            }
                          </div>
                        </div>
                      </div>
                      <div
                        styleName="item d2"
                        className={getClassNameByPriceChange(fixed(item?.RiseRate))}
                      >
                        {(item?.Price || 0).toFixed(2)}
                      </div>
                      <div
                        styleName="item d3"
                        className={getClassNameByPriceChange(fixed(item?.RiseRate))}
                      >
                        {dataFormat(fixed(item?.RiseRate))}
                      </div>
                    </div>
                  )) : tipDom()
                }
                <InfiniteScroll
                  hasMore={hasMore}
                  loadMore={async () => getList()}
                >
                  <div />
                </InfiniteScroll>
              </div>
            </div>
          </div>
        </div>
      </PullToRefresh>
      <div styleName="btn-box">
        {
          !btnType ? (
            <div styleName="tool">
              {/* 添加自选 */}
              <div
                styleName="item"
                onClick={() => {
                  setBtnType('zx');
                }}
              >
                <img src={IconAddOptional} alt="" />
                {formatMessage({ id: 'add_optional' })}
              </div>
              {/* 股票对比 */}
              <div styleName="item" onClick={() => setBtnType('pk')}>
                <img src={IconPK} alt="" />
                {formatMessage({ id: 'stock_pk' })}
              </div>
              {/* 添加至组合 */}
              <div styleName="item" onClick={() => setBtnType('zh')}>
                <img src={IconAddCombination} alt="" />
                {formatMessage({ id: 'add_combination' })}
              </div>
            </div>
          ) : selectDom()
        }
      </div>
      {/* 选择要添加至组合的弹窗 */}
      <CombinationDialog
        show={combinationDialog}
        closeClick={() => setCombinationDialog(false)}
        confirmClick={(id) => addStockToCombination(id)}
        createClick={() => {
          setCreateDialog(true);
          setCombinationDialog(false);
        }}
      />
      {/* 新建组合弹窗 */}
      <CreateCombinDialog
        show={createDialog}
        region={data?.region || ''}
        closeClick={() => {
          setCreateDialog(false);
          setCombinationDialog(true);
        }}
        confirmClick={(id) => {
          setCreateDialog(false);
          addStockToCombination(id);
        }}
      />
    </div>
  );
};

export default StrategyHome;
