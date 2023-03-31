import { Toast } from 'antd-mobile';
import { useIntl } from 'react-intl';
import { toFixed, toThousand } from '@dz-web/o-orange';
import { editUrlParams } from '@/utils/navigate';
import { COMBINATION_POSITION_ROUTERS } from '@mobile-mpa/modules/combination-position/routers';
import { ORDER_STATUS_ALL } from '@/constants/combination';
import { openNewPage, PageType } from '@mobile/helpers/native/msg';
import {
  nameAndCode,
  nowAndOrderPrice,
  qtyAndFilledQty,
  bsAndStatus,
  sourceCombination,
  currentCombination,
  warehouseTo,
} from '@mobile-mpa/modules/combination-position/components/table-column/table-column';

import useGetWidth from '@/hooks/useGetWidth';
import useRevocationOrders from '@/hooks/combination-position/use-revocation-orders';
import TableList from '@mobile/components/table-list/table-list';
import NoMessage from '@mobile/components/no-message/no-message';
import BasicModal from '@mobile/components/basic-modal/basic-modal';
import TableExpand from '@mobile-mpa/modules/combination-position/components/table-expand/table-expand';
import './combination-wait-warehouse-table.scss';

interface IProps {
  pid: number;
  list: Record<string, any>[];
  getOrderList: (...args: any[]) => any;
}

const CombinationWaitWarehouseTable: React.FC<IProps> = (props) => {
  const { pid, list = [], getOrderList } = props;

  const { formatMessage } = useIntl();
  const { domRef, expandWidth } = useGetWidth();
  const {
    modalInfo: { visible, orderInfo },
    setModalInfo,
    handleRevokeOrders,
  } = useRevocationOrders();

  const getTableExpand = ({ rowData }) => {
    const cfg = [
      {
        styleName: 'warehouse',
        label: formatMessage({ id: 'warehouse_record' }),
        handleClick: () => {
          const { id, stockName, stockCode, tradeMarket } = rowData;
          const route = editUrlParams(
            {
              id,
              pid: String(pid),
              name: encodeURIComponent(stockName),
              code: stockCode,
              market: tradeMarket,
            },
            COMBINATION_POSITION_ROUTERS.STOCK_WAREHOUSE_RECORD,
          );

          return openNewPage({
            replace: false,
            pageType: PageType.HTML,
            path: `combination-position.html#${route}`,
          });
        },
      },
    ];

    const isRevoke = [
      ORDER_STATUS_ALL.RESERVED,
      ORDER_STATUS_ALL.WAIT_REPORT,
      ORDER_STATUS_ALL.WAIT_TRANSACTION,
      ORDER_STATUS_ALL.PORTION_TRANSACTION,
    ].includes(+rowData.counterOrderStatus);

    if (isRevoke) {
      cfg.unshift({
        styleName: 'cancellations',
        label: formatMessage({ id: 'cancellations' }),
        handleClick: () => {
          setModalInfo({ visible: true, orderInfo: rowData });
        },
      });
    }

    return <TableExpand width={expandWidth} expandCfg={cfg} />;
  };

  return (
    <div styleName="wait-warehouse-table" ref={domRef}>
      <TableList
        data={list}
        addDom={getTableExpand}
        hiddenBox={<NoMessage />}
        columns={[
          nameAndCode(),
          nowAndOrderPrice(),
          qtyAndFilledQty(),
          bsAndStatus(),
          sourceCombination(),
          currentCombination(),
          warehouseTo(),
        ]}
      />

      <BasicModal
        visible={visible}
        title={formatMessage({ id: 'revoke_confirmed' })}
        cancelText={formatMessage({ id: 'cancel' })}
        confirmText={formatMessage({ id: 'confirm' })}
        onCancel={() => {
          setModalInfo({ visible: false });
        }}
        onConfirm={() => {
          handleRevokeOrders(() => {
            Toast.show({ content: formatMessage({ id: 'revoke_successed' }) });
            getOrderList();
          });
        }}
      >
        <div>
          <div styleName="info-item">
            <p styleName="info-item-label">{formatMessage({ id: 'name' })}</p>
            <p styleName="info-item-value">{orderInfo.stockName}</p>
          </div>
          <div styleName="info-item">
            <p styleName="info-item-label">{formatMessage({ id: 'code' })}</p>
            <p styleName="info-item-value">
              <span>{orderInfo.stockCode}</span>
              {orderInfo.tradeMarket && <span>{`.${orderInfo.tradeMarket}`}</span>}
            </p>
          </div>
          <div styleName="info-item">
            <p styleName="info-item-label">{formatMessage({ id: 'entrust_price' })}</p>
            <p styleName="info-item-value">{toThousand(toFixed(orderInfo.entrustPrice))}</p>
          </div>
          <div styleName="info-item">
            <p styleName="info-item-label">{formatMessage({ id: 'revoke_number' })}</p>
            <p styleName="info-item-value">
              {`${toThousand(orderInfo.entrustQty)}(${formatMessage({
                id: 'reference',
              })})`}
            </p>
          </div>
        </div>
      </BasicModal>
    </div>
  );
};

export default CombinationWaitWarehouseTable;
