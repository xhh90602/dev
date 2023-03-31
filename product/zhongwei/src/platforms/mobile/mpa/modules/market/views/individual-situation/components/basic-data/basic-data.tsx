/* eslint-disable react/no-danger */
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useContext, useEffect, useState } from 'react';
// import { useQuoteClient } from '@dz-web/quote-client-react';
import { getFTenApiMethod } from '@/api/module-api/cbbc_outstanding_distribution';

import { userConfigContext } from '@/platforms/mobile/helpers/entry/native';
import Loading from '@/platforms/mobile/components/loading/loading';
// import LoadFail from '@/platforms/mobile/components/load-fail/load-fail';
// import { useClient } from '@/hooks/quote/client-context';
import './basic-data.scss';
import NoMessage from '@/platforms/mobile/components/no-message/no-message';

interface IParam {
  body: any;
  mf: number;
}

interface IProps {
  dict: any;
  sf: number;
  params: IParam;
}

const BasicData: React.FC<IProps> = ({ dict, sf, params }) => {
  const userConfig = useContext<any>(userConfigContext);
  const { formatMessage } = useIntl();
  // const { client } = useClient();
  const [basicData, setBasicData] = useState([]);
  const [dataStatus, setDataStatus] = useState('');

  // const { wsClient, isWsClientReady } = useQuoteClient();

  /** 获取 基本资料 数据 */
  function getData() {
    setDataStatus('loading');
    const { body } = params;
    const objValue = {
      trade_market: body?.trade_market,
      mode_code: '1001',
      body: {
        stk_id: body?.stk_id,
        language: body?.language,
      },
    };
    getFTenApiMethod(objValue)
      .then((res) => {
        const { result: data } = res;
        setDataStatus('success');
        if (!data.length) return;
        const filtArr = dict.filter((k) => +k.mod_code === sf);
        const result = filtArr.map((item) => {
          if (data[0][item.code]) {
            return { ...item, [item.code]: data[0][item.code] };
          }
          return item;
        });
        setBasicData(result);
      })
      .catch((err) => {
        setDataStatus('error');
        console.log(err, '<---获取数据失败');
      });
  }

  // function getData() {
  //   console.log('params4444444444::::', params);
  //   setDataStatus('loading');
  //   const { body, mf } = params;
  //   wsClient
  //     ?.send({ body, mf, req_id: '1', sf })
  //     .then((res) => {
  //       const { body: data } = res;
  //       setDataStatus('success');

  //       if (!data.length) return;

  //       const filtArr = dict.filter((k) => +k.mod_code === sf);
  //       console.log(data, 'filtArr');

  //       const result = filtArr.map((item) => {
  //         if (data[0][item.code]) {
  //           return { ...item, [item.code]: data[0][item.code] };
  //         }
  //         return item;
  //       });
  //       setBasicData(result);
  //     })
  //     .catch((err) => {
  //       setDataStatus('error');
  //       console.log(err, '<---获取数据失败');
  //     });
  // }

  // useEffect(
  //   () => {
  //     if (!dict) return;
  //     if (!isWsClientReady) return;
  //     getData();
  //   },
  //   [dict, userConfig.language, isWsClientReady],
  // );

  useEffect(() => {
    if (!dict) return;
    getData();
  }, [dict, userConfig.language]);

  return (
    <div styleName="basic-wrap">
      {dataStatus === 'success' && !basicData?.length && <NoMessage />}

      {dataStatus === 'loading' ? (
        <div styleName="loading">
          <Loading isLoading />
        </div>
      ) : (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
          {dataStatus === 'error' ? (
            <div styleName="error-box">
              <NoMessage />
              {/* <LoadFail reloadCallback={() => getData()} /><NoMessage reloadCallback={() => getData()} /> */}
            </div>
          ) : (
            basicData && basicData.map((item: any) => (
              <div styleName="detail-item">
                <span styleName="left">{item[`${formatMessage({ id: 'name' })}`]}</span>
                <p dangerouslySetInnerHTML={{ __html: item[item.code] }} />
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};
export default BasicData;
