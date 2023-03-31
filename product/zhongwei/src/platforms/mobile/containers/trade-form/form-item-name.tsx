/* eslint-disable no-restricted-properties */
import { Popover } from 'antd-mobile';
import { useRef } from 'react';
import { FormattedMessage } from 'react-intl';

import { getClassNameByPriceChange } from '@dz-web/quote-client';
import { toSlice, toThousand } from '@dz-web/o-orange';

import { mul, sliceString } from '@/utils';
import { TRADE_ORDER_TYPE, VALIDITY_DATA } from '@/constants/trade';

import NumberInput from './component/number-input';
import MaxPositionTab from './component/max-position-tab';
import PriceInput from './component/price-input';

import './trade-form.scss';

export const LabelGold = (props) => {
  const { excessRatio } = props;

  const containerRef = useRef<any>(null);

  return (
    <Popover
      mode="dark"
      content={(
        <FormattedMessage id={excessRatio < 1
          ? 'buy_power_deficiency_ordet_fail_hint'
          : 'buy_power_deficiency_hint'}
        />
      )}
      placement="topLeft"
      visible={excessRatio > 0}
      getContainer={() => containerRef.current}
    >
      <span className="t-normal" ref={containerRef}>
        <FormattedMessage id="price_estimate" />
      </span>
    </Popover>
  );
};

/** 价格输入 */
export const priceInputEle = (params: any, labelText = '') => ({
  label: (
    <div className="f-s-26 t-label">{labelText || <FormattedMessage id="limited_price" />}</div>
  ),
  content: <PriceInput {
    ...params
  }
  />,
  line: true,
});

/** 数量输入框 */
export const numberInputEle = (params: any) => ({
  label: (
    <div className="f-s-26 t-label">
      <FormattedMessage id="qty" />
    </div>
  ),
  line: true,
  content: <NumberInput
    {...params}
  />,
});

/** 可买 */
export const canEditNum = (params) => {
  const { cashMax, financeMax } = params;

  return ({
    label: (
      <div>
        <div>
          <FormattedMessage id="cash_enable_buy" />
          &nbsp;
          <span>
            {toThousand((cashMax === 0 || cashMax) ? cashMax : '--')}
          </span>
        </div>
      </div>
    ),
    content: (
      <div className="t-r">
        <div>
          <FormattedMessage id="financing_enable_buy" />
          &nbsp;
          <span>
            {toThousand((financeMax === 0 || financeMax) ? financeMax : '--')}
          </span>
        </div>
      </div>
    ),
  });
};

/** 最大可卖|可买 */
export const editPositionNum = (params) => {
  const {
    countMax = '',
    setQty = (v) => { console.log(v); },
    bs = TRADE_ORDER_TYPE.BUY,
    isFinan = false,
  } = params;

  const isBuy = bs === TRADE_ORDER_TYPE.BUY;

  return {
    label: (
      <div>
        {
          isBuy
            ? <FormattedMessage id={isFinan ? 'max_enable_buy' : 'enable_buy'} />
            : <FormattedMessage id="enable_sell_qty" />
        }
        &nbsp;
        <span>
          {toThousand((countMax === 0 || countMax) ? countMax : '--')}
        </span>
      </div>
    ),
    content: (
      <MaxPositionTab
        setStockNumber={setQty}
        countMax={countMax}
      />
    ),
  };
};

/** 持仓成本 */
export const positionNum = (num: StrNumber) => ({
  label: (
    <div>
      <FormattedMessage id="position_cost" />
      &nbsp;
      <span>
        {num}
      </span>
    </div>
  ),
});

/** 金额(预估) */
export const predictCount = (props = {
  qty: 0,
  price: 10,
  currency: 'HKD',
  visible: true,
}) => ({
  label: props.visible ? (
    <div styleName="has-tips">
      <div styleName="tips">
        <FormattedMessage id="buy_power_deficiency_ordet_fail_hint" />
        &nbsp;&nbsp;
        <FormattedMessage id="go_to_top_up" />
      </div>
      <FormattedMessage id="price_estimate" />
    </div>
  ) : (<FormattedMessage id="price_estimate" />),
  labelClassName: 't-normal f-bold f-s-32',
  content: (
    <div className="t-normal f-bold t-r f-s-32">
      {sliceString(mul(props.qty, props.price))}
      {props.currency}
    </div>
  ),
});

/** 下单借款金额(预估) */
export const predictOrderCount = (props = {
  finance: 1,
}) => ({
  label: <FormattedMessage id="order_borrowing_balance_estimate" />,
  content: (
    <div className={`${getClassNameByPriceChange(props.finance)} t-r`}>
      {
        toSlice(props.finance)
      }
    </div>
  ),
});

/** 有效期 */
export const termOfValidity = (active: VALIDITY_DATA, onCheck: (s: VALIDITY_DATA) => void) => ({
  label: <FormattedMessage id="validity_date" />,
  content: (
    <div styleName="tab-polygon">
      <div
        styleName={active === VALIDITY_DATA.N ? 'active' : ''}
        onClick={() => onCheck(VALIDITY_DATA.N)}
      >
        <FormattedMessage id="on_that_day" />
      </div>
      <div
        styleName={active === VALIDITY_DATA.E ? 'active' : ''}
        onClick={() => onCheck(VALIDITY_DATA.E)}
      >
        <FormattedMessage id="before_revoke" />
      </div>
      <div
        styleName={active === VALIDITY_DATA.A ? 'active' : ''}
        onClick={() => onCheck(VALIDITY_DATA.A)}
      >
        <FormattedMessage id="assign_date" />
      </div>
    </div>
  ),
});
