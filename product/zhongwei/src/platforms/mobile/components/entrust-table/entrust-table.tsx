/* eslint-disable react/require-default-props */
import TableList from '@mobile/components/table-list/table-list';
import {
  orderAndAveragePrice,
  qtyAndFilledQty,
  bsAndStatus,
  nameAndCode,
  nowAndOrderPrice,
  historyNameAndCode,
} from '@mobile/components/table-column-item/table-column-item';
import useEntrustList from '@/hooks/trade/use-entrust-list';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { sub } from '@/utils';
import { toFixed, toThousand } from '@dz-web/o-orange';
import { operateBusiness } from '@/api/module-api/trade';
import { Toast } from 'antd-mobile';
import IconSvg from '../icon-svg';

import './entrust-table.scss';
import { TRADE_ROUTERS } from '../../mpa/modules/trade/routers';
import NoMessage from '../no-message/no-message';
import TradeBasicModal from '../trade-basic-modal/trade-basic-modal';
import { useTradeStore } from '../../model/trade-store';
import { openNewPage, PageType } from '../../helpers/native/msg';

interface IEntrust {
  type: 'today' | 'history';
  templateCode?: 'default' | 'order-entrust' | 'order-history';
  // filterData?: Record<string, any>;
  wrapperPadding?: [number|string, number|string];
  setLen?: (num: number) => void
  historyReqBody?: {
    bs?: 'B' | 'S';
    status?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
  },
}

const list = [
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
    content: (s) => {
      if (s.orderType === 'MKT') return <FormattedMessage id="MKT" />;
      if (s.orderType === 'AO') return <FormattedMessage id="AO" />;
      return (
        <span>
          {toFixed(s.price, {
            precision: 3,
          })}
        </span>
      );
    },
  },
  {
    label: <FormattedMessage id="revoke_number" />,
    content: (s) => (
      <span>
        {toThousand(sub(s.qty, s.execQty))}
        (
        <FormattedMessage id="reference" />
        )
      </span>

    ),
  },
];

const EntrustTable = (props: IEntrust) => {
  const { formatMessage } = useIntl();
  const {
    type = 'today',
    templateCode = 'default',
    // filterData = {},
    historyReqBody = {},
    wrapperPadding = [0, 0],
    setLen = () => undefined,
  } = props;

  const update = useTradeStore((state) => state.entrustUpdate);
  const r = useTradeStore((state) => state.setEntrustUpdate);
  const [orderType, setOrderType] = useState('all');

  const finalHistoryReqBody = useMemo(() => ({
    ...historyReqBody,
    type: orderType === 'all' ? undefined : orderType,
  }), [historyReqBody, orderType]);

  const { data, length, loading } = useEntrustList({
    queryType: type,
    update,
    historyReqBody: finalHistoryReqBody,
  });

  useEffect(() => {
    setLen(length);
  }, [length]);

  const domRef = useRef<HTMLDivElement>(null);

  const template = {
    default: [
      historyNameAndCode(domRef, orderType, setOrderType),
      orderAndAveragePrice(),
      qtyAndFilledQty(),
      bsAndStatus({ width: '20%' }),
    ],
    'order-entrust': [
      nameAndCode(),
      nowAndOrderPrice(),
      qtyAndFilledQty(),
      bsAndStatus(),
    ],
  };

  const [expandWidth, setExpandWidth] = useState(0);

  useEffect(() => {
    const changeWidth = () => {
      if (!domRef.current) return;
      const { width = 0 } = domRef.current?.getBoundingClientRect() || {};
      setExpandWidth(width - 20);
    };

    changeWidth();

    window.addEventListener('resize', changeWidth);

    return () => {
      window.removeEventListener('resize', changeWidth);
    };
  }, [domRef.current]);

  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<any>({});
  const { userTradeConfigInfo } = useTradeStore();

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
    <div styleName="expand-box" style={{ width: `${expandWidth}px` }}>
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
        <FormattedMessage id="detail" />
      </div>
      <div
        className="t-c"
        styleName={['1', '2', '7'].includes(rowData.orderStatus) ? '' : 'disabled'}
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
        <FormattedMessage id="revoke" />
      </div>
    </div>
  );

  return (
    <div ref={domRef}>
      <TradeBasicModal
        title={formatMessage({ id: 'withdrawal_confirm' })}
        visible={visible}
        state={current}
        onClose={() => { setVisible(false); }}
        list={list}
        callback={cancelOrder}
      />
      <TableList
        hiddenBox={<NoMessage />}
        isLoading={loading}
        wrapperPadding={wrapperPadding}
        data={data}
        // titleHeight={30}
        columns={template[templateCode]}
        onRowClick={({ rowData }) => {
          if (type === 'history') {
            openNewPage({
              path: `trade.html#${TRADE_ROUTERS.INFO}?orderNo=${rowData.orderNo}&market=${rowData.smallMarket}`,
              pageType: PageType.HTML,
              title: '订单详情',
            });
          }
        }}
        addDom={type === 'history' ? undefined : entrustAddDom}
      />
    </div>
  );
};

export default memo(EntrustTable);
