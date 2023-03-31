/**
 * 订单状态
 * INVALID 已预约
 * RESERVED 已失效
 * ORDER_FAILED 下单失败
 * CANCELLED_ORDER 已撤单
 * ALL_TRANSACTIONS 全部成交
 * PARTIAL_TRANSACTION 部分成交
 * WAITING_FOR_TRANSACTION 等待成交
 */
export enum ORDER_STATUS {
  INVALID = 'INVALID',
  RESERVED = 'RESERVED',
  ORDER_FAILED = 'ORDER_FAILED',
  CANCELLED_ORDER = 'CANCELLED_ORDER',
  ALL_TRANSACTIONS = 'ALL_TRANSACTIONS',
  PARTIAL_TRANSACTION = 'PARTIAL_TRANSACTION',
  WAITING_FOR_TRANSACTION = 'WAITING_FOR_TRANSACTION',
}

/**
 * 订单状态映射多语言字典
 */
export const ORDER_STATUS_LANG_DICT = {
  [ORDER_STATUS.INVALID]: 'invalid',
  [ORDER_STATUS.RESERVED]: 'reserved',
  [ORDER_STATUS.ORDER_FAILED]: 'order_failed',
  [ORDER_STATUS.CANCELLED_ORDER]: 'withdrawals',
  [ORDER_STATUS.ALL_TRANSACTIONS]: 'all_transaction',
  [ORDER_STATUS.PARTIAL_TRANSACTION]: 'partial_transaction',
  [ORDER_STATUS.WAITING_FOR_TRANSACTION]: 'wait_transaction',
};

/**
 * 0已预约
 * 1等待上报
 * 2等待成交
 * 3等待撤单
 * 4部成待撤
 * 5部成部撤
 * 6已撤单
 * 7部分成交
 * 8全部成交
 * 9已失效
 * 10下单失败
 */
export enum ORDER_STATUS_ALL {
  RESERVED,
  WAIT_REPORT,
  WAIT_TRANSACTION,
  WAIT_REVOKE,
  PORTION_WAIT_TRANSACTION_REVOKE,
  PORTION_TRANSACTION_REVOKE,
  REVOKED,
  PORTION_TRANSACTION,
  ALL_TRANSACTION,
  INVALID,
  FAILED,
}

export function getOrderStatus(state: number) {
  // 部分成交：5部成部撤  4部成待撤  7部分成交
  const portionTradeArr = [
    ORDER_STATUS_ALL.PORTION_WAIT_TRANSACTION_REVOKE,
    ORDER_STATUS_ALL.PORTION_TRANSACTION_REVOKE,
    ORDER_STATUS_ALL.PORTION_TRANSACTION,
  ];

  if (portionTradeArr.includes(state)) {
    return ORDER_STATUS.PARTIAL_TRANSACTION;
  }

  // 等待成交： 1等待上报  2等待成交  3等待撤单
  const waitTradeArr = [ORDER_STATUS_ALL.WAIT_REPORT, ORDER_STATUS_ALL.WAIT_TRANSACTION, ORDER_STATUS_ALL.WAIT_REVOKE];

  if (waitTradeArr.includes(state)) {
    return ORDER_STATUS.WAITING_FOR_TRANSACTION;
  }

  switch (state) {
    case ORDER_STATUS_ALL.RESERVED:
      // 已预约： 0已预约
      return ORDER_STATUS.RESERVED;
    case ORDER_STATUS_ALL.REVOKED:
      // 已撤单：6已撤单
      return ORDER_STATUS.CANCELLED_ORDER;
    case ORDER_STATUS_ALL.INVALID:
      // 已失效：9已失效
      return ORDER_STATUS.INVALID;
    case ORDER_STATUS_ALL.FAILED:
      // 下单失败：10下单失败
      return ORDER_STATUS.ORDER_FAILED;
    default:
      // 全部成交：8全部成交
      return ORDER_STATUS.ALL_TRANSACTIONS;
  }
}

/**
 * 组合类型
 * 0 模拟盘
 * 1 实盘
 */
export enum PORTFOLIO_TYPE {
  SIMULATE = '0',
  FRIM_OFFER = '1',
}
