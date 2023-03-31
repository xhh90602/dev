import TableList from '@mobile/components/table-list/table-list';
import {
  marketCodeName,
  nowAndLastPrice,
  marketValue,
  currentAndEnableQty,
  fundInCom,
  todayFundInCom,
  holdRatio,
} from '@mobile/components/table-column-item/table-column-item';

import './position-table.scss';
import { FormattedMessage } from 'react-intl';
import IconSvg from '@mobile/components/icon-svg';
import { TRADE_ROUTERS } from '@mobile-mpa/modules/trade/routers';
import useGetWidth from '@/hooks/useGetWidth';
import { memo, useEffect, useState } from 'react';
import usePositionList from '@/hooks/trade/use-position-list';
import { JavaMarket } from '@/utils';
import NoMessage from '../no-message/no-message';

interface IProps {
  setLen?: (num: number) => void
}

const PositionTable = ({ setLen = () => undefined }: IProps) => {
  const {
    domRef,
    expandWidth,
  } = useGetWidth();
  const [market, setMarket] = useState([JavaMarket.HKEX, JavaMarket.SHMK, JavaMarket.SZMK]);
  const { data, length, loading, stockJump } = usePositionList({ market });

  useEffect(() => {
    setLen(length);
  }, [length]);

  const positionAddDom = ({ rowData }) => (
    <div styleName="expand-box" style={{ width: `${expandWidth}px` }}>
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
        <div styleName="expand-icon">
          <IconSvg path="icon_stock_position" />
        </div>
        <FormattedMessage id="stocks_distribution" />
      </div>
      <div className="t-c">
        <div styleName="expand-icon">
          <IconSvg path="icon_share" />
        </div>
        <FormattedMessage id="share" />
      </div>
    </div>
  );

  return (
    <div ref={domRef}>
      <TableList
        data={data}
        isLoading={loading}
        addDom={positionAddDom}
        hiddenBox={<NoMessage />}
        columns={[
          marketCodeName(domRef, setMarket, market),
          nowAndLastPrice(),
          marketValue(),
          currentAndEnableQty(),
          fundInCom(),
          todayFundInCom(),
          holdRatio(),
        ]}
      />
    </div>
  );
};
PositionTable.defaultProps = {
  setLen: () => undefined,
};
export default memo(PositionTable);
