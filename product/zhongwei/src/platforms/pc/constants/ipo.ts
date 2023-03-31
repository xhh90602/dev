export const SUBSCRIBE_TYPE = {
  0: '融资认购',
  Z: '现金认购',
  O: '融资认购',
  E: '融资认购',
};

export enum SUBSCRIBE_TYPE_ALIAS {
  CASH = 'cash',
  FINANCING = 'financing',
}

export const SUBSCRIBE_TYPE_MAP = {
  [SUBSCRIBE_TYPE_ALIAS.CASH]: '现金认购',
  [SUBSCRIBE_TYPE_ALIAS.FINANCING]: '融资认购',
};

export const SUBSCRIBE_STATEMENT_NAME = '《中信建投新股认购声明》';
