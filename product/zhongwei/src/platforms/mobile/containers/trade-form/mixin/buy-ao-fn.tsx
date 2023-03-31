import { TRADE_ORDER_TYPE } from '@/constants/trade';
import { mul, returnCurrency, sliceString } from '@/utils';
import { toSlice, toThousand } from '@dz-web/o-orange';
import { getClassNameByPriceChange } from '@dz-web/quote-client';
import { Switch } from 'antd-mobile';
import { IOrderForm } from '@mobile/constants/trade';
import { FormattedMessage, useIntl } from 'react-intl';
import { canEditNum, editPositionNum, numberInputEle, priceInputEle, LabelGold } from '../form-item-name';

/** 竞价买入模板 */
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
    checked,
    setChecked,
    isFinan = false,
    excessRatio,
  } = props;

  const { formatMessage } = useIntl();

  const setPrice = (v) => {
    setState({ key: 'price', value: v });
  };

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
    {
      label: (
        <div className="f-s-26 t-normal">
          <FormattedMessage id="bid_price_title" />
        </div>
      ),
      line: true,
      content: <div className="t-r"><Switch checked={checked} onChange={(v) => setChecked(v)} /></div>,
    },
    checked && priceInputEle({
      bs: TRADE_ORDER_TYPE.BUY,
      value: price,
      changeValue: (v: any) => setPrice(v),
    }, formatMessage({ id: 'amount' })),
    numberInputEle({
      bs: TRADE_ORDER_TYPE.BUY,
      value: qty,
      changeValue: (v: any) => setQty(v),
    }),
    ...defaultList,
  ];
};
