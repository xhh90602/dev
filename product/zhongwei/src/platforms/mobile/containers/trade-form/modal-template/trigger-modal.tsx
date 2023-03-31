/* eslint-disable react/no-array-index-key */
import { useState } from 'react';
import { TRADE_ORDER_TYPE, VALIDITY_DATA, VALIDITY_DATA_TEXT } from '@/constants/trade';
import { mul, sliceString } from '@/utils';
import { toSlice, toThousand } from '@dz-web/o-orange';
import { Modal, Toast, SpinLoading } from 'antd-mobile';
import { FormattedMessage, useIntl } from 'react-intl';

import IconNotSelect from '@mobile/images/icon_not_select.svg';
import IconSelect from '@mobile/images/icon_select.svg';

import '../trade-form.scss';
import dayjs from 'dayjs';

const lTypeText = {
  N: <FormattedMessage id="newest_price" />, // 最新价
  Y: <FormattedMessage id="last_closing_price" />, // 昨收价
  O: <FormattedMessage id="opening_price" />, // 开盘价
};

const executeTypeList = {
  S: <FormattedMessage id="marker_price" />, // 市价
  C: <FormattedMessage id="trigger_price" />, // 触发价
  Z: <FormattedMessage id="bid_price" />, // 指定价
};

export const getExecuteText = (bs, state) => {
  if (bs) {
    if (state.type === 'L') {
      const priceDom = lTypeText[state.lType];

      return (
        <span>
          <FormattedMessage id="trigger_modal_buy_l" />
          {state.lType === 'N' && '['}
          {priceDom}
          {state.lType === 'N' && ']'}
          <FormattedMessage id={state.lOption === 'U' ? 'rise' : 'lower'} />
          {state.lRatio}
          %
        </span>
      );
    }

    if (state.type === 'S') {
      return (
        <span>
          <FormattedMessage id="trigger_modal_buy_s" />
          {state.sPrice}
        </span>
      );
    }

    return (
      <span>
        <FormattedMessage id="trigger_modal_buy_r_1" />
        {state.rTopLower}
        %，
        <FormattedMessage id="trigger_modal_buy_r_2" />
        {state.rLowestRise}
        %
      </span>
    );
  }

  if (state.type === 'L') {
    const priceDom = lTypeText[state.lType];

    return (
      <span>
        <FormattedMessage id="trigger_modal_buy_l" />
        {state.lType === 'N' && '['}
        {priceDom}
        {state.lType === 'N' && ']'}
        <FormattedMessage id={state.lOption === 'U' ? 'rise' : 'lower'} />
        {state.lRatio}
        %
      </span>
    );
  }

  if (state.type === 'S') {
    return (
      <span>
        <FormattedMessage id="trigger_modal_sell_s" />
        {state.sPrice}
      </span>
    );
  }

  return (
    <span>
      <FormattedMessage id="trigger_modal_sell_r_1" />
      {state.rLowestRise}
      %，
      <FormattedMessage id="trigger_modal_sell_r_2" />
      {state.rTopLower}
      %
    </span>
  );
};

const list = ({ bs, groups = [], state, stockCheck }) => [
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
    content: () => <FormattedMessage id="condition_order" />,
  },
  {
    diy: () => (
      <div styleName="desc-card">
        <div styleName="desc-item">
          <div styleName="desc-label">
            <FormattedMessage id="condition" />
          </div>
          <div styleName="desc-text">{getExecuteText(bs, state)}</div>
        </div>
        <div styleName="desc-item">
          <div styleName="desc-label">
            <FormattedMessage id="execute" />
          </div>
          <div styleName="desc-text">
            <FormattedMessage id="use" />
            {executeTypeList[state.executeType]}
            {state.executeType !== 'S' ? state.executePrice : ''}
            <FormattedMessage id={bs ? 'buying' : 'sale'} />
          </div>
        </div>
      </div>
    ),
  },
  {
    label: <FormattedMessage id="direction" />,
    content: () => <FormattedMessage id={bs ? 'buying' : 'sale'} />,
    color: true,
  },
  {
    label: <FormattedMessage id="qty" />,
    content: () => toThousand([state.qty, ...groups.map((v: any) => v.qty)].reduce((p, v) => p + Number(v || 0), 0)),
  },
  groups.length && {
    diy: (d) => (
      <div styleName="desc-card">
        {[
          stockCheck && { portfolioName: <FormattedMessage id="number_of_individual_shares" />, qty: d.qty },
          ...groups,
        ].map((v, i) => (
          <div styleName="desc-item" key={i}>
            <div>{v.portfolioName}</div>
            <div styleName="desc-text">{toThousand(v.qty)}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    label: <FormattedMessage id="condition_order_of_validity" />,
    content: () => (state.executeDateType === VALIDITY_DATA.A
      ? dayjs(state.executeDate).format('YYYY-MM-DD')
      : VALIDITY_DATA_TEXT[state.executeDateType]),
  },
  {
    line: true,
  },
  {
    label: <FormattedMessage id="price_estimate" />,
    content: () => (
      <span className="f-s-32 f-bold">
        {sliceString(
          mul(
            [state.qty, ...groups.map((v: any) => v.qty)].reduce((p, v) => p + Number(v || 0), 0),
            state.executePrice,
          ),
        )}
      </span>
    ),
  },
];

const listBuySell = ({ state }) => [
  {
    label: <FormattedMessage id="condition" />,
    content: () => <FormattedMessage id="sale_condition" />,
  },
  {
    diy: () => (
      <div styleName="desc-card">
        <div styleName="desc-item">
          <div styleName="desc-label">
            <FormattedMessage id="condition" />
          </div>
          <div styleName="desc-text">{getExecuteText(false, state)}</div>
        </div>
        <div styleName="desc-item">
          <div styleName="desc-label">
            <FormattedMessage id="execute" />
          </div>
          <div styleName="desc-text">
            <FormattedMessage id="use" />
            {executeTypeList[state.executeType]}
            {state.executeType !== 'S' ? state.executePrice : ''}
            <FormattedMessage id="sale" />
          </div>
        </div>
      </div>
    ),
  },
  {
    label: <FormattedMessage id="direction" />,
    content: () => <FormattedMessage id="sale" />,
    color: true,
    colorText: 'var(--blue-color)',
  },
  {
    label: <FormattedMessage id="qty" />,
    content: () => toSlice(state.qty),
  },
  {
    label: <FormattedMessage id="condition_order_of_validity" />,
    content: () => (state.executeDateType === VALIDITY_DATA.A
      ? dayjs(state.executeDate).format('YYYY-MM-DD')
      : VALIDITY_DATA_TEXT[state.executeDateType]),
  },
  {
    line: true,
  },
  {
    diy: () => (
      <div className="t-desc f-s-22 m-t-15">
        <FormattedMessage id="trigger_modal_condition_validity_hint" />
      </div>
    ),
  },
  {
    label: <FormattedMessage id="price_estimate" />,
    content: () => <span className="f-s-32 f-bold">{sliceString(mul(state.qty, state.executePrice))}</span>,
  },
];

const TriggerModal = (props) => {
  const {
    visible,
    onClose,
    state,
    callback = () => undefined,
    color = 'var(--orange-color)',
    bs,
    groups,
    stockCheck,
    confirmLoading = false,
  } = props;

  const { formatMessage } = useIntl();

  localStorage.getItem('triggerDealChecked');

  const [checked, setChecked] = useState(localStorage.getItem('triggerDealChecked') || false);

  const listRender = (arr) => arr.map((form: any) => {
    if (!form) return null;

    if (form.line) return <div className="line" />;

    if (form.diy) return form.diy(state);

    return (
      <div key={form.label?.props?.id || form.label} styleName="content-item" className="flex-c-between">
        <div styleName="label">
          {form.label}
        </div>
        <div className="f-bold" style={{ color: form.color ? form.colorText || color : 'var(--text-color)' }}>
          {form.content(state)}
        </div>
      </div>
    );
  });

  return (
    <Modal
      visible={visible}
      styleName="trigger-modal"
      onClose={() => {
        onClose();
      }}
      disableBodyScroll={false}
      closeOnMaskClick
      destroyOnClose
      content={(
        <div styleName="modal">
          <div styleName="title">
            <FormattedMessage id="order_detail" />
          </div>
          <div styleName="content">
            {listRender(
              list({
                bs: bs === TRADE_ORDER_TYPE.BUY,
                groups,
                state: {
                  ...state.executeInfo,
                  ...state.trigger,
                },
                stockCheck,
              }),
            )}
          </div>
          {state.sellSwitch && (
            <>
              <div styleName="sell-box">
                <div styleName="sell-tip">
                  <FormattedMessage id="trigger_modal_sale_condition_hint" />
                </div>
              </div>
              <div styleName="content">
                {listRender(
                  listBuySell({
                    state: {
                      ...state.sellExecuteInfo,
                      ...state.sellTrigger,
                    },
                  }),
                )}
              </div>
            </>
          )}
          <div styleName="sell-tip-desc">
            <div
              styleName="check-box"
              onClick={() => {
                setChecked(!checked);
                localStorage.setItem('triggerDealChecked', String(!checked));
              }}
            >
              <img alt="" src={checked ? IconSelect : IconNotSelect} />
              <span>
                <FormattedMessage id="i_have_read_and_agree" />
                <span className="t-link">
                  《
                  <FormattedMessage id="zhongwei_condition_agreement" />
                  》
                </span>
              </span>
            </div>
            <div className="t-desc f-s-22">
              <p>
                <FormattedMessage id="warm_prompt" />
                ：
              </p>
              <p><FormattedMessage id="trigger_modal_warm_prompt_1" /></p>
              <p><FormattedMessage id="trigger_modal_warm_prompt_2" /></p>
              <p><FormattedMessage id="trigger_modal_warm_prompt_3" /></p>
            </div>
          </div>
          <div styleName="tool">
            <div
              className="flex-c-c"
              styleName="cancel-btn"
              onClick={() => {
                onClose();
              }}
            >
              <FormattedMessage id="cancel" />
            </div>
            <div
              className="flex-c-c"
              styleName="sure-btn"
              style={{ '--bg': color }}
              onClick={() => {
                if (!checked) {
                  Toast.show(formatMessage({ id: 'please_sign_the_agreement' }));
                  return;
                }
                callback();
              }}
            >
              {confirmLoading && <SpinLoading className="m-r-10" color="#fff" style={{ '--size': '1em' }} />}
              <FormattedMessage id="determine" />
            </div>
          </div>
        </div>
      )}
    />
  );
};

export default TriggerModal;
