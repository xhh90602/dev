/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useQuoteClient } from '@dz-web/quote-client-react';
import { getFTenApiMethod } from '@/api/module-api/cbbc_outstanding_distribution';

import { nativeOpenPage } from '@/platforms/mobile/helpers/native/url';
import Loading from '@/platforms/mobile/components/loading/loading';
import NoData from '@/platforms/mobile/components/no-data/no-data';
import { userConfigContext } from '@/platforms/mobile/helpers/entry/native';
// import more from '@/platforms/mobile/mpa/modules/market/images/more.svg';
import { dateTransformSymbol } from '@/platforms/mobile/mpa/modules/market/utils/date-transform-symbol';
import { amountFormatToCN } from '@/platforms/mobile/mpa/modules/market/utils/amount-format-cn';
import TableInfo from '@mobile/mpa/modules/market/components/table-info/table-info';

// import { userConfigContext } from '@/helpers/entry/native';
// import { useClient } from '@/hooks/quote/client-context';
import './company-action.scss';
import NoMessage from '@/platforms/mobile/components/no-message/no-message';

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
  // {
  //   Header: 'new_end_date',
  //   accessor: 'new_end_date',
  //   Cell: ({ value }) => (value ? dateTransformSymbol(`${value}`, '/') : '--'),
  // },
  {
    Header: 'dividendDate',
    accessor: 'div_deli_date',
    Cell: ({ value }) => (value ? dateTransformSymbol(`${value}`, '/') : '--'),
  },
];

const shareBuyBacks = [
  {
    Header: 'date',
    accessor: 'trade_date',
    Cell: ({ value }) => dateTransformSymbol(value, '/'),
  },
  {
    Header: 'backCount',
    accessor: 'buy_back_amt_hk',
    Cell: ({ value }) => amountFormatToCN(value),
  },
  {
    Header: 'totalEquity',
    accessor: 'buy_back_num_ratio',
    Cell: ({ value }) => `${value}%`,
  },
];

const stockSplitMerge = [
  {
    Header: 'date',
    accessor: 'pub_date',
    Cell: ({ value }) => dateTransformSymbol(value, '/'),
  },
  {
    Header: 'way',
    accessor: 'way',
  },
  {
    Header: 'splitRate',
    accessor: 'detail',
  },
];

interface IParam {
  body: any;
  mf: number;
}

interface IProps {
  dict: any;
  sf: number;
  params: IParam;
}

enum paramCode {
  dividends = 20, // 分红派息
  redemption = 21, // 股份回购
  splitMergerStock = 22, // 拆股并购
}

const CompanyAction: React.FC<IProps> = ({ dict, sf, params }) => {
  const {
    body: { stockType },
  } = params;
  const userConfig = useContext<any>(userConfigContext);
  const { language } = userConfig;

  const { wsClient, isWsClientReady } = useQuoteClient();

  // const { client, isQuoteReady } = useClient();
  const { formatMessage } = useIntl();
  const [compDividendData, setCompDividend] = useState(null);
  const [shareBuyBacksData, setShareBuyBacks] = useState(null);
  const [stockSplitMergeData, setStockSplitMerge] = useState(null);

  function toMorePage(sfcode, tit) {
    const {
      body: { stk_id: code },
      mf,
    } = params;
    nativeOpenPage(`dividends-home.html?sf=${sfcode}&mf=${mf}&title=${tit}&code=${code}`);
  }

  // useEffect(() => {
  //   if (!dict || !isWsClientReady) return;
  //   const { body, mf } = params;
  //   const { stk_id } = body;

  //   //  分红派息
  //   wsClient
  //     ?.send({
  //       body: {
  //         language,
  //         stk_id,
  //         page_num: 1,
  //         page_size: 10,
  //       },
  //       mf,
  //       sf,
  //     })
  //     .then((res) => {
  //       const {
  //         body: { datas },
  //       } = res;

  //       // const { comp_dividend: dividend, share_buy_backs: buyBacks, stock_split_merge: splitMerge } = Data;
  //       setCompDividend(datas);
  //       // setShareBuyBacks(buyBacks);
  //       // setStockSplitMerge(splitMerge);
  //     })
  //     .catch((err) => {
  //       console.log(err, '<---获取数据失败');
  //     });
  //   //  拆并股
  //   wsClient
  //     ?.send({
  //       body: {
  //         language,
  //         stk_id,
  //         page_num: 1,
  //         page_size: 10,
  //       },
  //       mf,
  //       sf: '1006',
  //     })
  //     .then((res) => {
  //       const {
  //         body: { datas },
  //       } = res;

  //       setStockSplitMerge(datas);
  //     })
  //     .catch((err) => {
  //       console.log(err, '<---获取数据失败');
  //     });

  //   // 股份回购
  //   wsClient
  //     ?.send({
  //       body: {
  //         language,
  //         stk_id,
  //         page_num: 1,
  //         page_size: 10,
  //       },
  //       mf,
  //       sf: '1005',
  //     })
  //     .then((res) => {
  //       const {
  //         body: { datas },
  //       } = res;

  //       setShareBuyBacks(datas);
  //     })
  //     .catch((err) => {
  //       console.log(err, '<---获取数据失败');
  //     });
  // }, [dict, isWsClientReady, language]);

  useEffect(() => {
    if (!dict) return;
    const { body } = params;
    //  分红派息
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
        // const { comp_dividend: dividend, share_buy_backs: buyBacks, stock_split_merge: splitMerge } = Data;
        setCompDividend(datas);
        // setShareBuyBacks(buyBacks);
        // setStockSplitMerge(splitMerge);
      })
      .catch((err) => {
        console.log(err, '<---获取数据失败');
      });
    //  拆股并购
    getFTenApiMethod({
      trade_market: body?.trade_market,
      mode_code: '1006',
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
        setStockSplitMerge(datas);
      })
      .catch((err) => {
        console.log(err, '<---获取数据失败');
      });

    // 股份回购
    getFTenApiMethod({
      trade_market: body?.trade_market,
      mode_code: '1005',
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
        setShareBuyBacks(datas);
      })
      .catch((err) => {
        console.log(err, '<---获取数据失败');
      });
  }, [dict, language]);

  return (
    <div styleName="action-wrap">
      <div styleName="bonus">
        <div styleName="title">
          <FormattedMessage id="dividends" />
          {/* {
            compDividendData && !!compDividendData.length && (
            <div styleName="click-more" onClick={() => toMorePage(paramCode.dividends, 'dividends')}>
              <span>更多</span>
              <span><img src={more} alt="" /></span>
            </div>
            )
          } */}
        </div>
        {!compDividendData && (
          <div styleName="loading">
            <Loading isLoading />
          </div>
        )}
        {compDividendData && <TableInfo columns={divideHead} pageType="company" data={compDividendData} />}
        {compDividendData && !compDividendData.length && (
          <div styleName="nodata">
            <NoMessage />
          </div>
        )}
      </div>

      {!stockType && (
        <div styleName="buy-back">
          <div styleName="title">
            <FormattedMessage id="Redemption" />
            {/* {
              shareBuyBacksData && !!shareBuyBacksData.length && (
              <div styleName="click-more" onClick={() => toMorePage(paramCode.redemption, 'Redemption')}>
                <span>更多</span>
                <span><img src={more} alt="" /></span>
              </div>
              )
            } */}
          </div>
          {!shareBuyBacksData && (
            <div styleName="loading">
              <Loading isLoading />
            </div>
          )}
          {shareBuyBacksData && <TableInfo columns={shareBuyBacks} pageType="company" data={shareBuyBacksData} />}
          {shareBuyBacksData && !shareBuyBacksData.length && (
            <div styleName="nodata">
              <NoMessage />
            </div>
          )}
        </div>
      )}

      <div styleName="merge">
        <div styleName="title">
          <FormattedMessage id="splitStock" />
          {/* {
            stockSplitMergeData && !!stockSplitMergeData.length && (
            <div styleName="click-more" onClick={() => toMorePage(paramCode.splitMergerStock, 'splitStock')}>
              <span>更多</span>
              <span styleName="right-arrow"><img src={more} alt="" /></span>
            </div>
            )
          } */}
        </div>
        {!stockSplitMergeData && (
          <div styleName="loading">
            <Loading isLoading />
          </div>
        )}
        {stockSplitMergeData && <TableInfo columns={stockSplitMerge} pageType="company" data={stockSplitMergeData} />}
        {stockSplitMergeData && !stockSplitMergeData.length && (
          <div styleName="nodata">
            <NoMessage />
          </div>
        )}
      </div>
    </div>
  );
};
export default CompanyAction;
