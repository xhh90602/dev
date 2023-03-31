import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import {
  goBack,
  addOptional,
  deleteOptional,
  sessionStorageGetItem,
  goToSymbolPage,
} from '@/platforms/mobile/helpers/native/msg';
import { useSearchParam } from 'react-use';
import { InfiniteScroll, Toast } from 'antd-mobile';
import { userConfigContext } from '@/platforms/mobile/helpers/entry/native';
import Empty from '@/platforms/mobile/components/combination/empty';
import Loading from '@/platforms/mobile/components/combination/loading';
import IconHK from '@/platforms/mobile/images/icon_HK.svg';
import IconSZ from '@/platforms/mobile/images/icon_SZ.svg';
import IconUS from '@/platforms/mobile/images/icon_US.svg';
import IconSH from '@/platforms/mobile/images/icon_SH.svg';
import IconBack from '@/platforms/mobile/images/icon_back_white.svg';
import IconBot from '@/platforms/mobile/images/icon_bot.svg';
import Iconzx from '@/platforms/mobile/images/icon_not_select_stock.svg';
import Iconqx from '@/platforms/mobile/images/icon_self_select_stock.svg';
import { CommonApi, getQuoData } from '@/api/module-api/strategy';
import { getSelf } from '@/api/module-api/combination';
import IconSortDefault from '@/platforms/mobile/images/icon_sort_default.png';
import IconSortAsc from '@/platforms/mobile/images/icon_sort_asc.png';
import IconSortDesc from '@/platforms/mobile/images/icon_sort_desc.png';
import { getClassNameByPriceChange, getMarketCategoryTag } from '@dz-web/quote-client';
import { useGetState } from 'ahooks';

import './selected-strategy-detail.scss';
import { pageOnShow } from '@/platforms/mobile/helpers/native/register';

const StrategyHome: React.FC = () => {
  const safeAreaTop = Number(useSearchParam('safeAreaTop')) || 0;
  const strategyId = Number(useSearchParam('strategyId')) || 0;
  const [pages, setPages, getPages] = useGetState<any>({ pageNum: 0, pageSize: 20 });
  const [list, setList] = useState<any>([]);
  const [data, setData] = useState({ name: '', desc: '' });
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [textMore, setTextMore] = useState<boolean>(false);
  const [total, setTotal] = useState(0);
  const [optionalList, setOptionalList] = useState<any>([]);
  const [sortType, setSortType] = useState('default');
  const userConfig = useContext<any>(userConfigContext);
  const [lang, setLang] = useState<string>('zh-CN');
  const { formatMessage } = useIntl();

  const fixed = (num) => (+num ? +(+num).toFixed(2) : 0);

  const dataFormat = (num) => {
    if (+num) {
      if (+num > 0) {
        return `+${(+num * 100).toFixed(2)}%`;
      }
      return `${(+num * 100).toFixed(2)}%`;
    }
    return '0.00%';
  };

  const strIntercept = (str) => {
    if (str && str.length > 78) {
      return `${str.slice(0, 78)}...`;
    }
    return str;
  };

  const sortData = () => {
    if (sortType === 'asc') {
      const sortList = list.sort((a, b) => a.RiseRate - b.RiseRate);
      setList([...sortList]);
    }
    if (sortType === 'desc') {
      const sortList = list.sort((a, b) => b.RiseRate - a.RiseRate);
      setList([...sortList]);
    }
  };

  const sortClick = () => {
    switch (sortType) {
      case 'default':
        setSortType('asc');
        break;
      case 'asc':
        setSortType('desc');
        break;
      default:
        setSortType('default');
        break;
    }
  };

  useEffect(() => {
    if (sortType) {
      sortData();
    }
  }, [sortType]);

  const getStockParamsFormat = (res) => {
    if (res && res.length) {
      return res.map((item) => {
        const { code, subMarket } = item;
        return {
          Code: code,
          Market: subMarket,
        };
      });
    }
    return [];
  };

  const getSelfList = async () => {
    getSelf({}).then((res) => {
      if (res && res.code === 0 && res?.result.length) {
        setOptionalList([...res.result[0].stocks]);
      }
    });
  };

  // 获取股票信息
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
              item.MonthRise = resData[idx].MonthRise || 0;
            }
          });
          setList([...list, ...params]);
        }
      }).catch((err) => {
        setHasMore(false);
        Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err.message}` });
      });
    } catch (err: any) {
      setHasMore(false);
      Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err}` });
    }
  };

  let flag = true;
  const getList = async () => {
    if (!hasMore || !flag) return;
    flag = false;
    try {
      const { pageSize, pageNum } = getPages();
      const num = pageNum + 1;
      await CommonApi({ mf: 9, sf: 18, body: { pageSize, pageNum: num, strategyId } }).then((res: any) => {
        if (res && res.code === 0 && res?.body) {
          if (res?.body?.stocks && res?.body.stocks.length) {
            getStockInfo(res.body.stocks);
          } else {
            setHasMore(false);
          }
          setTotal(res.body?.total || 0);
          setPages({ pageSize, pageNum: num });
        }
        setLoading(false);
        flag = true;
      }).catch((err) => {
        flag = true;
        setHasMore(false);
        setLoading(false);
        Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err.message}` });
      });
    } catch (err: any) {
      flag = true;
      setHasMore(false);
      setLoading(false);
      Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err}` });
    }
  };

  const isSelf = (item) => {
    const { code, subMarket } = item;
    const idx = optionalList.findIndex((ele) => `${ele.stockCode}` === `${code}`
      && `${ele.marketCode}` === `${subMarket}`);
    if (idx > -1) {
      return true;
    }
    return false;
  };

  // 添加/删除自选【接口】
  const saveSelf = (item) => {
    const { code, subMarket } = item;
    if (isSelf(item)) {
      deleteOptional({ smallMarket: subMarket, code }).then(() => {
        getSelfList();
      });
    } else {
      addOptional({ smallMarket: subMarket, code }).then(() => {
        getSelfList();
      });
    }
  };

  const goStock = ({ subMarket, code }) => {
    goToSymbolPage({ market: subMarket, code });
  };

  const getStockName = (item) => {
    if (lang === 'zh-CN') {
      return item?.Name;
    }
    return item?.Name_T;
  };

  const marketIMG = (market) => {
    if (market === 'SZ') return IconSZ;
    if (market === 'SH') return IconSH;
    if (market === 'HK') return IconHK;
    if (market === 'US') return IconUS;
    return '';
  };

  useEffect(() => {
    if (userConfig) {
      const { language } = userConfig;
      setLang(language || 'zh-CN');
    }
  }, [userConfig]);

  const getSessionItem = () => {
    sessionStorageGetItem({ key: 'strategyInfo' }).then((res) => {
      if (res && res?.key && res?.value) {
        setData(res.value);
      }
    });
  };

  useEffect(() => {
    getSelfList();
    getSessionItem();

    pageOnShow(() => {
      getSelfList();
    });
  }, []);

  const tipDom = useMemo(() => {
    if (isLoading && !list.length) {
      return (
        <div styleName="loading-page">
          <Loading text="" />
        </div>
      );
    }
    if (!isLoading && !list.length) {
      return (
        <div styleName="empty-box">
          <Empty type="strategy" />
        </div>
      );
    }
    return null;
  }, [data]);

  return (
    <div styleName="selected-strategy-detail">
      <div styleName="full-content">
        <div styleName="head-top" style={{ top: `${+safeAreaTop}px` }}>
          <img styleName="back" src={IconBack} alt="" onClick={() => goBack()} />
          <div styleName="title" />
        </div>
        <div styleName="content">
          <div styleName="stock-info">
            <div styleName="title">{data?.name || ''}</div>
            <div styleName="text-box">
              <div styleName="text" onClick={() => setTextMore(!textMore)}>
                {textMore ? data?.desc : strIntercept(data?.desc)}
                <img styleName={textMore ? 'up' : ''} src={IconBot} alt="" />
              </div>
            </div>
          </div>
          <div styleName="sotck-box">
            <div styleName="relevant-stock">
              <div styleName="title">
                <div styleName="left">
                  {formatMessage({ id: 'related_stock' })}
                  <span>{formatMessage({ id: 'shares_in_total' }, { value: total || 0 })}</span>
                </div>
                <div styleName="right">{formatMessage({ id: 'stock_show_tip' })}</div>
              </div>
              <div styleName="stock-list">
                <div styleName="head">
                  <div styleName="item t1">{formatMessage({ id: 'stock_name' })}</div>
                  <div styleName="item t2">{formatMessage({ id: 'latest_price' })}</div>
                  <div styleName="item t3" onClick={() => sortClick()}>
                    {formatMessage({ id: 'day_accumulated_increase_and_decrease' })}
                    {sortType === 'default' && <img src={IconSortDefault} alt="" />}
                    {sortType === 'asc' && <img src={IconSortAsc} alt="" />}
                    {sortType === 'desc' && <img src={IconSortDesc} alt="" />}
                  </div>
                  <div styleName="item" />
                </div>
                <div styleName="stock-content">
                  <div styleName="item-box">
                    {
                      list && list.length ? list.map((item) => (
                        <div styleName="item" key={`${item.code}-${item.subMarket}`}>
                          <div styleName="info" onClick={() => goStock(item)}>
                            <div styleName="stock-name">{getStockName(item)}</div>
                            <div styleName="stock-code">
                              <img
                                styleName="icon-market"
                                src={marketIMG(getMarketCategoryTag(item?.subMarket))}
                                alt=""
                              />
                              {item.code}
                            </div>
                          </div>
                          <div
                            styleName="price"
                            className={
                              getClassNameByPriceChange(item?.RiseRate || 0)
                            }
                          >
                            {fixed(item.Price)}
                          </div>
                          <div styleName="rise-and-fall">
                            <div
                              styleName="day"
                              className={
                                getClassNameByPriceChange(item?.RiseRate || 0)
                              }
                            >
                              {dataFormat(item.RiseRate)}
                            </div>
                            <div
                              styleName="cumulative"
                              className={
                                getClassNameByPriceChange(item?.MonthRise || 0)
                              }
                            >
                              {dataFormat(item.MonthRise)}
                            </div>
                          </div>
                          <div styleName="optional">
                            {
                              isSelf(item) ? (
                                <img src={Iconqx} alt="" onClick={() => saveSelf(item)} />
                              ) : (
                                <img src={Iconzx} alt="" onClick={() => saveSelf(item)} />
                              )
                            }
                          </div>
                        </div>
                      )) : (
                        tipDom
                      )
                    }
                    <InfiniteScroll
                      hasMore={hasMore}
                      loadMore={async () => getList()}
                    >
                      {
                        list && list.length > 0 && !hasMore && (
                          <div styleName="not-more">
                            ~
                            {formatMessage({ id: 'notMore' })}
                            ~
                          </div>
                        )
                      }
                    </InfiniteScroll>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyHome;
