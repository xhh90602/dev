import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { settingNavigationTitle, settingHeaderButton } from '@mobile/helpers/native/msg';

import useStockWarehouseRecord from '@/hooks/combination-position/use-stock-warehouse-record';
import Loading from '@mobile/components/loading/loading';
import WarehouseRecordTable from '../../components/warehouse-record-table/warehouse-record-table';
import AssociatedOrderTabs from '../../components/associated-order-tabs/associated-order-tabs';
import './stock-warehouse-record.scss';

const StockWarehouseRecord: React.FC = () => {
  const { formatMessage } = useIntl();
  const { isLoading, searchParams, warehouseRecords } = useStockWarehouseRecord();

  useEffect(() => {
    settingNavigationTitle({
      name: `${decodeURIComponent(searchParams.name)}${formatMessage({ id: 'warehouse_record' })}`,
    });

    settingHeaderButton([
      {
        index: 1,
        icon: 'back',
        position: 'left',
        onClickCallbackEvent: 'back',
      },
    ]);
  }, [searchParams]);

  return (
    <Loading isLoading={isLoading}>
      <div styleName="stock-warehouse-record">
        <div styleName="record-table">
          <WarehouseRecordTable showNameCode={false} list={warehouseRecords} />
        </div>

        <AssociatedOrderTabs
          portfolioId={searchParams.pid}
          stockCode={searchParams.code}
          tradeMarket={searchParams.market}
        />
      </div>
    </Loading>
  );
};

export default StockWarehouseRecord;
