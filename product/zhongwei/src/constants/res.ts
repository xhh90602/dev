export const enum ResponseCode {
  OK,
  ERROR = 500,
  TRADE_SESSION_TIMEOUT = 30201, // 交易超时、踢线
  USER_SESSION_TIMEOUT = 30202, // 手机号超时、踢线
  TO_REGISTER = 30204, // 去注册
  NEED_2FA = 30230,
  TRADE_TIMEOUT = 30231, // 交易超时、踢线
  TIME_OUT = 42020, // 操作超时(2FA时)
  MAINTAIN = 50001, // 维护中
  INIT_PASSWORD = 610547, // 是初始密码
  PASSWORD_EXPIRE = 610556, // 密码已过期
}
