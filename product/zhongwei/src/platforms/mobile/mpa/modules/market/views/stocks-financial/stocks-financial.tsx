import React, { useContext, useEffect, useRef, useState } from 'react';
// import { useQuoteClient } from '@dz-web/quote-client-react';
import { Dropdown } from 'antd-mobile';
import { FormattedMessage, useIntl } from 'react-intl';

import StockDetailTabs from '@mobile/mpa/modules/market/components/stock-detail-tabs/stock-detail-tabs';
import { parseUrlBySearch } from '@dz-web/o-orange';
import { IUserConfig } from '@mobile/hooks/use-init-native';
import { userConfigContext } from '@/platforms/mobile/helpers/entry/native';
import { getBigMatketData } from '@/api/module-api/market';
import { getFTenApiMethod } from '@/api/module-api/cbbc_outstanding_distribution';
import HandleParams from '@mobile/mpa/modules/market/utils/handle-params';
import { getFinancialTabData } from '@mobile/mpa/modules/market/constants';
// import { useClient } from '@/platforms/mobile/hooks/quote/client-context';
import ScrollTable from './components/scroll-table/scroll-table';

import './stocks-financial.scss';

interface tabItem {
  value: number;
  label: string;
}

const reportArr = [
  { content: 'all', key: '' },
  { content: 'year', key: 12 },
  { content: 'center', key: 6 },
];

// const reportArr = [
//   { content: 'all', key: '' },
//   { content: 'year', key: 'F' },
//   { content: 'center', key: 'I' },
// ];

const StocksFinancial: React.FC = () => {
  const userConfig = useContext<IUserConfig>(userConfigContext);
  // const { client, isQuoteReady } = useClient();
  const [tabData, setTabData] = useState<tabItem[]>([]);
  const [params, setParams] = useState<any>(null);
  const [tabIndex, setTabIndex] = useState(''); // 索引
  const [yearArr, setYearArr] = useState([]);
  const [yearName, setYearName] = useState('selectYear'); // 年份 state
  const [reportName, setReportName] = useState('selectPort'); // 报表类型 state
  const [reportState, setReportState] = useState('');
  const [tradeMarket, setTradeMarket] = useState(null);

  const [year, setYear] = useState('');

  const DrowRef: any = useRef(null);
  const currencyRef = useRef('');

  // const { wsClient, isWsClientReady } = useQuoteClient();
  const { formatMessage } = useIntl();

  function getValue(val: any) {
    setTabIndex(val);
  }

  /** 选择年份 */
  function swictYear(item) {
    setYear(item.key);
    setYearName(item.content);
    DrowRef.current.close();
  }

  /** 选择报表类型 */
  function swicthStatement(item) {
    setReportName(item.content);
    setReportState(item.key);
    DrowRef.current.close();
  }

  // 获取大市场
  // useEffect(() => {
  //   getBigMatketData([
  //     {
  //       code: parseUrlBySearch('code') || '00700',
  //       smallMarket: parseUrlBySearch('market') || '2002',
  //     },
  //   ])
  //     .then((res) => {
  //       if (!res) return;
  //       const { result } = res;
  //       console.log('dddddddddd:::', res);
  //       const obj = result[0];
  //       const finalParam = HandleParams({ ...obj, lan: userConfig.language });
  //       const { key } = finalParam;
  //       currencyRef.current = key;

  //       setTabData(getFinancialTabData(key));
  //       setTabIndex(getFinancialTabData(key)[0].value);
  //       setParams(finalParam);
  //     })
  //     .catch((err) => {
  //       console.log(err, '<___获取大市场失败');
  //     });
  // }, [userConfig.language]);

  /* 获取当前股票报表年份数组 */
  // useEffect(() => {
  //   // console.log(params, isWsClientReady, 'isWsClientReady');

  //   if (!params || !isWsClientReady) return;
  //   const { body, mf } = params;

  //   wsClient
  //     ?.send({
  //       body,
  //       mf,
  //       req_id: '1',
  //       sf: 67,
  //     })
  //     .then((res) => {
  //       console.log('----------222222222222res------------', res);
  //       const { body: bodyArr } = res;
  //       const result = bodyArr.map((item) => ({ key: +item, content: `${item}年` }));
  //       result.unshift({ key: '', content: '全部' });
  //       setYearArr(result);
  //     })
  //     .catch((err) => {
  //       console.log(err, '<___获取年份数组失败');
  //     });
  // }, [isWsClientReady, params]);

  // 获取大市场 trade_market
  useEffect(() => {
    if (userConfig.language) {
      getBigMatketData([
        {
          code: parseUrlBySearch('code'),
          // code: parseUrlBySearch('code') || '00700',
          smallMarket: parseUrlBySearch('market'),
          // smallMarket: parseUrlBySearch('market') || '2002',
        },
      ])
        .then((res) => {
          if (!res) return;
          const { result } = res;
          const objValue = result[0];
          setTradeMarket(objValue?.tradeMarket);

          const finalParam = HandleParams({ ...objValue, tradeMarket: objValue.tradeMarket, lan: userConfig.language });
          const { key } = finalParam;
          currencyRef.current = key;

          setTabData(getFinancialTabData(key));
          setTabIndex(getFinancialTabData(key)[0].value);
          setParams(finalParam);
        })
        .catch((err) => {
          console.log(err, '<---获取大市场失败---->');
        });
    }
  }, [userConfig.language]);

  /** 获取年份数组 */
  useEffect(() => {
    if (!params) return;
    const { body } = params;
    const objValue = {
      trade_market: body?.tradeMarket,
      mode_code: 'S002',
      body: {
        stk_id: body?.stk_id,
      },
    };
    getFTenApiMethod(objValue)
      .then((res) => {
        const { result: bodyArr } = res;
        const result = bodyArr.map((item) => ({ key: +item, content: `${item}年` }));
        result.unshift({ key: '', content: '全部' });
        setYearArr(result);
      })
      .catch((err) => {
        console.log(err, '<___获取年份数组失败');
      });
  }, [params, tradeMarket]);

  return (
    <div styleName="page-wrapper">
      <div styleName="tab-box">
        <StockDetailTabs tabData={tabData} onChange={(value) => getValue(value)} />
      </div>
      {!!tabData.length && (
        <div styleName="dropdown-wrap">
          {tabIndex === '1' && params && params.key === 'USA' ? null : (
            <Dropdown ref={DrowRef}>
              <Dropdown.Item key="sorter" title={formatMessage({ id: yearName })} destroyOnClose>
                <div styleName="drop-wrap">
                  {yearArr.map((item: any) => (
                    <li
                      styleName={year === item.key ? 'selected' : ''}
                      onClick={() => swictYear(item)}
                      key={item.content}
                    >
                      {item.content}
                    </li>
                  ))}
                </div>
              </Dropdown.Item>
              <Dropdown.Item key="bizop" title={formatMessage({ id: reportName })}>
                <div styleName="drop-wrap">
                  {reportArr.map((item) => (
                    <li
                      styleName={reportState === item.key ? 'selected' : ''}
                      onClick={() => swicthStatement(item)}
                      key={item.content}
                    >
                      <FormattedMessage id={item.content} />
                    </li>
                  ))}
                </div>
              </Dropdown.Item>
            </Dropdown>
          )}
        </div>
      )}
      <div styleName="table-wrap">
        <ScrollTable
          currency={currencyRef.current}
          params={params}
          year={year}
          sf={+tabIndex}
          reportType={reportState}
        />
      </div>
    </div>
  );
};

export default StocksFinancial;
