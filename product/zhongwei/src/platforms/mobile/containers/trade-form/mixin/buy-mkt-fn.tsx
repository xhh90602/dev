import { TRADE_ORDER_TYPE } from '@/constants/trade';
import { mul, returnCurrency, sliceString } from '@/utils';
import { toSlice, toThousand } from '@dz-web/o-orange';
import { getClassNameByPriceChange } from '@dz-web/quote-client';
// import GroupCheckBox from './component/group-check-box';
import { IOrderForm } from '@mobile/constants/trade';
import { FormattedMessage } from 'react-intl';
import { canEditNum, editPositionNum, numberInputEle, LabelGold } from '../form-item-name';

const inputEle = ({
  qty,
  setQty,
}) => [
  numberInputEle({
    bs: TRADE_ORDER_TYPE.BUY,
    value: qty,
    changeValue: (v: any) => setQty(v),
  }),
];

/** 市价买入模板 */
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

  const setQty = (v) => {
    setState({ key: 'qty', value: v });
  };

  const {
    price,
    qty,
  } = state;

  const defaultList = [
    isFinan && canEditNum({ cashMax, financeMax }),
    editPositionNum({
      isFinan,
      countMax: isFinan ? countMax : cashMax,
      cashMax,
      code,
      setQty,
      bs: TRADE_ORDER_TYPE.BUY,
    }),
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
      qty,
      setQty,
    }),
    ...defaultList,
  ];
};
