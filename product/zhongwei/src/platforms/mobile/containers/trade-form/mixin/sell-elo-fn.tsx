import { TRADE_ORDER_TYPE } from '@/constants/trade';
import { mul, returnCurrency, sliceString } from '@/utils';
import { toSlice, toThousand } from '@dz-web/o-orange';
import { getClassNameByPriceChange } from '@dz-web/quote-client';
import { ISellOrderForm } from '@mobile/constants/trade';
import { FormattedMessage, useIntl } from 'react-intl';
import GroupCheckBox from '../component/group-check-box';
import TermOfValidity from '../component/term-of-validity';
import { editPositionNum, positionNum, numberInputEle, priceInputEle, LabelGold } from '../form-item-name';

const inputEle = ({
  qty,
  setQty,
  countMax,
  costPrice,
}) => [
  numberInputEle({
    bs: TRADE_ORDER_TYPE.SELL,
    countMax,
    value: qty,
    changeValue: (v: any) => setQty(v),
  }),
  positionNum(costPrice),
  editPositionNum({
    countMax,
    setQty,
    bs: TRADE_ORDER_TYPE.SELL,
  }),
];

/** 限价卖出模板 */
export default (props: ISellOrderForm) => {
  const {
    code,
    hasTip,
    market,
    countMax,
    state,
    setState,
    groupList,
    groupCheckProxy,
    sellPositionNumRender,
    costPrice,
  } = props;

  const { formatMessage } = useIntl();

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
    inactiveFlag: executeDateType,
  } = state;

  const defaultList = [
    {
      label: <FormattedMessage id="validity_date" />,
      content: (
        <TermOfValidity {...{ executeDateType, setExecuteDateType }} />
      ),
    },
    {
      label: (
        <LabelGold tip={hasTip} />
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

  /** 是否为组合模式 */
  if (groupList.length) {
    return [
      sellPositionNumRender,
      priceInputEle({
        bs: TRADE_ORDER_TYPE.SELL,
        value: price,
        changeValue: (v: any) => setPrice(v),
      }),
      {
        extraContent: <GroupCheckBox
          groupCheckProxy={groupCheckProxy}
          defaultFormList={inputEle}
          list={[
            {
              state: {
                price,
                setPrice,
                qty,
                setQty,
                countMax,
                code,
              },
              select: true,
              name: formatMessage({ id: 'individual_share' }),
              id: '个股',
            },
            ...groupList.map((group) => {
              const count = group.state.qtyMax;

              return ({
                state: {
                  setPrice: (v) => {
                    group.setState({ key: 'nowPrice', value: v });
                  },
                  price: group.state.nowPrice,
                  setQty: (v) => {
                    group.setState({ key: 'qty', value: v });
                  },
                  qty: group.state.qty,
                  countMax: count,
                },
                name: group.state.portfolioName,
                id: group.state.portfolioId,
              });
            }),
          ]}
        />,
      },
      ...defaultList,
    ];
  }

  return [
    sellPositionNumRender,
    priceInputEle({
      bs: TRADE_ORDER_TYPE.SELL,
      value: price,
      changeValue: (v: any) => setPrice(v),
    }),
    ...inputEle({
      qty,
      setQty,
      countMax,
      costPrice,
    }),
    ...defaultList,
  ];
};
