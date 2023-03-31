import { TRIGGER_EXECUTE_TYPE, TRIGGER_TYPE } from '@/constants/trigger-trade';
import { TRADE_ORDER_TYPE } from '@/constants/trade';
import { FormattedMessage, useIntl } from 'react-intl';
import { priceTypeList, ISellOrderForm, priceTypeListA } from '@/platforms/mobile/constants/trade';
import { mul, returnCurrency, sliceString } from '@/utils';
import { toSlice, toThousand } from '@dz-web/o-orange';
import { getClassNameByPriceChange } from '@dz-web/quote-client';
import { Grid, Popover } from 'antd-mobile';
import { useMemo } from 'react';
import { isHKTradeMarket } from '../../trade-order/trade-order';
import GroupCheckBox from '../component/group-check-box';
import TriggerTermOfValidity from '../component/trigger-term-of-validity';
import { editPositionNum, numberInputEle, priceInputEle, LabelGold, positionNum } from '../form-item-name';
import '../trade-form.scss';

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

/** 条件单卖出模板 */
export default (props: ISellOrderForm) => {
  const {
    hasTip,
    market,
    state,
    setState,
    groupList,
    groupCheckProxy,
    countMax,
    costPrice,
  } = props;

  const {
    executePrice,
    executeDate,
    executeType,
    qty,
    executeDateType,
    type,
    lPrice,
    sPrice,
  } = state;

  const { formatMessage } = useIntl();

  const setPrice = (v) => {
    setState({ executePrice: v });
  };

  const setQty = (v) => {
    setState({ qty: v });
  };

  const setExecuteDateType = (v) => {
    setState({ executeDateType: v });
  };
  const setExecuteDate = (v) => {
    setState({ executeDate: v });
  };
  const setExecuteType = (v) => {
    setState({ executeType: v });
    /** 切换到触发价, 更新触发价为触发价格 */
    if (v === TRIGGER_EXECUTE_TYPE.C) {
      /** 设置对应触发条件下的触发价格 */
      setState({ executePrice: type === TRIGGER_TYPE.L ? lPrice : sPrice });
    }
  };

  const defaultList = [
    {
      label: formatMessage({ id: 'condition_validity_date' }),
      content: (
        <TriggerTermOfValidity {...{ executeDate, setExecuteDate, executeDateType, setExecuteDateType }} />
      ),
    },
    {
      label: (
        <LabelGold tip={hasTip} />
      ),
      content: (
        <div className="t-normal f-bold t-r f-s-32">
          {sliceString(mul(qty, executePrice))}
          {returnCurrency(market as number, '')}
        </div>
      ),
    },
    hasTip && {
      label: formatMessage({ id: 'order_borrowing_balance_estimate' }),
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
      {
        extraContent: (
          <Grid.Item span={10}>
            <div className="t-normal f-bold f-s-30 m-t-3">
              <FormattedMessage id="before_arrive_trigger_condition" />
              <Popover.Menu
                actions={priceTypeList.map((c) => ({
                  ...c,
                  text: (<div className={c.key === executeType ? 't-normal' : ''}>{c.text}</div>),
                }))}
                placement="bottom"
                onAction={(node: any) => {
                  setExecuteType(node.key);
                }}
                trigger="click"
              >
                <div styleName="select-text">
                  {priceTypeList.find((v) => v.key === executeType)?.text}
                  <span className="arrow" />
                </div>
              </Popover.Menu>
              <FormattedMessage id="proceed_sell" />
            </div>
          </Grid.Item>
        ),
        line: true,
      },
      executeType !== TRIGGER_EXECUTE_TYPE.S && priceInputEle({
        bs: TRADE_ORDER_TYPE.SELL,
        value: executePrice,
        changeValue: (v: any) => setPrice(v),
      }, formatMessage({ id: 'trigger_price' })),
      {
        extraContent: <GroupCheckBox
          groupCheckProxy={groupCheckProxy}
          defaultFormList={inputEle}
          list={[
            {
              state: {
                qty: state.qty,
                setQty,
                countMax,
              },
              select: true,
              name: formatMessage({ id: 'individual_share' }),
              id: '个股',
            },
            ...groupList.map((group) => ({

              state: {
                setQty: (v) => {
                  group.setState({ key: 'qty', value: v });
                },
                qty: group.state.qty,
                countMax: group.state.qtyMax,
              },
              name: group.state.portfolioName,
              id: group.state.portfolioId,
            })),
          ]}
        />,
      },
      ...defaultList,
    ];
  }

  const priceActions = useMemo(
    () => (isHKTradeMarket() ? priceTypeList : priceTypeListA)
      .filter((c) => !(type === TRIGGER_TYPE.R && c.key === TRIGGER_EXECUTE_TYPE.Z))
      .map((c) => ({
        ...c,
        text: <div className={c.key === executeType ? 't-normal' : ''}>{c.text}</div>,
      })),
    [type, executeType],
  );

  const showPriceInput = useMemo(
    () => (
      type === TRIGGER_TYPE.R
        ? executeType === TRIGGER_EXECUTE_TYPE.Z
        : executeType !== TRIGGER_EXECUTE_TYPE.S
    ),
    [executeType, type],
  );

  return [
    {
      extraContent: (
        <Grid.Item span={10}>
          <div className="t-normal f-bold f-s-30 m-t-3">
            <FormattedMessage id="before_arrive_trigger_condition" />
            <Popover.Menu
              actions={priceActions}
              placement="bottom"
              onAction={(node: any) => {
                setExecuteType(node.key);
              }}
              trigger="click"
            >
              <div styleName="select-text">
                {priceTypeList.find((v) => v.key === executeType)?.text}
                <span className="arrow" />
              </div>
            </Popover.Menu>
            <FormattedMessage id="proceed_sell" />
          </div>
        </Grid.Item>
      ),
      line: true,
    },
    showPriceInput && priceInputEle({
      bs: TRADE_ORDER_TYPE.SELL,
      lPrice,
      isCondition: true,
      executeType,
      value: executePrice,
      changeValue: (v: any) => setPrice(v),
      disabled: executeType === TRIGGER_EXECUTE_TYPE.C,
    }, formatMessage({ id: executeType === TRIGGER_EXECUTE_TYPE.C ? 'trigger_price' : 'bid_price' })),
    ...inputEle({
      qty: state.qty,
      setQty,
      countMax,
      costPrice,
    }),
    ...defaultList,
  ];
};
