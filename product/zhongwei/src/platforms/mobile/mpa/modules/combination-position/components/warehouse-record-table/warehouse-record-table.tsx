import {
  nameAndCode,
  warehouseTime,
  proportionoOfSourceCombination,
  difference,
  warehouseToRatio,
  warehouseAmountPlan,
  warehouseNumberPlan,
  warehouseAfterRatio,
  warehouseAmountPractical,
  warehouseNumberPractical,
} from '@mobile-mpa/modules/combination-position/components/table-column/table-column';

import TableList from '@mobile/components/table-list/table-list';
import NoMessage from '@mobile/components/no-message/no-message';
import './warehouse-record-table.scss';

interface IWarehouseRecord {
  list: Record<string, any>[];
  showNameCode: boolean;
}

const WarehouseRecordTable: React.FC<IWarehouseRecord> = (props) => {
  const { list = [], showNameCode } = props;

  return (
    <div styleName="warehouse-record-table">
      <TableList
        data={list}
        hiddenBox={<NoMessage />}
        columns={[
          showNameCode ? nameAndCode() : warehouseTime(),
          proportionoOfSourceCombination({ align: 'center' }),
          difference({ align: 'center' }),
          warehouseToRatio({ width: '40%' }),
          warehouseAmountPlan(),
          warehouseNumberPlan(),
          warehouseAfterRatio(),
          warehouseAmountPractical(),
          warehouseNumberPractical(),
        ]}
      />
    </div>
  );
};

export default WarehouseRecordTable;
