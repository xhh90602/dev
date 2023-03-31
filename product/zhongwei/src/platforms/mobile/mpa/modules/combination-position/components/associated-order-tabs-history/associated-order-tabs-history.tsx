import { openNewPage, PageType } from '@mobile/helpers/native/msg';
import {
  nameAndCode,
  entrustAndTradeAveragePrice,
  qtyAndFilledQty,
  bsAndStatus,
} from '@mobile-mpa/modules/combination-position/components/table-column/table-column';

import useAssociatedHistoryOrders from '@/hooks/combination-position/use-associated-history-orders';
import TableList from '@mobile/components/table-list/table-list';
import Loading from '@mobile/components/loading/loading';
import NoMessage from '@mobile/components/no-message/no-message';
import './associated-order-tabs-history.scss';

interface IProps {
  refNo?: string;
  stockCode?: string;
  tradeMarket?: string;
  portfolioId?: number;
}

const AssociatedOrderTabsHistory: React.FC<IProps> = (props) => {
  const { portfolioId } = props;
  const { isLoading, historyOrderList } = useAssociatedHistoryOrders(props);

  return (
    <div styleName="associated-order-table">
      <Loading isLoading={isLoading}>
        <TableList
          data={historyOrderList}
          titleHeight={40}
          wrapperPadding={[0, 44]}
          hiddenBox={<NoMessage />}
          onRowClick={({ rowData }: Record<string, any>) => {
            const { orderNo, smallMarket } = rowData;

            return openNewPage({
              replace: false,
              pageType: PageType.HTML,
              path: `/trade.html#/info?market=${smallMarket}&orderNo=${orderNo}&portfolioId=${portfolioId}`,
            });
          }}
          columns={[
            nameAndCode({ width: '20%' }),
            entrustAndTradeAveragePrice({ width: '30%' }),
            qtyAndFilledQty({ width: '30%' }),
            bsAndStatus({ width: '20%' }),
          ]}
        />
      </Loading>
    </div>
  );
};

export default AssociatedOrderTabsHistory;
