import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
// import { useQuoteClient } from '@dz-web/quote-client-react';
import { getFTenApiMethod } from '@/api/module-api/cbbc_outstanding_distribution';

import StockDetailTabs from '@mobile/mpa/modules/market/components/stock-detail-tabs/stock-detail-tabs';
import { isRollTop } from '@/platforms/mobile/helpers/native/msg';
import { disableIosScroll } from '@/platforms/mobile/helpers/native/register';
import { identifyIosSystem } from '@/platforms/mobile/mpa/modules/market/utils/identify-ios-system';

import webViewScoll from '@/platforms/mobile/mpa/modules/market/utils/web-view-scoll';

// import { situationArr } from '../../constants/index';

import BasicData from '../../components/basic-data/basic-data';
import Shareholder from '../../components/shareholder/shareholder';
import CompanyAction from '../../components/company-action/company-action';

import './stock-situation.scss';

interface IParam {
  body: any;
  mf: number;
}

interface IProps {
  params: IParam;
}

// enum situationType {
//   basical = +situationArr[0].code,
//   shareholder = +situationArr[1].code,
//   companyAction = +situationArr[2].code,
// }

const StockSituation: React.FC<IProps> = ({ params }) => {
  const situationArr: any = React.useMemo(
    () => [
      // 个股简况
      { value: '1001', code: '1001', label: 'basical' },
      {
        value: '1002',
        code: '1002',
        label: params?.body?.trade_market === 'USA' ? 'institutionalShareholder' : 'shareholder',
      },
      { value: '1004', code: '1004', label: 'companyAction' },
    ],
    [params?.body?.trade_market],
  );
  // const { wsClient, isWsClientReady } = useQuoteClient();
  // const { client, isQuoteReady } = useClient();
  const [disableScroll, setDisableScroll] = useState(false);
  const [dictObj, setDictObj] = useState(null);
  const domRef = useRef<HTMLDivElement | null>(null);

  const [type, setType] = useState(situationArr[0].value);

  enum situationType {
    basical = +situationArr[0].code,
    shareholder = +situationArr[1].code,
    companyAction = +situationArr[2].code,
  }

  // tab切换
  function switchIndex(code: string) {
    setType(code);
  }

  // useEffect(() => {
  //   console.log(params, '44444444444444444444444444');
  //   console.log(params, isWsClientReady, situationArr, 'isWsClientReady');

  //   if (!params || !isWsClientReady) return;
  //   const { body, mf } = params;
  //   wsClient
  //     ?.send({ body, mf, req_id: '1', sf: '9999' })
  //     .then((res) => {
  //       const { body: dict } = res;
  //       console.log('dict----------', dict);
  //       console.log('type----------', type);
  //       const data = dict[`${type}`];
  //       console.log(data, '-------------------data--------------------');

  //       setDictObj(data);
  //     });
  // }, [type, params, isWsClientReady]);
  useEffect(() => {
    if (!params) return;
    const { body } = params;
    const objValue = {
      trade_market: body?.trade_market,
      mode_code: 'S001',
      body: {
        language: body?.language,
      },
    };
    getFTenApiMethod(objValue).then((res) => {
      const { result: dict } = res;
      const data = dict[`${type}`];
      setDictObj(data);
    });
  }, [type, params]);

  // 滚动
  useEffect(() => {
    if (!domRef.current) return null;
    const scrollDom = domRef.current;
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
      scrollDom.removeEventListener('scroll', scrollHandle);
    };
  }, [domRef.current]);

  useEffect(() => {
    disableIosScroll(({ isScroll }) => {
      setDisableScroll(isScroll);
    });
  }, []);

  return (
    <>
      {/* <Tabs tabIndex={type} tabList={situationArr} callBack={(idx) => switchIndex(idx)} /> */}
      <div styleName="tab-box">
        <StockDetailTabs tabData={situationArr} onChange={(value) => switchIndex(value)} />
      </div>
      {
        // 基本资料
        +type === situationType.basical && (
          <div styleName="main-basic" ref={domRef} style={{ overflow: disableScroll ? 'hidden' : 'scroll' }}>
            <BasicData dict={dictObj} params={params} sf={+type} />
          </div>
        )
      }
      {
        // 股东股本 或 机构持股
        +type === situationType.shareholder && (
          <div styleName="main-shareholder" ref={domRef} style={{ overflow: disableScroll ? 'hidden' : 'scroll' }}>
            <Shareholder dict={dictObj} params={params} sf={+type} />
          </div>
        )
      }
      {
        // 公司行动
        +type === situationType.companyAction && (
          <div styleName="main-companyAction" ref={domRef} style={{ overflow: disableScroll ? 'hidden' : 'scroll' }}>
            <CompanyAction dict={dictObj} params={params} sf={+type} />
          </div>
        )
      }
    </>
  );
};
export default StockSituation;
