/* eslint-disable react/no-array-index-key */
import IconSvg from '@mobile/components/icon-svg';
import './stock-search.scss';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { editUrlParams } from '@/utils/navigate';
import { getMarketCategoryTag, search } from '@dz-web/quote-client';
import { DotLoading, Input, Popover } from 'antd-mobile';
import { useQuoteClient } from '@dz-web/quote-client-react';
import { debounce } from 'lodash-es';
import { useIntl } from 'react-intl';
import { TRADE_ROUTERS } from '../../mpa/modules/trade/routers';
import QuoteMarketTypeTag from '../quote-market-type-tag/quote-market-type-tag';
import useHotStock from '../../hooks/use-hot-stock';

interface IStockSearch {
  finance?: number;
  market: string;
  code: string;
  name: string;
  type?: string; // 交易买入卖出类型
  readOnly?: boolean; // 是否只读
  itemCallBack?: (m: string, c: string, n: string) => void; // 列表item点击回调
}

const defaultMarketScope = window.GLOBAL_CONFIG.QUOTES_CONFIG.searchGlobal;
const defaultBlockidlists = window.GLOBAL_CONFIG.QUOTES_CONFIG.blockidlists;

/** 股票搜索组件 */
const StockSearch = (props: IStockSearch) => {
  const { formatMessage } = useIntl();

  const { finance, market, code, name, type, readOnly, itemCallBack } = props;

  const navigate = useNavigate();

  const { isWsClientReady, wsClient } = useQuoteClient();

  const [visible, setVisible] = useState(false);

  const remak = useMemo(() => getMarketCategoryTag(market), [market]);

  const close = () => {
    if (visible) {
      setValue('');
      setVisible(false);
    }
  };

  useEffect(() => {
    document.querySelector('.trade')?.addEventListener('scroll', close);
    window.addEventListener('click', close);

    return () => {
      document.querySelector('.trade')?.removeEventListener('scroll', close);
      window.removeEventListener('click', close);
    };
  }, []);

  const [value, setValue] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchList, setSearchList] = useState<any[]>([]);

  const onSearch = useCallback(
    debounce((val, isReady) => {
      if (!val || !isReady) return;
      search(wsClient, {
        code: val,
        marketlists: defaultMarketScope,
        blockidlists: defaultBlockidlists,
      })
        .then((res) => {
          setSearchList(res);
        })
        .catch((err) => {
          console.log('全局搜索 error -> ', err);
          setSearchList([]);
        })
        .finally(() => {
          setSearchLoading(false);
        });
    }, 300),
    [wsClient],
  );

  useEffect(() => {
    setSearchLoading(true);
    onSearch(value, isWsClientReady);
  }, [value, isWsClientReady]);

  const inputRef = useRef<any>(null);
  const { hotStockList, fetchHotStock } = useHotStock();

  useEffect(() => {
    if (inputRef.current && visible) {
      fetchHotStock();
      inputRef.current.focus();
    }
  }, [visible]);

  const jumpStock = (m: number, c: string, n: string) => {
    try {
      if (itemCallBack) {
        itemCallBack(m.toString(), c, n);
      }
      if (type) {
        const url = editUrlParams(
          { market: String(m), code: c, name: n },
          type === 'B' ? TRADE_ROUTERS.BUY : TRADE_ROUTERS.SELL,
        );
        console.log(url, '===> callback');
        navigate(url, { replace: false });
      }
      close();
    } catch (err) {
      console.log({ market: m, code: c, name: n }, '---> callback search');
      console.log(err);
    }
  };

  const historyStockList = () => JSON.parse(localStorage.getItem('histort-stock-list') || '[]');

  const saveHistoryStock = (stock) => {
    const list = historyStockList().concat([stock]).slice(0, 10);
    localStorage.setItem('histort-stock-list', JSON.stringify(list));
  };

  return (
    <Popover
      styleName="search-pop"
      stopPropagation={['click']}
      placement="bottom"
      trigger="click"
      visible={visible}
      content={
        value.length > 0 ? (
          <div styleName="pop search-list">
            {searchLoading ? (
              <div styleName="hint-box">
                <DotLoading />
              </div>
            ) : (
              searchList.map((s, i) => {
                const codeDom = s.code.replace(value, `<span class="text-active">${value}</span>`);
                const isLast = searchList.length === i + 1;
                return (
                  <div
                    key={s.code}
                    onClick={() => {
                      jumpStock(s.market, s.code, s.sc_name);
                      saveHistoryStock(s);
                    }}
                  >
                    <div>
                      <div className="f-s-28">{s.sc_name}</div>
                      <div className="flex-l-c f-s-26 t-desc">
                        <QuoteMarketTypeTag market={s.market} />
                        <span dangerouslySetInnerHTML={{ __html: codeDom }} />
                      </div>
                    </div>
                    {!isLast && <div className="line m-y-20" />}
                  </div>
                );
              })
            )}
            {searchList.length < 1 && !searchLoading && (
              <div styleName="hint-box">
                {formatMessage({ id: 'no_data' })}
              </div>
            )}
          </div>
        ) : (
          <div styleName="pop">
            <div styleName="title-text">
              {formatMessage({ id: 'history_search' })}
            </div>
            <div styleName="history-list">
              {historyStockList().map((s, i) => (
                <div key={s.code} onClick={() => jumpStock(s.market, s.code, s.sc_name)}>
                  <div className="flex-l-c">
                    <QuoteMarketTypeTag market={s.market} />
                    {s.sc_name}
                  </div>
                  {i + 1 !== searchList.length && <div className="line m-y-20" />}
                </div>
              ))}
              {historyStockList().length < 1 && formatMessage({ id: 'no_data' })}
            </div>
            <div styleName="title-text">
              {formatMessage({ id: 'hot_today' })}
            </div>
            <div styleName="hot-list">
              {hotStockList.map((hotStock, i) => (
                <div key={hotStock.Code} onClick={() => jumpStock(hotStock.Market, hotStock.Code, hotStock.Name)}>
                  <div className="flex-l-c">
                    <QuoteMarketTypeTag market={hotStock.Market} />
                    {hotStock.Name}
                  </div>
                  {i + 1 !== searchList.length && <div className="line m-y-20" />}
                </div>
              ))}
              {hotStockList.length < 1 && formatMessage({ id: 'no_data' })}
            </div>
          </div>
        )
      }
    >
      <div
        styleName="stock-search"
        className="flex-between-center"
        onClick={(e) => {
          if (readOnly) return;
          setVisible(!visible);
          e.stopPropagation();
        }}
      >
        <div styleName="input-box">
          {!readOnly && <IconSvg path="icon_search" />}

          {visible ? (
            <Input
              ref={inputRef}
              styleName="input"
              placeholder={formatMessage({ id: 'please_enter_the_content' })}
              autoFocus
              readOnly={readOnly}
              value={value}
              onChange={(val) => {
                setValue(val);
              }}
            />
          ) : (
            <span styleName="stock-name">
              <span>{name}</span>
              <span>{code}</span>
              {remak && (
              <span>
                .
                {remak}
              </span>
              )}
            </span>
          )}
        </div>
        {/* TODO: 待接入 */}
        {/* {finance && finance > 0 && (
        <div styleName="stock-icon">
          <FormattedMessage id="融" />
          {finance}
          %
        </div>
        )} */}
      </div>
    </Popover>
  );
};

StockSearch.defaultProps = {
  finance: 0,
  readOnly: false,
  itemCallBack: undefined,
  type: undefined,
};

export default memo(StockSearch);
