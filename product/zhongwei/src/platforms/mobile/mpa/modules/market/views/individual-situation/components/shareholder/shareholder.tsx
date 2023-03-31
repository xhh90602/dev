/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useQuoteClient } from '@dz-web/quote-client-react';
import dayjs from 'dayjs';
import { getFTenApiMethod } from '@/api/module-api/cbbc_outstanding_distribution';

import Loading from '@mobile/components/loading/loading';
// import more from '@/platforms/mobile/mpa/modules/market/images/more.svg';
// import { nativeOpenPage } from '@mobile/helpers/native/url';
// import { useClient } from '@/hooks/quote/client-context';
import ShareholderChart from './components/shareholder-chart/shareholder-chart';
import HkShareholder from './components/hk-shareholder/hk-shareholder';
import UsaShareholder from './components/usa-shareholder/usa-shareholder';
import './shareholder.scss';

interface IShareHoldChange {
  deadline: string;
  allShare: number;
  dataRatio: any;
}

interface IParam {
  body: any;
  mf: number;
}

interface IProps {
  dict: any;
  sf: number;
  params: IParam;
}

const Shareholder: React.FC<IProps> = ({ dict, sf, params }) => {
  const [shareHoldChangeData, setShareHoldChange] = useState(null); // 港股数据
  const [shareStructureData, setShareStructure] = useState<IShareHoldChange | null>(null); // 图表数据
  const [bigmarket, setBigmarket] = useState('');
  const { wsClient, isWsClientReady } = useQuoteClient();

  // const { client, isQuoteReady } = useClient();
  const sfCodeRef = useRef('0');

  function sendUsaSf(usaSf) {
    sfCodeRef.current = usaSf;
  }

  // function toMorePage(sfcode, tit) {
  //   console.log(params);
  //   const { body: { stk_id: code }, mf } = params;
  //   nativeOpenPage(`dividends-home.html?sf=${sfcode}&mf=${mf}&title=${tit}&code=${code}&stockType=${bigmarket}`);
  // }

  // 用ws请求接口
  // useEffect(() => {
  //   if (!dict) return;
  //   if (!isWsClientReady) return;
  //   const { body, mf } = params;
  //   const { stockType } = body;

  //   wsClient
  //     ?.send({ body, mf, sf })
  //     .then((res) => {
  //       console.log('<========res=============', res);
  //       const { body: data } = res;
  //       setBigmarket(stockType);
  //       if (stockType === 'USA') {
  //         const { last_trade_date: deadline, data_ratio: dataRatio, all_issue_share: allShare } = data;
  //         setShareStructure({ deadline, dataRatio, allShare });
  //       } else {
  //         // const { share_hold_change: holdChange, share_structure: structure } = data;
  //         // const { last_trade_date: deadline, data_ratio: dataRatio, all_issue_share: allShare } = structure;
  //         const { last_trade_date: deadline, data_ratio: dataRatio, all_issue_share: allShare } = data;
  //         // setShareHoldChange(holdChange);
  //         // setShareStructure(structure);
  //         setShareStructure({ deadline, dataRatio, allShare });
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });

  //   wsClient
  //     ?.send({
  //       body: {
  //         ...body,
  //         page_num: 1,
  //         page_size: 10,
  //       },
  //       mf,
  //       sf: '1003',
  //     })
  //     .then((res) => {
  //       console.log(res);
  //       const { body: data } = res;

  //       // if (stockType === 'USA') return;
  //       const { datas: holdChange } = data;

  //       setShareHoldChange(holdChange);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, [dict, isWsClientReady]);

  // 用http请求接口
  useEffect(() => {
    if (!dict) return;
    const { body } = params;
    const { stockType } = body;
    // 请求接口：股本结构 数据
    getFTenApiMethod({
      trade_market: body?.trade_market,
      mode_code: '1002',
      body: {
        stk_id: body?.stk_id,
        language: body?.language,
      },
    })
      .then((res) => {
        console.log('<========res=============', res);
        const { result: data } = res;
        setBigmarket(stockType);
        if (stockType === 'USA') {
          const { last_trade_date: deadline, data_ratio: dataRatio, all_issue_share: allShare } = data;
          setShareStructure({ deadline, dataRatio, allShare });
        } else {
          // const { share_hold_change: holdChange, share_structure: structure } = data;
          // const { last_trade_date: deadline, data_ratio: dataRatio, all_issue_share: allShare } = structure;
          const { last_trade_date: deadline, data_ratio: dataRatio, all_issue_share: allShare } = data;
          // setShareHoldChange(holdChange);
          // setShareStructure(structure);
          setShareStructure({ deadline, dataRatio, allShare });
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // 请求接口：持股变动 数据
    getFTenApiMethod({
      trade_market: body?.trade_market,
      mode_code: '1003',
      body: {
        stk_id: body?.stk_id,
        language: body?.language,
        page_num: 1,
        page_size: 10,
      },
    })
      .then((res) => {
        console.log(res);
        const { result: data } = res;
        // if (stockType === 'USA') return;
        const { datas: holdChange } = data;
        setShareHoldChange(holdChange);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [dict]);

  return (
    <div styleName="shareholder-wrap">
      {/* 股本结构 */}
      {params?.body?.trade_market === 'USA' ? null : (
        <div styleName="shareholder-top">
          <div styleName="title-box">
            <span styleName="holder">
              <FormattedMessage id="structure" />
            </span>
            <span styleName="date">
              {shareStructureData && dayjs(shareStructureData.deadline).format('YYYY/MM/DD')}
              <FormattedMessage id="updateDate" />
            </span>
          </div>
          {shareStructureData ? (
            <ShareholderChart
              allShare={shareStructureData.allShare}
              shareStructureData={shareStructureData.dataRatio}
              bigMarket={bigmarket}
            />
          ) : (
            <div styleName="loading">
              <Loading isLoading />
            </div>
          )}
        </div>
      )}
      {/* 持股变动 */}
      {params?.body?.trade_market === 'USA' ? (
        <UsaShareholder dict={dict} params={params} sendSf={(usaSf) => sendUsaSf(usaSf)} />
      ) : (
        <div styleName="shareholder-bottom">
          <div styleName="title-box">
            <span styleName="holder">
              <FormattedMessage id="variation" />
            </span>
            {/* <div
            styleName="check-more"
            onClick={() => toMorePage(sfCodeRef.current, bigmarket ? 'usaVvariation' : 'variation')}
          >
            <span>更多</span>
            <span><img src={more} alt="" /></span>
          </div> */}
          </div>
          <HkShareholder tableData={shareHoldChangeData} />
          {/* {bigmarket === 'USA' ? (
            <UsaShareholder dict={dict} params={params} sendSf={(usaSf) => sendUsaSf(usaSf)} />
          ) : (
            <HkShareholder tableData={shareHoldChangeData} />
          )} */}
        </div>
      )}
    </div>
  );
};
export default Shareholder;
