/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-return-assign */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useEffect } from 'react';
import TableList from '@mobile/components/table-list/table-list';
import { HeartFill } from 'antd-mobile-icons';
import NoMessage from '@mobile/components/no-message/no-message';
import { FormattedMessage } from 'react-intl';
import { toUnit } from '@dz-web/o-orange';
import { useQuoteClient } from '@dz-web/quote-client-react';

import { addOptional, deleteOptional } from '@mobile/helpers/native/msg';
import { getMarketCategoryTag, MARKET_TYPE_TAG } from '@dz-web/quote-client';
import StockDetailTabs from '@mobile/mpa/modules/market/components/stock-detail-tabs/stock-detail-tabs';

// import Iconjt from '@/platforms/mobile/images/icon_jt.svg';
import IconSZ from '@/platforms/mobile/images/icon_SZ.svg';
import IconSH from '@/platforms/mobile/images/icon_SH.svg';
import IconHK from '@/platforms/mobile/images/icon_HK.svg';
import IconUS from '@/platforms/mobile/images/icon_US.svg';
// import { humanNumber } from '@/utils';

import './active-shares-traded.scss';
import { querySelfList } from '@/api/module-api/trade';
import { activeSharesTabData, filterSymbolsData } from '../../constants';

const marketTypeTag = {
  [MARKET_TYPE_TAG.hk]: IconHK,
  [MARKET_TYPE_TAG.sh]: IconSH,
  [MARKET_TYPE_TAG.sz]: IconSZ,
  [MARKET_TYPE_TAG.us]: IconUS,
};

const ActiveSharesTraded = (props) => {
  const { language } = props;
  const { wsClient, isWsClientReady } = useQuoteClient();

  const [optionalList, setOptionalList] = useState<any[]>([]);
  const [activeSharesTradedIndex, setActiveSharesTradedIndex] = useState<number>(1);

  const [tableData, setTableData] = useState<any[]>([
    // {
    //   exchangeId: 2,
    //   marketId: 2002,
    //   code: '00003',
    //   callWarrantAmount: 2751760,
    //   callWarrantRatio: 0.02256,
    //   putWarrantAmount: 0,
    //   putWarrantRatio: 0,
    //   name: '长和',
    // },
  ]);

  // useEffect(() => {
  // -----请求接口获取tab栏数据,紧接着去请求其对应表格的数据----
  // setTabData();
  // }, []);

  const columns = [
    {
      label: <FormattedMessage id="name_code" />,
      fixed: true,
      dataKey: 'name',
      width: '25%',
      align: 'left',
      titleClassName: 'table-header-cell',
      className: 'table-body-cell',
      render: ({ rowData }) => (
        <div styleName="name-code-info">
          <div styleName="name-style">{rowData.name}</div>
          {/* <span styleName="other-name"> */}
          {/* {rowData.otherName} */}
          {/* </span> */}
          <div style={{ position: 'relative' }}>
            <img src={marketTypeTag[getMarketCategoryTag(rowData?.marketId) || '']} alt="" styleName="market-tag" />
            <span styleName="code-style">{rowData.code}</span>
            <HeartFill
              color={rowData?.isSelf ? '#da070e' : '#b5bbcf'}
              fontSize={13}
              onClick={() => {
                const optional = rowData?.isSelf ? deleteOptional : addOptional;
                optional({ smallMarket: rowData?.marketId, code: rowData?.code }).then((res) => {
                  console.log('ddddd', res);
                  console.log('smallMarket:::', rowData?.marketId);
                  console.log('code', rowData?.code);
                  // if (!res?.result) return;
                  getOptionalList();
                });
              }}
            />
          </div>
        </div>
      ),
    },
    {
      label: <FormattedMessage id="transaction_amount_regular_shares" />,
      dataKey: 'putWarrantAmount',
      width: '25%',
      align: 'center',
      titleClassName: 'table-header-cell',
      className: 'table-body-cell',
      render: ({ rowData }) => <div styleName="plus-strand">{toUnit(rowData?.amount, { lanType: language })}</div>,
    },
    {
      label: (
        <FormattedMessage id={activeSharesTradedIndex === 1 ? 'transaction_amount_warrant' : 'bull_ontracts_amount'} />
      ),
      dataKey: 'callWarrantAmount',
      titleClassName: 'table-header-cell',
      className: 'table-body-cell',
      width: '25%',
      align: 'center',
      render: ({ rowData }) => {
        const amount = activeSharesTradedIndex === 1 ? rowData?.callWarrantAmount : rowData?.bullContractsAmount;
        return <div styleName="stock-warrants">{toUnit(amount, { lanType: language })}</div>;
      },
    },
    {
      label: <FormattedMessage id={activeSharesTradedIndex === 1 ? 'subscription_put' : 'call_put_warrant'} />,
      dataKey: 'priceLimit',
      titleClassName: 'table-header-cell',
      className: 'table-body-cell',
      width: '25%',
      align: 'center',
      render: ({ rowData }) => {
        // eslint-disable-next-line max-len
        const call_bull = activeSharesTradedIndex === 1 ? rowData?.callWarrantAmount : rowData?.bullContractsAmount || 0;
        const put_bear = activeSharesTradedIndex === 1 ? rowData?.putWarrantAmount : rowData?.bearContractsAmount || 0;

        const total = call_bull + put_bear;
        const callwidth = total ? ((call_bull / total) * 100).toFixed(2) : 0;
        const putwidth = total ? (100 - +callwidth).toFixed(2) : 0;
        // const callwidth = '0.00';
        // const putwidth = '0.00';

        const background = () => {
          if (callwidth === putwidth) return '#fff';

          return Number(callwidth) === 0 || Number(callwidth) === 100 ? 'none' : '#fff';
        };

        return (
          <div
            styleName="percentage-value"
            style={{
              borderRadius: '0.08rem',
            }}
          >
            <div
              styleName="percentage-subscription"
              style={{
                flex: `${callwidth}%`,
                borderRadius: Number(callwidth) === 100 ? '0.08rem' : '',
                '--background': background(),
                zIndex: `${callwidth + 100}`,
              }}
            />
            <div
              styleName="percentage-put"
              style={{
                flex: `${putwidth}%`,
                borderRadius: Number(putwidth) === 100 ? '0.08rem' : '',
                zIndex: `${putwidth}`,
              }}
            />
            {/* <div
              styleName="percentage-subscription"
              style={{ width: `${toFixed(rowData?.callWarrantRatio * 1000) || '50'}%` }}
            />
            <div styleName="percentage-put" style={{ width: `${rowData?.putWarrantRatio || '50%'}` }} /> */}
          </div>
        );
      },
    },
  ];
  /** 成交活躍股 中的 認股證 牛熊證 tab栏切换 */
  function getValue(val: number) {
    console.log(val, '<___val___');
    setActiveSharesTradedIndex(val);
  }

  const getOptionalList = (data = tableData) => {
    console.log('获自选列表');

    querySelfList({
      // bigMarkets: [...JavaMarket.A.split('-'), JavaMarket.USA, JavaMarket.HKEX],
    })
      .then((res) => {
        if (res.code !== 0) return;
        const { result } = res;
        setOptionalList(result);
        // const result = [
        //   {
        //     stockCode: '00003',
        //   },
        // ];
        // 是否自选
        data.forEach((dataItem) => {
          const isSelf = result.filter((optionalItem) => dataItem.code === optionalItem.stockCode);

          dataItem.isSelf = isSelf.length;
        });

        setTableData(data);
      })
      .catch((err) => console.log(err, '自选列表获取失败'));
  };

  // useEffect(() => {
  //   getOptionalList();
  // }, []);

  useEffect(() => {
    if (!isWsClientReady) return;
    wsClient
      ?.send({
        mf: 104,
        sf: 1,
        body: {
          language,
          hk_warrant: [],
          sort_field: '',
          begin: 0,
          count: 10,
          desc: true,
          fields: ['#hk_warrant', 'name', 'amount'],
        },
      })
      .then((res) => {
        if (res.code !== 0) return;
        const { symbols } = res.body;

        const data = filterSymbolsData(symbols);
        console.log(data, 'cancelable');

        // 是否自选
        data.forEach((dataItem) => {
          const isSelf = optionalList.filter((optionalItem) => dataItem.code === optionalItem.stockCode);

          dataItem.isSelf = isSelf.length;
        });

        setTableData(data);
        getOptionalList(data);
      })
      .catch((err) => console.log(err, '获取淡仓成交活跃股失败'));
  }, [isWsClientReady, activeSharesTradedIndex]);

  return (
    <div styleName="active-shares-traded">
      <h3 styleName="small-title-name">
        <FormattedMessage id="active_shares_traded_short_positions" />
      </h3>
      <div styleName="tab-box">
        <StockDetailTabs
          tabData={activeSharesTabData}
          onChange={(value) => getValue(value)}
          itemStyle={{ width: '50%' }}
        />
      </div>
      <div styleName="table-box">
        <TableList
          data={tableData}
          wrapperPadding={['0.32rem', '0.32rem']}
          hiddenBox={<NoMessage />}
          columns={columns}
          titleHeight={28}
          columnHeight={28}
          // onFooter={onReachBottom}
          // onRowClick={onRowClick}
        />
      </div>
    </div>
  );
};

export default ActiveSharesTraded;
