/* eslint-disable camelcase */
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { useQuoteClient } from '@dz-web/quote-client-react';
import { getFTenApiMethod } from '@/api/module-api/cbbc_outstanding_distribution';

import { useIntl } from 'react-intl';
import { userConfigContext } from '@mobile/helpers/entry/native';
// import { useClient } from '@/hooks/quote/client-context';
import { dateTransformSymbol } from '@/platforms/mobile/mpa/modules/market/utils/date-transform-symbol';
import { amountFormatToCN } from '@/platforms/mobile/mpa/modules/market/utils/amount-format-cn';
import NoData from '@mobile/components/no-data/no-data';
import Loading from '@mobile/components/loading/loading';
import TableInfo from '@mobile/mpa/modules/market/components/table-info/table-info';

import './usa-shareholder.scss';
import NoMessage from '@/platforms/mobile/components/no-message/no-message';

interface IParam {
  body: any;
  mf: number;
}

interface IProps {
  dict: any;
  params: IParam;
  sendSf: (keySf: number) => void;
}

const tabSf = [
  { label: 'all', keyValue: '0' },
  { label: 'organization', keyValue: '1' },
  { label: 'fund', keyValue: '2' },
  { label: 'senior', keyValue: '3' },
];

const usaThArr = [
  {
    Header: 'nameDate',
    accessor: 'holder_name',
    subTitle: 'rpl_date',
    Cell: ({ column, data, value, row }) => {
      const { index } = row;
      const { subTitle } = column;
      return (
        <>
          <span>{value}</span>
          <br />
          <span>{dateTransformSymbol(data[index][subTitle], '/')}</span>
        </>
      );
    },
  },
  {
    Header: 'stockCount',
    accessor: 'hold_vol',
    subTitle: 'hold_rate',
    Cell: ({ column, data, value, row }) => {
      const { index } = row;
      const { subTitle } = column;
      return (
        <>
          <span styleName="share-holding">{amountFormatToCN(value)}</span>
          <br />
          <span>{data[index][subTitle] ? data[index][subTitle].toFixed(2) : '--'}</span>
        </>
      );
    },
  },
  {
    Header: 'stockAfterCount',
    accessor: 'chan_vol',
    subTitle: 'chan_rate',
    Cell: ({ column, data, value, row }) => {
      const { index } = row;
      const { subTitle } = column;
      return (
        <>
          <span>{amountFormatToCN(value)}</span>
          <br />
          <span>{data[index][subTitle] || '--'}</span>
        </>
      );
    },
  },
];

const UsaShareholder: React.FC<IProps> = ({ dict, params, sendSf }) => {
  const { formatMessage } = useIntl();
  // const { client } = useClient();
  const { wsClient, isWsClientReady } = useQuoteClient();

  const userConfig = useContext<any>(userConfigContext);
  const [usaSf, setUsaSf] = useState('0');
  const [usaData, setUsaData] = useState(null);

  function swichTabSf(keySf: number) {
    // setUsaSf(keySf);
    // sendSf(keySf);
  }

  // useEffect(() => {
  //   if (!dict || usaSf === -1) return;
  //   if (!isWsClientReady) return;
  //   const { body, mf } = params;
  //   const { stk_id } = body;
  //   console.log(body, '<---body');
  //   console.log(usaSf, 'usaSf');

  //   sendSf(usaSf);
  //   wsClient
  //     ?.send({
  //       body: {
  //         stk_id,
  //         page_num: 1,
  //         page_size: 5,
  //         hold_type: usaSf,
  //       },
  //       mf,
  //       sf: '1003',
  //     })
  //     .then((res) => {
  //       const {
  //         body: { datas },
  //       } = res;
  //       setUsaData(datas);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, [dict, usaSf, isWsClientReady]);

  useEffect(() => {
    // if (!dict || usaSf === -1) return;
    if (!dict) return;
    const { body } = params;
    // sendSf(usaSf);
    getFTenApiMethod({
      trade_market: body?.trade_market,
      mode_code: '1003',
      body: {
        stk_id: body?.stk_id,
        language: body?.language,
        page_num: 1,
        page_size: 5,
        hold_type: 1,
      },
    })
      .then((res) => {
        const {
          result: { datas },
        } = res;
        setUsaData(datas);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [dict, usaSf]);

  return (
    <div styleName="usa-style">
      {/* <div styleName="tab-box">
        <div styleName="tab-contain">
          {tabSf.map((k) => (
            <li styleName={k.keyValue === usaSf ? 'active' : ''} onClick={() => swichTabSf(k.keyValue)}>
              {formatMessage({ id: k.label })}
            </li>
          ))}
        </div>
      </div> */}
      {!usaData && (
        <div styleName="loading">
          <Loading isLoading />
        </div>
      )}
      {usaData && <TableInfo pageType="share" columns={usaThArr} data={usaData} />}
      {usaData && !usaData.length && (
        <div styleName="nodata">
          {/* <NoData
            text={formatMessage({ id: 'noData' })}
            width="0.8rem"
            height="0.8rem"
            theme={userConfig.theme}
          /> */}
          <NoMessage />
        </div>
      )}
    </div>
  );
};

export default UsaShareholder;
