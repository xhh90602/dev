import { FormattedMessage } from 'react-intl';

export enum TradeSearchTableType {
  TODAY = 'today',
  HISTORY = 'history',
}

export type CheckProxy = boolean[];

/**
 * 组合数据结构
 * @param bs 买卖方向
 * @param id 组合股票id
 * @param portfolioName 组合名称
 * @param portfolioId 组合id
 * @param nowPrice 价格
 * @param qty 数量
 * @param stockCode 股票代码
 * @param tradeMarket 交易市场
 */
export interface GroupObject {
  bs: string;
  id: number;
  portfolioName: string;
  portfolioId: number;
  nowPrice: number;
  qty: number;
  stockCode: string;
  tradeMarket: string;
  [s: string]: any;
}

/**
 * 买入表单初始化
 */
export interface IOrderForm {
  countMax: StrNumber;
  financeMax: StrNumber;
  cashMax: StrNumber;
  code?: string;
  hasTip?: string;
  market?: StrNumber;
  state: Record<string, any>;
  setState: any;
  [s: string]: any;
}

/**
 * 卖出表单初始化
 */
export interface ISellOrderForm extends IOrderForm {
  groupList: GroupObject[];
  groupCheckProxy: CheckProxy;
}

export const priceTypeList = [
  {
    text: <FormattedMessage id="marker_price" />,
    key: 'S',
  }, {
    text: <FormattedMessage id="trigger_price" />,
    key: 'C',
  }, {
    text: <FormattedMessage id="bid_price" />,
    key: 'Z',
  },
];

export const priceTypeListA = [
  {
    text: <FormattedMessage id="trigger_price" />,
    key: 'C',
  }, {
    text: <FormattedMessage id="bid_price" />,
    key: 'Z',
  },
];

/** 委托方向 */
export const entrustOrderDirection = [
  {
    label: <FormattedMessage id="all" />,
    value: '',
  },
  {
    label: <FormattedMessage id="buying" />,
    value: 'B',
  },
  {
    label: <FormattedMessage id="sale" />,
    value: 'S',
  },
];

/** 币种 */
export const currencyList = [
  {
    key: 'HKD',
    text: 'HKD',
  },
  {
    key: 'USD',
    text: 'USD',
  },
  {
    key: 'CNY',
    text: 'CNY',
  },
];
