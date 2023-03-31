import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { settingNavigationTitle, settingHeaderButton } from '@mobile/helpers/native/msg';

import dayjs from 'dayjs';
import useCombinationWarehouseDetail from '@/hooks/combination-position/use-combination-warehouse-detail';
import Loading from '@mobile/components/loading/loading';
import WarehouseRecordTable from '../../components/warehouse-record-table/warehouse-record-table';
import AssociatedOrderTabs from '../../components/associated-order-tabs/associated-order-tabs';
import './combination-warehouse-detail.scss';

const StockWarehouseRecord: React.FC = () => {
  const { formatMessage } = useIntl();
  const { isLoading, isExpandAll, recordList, searchParams, handleExpand } = useCombinationWarehouseDetail();

  useEffect(() => {
    settingNavigationTitle({ name: formatMessage({ id: 'details' }) });

    settingHeaderButton([
      {
        index: 1,
        icon: 'back',
        position: 'left',
        onClickCallbackEvent: 'back',
      },
    ]);
  }, []);

  return (
    <Loading isLoading={isLoading}>
      <div>
        <div styleName="warehouse-time">
          <span>{`${formatMessage({ id: 'warehouse_time' })}：`}</span>
          <span>{dayjs(searchParams.time).format('YYYY/MM/DD HH:ss:mm')}</span>
        </div>

        <div styleName="asset-box">
          <div styleName="balance-box">
            <p styleName="money">{searchParams.balance}</p>
            <p>{formatMessage({ id: 'remaining_configurable_amount' })}</p>
          </div>
          <div styleName="ratio-box">
            <p styleName="before-ratio">{searchParams.bRatio}</p>
            <p>{searchParams.aRatio}</p>
          </div>
        </div>

        <div styleName="record-table-box">
          <WarehouseRecordTable showNameCode list={recordList} />

          {!isExpandAll && recordList.length > 0 && (
            <div styleName="expand-all-box" onClick={handleExpand}>
              {formatMessage({ id: 'expand_all' })}
            </div>
          )}
        </div>

        <AssociatedOrderTabs refNo={searchParams.refNo} portfolioId={searchParams.pId} />
      </div>
    </Loading>
  );
};

export default StockWarehouseRecord;
