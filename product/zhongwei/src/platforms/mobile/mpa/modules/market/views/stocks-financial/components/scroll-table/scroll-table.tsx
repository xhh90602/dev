import * as React from 'react';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
// import { useQuoteClient } from '@dz-web/quote-client-react';

import { userConfigContext } from '@/platforms/mobile/helpers/entry/native';
import { isRollTop } from '@/platforms/mobile/helpers/native/msg';
import { identifyIosSystem } from '@mobile/mpa/modules/market/utils/identify-ios-system';

// import { useClient } from '@/hooks/quote/client-context';
import { compareToClass } from '@/platforms/mobile/mpa/modules/market/utils/compare-to-class';
import { disableIosScroll } from '@/platforms/mobile/helpers/native/register';
import Loading from '@mobile/components/loading/loading';
import NoData from '@mobile/components/no-data/no-data';
// import LoadFail from '@mobile/components/load-fail/load-fail';
import { getFTenApiMethod } from '@/api/module-api/cbbc_outstanding_distribution';

import webViewScoll from '@mobile/mpa/modules/market/utils/web-view-scoll';
import NoMessage from '@/platforms/mobile/components/no-message/no-message';

import { dataTranform } from '../transform-data/func-tranform';
import './scroll-table.scss';

interface IParams {
  body: any;
  mf: number;
  key: string;
}

interface IProps {
  currency: string;
  params: IParams;
  sf: number;
  year: string;
  reportType: string;
}

const ScrollTable: React.FC<IProps> = ({ currency, params, sf, year, reportType }) => {
  const userConfig = useContext<any>(userConfigContext);
  // const { wsClient, isWsClientReady } = useQuoteClient();

  // const { client, isQuoteReady } = useClient();
  const { theme } = userConfig;
  const { formatMessage } = useIntl();
  const [dictObj, setDictObj] = useState<any>(null);
  const [disableScroll, setDisableScroll] = useState(false);
  const [dictData, setDictData] = useState([]);
  const [dataLoad, setDataLoad] = useState('');
  const [loadStatus, setLoadStatus] = useState('');
  const [financialData, setFnancialData] = useState<any>(null);
  const domRef = useRef<HTMLTableElement | null>(null);

  // 转换报表类型
  function transFormReport(report: string) {
    if (report === 'F') return formatMessage({ id: 'yearRate' });
    if (report === 'I') return formatMessage({ id: 'centerRate' });
    return report;
  }

  // 获取数据
  // const currentData = useMemo(() => {
  //   console.log('financialData::::', financialData);
  //   if (!year && !reportType) return financialData;
  //   if (year && !reportType) {
  //     return financialData?.filter((item) => item.myselfYear === year);
  //   }
  //   if (!year && reportType) {
  //     return financialData?.filter((item) => item.cover_month === reportType);
  //   }
  //   return financialData?.filter((item) => item.myselfYear === year && item.cover_month === reportType);
  // }, [financialData, year, reportType]);

  // function getTableData() {
  //   setLoadStatus('loading');
  //   const { body, mf } = params;
  //   console.log(body, sf, 'body');

  //   wsClient?.send({
  //     body,
  //     mf,
  //     req_id: '1',
  //     sf,
  //   }).then((res) => {
  //     console.log(res, '<---获取报表数据88888888888--->');
  //     const { body: { datas, industry_type: industryTypes } } = res;
  //     const typeDict = dictObj[sf];
  //     console.log(dictObj, sf, 'typeDict');

  //     const typeData = typeDict[`${industryTypes}`];
  //     console.log(typeData, '<____typeData');
  //     // 剔除3月和9月的数据
  //     const result = datas.filter((item) => {
  //       if (!item.sett_date_year) return item;
  //       const getDate = new Date(item.sett_date_year.replace(/-/g, '/'));
  //       const currentYear = getDate.getFullYear();
  //       const currentMouth = getDate.getMonth() + 1;
  //       item.fin_rpl_type = transFormReport(item.fin_rpl_type);
  //       item.myselfYear = currentYear;
  //       item.cover_month = currentMouth;
  //       if (currentMouth === 6 || currentMouth === 12) {
  //         return item;
  //       }
  //       return null;
  //     });
  //     console.log('typeData55555555555555555::::::', typeData);
  //     setLoadStatus('');
  //     setDictData(typeData);
  //     setFnancialData(result);
  //   }).catch((err) => {
  //     setLoadStatus('');
  //     setDataLoad('error');
  //     console.log(err, '<___<--获取财务数据失败');
  //   });
  // }

  /** http请求，上面注释调的是ws请求 */
  function getTableData() {
    setLoadStatus('loading');
    const { body } = params;
    const objValue = {
      trade_market: body?.tradeMarket,
      mode_code: sf,
      body: {
        stk_id: body?.stk_id,
        // eslint-disable-next-line no-nested-ternary
        rpl_type: Number(reportType) === 6 ? 'I' : Number(reportType) === 12 ? 'F' : '',
        year,
        language: userConfig.language,
      },
    };
    getFTenApiMethod(objValue)
      .then((res) => {
        const {
          result: { datas, industry_type: industryTypes },
        } = res;
        const typeDict = dictObj[sf];
        const typeData = typeDict[`${industryTypes}`];
        // 剔除3月和9月的数据
        const result = datas?.filter((item) => {
          if (!item?.sett_date_year) return item;
          const getDate = new Date(item?.sett_date_year?.replace(/-/g, '/'));
          const currentYear = getDate.getFullYear();
          const currentMouth = getDate.getMonth() + 1;
          item.fin_rpl_type = transFormReport(item.fin_rpl_type);
          item.myselfYear = currentYear;
          item.cover_month = currentMouth;
          if (currentMouth === 6 || currentMouth === 12) {
            return item;
          }
          return null;
        });
        setLoadStatus('');
        setDictData(typeData);
        setFnancialData(result);
      })
      .catch((err) => {
        setLoadStatus('');
        setDataLoad('error');
        console.log(err, '<___<--获取财务数据失败');
      });
  }

  function getTable() {
    return dictData?.map((item: any, index) => (
      <tr>
        <td>{item[formatMessage({ id: 'name' })]}</td>
        {financialData.length
          ? financialData.map((k) => {
            if (k[item.code]) {
              return (
                <td>
                  <span>{dataTranform(k[item.code], item.code)}</span>
                  <br />
                  <span className={compareToClass(k[`${item.code}_ratio`])}>
                    {k[`${item.code}_ratio`] ? `${k[`${item.code}_ratio`].toFixed(2)}%` : ''}
                  </span>
                </td>
              );
            }
            return <td>--</td>;
          })
          : index === 0 && (
            <td styleName="nodata" rowSpan={10}>
              <NoData text={formatMessage({ id: 'noData' })} theme={theme} />
            </td>
          )}
      </tr>
    ));
  }

  // useEffect(() => {
  //   if (!params || !isWsClientReady) return;
  //   const { body, mf } = params;
  //   wsClient
  //     ?.send({ body, mf, req_id: '1', sf: '9999' })
  //     .then((res) => {
  //       console.log('获取字典数据-------:::', res);
  //       const { body: dict } = res;
  //       setDictObj(dict);
  //     })
  //     .catch((err) => {
  //       console.log(err, '<___<---获取字典数据失败');
  //     });
  // }, [params, isWsClientReady]);

  // useEffect(() => {
  //   if (!dictObj) return;
  //   if (!isWsClientReady) return;

  //   getTableData();
  // }, [dictObj, sf, userConfig.language, isWsClientReady]);

  /** http请求，上面注释调的是ws请求 */
  useEffect(() => {
    if (!params) return;
    const { body } = params;
    getFTenApiMethod({
      trade_market: body?.tradeMarket,
      mode_code: 'S001',
      body: {
        language: userConfig.language,
      },
    })
      .then((res) => {
        const { result: dict } = res;
        setDictObj(dict);
      })
      .catch((err) => {
        console.log(err, '<___<---获取字典数据失败');
      });
  }, [params, sf, userConfig.language, year, reportType]);

  useEffect(() => {
    if (!dictObj) return;
    getTableData();
  }, [dictObj]);

  // 滚动
  useEffect(() => {
    if (!domRef.current) return null;
    const scrollDom = domRef.current;
    webViewScoll(scrollDom);
    const scrollHandle = () => {
      const { scrollTop } = scrollDom;
      if (scrollTop < 15 && identifyIosSystem) {
        isRollTop().then((r) => {
          // console.log(r);
        });
      }
    };
    scrollDom.addEventListener('scroll', scrollHandle);
    return () => {
      scrollDom.removeEventListener('scroll', scrollHandle);
    };
  }, [sf]);

  useEffect(() => {
    disableIosScroll(({ isScroll }) => {
      setDisableScroll(isScroll);
    });
  }, []);

  return (
    <div styleName="table-box" ref={domRef} style={{ overflow: disableScroll ? 'hidden' : 'scroll' }}>
      {loadStatus === 'loading' ? (
        <div styleName="loading">
          <Loading isLoading />
        </div>
      ) : (
        <>
          {dataLoad === 'error' && (
            <div styleName="error-box">
              {/* <LoadFail status="error" reloadCallback={() => getTableData()} /> */}
              <NoMessage />
            </div>
          )}
          {dataLoad !== 'error' && financialData && (
            <table cellSpacing="0">
              <thead>
                <tr>
                  <th>{formatMessage({ id: currency })}</th>
                  {financialData.map((k, index) => (
                    <th>{k.sett_date_year}</th>
                  ))}
                  {!financialData.length && <th />}
                </tr>
              </thead>
              <tbody>{getTable()}</tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};
export default ScrollTable;
