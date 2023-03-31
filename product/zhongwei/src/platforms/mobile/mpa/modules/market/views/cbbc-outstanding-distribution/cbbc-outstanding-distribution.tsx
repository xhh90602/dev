/* eslint-disable max-len */
import { useContext, useEffect, useState, useRef, useMemo } from 'react';
// import SelectDefault from '@pc/spa/views/quote/components/select-box/select-default';
import { useQuoteClient, useSubscribeSingleStockQuote } from '@dz-web/quote-client-react';
import { dateFormat } from '@dz-web/o-orange';
import dayjs from 'dayjs';
import { useSearchParam } from 'react-use';
import { FormattedMessage, useIntl } from 'react-intl';
import classNames from 'classnames';

// import { symbolInfoContext } from '@pc/spa/views/quote/views/symbol-info/contexts/symbol-info';

import './cbbc-outstanding-distribution.scss';

import { userConfigContext } from '@/platforms/mobile/helpers/entry/native';
import { Dropdown } from 'antd-mobile';
import { getClassNameByPriceChange } from '@dz-web/quote-client';
import { openNativePage, PageType, NativePages } from '@/platforms/mobile/helpers/native/msg';
import { searchStockCallback } from '@/platforms/mobile/helpers/native/register';
import { getBigMatketData } from '@/api/module-api/market';
import { getFTenApiMethod } from '@/api/module-api/cbbc_outstanding_distribution';
import downArrow from './images/arrows-down.svg';
import searchIcon from './images/search.svg';
import nullData from './images/null.svg';

enum BIG_FUN {
  F10 = 7,
}

enum F10_FUN {
  WARRANT_CBBC_INTERVAL = 14,
  WARRANT_CBBC_DISTRIBUTION = 15,
}

const carObj = {
  'zh-TW': {
    name: 'trName',
  },
  'zh-CN': {
    name: 'name',
  },
  'en-US': {
    name: 'enName',
  },
};

const CbbcDistribute: React.FC = () => {
  const userConfig = (useContext(userConfigContext) as any) || {};
  const { language } = userConfig;
  const { formatMessage } = useIntl();
  const { wsClient, isWsClientReady } = useQuoteClient();

  // const code = useSearchParam('code') || '';
  // const market = useSearchParam('market') || '';
  const [market, setMarket] = useState<any>(useSearchParam('market') || '');
  const [code, setCode] = useState<any>(useSearchParam('code') || '');
  // const { code, market } = useContext(symbolInfoContext);
  const [tradeDay, setTradeDay] = useState('');
  const [priceInterval, setPriceInterval] = useState(0);
  const [tradeDayList, setTradeDayList] = useState<null | any[]>(null);
  const [priceIntervalList, setPriceIntervalList] = useState<null | any[]>(null);
  const [proportion, setProportion] = useState<any>(null);
  const [bearList, setBearList] = useState<any>([]);
  const [bullList, setBullList] = useState<any>([]);
  const hasUnderlyingStock = useMemo(() => !!(market && code), [market, code]);
  const dropdownRef: any = useRef(null);
  const isStockPage = useSearchParam('isStockPage') || false;
  const [tradeMarket, setTradeMarket] = useState(null);

  // 当日收市价
  const [currentDatePrice, setCurrentDatePrice] = useState(0);

  /* 回收价区间 */
  // const getRecoveryInterval = () => {
  //   wsClient
  //     ?.send({
  //       body: { stk_id: code, language, date: tradeDay },
  //       mf: BIG_FUN.F10,
  //       sf: F10_FUN.WARRANT_CBBC_INTERVAL,
  //       req_id: '4',
  //     })
  //     .then((res) => {
  //       console.log('res66666666666::::', res);
  //       if (res.code === 0) {
  //         setPriceInterval(res.body[0]);
  //         const intervalList = res.body?.map((k) => ({ content: `${k}HKD`, value: k }));
  //         setPriceIntervalList(intervalList);
  //       }
  //     })
  //     .catch((err) => console.log(err, '<---获取回收价区间失败'));
  // };

  function renderOutstandingList(data: any[], isBull = false) {
    const maxAry: number[] = [];
    data.forEach((item) => {
      maxAry.push(Number(item.holdin));
    });
    const currentMax = Math.max(...maxAry);

    const text = isBull
      ? formatMessage({ id: 'add_up_to' })
      : `${formatMessage({ id: 'add_up_to' })}/${formatMessage({ id: 'heavy_cargo_area' })}`;
    return (
      <>
        <div styleName="outstanding-price-block">
          {data.map((item) => {
            const { left, right, idx } = item;
            return (
              <div key={`${left}-${right}-${idx}`} styleName="outstanding-price-list">
                {`${Number(left)}~${Number(right).toFixed(3)}`}
              </div>
            );
          })}
        </div>

        <div
          styleName={classNames('outstanding-recycle-block', {
            'outstanding-recycle-block--bull': isBull,
            'outstanding-recycle-block--bear': !isBull,
          })}
        >
          {/* <div styleName="outstanding-recycle-bar" style={{ width: `${width === 0 ? '1px' : `${width}%`}` }} /> */}
          {data.map((item) => {
            const { holdin, holdin_his: holdinHis, idx, width } = item;
            // console.log(width, 'width');
            // const ss = 100;
            return (
              <div key={`${holdin}-${idx}`} styleName="outstanding-recycle-list">
                <div styleName="outstanding-recycle-bar" style={{ width: `${width === 0 ? '1px' : `${width}%`}` }}>
                  {currentMax === Number(item.holdin) ? text : ''}
                </div>
                {holdin}
                {holdinHis}
              </div>
            );
          })}
        </div>
      </>
    );
  }

  const quote = useSubscribeSingleStockQuote(Number(market), code);

  const card = useMemo(() => {
    if (!language || !quote) return {};
    return {
      name: quote[carObj[language].name],
      now: quote.now,
      code: quote.code,
      priceRise: quote.priceRise,
      priceRiseRate: quote.priceRiseRate,
    };
  }, [language, quote, market, code]);

  // console.log(card, 'useSubscribeSingleStockQuote');

  /* 牛熊街货分布 */
  // const getDistributed = () => {
  //   wsClient
  //     ?.send({
  //       body: {
  //         interval_value: priceInterval,
  //         stk_id: code,
  //         language,
  //         date: tradeDay,
  //       },
  //       mf: BIG_FUN.F10,
  //       sf: F10_FUN.WARRANT_CBBC_DISTRIBUTION,
  //       req_id: '4',
  //     })
  //     .then((res) => {
  //       const {
  //         body: { bear, bull, bearRatio, bullRatio },
  //       } = res;

  //       // 熊-街货分布
  //       const bearArr = bear.map((item: any) => +item.holdin || 0);
  //       const bearTotal = Math.max.apply(null, bearArr);
  //       bear.forEach((item, index) => {
  //         item.idx = index;
  //         item.width = (+item.holdin && (item.holdin / bearTotal) * 100) || 0;
  //       });

  //       setBearList(bear);

  //       // 牛-街货分布
  //       const bullArr = bull.map((item: any) => +item.holdin || 0);
  //       const bullTotal = Math.max.apply(null, bullArr);
  //       bull.forEach((item, index) => {
  //         item.idx = index;
  //         item.width = (+item.holdin && (item.holdin / bullTotal) * 100) || 0;
  //       });
  //       setBullList(bull);

  //       setProportion({
  //         bearRatio,
  //         bullRatio,
  //       });
  //     })
  //     .catch((err) => console.log(err, '<---获取数据失败'));
  // };

  /* 牛熊街货分布 */
  const getDistributed = () => {
    const paramsObj = {
      trade_market: tradeMarket,
      mode_code: '4002',
      body: {
        stk_id: `${code}.hk`,
        date: tradeDay,
        interval_value: priceInterval,
      },
    };
    getFTenApiMethod(paramsObj)
      .then((res) => {
        const {
          result: { bear, bull, bearRatio, bullRatio },
        } = res;
        // 熊-街货分布
        const bearArr = bear.map((item: any) => +item.holdin || 0);
        const bearTotal = Math.max.apply(null, bearArr);
        bear.forEach((item, index) => {
          item.idx = index;
          item.width = (+item.holdin && (item.holdin / bearTotal) * 100) || 0;
        });
        setBearList(bear);
        // 牛-街货分布
        const bullArr = bull.map((item: any) => +item.holdin || 0);
        const bullTotal = Math.max.apply(null, bullArr);
        bull.forEach((item, index) => {
          item.idx = index;
          item.width = (+item.holdin && (item.holdin / bullTotal) * 100) || 0;
        });
        setBullList(bull);
        setProportion({
          bearRatio,
          bullRatio,
        });
      })
      .catch((err) => console.log(err, '<---获取数据失败--->'));
  };

  useEffect(() => {
    if (tradeDay && priceInterval) {
      getDistributed();
      const time = dayjs(tradeDay).format('YYYY-MM-DD 00:00:00');
      wsClient
        ?.send({
          body: {
            fields: [],
            market_id: market,
            code,
            period: 'day',
            adj_mode: '',
            mmk_combine_mode: '',
            time_range: [time, time],
          },
          mf: 100,
          sf: 23,
        })
        .then((res) => {
          console.log(res, '------------getKLine-----------');
          const {
            body: { fields, klines },
          } = res;
          const kLineObj: any = {};
          fields?.forEach((k, i) => {
            kLineObj[k] = klines[0][i];
          });
          setCurrentDatePrice(kLineObj.close);
        })
        .catch((err) => {
          console.log(err, '<--获取K线失败');
        });
    }
  }, [tradeDay, priceInterval, market, code]);

  /* 获取回收价区间 */
  // useEffect(() => {
  //   if (language && tradeDay) {
  //     getRecoveryInterval();
  //   }
  // }, [language, tradeDay, code, market]);

  /** 获取牛熊收回区间 */
  const getRecoveryInterval = (value) => {
    const params = {
      trade_market: value,
      mode_code: '4001',
      body: {
        stk_id: `${code}.hk`,
        date: tradeDay,
      },
    };
    getFTenApiMethod(params)
      .then((res) => {
        if (res.code === 0) {
          setPriceInterval(res.result[0]);
          const intervalList = res.result?.map((k) => ({ content: `${k}HKD`, value: k }));
          setPriceIntervalList(intervalList);
        }
      })
      .catch((err) => console.log(err, '<---获取回收价区间失败---->'));
  };

  // 获取大市场 trade_market
  useEffect(() => {
    if (language && tradeDay) {
      getBigMatketData([
        {
          code,
          smallMarket: market,
        },
      ])
        .then((res) => {
          if (!res) return;
          const { result } = res;
          const objValue = result[0];
          setTradeMarket(objValue?.tradeMarket);
          getRecoveryInterval(objValue?.tradeMarket);
        })
        .catch((err) => {
          console.log(err, '<---获取大市场失败---->');
        });
    }
  }, [market, code, language, tradeDay]);

  /* 获取交易日 */
  useEffect(() => {
    if (!isWsClientReady) return;
    const before30Day = +dayjs().subtract(30, 'day').format('YYYYMMDD');
    const nowData = +dayjs().format('YYYYMMDD');
    wsClient
      ?.send({
        sf: 3,
        mf: 100,
        body: { market_id: 2002, day_range: [before30Day, nowData] },
      })
      .then((res) => {
        const {
          body: { days },
        } = res;
        if (days?.length) {
          // 判断是不是交易日, days里面最后一条包含今天就去掉今天 isSame
          const data = `${days[days.length - 1]}`;
          const today = dayjs(new Date()).format('YYYYMMDD');
          const isToday = dayjs(data).isSame(today, 'day');
          if (isToday) {
            days.splice(days.length - 1);
          }
          const daysList = days.slice(days.length - 10);
          const temp = [];
          daysList.forEach((item) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            temp.push(dateFormat(`${item}`, 'yyyy-MM-dd', { isNoSignDate: true }));
          });
          // console.log(temp[temp.length - 1], 'temp[temp.length - 1] ==> temp[temp.length - 1]');
          setTradeDay(temp[temp.length - 1]);
          const tradeTemp = temp.map((k) => ({ content: k, value: k })).reverse();
          setTradeDayList(tradeTemp);
        }
      })
      .catch((err) => {
        console.log(err, '<---err');
      });
  }, [isWsClientReady, market, code]);

  function renderDropdownTitle(title: string, value: string) {
    return (
      <div styleName="dropdown-title">
        {title && <p styleName="dropdown-title-key">{title}</p>}
        {value && <p styleName="dropdown-title-value">{value}</p>}
      </div>
    );
  }

  const bottomMax = useMemo(() => {
    const ary: number[] = [];
    // const bullAry: number[] = [];
    // bearList.forEach((item) => {
    //   ary.push(Number(item.holdin));
    // });
    bullList.forEach((item) => {
      ary.push(Number(item.holdin));
    });

    return Math.max(...ary);
  }, [bearList, bullList]);

  /** 跟原生的app的交互 搜索 */
  const gotoSearch = () => {
    openNativePage({
      pageType: PageType.NATIVE,
      path: NativePages.SEARCH,
      replace: false,
      data: {
        callbackEvent: 'searchStockCallback',
        warrantAndCBBC: true,
      },
    });
  };

  useEffect(() => {
    // 注册事件，后 拿到跟app交互返回过来的参数，再去请求相关的接口
    searchStockCallback((res: any) => {
      setMarket(res?.market);
      setCode(res?.code);
      // window.location.href = `${window?.location.href}&market=${res?.market}&code=${res?.code}`;
    });
  }, []);

  return (
    <div styleName="page">
      {!(isStockPage === 'true') && !hasUnderlyingStock && (
        <>
          <div styleName="caption">
            <div styleName="search-box" onClick={() => gotoSearch()}>
              {/* <div styleName="search-box" onClick={() => console.log('warrantAndCBBC')}> */}
              {/* <img src={themeMode === 'dark' ? searchBlack : searchWhite} alt="" styleName="search-icon" /> */}
              <img src={searchIcon} alt="" styleName="search-icon" />
              <span>
                <FormattedMessage id="search_placehold" />
              </span>
            </div>
          </div>
          <div styleName="base">
            <img src={nullData} alt="" srcSet="" />
            <p>{formatMessage({ id: 'p1' })}</p>
            <p>{formatMessage({ id: 'p2' })}</p>
          </div>
        </>
      )}

      {hasUnderlyingStock && (
        // {hasUnderlyingStock && isStockPage === 'true' && (
        <>
          {/* 个股下面的牛熊街货分布 是没有这搜索按钮 */}
          {isStockPage === 'true' ? null : (
            <div styleName="card-wrap">
              <div styleName="card">
                <div styleName="card-left">
                  <div styleName="card-left-top">
                    <span styleName="top-left">{card?.name}</span>
                    <span>{card?.code}</span>
                  </div>
                  <div styleName="card-left-bottom">
                    <span styleName="bottom-left">{Number(card?.now || 0).toFixed(2)}</span>
                    <span>{Number(card?.priceRise || 0).toFixed(3)}</span>
                    <span>{`${Number(card?.priceRiseRate || 0).toFixed(2)}%`}</span>
                  </div>
                </div>

                <div styleName="card-right" onClick={() => gotoSearch()}>
                  <img src={searchIcon} alt="" styleName="card-right-icon" />
                </div>
              </div>
            </div>
          )}

          {/* <div styleName="content-warp"> */}
          <div styleName="condition">
            <Dropdown ref={dropdownRef} arrow={<img styleName="icon" src={downArrow} alt="" />}>
              <Dropdown.Item
                key="sorter1"
                title={renderDropdownTitle(formatMessage({ id: 'recovery_price_range' }), `${priceInterval}HKD`)}
              >
                <ol styleName="dropdown-list">
                  {priceIntervalList?.map((item) => (
                    <li
                      styleName={classNames('dropdown-item', {
                        'dropdown-item--active': priceInterval === item,
                      })}
                      key={`${item}`}
                      onClick={() => {
                        setPriceInterval(item.value);
                        dropdownRef?.current?.close();
                      }}
                    >
                      {item.content}
                    </li>
                  ))}
                </ol>
              </Dropdown.Item>

              <Dropdown.Item key="bizop" title={renderDropdownTitle('', tradeDay)}>
                <ol styleName="dropdown-list" className="special-list">
                  {tradeDayList?.map((item) => (
                    <li
                      styleName={classNames('dropdown-item', {
                        'dropdown-item--active': tradeDay === item,
                      })}
                      key={item}
                      onClick={() => {
                        setTradeDay(item.value);
                        dropdownRef?.current?.close();
                      }}
                    >
                      {item.content}
                    </li>
                  ))}
                </ol>
              </Dropdown.Item>
            </Dropdown>
          </div>
          <div styleName="content">
            <div styleName="padding-side">
              <div styleName="name-side">
                <span styleName="side-title">
                  <FormattedMessage id="outstanding_distribution" />
                </span>

                <span styleName="content-update-time">
                  <span>{dayjs(tradeDay).format('YYYY/MM/DD') || ''}</span>
                  <FormattedMessage id="update_time" />
                </span>
              </div>

              <div styleName="percentage">
                <div styleName="percentage-bull" style={{ width: `${proportion?.bullRatio || '50%'}` }} />
                <div styleName="percentage-bear" style={{ width: `${proportion?.bearRatio || '50%'}` }} />
              </div>

              <div styleName="lengend">
                <div className={getClassNameByPriceChange(1)}>
                  <span>
                    <FormattedMessage id="bull" />
                  </span>
                  <span styleName="legend-right">{`${proportion?.bullRatio || 0}`}</span>
                </div>
                <div className={getClassNameByPriceChange(-1)}>
                  <span>
                    <FormattedMessage id="bear" />
                  </span>
                  <span styleName="legend-right">{`${proportion?.bearRatio || 0}`}</span>
                </div>
              </div>
            </div>

            {/* Y轴：收回价，X轴：相对股份数（万股），[ ]内代表一日变化量 */}
            <p styleName="content-intro">
              <FormattedMessage id="x_y_zhou" />
            </p>

            <div styleName="padding-side outstanding-block">{renderOutstandingList(bearList)}</div>

            {/* 当日收市价 */}
            <p styleName="close-price">
              <FormattedMessage id="today_close_price" />
              {/* {toPlaceholder(toFixed(currentDatePrice, dec))} */}
              <span styleName="close-price-right">{currentDatePrice.toFixed(3)}</span>
            </p>

            <div styleName="padding-side outstanding-block">{renderOutstandingList(bullList, true)}</div>

            <div styleName="padding-side bottom">
              <div styleName="bottom-left" />
              <div styleName="bottom-right">
                <span>0</span>
                <span>{Math.floor(bottomMax / 2)}</span>
                <span>{Math.floor(bottomMax) * 1.3}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
    // </div>
  );
};
export default CbbcDistribute;
