/* eslint-disable react/no-array-index-key */
import { TRADE_ORDER_STATUS, TRADE_ORDER_TYPE, VALIDITY_DATA_TEXT } from '@/constants/trade';
import { getOrderTypeText } from '@/platforms/mobile/constants/trade-order-type';
import { mul, sliceString } from '@/utils';
import { toSlice, toThousand } from '@dz-web/o-orange';
import { FormattedMessage } from 'react-intl';
import '../trade-form.scss';

const normalTemplate = ({ type, groups = [] as any[], stockCheck }) => [
  {
    label: <FormattedMessage id="name" />,
    content: (d) => d.name || '',
  },
  {
    label: <FormattedMessage id="code" />,
    content: (d) => d.code || '',
  },
  {
    label: <FormattedMessage id="order_type" />,
    content: (d) => getOrderTypeText(d.orderType),
  },
  {
    label: <FormattedMessage id="direction" />,
    content: (d) => (
      <FormattedMessage id={d.bs === TRADE_ORDER_TYPE.BUY
        ? 'buying'
        : 'sale'}
      />
    ),
    color: true,
  },
  {
    label: <FormattedMessage id="qty" />,
    content: (d) => toThousand([
      d.qty,
      ...groups.map((v) => v.qty),
    ].reduce((p, v) => p + Number(v), 0)),
  },
  groups.length && {
    diy: (d) => (
      <div styleName="desc-card">
        {
          [
            stockCheck && { portfolioName: <FormattedMessage id="number_of_individual_shares" />, qty: d.qty },
            ...groups,
          ].map((v, i) => (v ? (
            <div styleName="desc-item" key={i}>
              <div>{v.portfolioName}</div>
              <div styleName="desc-text">{toThousand(v.qty)}</div>
            </div>
          ) : null))
        }
      </div>
    ),
  },
  type === TRADE_ORDER_STATUS.ELO && {
    label: <FormattedMessage id="price" />,
    content: (d) => toSlice(d.price),
  },
  [TRADE_ORDER_STATUS.AO, TRADE_ORDER_STATUS.AL].includes(type) && {
    label: <FormattedMessage id="bidding" />,
    content: (d) => toSlice(d.price),
  },
  {
    label: <FormattedMessage id="time_limit" />,
    content: (d) => (VALIDITY_DATA_TEXT[d.inactiveFlag]),
  },
  {
    line: true,
  },
  {
    label: <FormattedMessage id="price_estimate" />,
    content: (d) => (
      <span className="f-s-32 f-bold">
        {sliceString(mul(
          [
            d.qty,
            ...groups.map((v: any) => v.qty),
          ].reduce((p, v) => p + Number(v || 0), 0),
          d.price,
        ))}
      </span>
    ),
  },
  type === TRADE_ORDER_STATUS.MKT && {
    diy: () => (
      <div styleName="desc-card-bottom">
        <FormattedMessage id="mtk_order_risk_hint_text" />
      </div>
    ),
  },
];

export default normalTemplate;
