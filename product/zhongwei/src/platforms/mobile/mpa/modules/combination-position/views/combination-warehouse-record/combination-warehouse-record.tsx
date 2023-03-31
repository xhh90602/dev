import { useIntl } from 'react-intl';
import { toFixed, toThousand } from '@dz-web/o-orange';
import { editUrlParams } from '@/utils/navigate';
import { openNewPage, PageType } from '@mobile/helpers/native/msg';
import { COMBINATION_POSITION_ROUTERS } from '@mobile-mpa/modules/combination-position/routers';
import {
  nameAndCode,
  proportionoOfSourceCombination,
  warehouseToRatio,
  warehouseAmountPlan,
  warehouseNumberPlan,
} from '@mobile-mpa/modules/combination-position/components/table-column/table-column';

import useCombinationWarehouseRecord from '@/hooks/combination-position/use-combination-warehouse-record';
import Loading from '@mobile/components/loading/loading';
import TableList from '@mobile/components/table-list/table-list';
import NoMessage from '@mobile/components/no-message/no-message';
import InfiniteScroll from '@mobile/components/infinite-scroll/infinite-scroll';
import FullScreenPageView from '@mobile/components/full-screen-page-view/full-screen-page-view';

import dayjs from 'dayjs';
import './combination-warehouse-record.scss';

const StockWarehouseRecord: React.FC = () => {
  const { formatMessage } = useIntl();
  const {
    isLoading,
    portfolioId,
    warehouseRecords: { records = [], hasMore },
    handleLoadMore,
  } = useCombinationWarehouseRecord();

  return (
    <Loading isLoading={isLoading}>
      <FullScreenPageView title={formatMessage({ id: 'warehouse_record' })} className="gradient-bg">
        <div styleName="stock-warehouse-record">
          {records.length ? (
            <div>
              {records.map((item: Record<string, any>) => (
                <div
                  styleName="warehouse-record-item"
                  key={item.id}
                  onClick={() => {
                    const data = {
                      id: item.id,
                      pId: portfolioId,
                      balance: toThousand(toFixed(item.surplusCapital)),
                      bRatio: item.beforeRatio,
                      aRatio: item.afterRatio,
                      time: dayjs(item.updateTime).format('YYYYMMDDHHssmm'),
                      refNo: item.refNo,
                    };

                    const dataStr = Object.keys(data).reduce(
                      (prev, curr) => `${prev}${curr}=${data[curr]}&`,
                      '',
                    );

                    const hash = COMBINATION_POSITION_ROUTERS.COMBINATION_WAREHOUSE_DETAIL;
                    openNewPage({
                      pageType: PageType.HTML,
                      path: `combination-position.html#${hash}?${dataStr.slice(0, dataStr.lastIndexOf('&'))}`,
                      replace: false,
                    });
                  }}
                >
                  <div styleName="warehouse-record-time">
                    <p styleName="create-time">{dayjs(item.updateTime).format('YYYY/MM/DD HH:ss:mm')}</p>
                  </div>

                  <div styleName="warehouse-record-table">
                    <TableList
                      data={item.nowList}
                      hiddenBox={<NoMessage />}
                      columns={[
                        nameAndCode(),
                        proportionoOfSourceCombination({ align: 'center' }),
                        warehouseToRatio({ width: '40%' }),
                        warehouseAmountPlan(),
                        warehouseNumberPlan(),
                      ]}
                    />
                  </div>
                </div>
              ))}

              <InfiniteScroll handleLoadMore={handleLoadMore} hasMore={hasMore} />
            </div>
          ) : (
            <NoMessage />
          )}
        </div>
      </FullScreenPageView>
    </Loading>
  );
};

export default StockWarehouseRecord;
