import React, { useContext, useState, useEffect, useMemo, useRef } from 'react';
import { useQuoteClient, useSubscribeStockListQuote } from '@dz-web/quote-client-react';
import {
  getMarketCategoryTag,
  MARKET_TYPE_TAG,
  search,
  querySnapshot,
  QUOTE_CATEGORY_FIELD,
} from '@dz-web/quote-client';
import { useSearchParam } from 'react-use';
import { useIntl } from 'react-intl';
import { Popover, SearchBar, Toast } from 'antd-mobile';
import { userConfigContext } from '@/platforms/mobile/helpers/entry/native';
import { nativeOpenPage } from '@/platforms/mobile/helpers/native/url';
import HeadTop from '@/platforms/mobile/components/combination/head-top';
import { addStockApi } from '@/platforms/mobile/mpa/modules/combination/view/add-stock/common';
import {
  goBack,
  sessionStorageSetItem,
  sessionStorageGetItem,
  sessionStorageRemoveItem,
  goToSymbolPage,
} from '@/platforms/mobile/helpers/native/msg';
import { pageOnShow } from '@/platforms/mobile/helpers/native/register';
import Empty from '@/platforms/mobile/components/combination/empty';
import IconSearch from '@/platforms/mobile/images/icon_search_01.svg';
import debounce from 'lodash-es/debounce';
import IconSZ from '@/platforms/mobile/images/icon_SZ.svg';
import IconSH from '@/platforms/mobile/images/icon_SH.svg';
import IconHK from '@/platforms/mobile/images/icon_HK.svg';
import IconUS from '@/platforms/mobile/images/icon_US.svg';
import IconDel from '@/platforms/mobile/images/icon_stock_del.svg';
import IconAdd from '@/platforms/mobile/images/icon_add_01.svg';
import IconStockDel from '@/platforms/mobile/images/icon_del_01.svg';
import { getSelf } from '@/api/module-api/combination';
import { useGetState } from 'ahooks';
import './add-stock-filter.scss';

const marketTypeTag = {
  [MARKET_TYPE_TAG.hk]: IconHK,
  [MARKET_TYPE_TAG.sh]: IconSH,
  [MARKET_TYPE_TAG.sz]: IconSZ,
  [MARKET_TYPE_TAG.us]: IconUS,
};

const currency = {
  HK: 'HKD',
  US: 'USD',
  CN: 'CNY',
  SH: 'CNY',
  SZ: 'CNY',
};

const defaultMarketScope = window.GLOBAL_CONFIG.QUOTES_CONFIG.searchGlobal;
const defaultBlockidlists = window.GLOBAL_CONFIG.QUOTES_CONFIG.blockidlists;

const AddStock: React.FC = () => {
  const safeAreaTop = Number(useSearchParam('safeAreaTop')) || 0;
  const portfolioId = Number(useSearchParam('portfolioId')) || 0;
  const source = String(useSearchParam('source')) || 'zuhe'; // 组合 || 策略
  const [stockList, setStockList, getStockList] = useGetState<any>([]);
  const [searchList, setSearchList] = useState<any>([]);
  const [searchVisible, setSearchVisible] = useState<boolean>(false);
  const [keyword, setKeyword] = useState('');
  const [groupType, setGroupType] = useState<string | number>('ALL');
  const [formatSelfStockList, setFormatSelfStockList] = useState<any>([]);
  const [selfStockList, setSelfStockList] = useState<any>([]);
  const { wsClient, isWsClientReady }: any = useQuoteClient();
  const userConfig = useContext<any>(userConfigContext);
  const [lang, setLang] = useState<string>('zh-CN');
  const cardRef = useRef(null);
  const { formatMessage } = useIntl();

  // 判断是否已经加入了股票
  const stockIdx = (item) => stockList.findIndex((ele) => ele.code === item.code && ele.market === item.market);

  // 添加股票
  const addStock = (item) => {
    const idx = stockIdx(item);
    const list: any = [...getStockList()];
    // 组合
    if (source.indexOf('zuhe') > -1) {
      if (idx > -1) {
        list.splice(idx, 1);
      } else {
        list.push(item);
      }
    }
    // 策略
    if (source.indexOf('pk') > -1) {
      if (stockList.length === 0 || stockList[0].market === item.market) {
        if (stockList.length < 4) {
          if (idx > -1) {
            list.splice(idx, 1);
          } else {
            list.push(item);
          }
          sessionStorageSetItem({ key: 'stockList', value: list }); // 只有策略才缓存
        } else {
          Toast.show({ content: formatMessage({ id: 'add_stock_market_length' }) }); // 最多添加4只股票
        }
      } else {
        Toast.show({ content: formatMessage({ id: 'add_stock_market_tip' }) }); // 只能添加相同市场的股票
      }
    }
    setStockList([...list]);
  };

  // 移除已添加的股票
  const removeStock = (item) => {
    const idx = stockIdx(item);
    if (idx > -1) {
      const list = [...getStockList()];
      list.splice(idx, 1);
      setStockList([...list]);
      if (source.indexOf('pk') > -1) {
        sessionStorageSetItem({ key: 'stockList', value: list });
      }
    }
  };

  // 搜索关键字change事件
  let func: any = null;
  const searchChange = (v) => {
    setSearchVisible(!!v);
    if (!func) {
      func = debounce(setKeyword, 800);
    }
    func(v);
  };

  // 自选股格式化
  const selfFormat = (list) => {
    const temp: any = [];
    if (list && list.length) {
      list.forEach((item) => {
        if (item.delistingDate === 0) {
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
      setSelfStockList(temp);
    } else {
      setSelfStockList([]);
    }
  };

  // 相关股票-行情
  useSubscribeStockListQuote(async (client: any): any => {
    const tempList = formatSelfStockList.filter((item) => {
      if (item.isDefault) {
        return item.type === groupType;
      }
      return item.id === groupType;
    })[0].stocks;
    if (tempList && tempList.length) {
      const symbols: any[] = tempList.map((item) => [item.marketCode, item.stockCode]);
      const list = await querySnapshot(client, {
        symbols,
        fields: [QUOTE_CATEGORY_FIELD.INFO, QUOTE_CATEGORY_FIELD.QUOTE],
      });
      selfFormat(list);
      return null;
    }
    setSelfStockList([]);
    return null;
  }, [formatSelfStockList, groupType]);

  // 跳转到选股器
  const stockPickerClick = () => {
    let url = `add-stock.html?source=${source}`;
    if (portfolioId) {
      url += `&portfolioId=${portfolioId}`;
    }
    nativeOpenPage(url, true);
  };

  // 获取自选股
  const getOptional = () => {
    getSelf({}).then((res: any) => {
      if (res && res.code === 0 && res?.result && res?.result.length) {
        const firstData = res?.result[0];
        const typeId = firstData.isDefault ? firstData.type : firstData.id;
        setGroupType(typeId);
        setFormatSelfStockList(res.result || []);
      } else {
        setSelfStockList([]);
      }
    }).catch((err) => {
      setSelfStockList([]);
      Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err.message}` });
    });
  };

  useEffect(() => {
    if (!keyword || !isWsClientReady) return;
    search(wsClient, {
      code: keyword,
      marketlists: defaultMarketScope,
      blockidlists: defaultBlockidlists,
    })
      .then((res) => {
        setSearchList(res);
      })
      .catch((err) => {
        console.log('搜索接口 Error =>', err);
        setSearchList([]);
      });
  }, [keyword, isWsClientReady]);

  // 获取市场
  const getMarketIMG = (market) => marketTypeTag[getMarketCategoryTag(market) || ''];

  // 获取语言
  useEffect(() => {
    if (userConfig) {
      const { language } = userConfig;
      setLang(language || 'zh-CN');
    }
  }, [userConfig]);

  useEffect(() => {
    getOptional();
    if (source !== 'zuhe') {
      sessionStorageGetItem({ key: 'stockList' }).then((res) => {
        if (res && res?.key && res?.value) {
          setStockList(res?.value || []);
        }
      });
      pageOnShow(() => {
        sessionStorageGetItem({ key: 'stockList' }).then((res) => {
          if (res && res?.key && res?.value) {
            setStockList(res?.value || []);
          }
        });
      });
    }
  }, []);

  // 搜索放大镜icon
  const iconSearch = () => (<img styleName="icon-search" src={IconSearch} alt="" />);

  // 股票保存到组合
  const addStockToCombination = async () => {
    const res = await addStockApi(stockList, portfolioId);
    if (res && res.code === 0) {
      Toast.show({ content: formatMessage({ id: 'add_success' }) });
      setTimeout(() => {
        nativeOpenPage(`simulate-combination-adjustment.html?portfolioId=${portfolioId}&source=zuhe`, true);
      }, 1200);
    } else {
      Toast.show({ content: res.message });
    }
  };

  // 点击返回
  const backCallback = () => {
    if (source === 'zuhe') {
      nativeOpenPage(`simulate-combination-adjustment.html?portfolioId=${portfolioId}&source=zuhe`, true);
    } else {
      goBack();
    }
  };

  // 点击完成
  const completeClick = () => {
    if (getStockList().length) {
      if (source === 'zuhe') {
        sessionStorageRemoveItem({ key: 'stockList' });
        addStockToCombination();
      }
      if (source === 'celue') {
        goBack();
      }
      if (source === 'pk') {
        goBack();
      }
    }
  };

  const goStock = ({ marketId, code }) => {
    goToSymbolPage({ market: marketId, code });
  };

  // 判断选择的是哪个自选分类
  const selfType = (item) => {
    if (item.isDefault) {
      return item.type;
    }
    return item.id;
  };

  // 搜索下拉列表
  const popoverDom = useMemo(() => {
    if (searchList && searchList.length) {
      return (
        <div styleName="stock-list-box">
          {
            searchList.map((item: any) => {
              if (item.is_delisting !== 1) {
                const { code, market: marketId, sc_name: cnName, tc_name: twName } = item;
                const name = lang === 'zh-CN' ? cnName : twName;
                const marketText = getMarketCategoryTag(marketId) || '';
                const market = marketText === 'SH' || marketText === 'SZ' ? 'CN' : marketText;
                return (
                  <div styleName="item" key={`${code}-${marketId}`}>
                    <div styleName="l">
                      <div styleName="name">{name}</div>
                      <div styleName="market-code">
                        <img styleName="market" src={getMarketIMG(marketId)} alt="" />
                        <div styleName="code">{code}</div>
                      </div>
                    </div>
                    <img
                      styleName="add-stock"
                      src={stockIdx({ name, code, market }) === -1 ? IconAdd : IconStockDel}
                      alt=""
                      onClick={() => addStock({ name, code, market, marketId, currencyCode: currency[market] })}
                    />
                  </div>
                );
              }
              return null;
            })
          }
        </div>
      );
    }
    return (
      <div styleName="empty-box">
        <Empty text={formatMessage({ id: 'not_search' })} />
      </div>
    );
  }, [searchList, stockList]);

  // 分类筛选
  const groupFilter = useMemo(() => {
    if (formatSelfStockList && formatSelfStockList.length) {
      return formatSelfStockList.filter((item) => !(item.isDefault && item.name === '基金'));
    }
    return [];
  }, [formatSelfStockList]);

  return (
    <div styleName="add-stock" style={{ paddingTop: `${+safeAreaTop}px` }}>
      <HeadTop
        isData={getStockList().length}
        title={formatMessage({ id: 'add_stock_text' })}
        headType="add-stock"
        backCallback={() => backCallback()}
        completeCallback={() => completeClick()}
      />
      <div styleName="add-stock-content">
        <div styleName="search-box" ref={cardRef}>
          <Popover
            visible={searchVisible}
            content={popoverDom}
            getContainer={cardRef.current}
            placement="bottom-start"
            trigger="click"
          >
            <SearchBar
              icon={iconSearch()}
              style={{
                '--border-radius': '8px',
                '--background': '#F7F8FC',
                '--height': '36px',
                '--padding-left': '12px',
              }}
              placeholder={formatMessage({ id: 'search_tip_text' })}
              onChange={(v) => searchChange(v)}
            />
          </Popover>

          <div styleName="search-result-box">
            {
              source !== 'zuhe' ? (
                <div styleName="left">
                  {formatMessage({ id: 'selected' })}
                  <span>{`${(stockList && stockList.length) || 0}/4`}</span>
                  {formatMessage({ id: 'selected_text' })}
                </div>
              ) : (
                <div styleName="left">
                  {formatMessage({ id: 'selected' })}
                  <span>{`${(stockList && stockList.length) || 0}`}</span>
                  {formatMessage({ id: 'self_selected' })}
                </div>
              )
            }
            <div
              styleName="right"
              onClick={() => stockPickerClick()}
            >
              {formatMessage({ id: 'stock_picker' })}
            </div>
          </div>
        </div>
        {
          stockList && stockList.length ? (
            <div styleName="selected-stock-list">
              <div styleName="selected-stock-list-box">
                <div styleName="item-box">
                  {
                    stockList.map((item) => (
                      <div styleName="item active" key={`${item.code}-${item.marketId}`}>
                        <img styleName="close" src={IconDel} alt="" onClick={() => removeStock(item)} />
                        <div styleName="name" onClick={() => goStock(item)}>{item.name}</div>
                        <div styleName="market-code" onClick={() => goStock(item)}>
                          <img styleName="market" src={getMarketIMG(item.marketId)} alt="" />
                          <div styleName="code">{item.code}</div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          ) : <div styleName="bt1" />
        }
        <div styleName="my-choice">
          <div styleName="title">{formatMessage({ id: 'my_choice' })}</div>
          <div styleName="type-list">
            <div styleName="type-list-box">
              {
                groupFilter.map((item) => (
                  <div
                    key={`${item.id}-${item.orderNo}-${item.type}-${item.name}-${item.isDefault}`}
                    styleName={groupType === selfType(item) ? 'item active' : 'item'}
                    onClick={() => setGroupType(selfType(item))}
                  >
                    {item.name}
                  </div>
                ))
              }
            </div>
          </div>
        </div>
        <div styleName="stock-list">
          {
            selfStockList && selfStockList.length ? (
              <>
                <div styleName="title">{formatMessage({ id: 'name_code' })}</div>
                <div styleName="stock-list-box">
                  {
                    selfStockList.map((item) => (
                      <div styleName="item" key={`${item.code}-${item.marketId}`}>
                        <div styleName="l" onClick={() => goStock(item)}>
                          <div styleName="name">{item.name}</div>
                          <div styleName="market-code">
                            <img styleName="market" src={getMarketIMG(item.marketId)} alt="" />
                            <div styleName="code">{item.code}</div>
                          </div>
                        </div>
                        <img
                          styleName="add-stock"
                          src={stockIdx(item) === -1 ? IconAdd : IconStockDel}
                          alt=""
                          onClick={() => addStock(item)}
                        />
                      </div>
                    ))
                  }
                </div>
              </>
            ) : (
              <div styleName="empty-box">
                <Empty text={formatMessage({ id: 'not_self_stock' })} />
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default AddStock;
