/* eslint-disable max-len */
import usePositionList from '@/hooks/trade/use-position-list';
import TableList from '@mobile/components/table-list/table-list';
import {
  nowAndLastPrice,
  marketValue,
  currentAndEnableQty,
  fundInCom,
  todayFundInCom,
  holdRatio,
  CodeName,
} from '@mobile/components/table-column-item/table-column-item';

import './index-position-table.scss';
import { FormattedMessage } from 'react-intl';
import IconSvg from '@mobile/components/icon-svg';
import { TRADE_ROUTERS } from '@mobile/mpa/modules/trade/routers';
import { openNewPage, PageType, sharePage, CShareType, shareSourceType, MarketType } from '@mobile/helpers/native/msg';
import { useRef } from 'react';
import { JavaMarket } from '@/utils';
import NoMessage from '../no-message/no-message';

const IndexPositionTable = (props) => {
  const { tradeMarket = ['HKD'] } = props;

  const { data, loading, stockJump } = usePositionList({ market: [...tradeMarket] });
  const stockShare = (rowData) => {
    console.log('===========>data', rowData);
    // let shareSourceTypes: any = null;
    // if (market.includes(JavaMarket.SZMK) || market.includes(JavaMarket.SHMK)) {
    //   shareSourceTypes = shareSourceType.SHSZAccount;
    // } else if (market.includes(JavaMarket.HKEX)) {
    //   shareSourceTypes = shareSourceType.HKAccount;
    // } else {
    //   shareSourceTypes = shareSourceType.USAccount;
    // }

    let marketType: any = null;
    if (tradeMarket.includes(JavaMarket.SZMK) || tradeMarket.includes(JavaMarket.SHMK)) {
      marketType = MarketType.A;
    } else if (tradeMarket.includes(JavaMarket.HKEX)) {
      marketType = MarketType.HK;
    } else {
      marketType = MarketType.US;
    }

    // if (market.includes(JavaMarket.SZMK) || market.includes(JavaMarket.SHMK)) {
    //   shareSourceTypes = shareSourceType.SHSZAccount;
    // } else if (market.includes(JavaMarket.HKEX)) {
    //   shareSourceTypes = shareSourceType.HKAccount;
    // } else {
    //   shareSourceTypes = shareSourceType.USAccount;
    // }

    const infoData = {
      // 持仓列表数据
      holdingStocks: [
        {
          code: rowData.stockCode,
          name: rowData.stockName,
          costPrice: Number(rowData.costPrice),
          price: Number(rowData.lastPrice),
          profitLossPct: rowData.floatingPLPercent,
          market: marketType,
        },
      ],
      // 分享来源
      shareSource: shareSourceType.StockAccount,
    };

    console.log('======>infoData', infoData);

    sharePage({
      shareType: CShareType.Data,
      info: infoData,
    });
  };
  const positionAddDom = ({ rowData }) => (
    <div styleName="expand-box">
      <div className="t-c">
        <div
          styleName="expand-icon"
          onClick={() => {
            stockJump(rowData, TRADE_ROUTERS.BUY);
          }}
        >
          <IconSvg path="icon_order_buy" />
        </div>
        <FormattedMessage id="buying" />
      </div>
      <div className="t-c">
        <div
          styleName="expand-icon"
          onClick={() => {
            stockJump(rowData, TRADE_ROUTERS.SELL);
          }}
        >
          <IconSvg path="icon_order_sell" />
        </div>
        <FormattedMessage id="sale" />
      </div>
      <div className="t-c">
        <div
          styleName="expand-icon"
          onClick={() => {
            openNewPage({
              path: `trade.html#/position-distribution?stockCode=${rowData.stockCode}&tradeMarket=${rowData.tradeMarket}`,
              pageType: PageType.HTML,
              title: '持仓分布',
            });
          }}
        >
          <IconSvg path="icon_stock_position" />
        </div>
        <FormattedMessage id="stocks_distribution" />
      </div>
      <div className="t-c">
        <div styleName="expand-icon">
          <IconSvg
            path="icon_share"
            click={() => {
              stockShare(rowData);
            }}
          />
        </div>
        <FormattedMessage id="share" />
      </div>
    </div>
  );

  const domRef = useRef(null);

  return (
    <div
      ref={domRef}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <TableList
        data={data}
        addDom={positionAddDom}
        hiddenBox={<NoMessage />}
        isLoading={loading}
        columns={[
          CodeName({ width: '25%' }),
          nowAndLastPrice(),
          currentAndEnableQty(),
          fundInCom(),
          todayFundInCom(),
          marketValue(),
          holdRatio(),
        ]}
      />
    </div>
  );
};

export default IndexPositionTable;
