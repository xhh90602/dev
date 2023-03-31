/** 触发类型： L-涨跌幅；S-股价条件；R-反弹买入/回落卖出 */
export enum TRIGGER_TYPE {
  L = 'L',
  S = 'S',
  R = 'R',
}

/** 涨跌幅类型： N-现价；Y-昨收价；O-开盘价；C-成本价 */
export enum TRIGGER_L_TYPE {
  N = 'N',
  Y = 'Y',
  O = 'O',
  C = 'C',
}

/** 涨跌幅选项： U-上涨；D-下跌 */
export enum TRIGGER_L_OPTION {
  U = 'U',
  D = 'D',
}

/** 股价条件选项： U-上涨；D-下跌 */
export enum TRIGGER_S_OPTION {
  U = 'U',
  D = 'D',
}

/** 执行价格类型： S-市价；C-触发价；Z-指定价 */
export enum TRIGGER_EXECUTE_TYPE {
  S = 'S',
  C = 'C',
  Z = 'Z',
}
