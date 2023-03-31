import { TRADE_ORDER_TYPE } from '@/constants/trade';
import { mul, returnCurrency, sliceString } from '@/utils';
import { toSlice, toThousand } from '@dz-web/o-orange';
import { getClassNameByPriceChange } from '@dz-web/quote-client';
import { ISellOrderForm } from '@mobile/constants/trade';
import { FormattedMessage, useIntl } from 'react-intl';
import GroupCheckBox from '../component/group-check-box';
import { editPositionNum, LabelGold, numberInputEle, positionNum } from '../form-item-name';

const inputEle = ({
  qty,
  setQty,
  countMax,
  costPrice,
}) => [
  numberInputEle({
    bs: TRADE_ORDER_TYPE.SELL,
    value: qty,
    countMax,
    changeValue: (v: any) => setQty(v),
  }),
  positionNum(costPrice),
  editPositionNum({
    countMax,
    setQty,
    bs: TRADE_ORDER_TYPE.SELL,
  }),
];

/** 竞价卖出模板 */
export default (props: ISellOrderForm) => {
  const {
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

  const setQty = (v) => {
    setState({ key: 'qty', value: v });
  };

  const {
    price,
    qty,
  } = state;

  const defaultList = [
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
      label: (<FormattedMessage id="order_borrowing_balance_estimate" />),
      content: (
        <div className={`${getClassNameByPriceChange(-1)} t-r`}>
          {
            toThousand(toSlice(hasTip))
          }
        </div>
      ),
    },
  ];

  if (groupList.length) {
    return [
      sellPositionNumRender,
      {
        extraContent: <GroupCheckBox
          groupCheckProxy={groupCheckProxy}
          defaultFormList={inputEle}
          list={[
            {
              state: {
                qty,
                setQty,
                countMax,
              },
              select: true,
              name: formatMessage({ id: 'individual_share' }),
              id: '个股',
            },
            ...groupList.map((group) => {
              const count = group.state.qtyMax;

              return ({
                state: {
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
    ...inputEle({
      // price,
      // setPrice,
      qty,
      setQty,
      countMax,
      costPrice,
    }),
    ...defaultList,
  ];
};
