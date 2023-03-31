/** 买卖方向 */
export enum BS_DIRECTION {
  BUY = 'B',
  SELL = 'S',
}

/** 下单类型 */
export enum TRADE_ORDER_TYPE {
  BUY = 'B', // 买入
  SELL = 'S', // 卖出
}

/** 下单委托状态 */
export enum TRADE_ORDER_STATUS {
  MKT = 'MKT', // 市价单
  ELO = 'ELO', // 限价单（HK）
  LMT = 'LMT', // 限价单 （A）
  AO = 'AO', // 竞价单
  AL = 'AL', // 竞价单(指定价)
  CONDITION = 'CONDITION', // 条件单 (PS:自己定义的)
}

/** 委托状态按钮字体 */
export enum TRADE_STATUS_TEXT {
  MKT = '市价',
  ELO = '限价',
  AO = '竞价',
  AL = '竞价',
  CONDITION = '提交',
}

/**
 * 订单委托状态
 * 多语言字典映射
 */
export const TRADE_ORDER_STATUS_LANG_DOCT = {
  [TRADE_ORDER_STATUS.MKT]: 'market_order',
  [TRADE_ORDER_STATUS.ELO]: 'limit_price_order',
  [TRADE_ORDER_STATUS.LMT]: 'limit_price_order',
  [TRADE_ORDER_STATUS.AO]: 'bidding_order',
  [TRADE_ORDER_STATUS.AL]: 'bidding_order',
  [TRADE_ORDER_STATUS.CONDITION]: 'condition_order',
};

/**
 * 订单有效期
 * N: 当日
 * E: 撤单前
 * A: 指定日期
 */
export enum VALIDITY_DATA {
  N = 'N',
  E = 'E',
  A = 'A',
}

export enum VALIDITY_DATA_TEXT {
  N = '当日有效',
  E = '撤单前有效',
  A = '指定日期',
}

/**
 * 订单有效期
 * 多语言字典映射
 */

export const ORDER_VALIDITY_LANG_DICT = {
  [VALIDITY_DATA.N]: 'this_date_only',
  [VALIDITY_DATA.E]: 'valid_until_withdrawal',
  [VALIDITY_DATA.A]: 'appointed_day',
};

/**
 * 交易账号类型
 * CASH: 现金
 * FINANCING: 融资
 */
export enum TRADE_ACCOUNT_TYPE {
  CASH = 'C',
  FINANCING = 'M',
}

/**
 * 订单类型
 * 1: 普通单/市价单
 * 2: 条件单
 * 3: 组合单
 */
export enum ORDER_TYPE_TRADE {
  GENERAL = 1,
  CONDITION = 2,
  COMBINE = 3,
}

/**
 * 订单类型
 * 多语言字典映射
 */
export const ORDER_TYPE_LANG_DICT = {
  [ORDER_TYPE_TRADE.GENERAL]: 'market_order',
  [ORDER_TYPE_TRADE.CONDITION]: 'condition_order',
  [ORDER_TYPE_TRADE.COMBINE]: 'combination_order',
};
