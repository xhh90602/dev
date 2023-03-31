/* eslint-disable react/require-default-props */
import { useState } from 'react';
import ContractionArea from '@mobile/components/contraction-area/contraction-area';
import { FormattedMessage, useIntl } from 'react-intl';
import BasicCard from '../basic-card/basic-card';
import IconSvg from '../icon-svg';
import './trigger-table-item.scss';

/**
 * A待触发，B已触发，C已失效（到期+撤销）
 */
export enum TRIGGER_TYPE {
  pending = 'A',
  finish = 'B',
  error = 'C',
}

/**
 * trigger.type L涨跌幅、S股价条件、R反弹买入/回落卖出
 */
type triggerOption = {
  type: string;
  price?: number;
  ratio?: number;
  option?: string;
  Sprice?: number;
  lowestRise?: number;
  topLower?: number;
};

/**
 * title 股票名称展示替换
 * stockName 股票名称
 * time 触发时间
 * executeType 执行类型
 * price 价格
 * qty 股数
 * trigger 触发条件
 * dealStatus 状态
 * status 是否展示状态
 */
interface ITrigger {
  title?: null | JSX.Element | Element;
  className?: string;
  stockName?: string;
  stockCode?: string;
  time?: string;
  type: string;
  executeType: string;
  price: number;
  qty: number;
  trigger: triggerOption;
  status: string;
  dealStatus: string;
  addDom: any;
}

const dealStatusList = {
  W: (
    <span className="status-no-finish" styleName="status-icon">
      <IconSvg path="icon_trigger_no_finish" />
      <FormattedMessage id="await_make_bargain" />
    </span>
  ),
  A: (
    <span className="status-finish" styleName="status-icon">
      <IconSvg path="icon_trigger_finish" />
      <FormattedMessage id="all_make_bargain" />
    </span>
  ),
  P: (
    <span className="status-pending" styleName="status-icon">
      <IconSvg path="icon_trigger_pending" />
      <FormattedMessage id="part_make_bargain" />
    </span>
  ),
  D: (
    <span className="status-error" styleName="status-icon">
      <IconSvg path="icon_trigger_error" />
      <FormattedMessage id="already_expired" />
    </span>
  ),
};

/** 触发条件 dom */
const TriggerTableItem = (props: ITrigger) => {
  const {
    title = null,
    trigger,
    time = null,
    type,
    executeType,
    stockCode,
    price,
    qty,
    stockName,
    status = 'A',
    dealStatus,
    className,
    addDom = null,
  } = props;

  const [visible, setVisible] = useState(false);
  const { formatMessage } = useIntl();

  const executeTypeList = {
    S: formatMessage({ id: 'marker_price' }),
    C: formatMessage({ id: 'trigger_price' }),
    Z: formatMessage({ id: 'bid_price' }),
  };

  const buyText = `<span class="orange-color">${formatMessage({ id: 'buying' })}</span>`;
  const sellText = `<span class="blue-color">${formatMessage({ id: 'sale' })}</span>`;

  let triggerDom = '';

  /** 涨跌幅 */
  if (trigger?.type === 'L') {
    triggerDom = `${formatMessage({ id: 'trigger_type_L_text_hint' })}[${trigger?.price}]${
      trigger?.option === 'U' ? formatMessage({ id: 'rise' }) : formatMessage({ id: 'lower' })
    }${trigger?.ratio}%`;
  }

  /** 股价条件 */
  if (trigger?.type === 'S') {
    triggerDom = `${formatMessage({ id: 'trigger_type_S_text_hint' })}[${trigger?.Sprice}]`;
  }

  /** 反弹买入 */
  if (trigger?.type === 'R') {
    triggerDom = `${formatMessage({
      id: `trigger_type_R_text_hint_a_${type}`,
    })}${trigger?.lowestRise}%，${formatMessage({
      id: `trigger_type_R_text_hint_b_${type}`,
    })}${trigger?.topLower}%`;
  }

  const priceDom = executeType?.toLocaleUpperCase() === 'S' ? '' : `[${price}]`;

  const executeDom = `${formatMessage({ id: 'use' })}${executeTypeList[executeType?.toLocaleUpperCase()]}${priceDom}${
    type === 'B' ? buyText : sellText
  } * ${qty}${formatMessage({ id: 'stock' })}`;

  const hasAdd = addDom && status === 'A';

  return (
    <BasicCard styleName={`padding ${hasAdd ? 'p-b' : ''}`} className={className}>
      <div style={{ opacity: '1' }}>
        {(title || stockName) && (
          <>
            <div styleName="title" className="normal-opacity">
              <div styleName="name">
                {title || (
                  <span>
                    {stockName}
                    &nbsp;
                    {stockCode}
                  </span>
                )}
              </div>
              <div styleName="time">{time}</div>
            </div>
            <div className="line" styleName="line" />
          </>
        )}
        <div
          styleName="item"
          onClick={() => {
            setVisible(!visible);
          }}
        >
          <div>
            <span styleName="icon">{formatMessage({ id: 'condition' })}</span>
            <span className="f-bold">{triggerDom}</span>
          </div>
          <div>
            <span styleName="icon">{formatMessage({ id: 'execute' })}</span>
            <span className="f-bold" dangerouslySetInnerHTML={{ __html: executeDom }} />
          </div>
          {status !== 'A' ? (
            <div>
              <span styleName="icon">{formatMessage({ id: 'status' })}</span>
              <span>{dealStatusList[status === 'C' ? 'D' : dealStatus]}</span>
            </div>
          ) : (
            ''
          )}
        </div>
        {hasAdd && (
          <div>
            <ContractionArea defaultOpen={false}>
              <div onClick={(e) => e.stopPropagation()}>{addDom}</div>
            </ContractionArea>
          </div>
        )}
      </div>
    </BasicCard>
  );
};

export default TriggerTableItem;
