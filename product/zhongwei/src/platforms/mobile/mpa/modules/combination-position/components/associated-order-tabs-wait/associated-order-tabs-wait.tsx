import { useIntl } from 'react-intl';
import { Toast } from 'antd-mobile';
import { toThousand } from '@dz-web/o-orange';
import { openNewPage, PageType } from '@mobile/helpers/native/msg';
import { ORDER_STATUS_ALL } from '@/constants/combination';
import {
  nameAndCode,
  nowAndOrderPrice,
  qtyAndFilledQty,
  bsAndStatus,
} from '@mobile-mpa/modules/combination-position/components/table-column/table-column';

import useGetWidth from '@/hooks/useGetWidth';
import useAssociatedWaitOrders from '@/hooks/combination-position/use-associated-wait-orders';
import useRevocationOrders from '@/hooks/combination-position/use-revocation-orders';
import TableList from '@mobile/components/table-list/table-list';
import Loading from '@mobile/components/loading/loading';
import NoMessage from '@mobile/components/no-message/no-message';
import BasicModal from '@mobile/components/basic-modal/basic-modal';
import TableExpand from '@mobile-mpa/modules/combination-position/components/table-expand/table-expand';
import './associated-order-tabs-wait.scss';

interface IProps {
  refNo?: string;
  stockCode?: string;
  tradeMarket?: string;
  portfolioId?: number;
}

const AssociatedOrderTabsWait: React.FC<IProps> = (props) => {
  const { portfolioId } = props;
  const { isLoading, waitOrderList, getList } = useAssociatedWaitOrders(props);

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
        styleName: 'detail',
        label: formatMessage({ id: 'details' }),
        handleClick: () => {
          const { orderNo, smallMarket } = rowData;

          return openNewPage({
            replace: false,
            pageType: PageType.HTML,
            path: `/trade.html#/info?market=${smallMarket}&orderNo=${orderNo}&portfolioId=${portfolioId}`,
          });
        },
      },
    ];

    const isRevoke = [
      ORDER_STATUS_ALL.WAIT_REPORT,
      ORDER_STATUS_ALL.WAIT_TRANSACTION,
      ORDER_STATUS_ALL.PORTION_TRANSACTION,
    ].includes(+rowData.orderStatus);

    if (isRevoke) {
      cfg.unshift({
        styleName: 'cancellations',
        label: formatMessage({ id: 'cancellations' }),
        handleClick: () => {
          setModalInfo({ visible: true, orderInfo: rowData });
        },
      });
    }

    return <TableExpand width={expandWidth - 44} expandCfg={cfg} />;
  };

  return (
    <div styleName="associated-order-table" ref={domRef}>
      <Loading isLoading={isLoading}>
        <TableList
          data={waitOrderList}
          titleHeight={40}
          wrapperPadding={[0, 44]}
          addDom={getTableExpand}
          hiddenBox={<NoMessage />}
          columns={[
            nameAndCode({ width: '25%' }),
            nowAndOrderPrice({ width: '20%' }),
            qtyAndFilledQty({ width: '30%' }),
            bsAndStatus({ width: '25%' }),
          ]}
        />
      </Loading>

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
            getList();
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
              <span>{`.${orderInfo.tradeMarket}`}</span>
            </p>
          </div>
          <div styleName="info-item">
            <p styleName="info-item-label">{formatMessage({ id: 'entrust_price' })}</p>
            <p styleName="info-item-value">{toThousand(orderInfo.price)}</p>
          </div>
          <div styleName="info-item">
            <p styleName="info-item-label">{formatMessage({ id: 'revoke_number' })}</p>
            <p styleName="info-item-value">{`${orderInfo.qty}(${formatMessage({ id: 'reference' })})`}</p>
          </div>
        </div>
      </BasicModal>
    </div>
  );
};

export default AssociatedOrderTabsWait;
