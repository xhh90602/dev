import { TRADE_ORDER_TYPE } from '@/constants/trade';
import { mul, returnCurrency, sliceString } from '@/utils';
import { toSlice, toThousand } from '@dz-web/o-orange';
import { getClassNameByPriceChange } from '@dz-web/quote-client';
import { IOrderForm } from '@mobile/constants/trade';
import { FormattedMessage } from 'react-intl';
import TermOfValidity from '../component/term-of-validity';
import { canEditNum, editPositionNum, numberInputEle, priceInputEle, LabelGold } from '../form-item-name';

const inputEle = ({
  price,
  setPrice,
  qty,
  setQty,
}) => [
  priceInputEle({
    bs: TRADE_ORDER_TYPE.BUY,
    value: price,
    changeValue: (v: any) => setPrice(v),
  }),
  numberInputEle({
    bs: TRADE_ORDER_TYPE.BUY,
    value: qty,
    changeValue: (v: any) => setQty(v),
  }),
];

/** 限价买入模板 */
export default (props: IOrderForm) => {
  const {
    cashMax,
    financeMax,
    code,
    hasTip,
    market,
    countMax,
    state,
    setState,
    isFinan = false,
    excessRatio,
  } = props;

  const setPrice = (v) => {
    setState({ key: 'price', value: v });
  };

  const setQty = (v) => {
    setState({ key: 'qty', value: v });
  };

  const setExecuteDateType = (v) => {
    setState({ key: 'inactiveFlag', value: v });
  };

  const {
    price,
    qty,
    inactiveFlag,
  } = state;

  const defaultList = [
    isFinan && canEditNum({ cashMax, financeMax }),
    editPositionNum({
      isFinan,
      countMax: isFinan ? countMax : cashMax,
      code,
      setQty,
      bs: TRADE_ORDER_TYPE.BUY,
    }),
    {
      label: <FormattedMessage id="validity_date" />,
      content: (
        <TermOfValidity {...{ executeDateType: inactiveFlag, setExecuteDateType }} />
      ),
    },
    {
      label: (
        <LabelGold excessRatio={excessRatio} />
      ),
      content: (
        <div className="t-normal f-bold t-r f-s-32">
          {sliceString(mul(qty, price))}
          {returnCurrency(market as number, '')}
        </div>
      ),
    },
    hasTip && {
      label: <FormattedMessage id="order_borrowing_balance_estimate" />,
      content: (
        <div className={`${getClassNameByPriceChange(-1)} t-r`}>
          {
            toThousand(toSlice(hasTip))
          }
        </div>
      ),
    },
  ];

  return [
    ...inputEle({
      price,
      setPrice,
      qty,
      setQty,
    }),
    ...defaultList,
  ];
};
