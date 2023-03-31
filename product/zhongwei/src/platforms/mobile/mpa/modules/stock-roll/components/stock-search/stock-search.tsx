/* eslint-disable react/no-danger */
/* eslint-disable react/no-array-index-key */
import IconSvg from '@mobile/components/icon-svg';
import './stock-search.scss';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getMarketCategoryTag, search } from '@dz-web/quote-client';
import { DotLoading, Input, Popover } from 'antd-mobile';
import { useQuoteClient } from '@dz-web/quote-client-react';
import QuoteMarketTypeTag from '@/platforms/mobile/components/quote-market-type-tag/quote-market-type-tag';
import { debounce } from 'lodash-es';
import { FormattedMessage, useIntl } from 'react-intl';

interface IStockSearch {
  market: string;
  code: string;
  name: string;
  stockMarket: string;
  placeholder?: string;
  readOnly?: boolean; // 是否只读
  parentDOM?: HTMLElement,
  itemCallBack?: (m: string, c: string, n: string) => void; // 列表item点击回调
}

const defaultMarketScope = window.GLOBAL_CONFIG.QUOTES_CONFIG.searchGlobal;
const defaultBlockidlists = window.GLOBAL_CONFIG.QUOTES_CONFIG.blockidlists;

/** 股票搜索组件 */
const StockSearch = (props: IStockSearch) => {
  const { formatMessage } = useIntl();

  const {
    placeholder = formatMessage({ id: 'please_enter' }) + formatMessage({ id: 'search_content' }),
    market,
    code,
    name,
    stockMarket,
    readOnly,
    itemCallBack,
    parentDOM,
  } = props;

  const { isWsClientReady, wsClient } = useQuoteClient();

  const [visible, setVisible] = useState(false);

  const remak = useMemo(() => getMarketCategoryTag(market), [market]);

  const isHasValue = useMemo(() => market && code && name, [market, code, name]);

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
          setSearchList(
            res.filter((item) => {
              const marketText = getMarketCategoryTag(item.market)?.toLocaleLowerCase();
              if (!marketText) return true;
              console.log('marketText:', marketText);

              return stockMarket === 'hk' ? marketText === stockMarket : ['sz', 'sh'].includes(marketText);
            }),
          );
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

  useEffect(() => {
    if (inputRef.current && visible) {
      inputRef.current.focus();
    }
  }, [visible]);

  const jumpStock = (m: number, c: string, n: string) => {
    try {
      if (itemCallBack) {
        console.log('itemCallBack', itemCallBack);
        itemCallBack(m.toString(), c, n);
      }
      close();
    } catch (err) {
      console.log({ market: m, code: c, name: n }, '---> callback search');
      console.log(err);
    }
    close();
  };

  return (
    <Popover
      styleName="search-pop"
      stopPropagation={['click']}
      content={(
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
                  }}
                >
                  <div className="f-s-28">{s.sc_name}</div>
                  <div className="flex-l-c f-s-26 t-desc">
                    <QuoteMarketTypeTag market={s.market} />
                    <span dangerouslySetInnerHTML={{ __html: codeDom }} />
                  </div>
                  {!isLast && <div className="line m-y-20" />}
                </div>
              );
            })
          )}
          {searchList.length < 1 && !searchLoading && (
            <div styleName="hint-box">
              <FormattedMessage id="no_data" />
            </div>
          )}
        </div>
      )}
      placement="bottom"
      trigger="click"
      visible={visible}
      getContainer={() => parentDOM || document.body}
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
          {isHasValue && !visible ? (
            <div styleName="stock-name">
              <span>{name}</span>
              <span>{code}</span>
              {remak && (
              <span>
                .
                {remak}
              </span>
              )}
            </div>
          ) : (
            <Input
              ref={inputRef}
              styleName="input"
              placeholder={placeholder}
              readOnly={readOnly}
              value={value}
              autoFocus
              onChange={(val) => {
                setValue(val);
              }}
            />
          )}
          <IconSvg path="icon_search" />
        </div>
      </div>
    </Popover>
  );
};

StockSearch.defaultProps = {
  readOnly: false,
  itemCallBack: undefined,
  placeholder: undefined,
  parentDOM: document.body,
};

export default memo(StockSearch);
