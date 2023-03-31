/* eslint-disable react/require-default-props */
import TableList from '@mobile/components/table-list/table-list';
import {
  qtyAndFilledQty,
  bsAndStatus,
  nameAndCode,
  nowAndOrderPrice,
  CodeName,
} from '@mobile/components/table-column-item/table-column-item';
import useEntrustList from '@/hooks/trade/use-entrust-list';
import { FormattedMessage, useIntl } from 'react-intl';
import { JavaMarket, sub } from '@/utils';
import { useMemo, useState } from 'react';
import { operateBusiness } from '@/api/module-api/trade';
import { Toast } from 'antd-mobile';
import { toThousand, toFixed } from '@dz-web/o-orange';
import IconSvg from '../icon-svg';

import './entrust-table.scss';
import { TRADE_ROUTERS } from '../../mpa/modules/trade/routers';
import NoMessage from '../no-message/no-message';
import { openNewPage, PageType } from '../../helpers/native/msg';
import TradeBasicModal from '../trade-basic-modal/trade-basic-modal';
import { useTradeStore } from '../../model/trade-store';

interface IEntrust {
  type: 'today' | 'history';
  tradeMarket?: JavaMarket[];
  templateCode?: 'default' | 'order-entrust' | 'order-history';
  wrapperPadding?: [number, number];
}

const modalList = [
  {
    label: <FormattedMessage id="name" />,
    content: (s) => (
      <span>{s.stockName}</span>
    ),
  },
  {
    label: <FormattedMessage id="code" />,
    content: (s) => (
      <span>{s.stockCode}</span>
    ),
  },
  {
    label: <FormattedMessage id="entrust_price" />,
    content: (s) => (
      <div>
        <span>
          {toFixed(s.price, {
            precision: 3,
          })}
        </span>
      </div>
    ),
  },
  {
    label: <FormattedMessage id="revoke_number" />,
    content: (s) => (
      <div>
        <span>{toThousand(sub(s.qty, s.execQty))}</span>
      </div>
    ),
  },
];

const IndexEntrustTable = (props: IEntrust) => {
  const update = useTradeStore((state) => state.entrustUpdate);
  const r = useTradeStore((state) => state.setEntrustUpdate);
  const { formatMessage } = useIntl();
  const {
    type = 'today',
    tradeMarket = [],
    templateCode = 'default',
    wrapperPadding = [0, 0],
  } = props;
  const { data, loading } = useEntrustList({
    queryType: type,
    update,
  });

  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<any>({});
  const { userTradeConfigInfo } = useTradeStore();

  const template = {
    default: [
      CodeName({ width: '25%' }),
      nowAndOrderPrice(),
      qtyAndFilledQty(),
      bsAndStatus(),
    ],
    'order-entrust': [
      nameAndCode(),
      nowAndOrderPrice(),
      qtyAndFilledQty(),
      bsAndStatus(),
    ],
  };

  const cancelOrder = () => {
    operateBusiness({
      orderNo: current.orderNo,
      type: 0,
    }).then((res) => {
      const { code } = res;

      if (code === 0) {
        Toast.show(formatMessage({ id: 'withdrawal_success' }));
        r();
        return;
      }

      Toast.show(formatMessage({ id: 'Withdrawal_failure' }));
    }).catch((err) => {
      console.log(err, '---> err');

      Toast.show(formatMessage({ id: 'Withdrawal_exception' }));
    }).finally(() => {
      setVisible(false);
    });
  };

  const entrustAddDom = ({ rowData }) => (
    <div styleName="expand-box">
      <div
        className="t-c"
        onClick={() => {
          openNewPage({
            path: `trade.html#${TRADE_ROUTERS.INFO}?orderNo=${rowData.orderNo}&market=${rowData.smallMarket}`,
            pageType: PageType.HTML,
            title: '订单详情',
          });
        }}
      >
        <div styleName="expand-icon">
          <IconSvg path="icon_info" />
        </div>
        <FormattedMessage id="详情" />
      </div>
      <div
        className="t-c"
        styleName={['1', '2', '7'].includes(rowData.orderStatus) ? '' : 'disbaled'}
        onClick={() => {
          if (['1', '2', '7'].includes(rowData.orderStatus)) {
            setCurrent(rowData);
            if (userTradeConfigInfo.orderToConfirmByDialog) {
              setVisible(true);
            } else {
              cancelOrder();
            }
          }
        }}
      >
        <div styleName="expand-icon">
          <IconSvg path="icon_back_order" />
        </div>
        <FormattedMessage id="撤单" />
      </div>
    </div>
  );

  const list = useMemo(
    () => data.filter((item) => tradeMarket.length === 0 || tradeMarket.some((v) => v === item.tradeMarket)),
    [data, tradeMarket],
  );

  return (
    <div onClick={(e) => { e.stopPropagation(); }}>
      <TradeBasicModal
        title={formatMessage({ id: 'withdrawal_confirm' })}
        visible={visible}
        state={current}
        onClose={() => { setVisible(false); }}
        list={modalList}
        callback={cancelOrder}
      />
      <TableList
        hiddenBox={<NoMessage />}
        wrapperPadding={wrapperPadding}
        data={list}
        isLoading={loading}
        columns={template[templateCode]}
        addDom={entrustAddDom}
      />
    </div>
  );
};

export default IndexEntrustTable;
