import * as React from 'react';
import { useContext, useEffect, useState, useRef } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
// import { useQuoteClient } from '@dz-web/quote-client-react';
import { getFTenApiMethod } from '@/api/module-api/cbbc_outstanding_distribution';

import Loading from '@mobile/components/loading/loading';
import { identifyIosSystem } from '@/platforms/mobile/mpa/modules/market/utils/identify-ios-system';
import webViewScoll from '@/platforms/mobile/mpa/modules/market/utils/web-view-scoll';
import { dateTransformSymbol } from '@/platforms/mobile/mpa/modules/market/utils/date-transform-symbol';
import { userConfigContext } from '@mobile/helpers/entry/native';
import NoData from '@mobile/components/no-data/no-data';
import { isRollTop } from '@mobile/helpers/native/msg';

import TableInfo from '../../../../components/table-info/table-info';
import './ETF-situation.scss';

interface IBasicData {
  cus_name?: string;
  dividend_policy?: string;
  fun_name?: string;
  invest_point?: string;
  list_date?: string;
  manage_assets_amount_etf?: number;
  name?: string;
  relate_ind?: string;
  relate_market?: string;
}

interface IParam {
  body: any;
  mf: number;
}

interface IProps {
  params: IParam;
}

const divideHead = [
  {
    Header: 'Solution',
    accessor: 'detail',
  },
  {
    Header: 'exDate',
    accessor: 'ex_date',
    Cell: ({ value }) => (value ? dateTransformSymbol(`${value}`, '/') : '--'),
  },
  {
    Header: 'new_end_date',
    accessor: 'new_end_date',
    Cell: ({ value }) => (value ? dateTransformSymbol(`${value}`, '/') : '--'),
  },
  {
    Header: 'dividendDate',
    accessor: 'div_deli_date',
    Cell: ({ value }) => (value ? dateTransformSymbol(`${value}`, '/') : '--'),
  },
];

const ETFSituation: React.FC<IProps> = ({ params }) => {
  const userConfig = useContext<any>(userConfigContext);
  // const { wsClient, isWsClientReady } = useQuoteClient();
  // const { client, isQuoteReady } = useClient();
  const { formatMessage } = useIntl();
  const [basicData, setBasicData] = useState<IBasicData>(null);
  const [dividData, setDividData] = useState<any>(null);
  const [pageNum, setPageNum] = useState(1);
  const [show, setShow] = useState(false);
  const [moreLoad, setMoreLoad] = useState(false);
  const domRef = useRef<HTMLDivElement | null>(null);

  function getData(num) {
    setMoreLoad(true);
    setPageNum(num);
  }

  // useEffect(() => {
  //   if (!params || !isWsClientReady) return;
  //   console.log(params, '<---params');
  //   const { body, mf } = params;
  //   wsClient
  //     ?.send({ body, mf, sf: 70 })
  //     .then((res) => {
  //       setBasicData(res.body);
  //     })
  //     .catch((error) => {
  //       console.log(error, '<---获取基本资料');
  //     });
  // }, [params, userConfig.language, isWsClientReady]);

  useEffect(() => {
    if (!params) return;
    const { body } = params;
    // 获取 ETF基本资料 数据
    getFTenApiMethod({
      trade_market: body?.trade_market,
      mode_code: '5001',
      body: {
        stk_id: body?.stk_id,
        language: body?.language,
      },
    })
      .then((res) => {
        setBasicData(res.result);
      })
      .catch((error) => {
        console.log(error, '<---获取基本资料');
      });
  }, [params, userConfig.language]);

  useEffect(() => {
    if (!params) return;
    const { body } = params;
    // 获取 分红派息 数据
    getFTenApiMethod({
      trade_market: body?.trade_market,
      mode_code: '1004',
      body: {
        stk_id: body?.stk_id,
        language: body?.language,
        page_num: 1,
        page_size: 10,
      },
    })
      .then((res) => {
        const {
          result: { datas },
        } = res;
        const data = dividData ? [...dividData, ...datas] : datas;
        if (pageNum > 1 && !datas.length) {
          setShow(true);
        }
        setDividData(data);
        setMoreLoad(false);
      })
      .catch((error) => {
        setMoreLoad(false);
        console.log(error);
      });
  }, [params, pageNum, userConfig.language]);

  // 滚动
  useEffect(() => {
    const scrollDom = domRef.current;
    const { scrollTop: top } = scrollDom;
    if (top === 0 && identifyIosSystem) {
      isRollTop().then((r) => {
        console.log(r);
      });
    }
    webViewScoll(scrollDom);
    const scrollHandle = () => {
      const { scrollTop } = scrollDom;
      if (scrollTop < 15 && identifyIosSystem) {
        isRollTop().then((r) => {
          console.log(r);
        });
      }
    };
    scrollDom.addEventListener('scroll', scrollHandle);
    return () => {
      scrollDom.addEventListener('scroll', scrollHandle);
    };
  }, [domRef.current]);

  return (
    <div styleName="hk-etf-warp" ref={domRef}>
      <div styleName="base-info">
        <div styleName="base-title">
          <FormattedMessage id="basical" />
        </div>
        {!basicData && (
          <div styleName="loading">
            <Loading isLoading />
          </div>
        )}
        {basicData && !(JSON.stringify(basicData) === '{}') ? (
          <div>
            <div styleName="info-item">
              <span>
                <FormattedMessage id="etfName" />
              </span>
              <span>{basicData.name}</span>
            </div>
            <div styleName="info-item">
              <span>
                <FormattedMessage id="amount" />
              </span>
              <span>{basicData.manage_assets_amount_etf}</span>
            </div>
            <div styleName="info-item">
              <span>
                <FormattedMessage id="relateInd" />
              </span>
              <span>{basicData.relate_ind}</span>
            </div>
            <div styleName="info-item">
              <span>
                <FormattedMessage id="relateMarket" />
              </span>
              <span>{basicData.relate_market}</span>
            </div>
            <div styleName="info-item">
              <span>
                <FormattedMessage id="funName" />
              </span>
              <span>{basicData.fun_name}</span>
            </div>
            <div styleName="info-item">
              <span>
                <FormattedMessage id="cusName" />
              </span>
              <span>{basicData.cus_name}</span>
            </div>
            <div styleName="info-item">
              <span>
                <FormattedMessage id="listDate" />
              </span>
              <span>{basicData.list_date}</span>
            </div>
            <div styleName="info-item">
              <span>
                <FormattedMessage id="divide" />
              </span>
              <span>{basicData.dividend_policy}</span>
            </div>
            <div styleName="info-item">
              <span>
                <FormattedMessage id="invest" />
              </span>
              <span>{basicData.invest_point}</span>
            </div>
          </div>
        ) : (
          <div styleName="nodata">
            <FormattedMessage id="noData" />
          </div>
        )}
      </div>
      <div styleName="divide">
        <div styleName="divide-title">
          <FormattedMessage id="dividends" />
        </div>
        {!dividData && (
          <div styleName="loading">
            <Loading isLoading />
          </div>
        )}
        {dividData && <TableInfo pageType="ETF" columns={divideHead} data={dividData} />}
        {dividData && !dividData.length && (
          <div styleName="nodata">
            <NoData text={formatMessage({ id: 'noData' })} width="0.8rem" height="0.8rem" theme={userConfig.theme} />
          </div>
        )}
        {moreLoad && (
          <div styleName="more-load">
            <Loading isLoading />
          </div>
        )}
        {dividData && !!dividData.length && !moreLoad && !show && (
          <div styleName="need-more" onClick={() => getData(pageNum + 1)}>
            <FormattedMessage id="checkMore" />
          </div>
        )}
        {show && <div styleName="need-more"><FormattedMessage id="noMoreData" /></div>}
      </div>
    </div>
  );
};

export default ETFSituation;
