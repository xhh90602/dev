import { Toast } from 'antd-mobile';
import { security } from '@/encrypt';

import { RequestProxy, RequestProxyScope, requestProxyManager } from '@dz-web/request';
import { userStatusChange, UserStatus } from '@mobile/helpers/native/msg';
import { values } from 'lodash-es';
import { encryption } from '@/platforms/mobile/helpers/generate-page';
import { createReqInstanceByProxy } from './base-request';

export enum TradeConditionKey {
  TRADETOKEN = 'tradeToken',
  ENCRYPTTOKEN = 'encryptToken',
}

const isEncrypt = window.GLOBAL_CONFIG.ENABLE_ENCRYPT;

/* 请求条件 */
const condition: {
  [TradeConditionKey.TRADETOKEN]: string;
  [TradeConditionKey.ENCRYPTTOKEN]?: string;
} = {
  [TradeConditionKey.TRADETOKEN]: '',
};

if (isEncrypt) {
  condition[TradeConditionKey.ENCRYPTTOKEN] = '';
}

/**
 * @description 发送请求条件代理
 * @description 用于在请求前拦截和条件生效后发送拦截的请求
 * @param tradeToken {String} 交易token
 * @param encryptToken {String} 加密token 非加密不存在这个属性
 */
export const tradeReqCondition = new Proxy(condition, {
  set: (target, key, val, receiver) => {
    const value = val;
    target[key] = !!value;
    if (!values(target).some((v) => !v)) {
      console.log('--------------------->发送拦截的交易请求');
      requestProxyManager.clear(RequestProxyScope.TRADE_TOKEN);
    }
    return Reflect.set(target, key, value, receiver);
  },
});

const enum ResponseCode {
  OK,
  ERROR = 500,
  TRADE_SESSION_INVALID = 76, // 会话无效
  TRADE_SESSION_TIMEOUT = 990151, // 交易超时、踢线
  USER_SESSION_TIMEOUT = 1006, // 手机号超时、踢线
  TO_REGISTER = 30204, // 去注册
  NEED_2FA = 30230,
  TRADE_TIMEOUT = 30231, // 交易超时、踢线
  TIME_OUT = 42020, // 操作超时(2FA时)
  MAINTAIN = 50001, // 维护中
  INIT_PASSWORD = 610547, // 是初始密码
  PASSWORD_EXPIRE = 610556, // 密码已过期
  STOKEN_EXPIRE = 100211, // 加密token过期
}
const noEncryption = ['trading/trans'];

const requestInterceptors = (config: any) => {
  // 处理参数
  const { data } = config;

  const isencryp = noEncryption.some((item) => config.url?.includes(item));
  /** 是否开启加密 */
  if (isEncrypt && isencryp) {
    config.headers = {
      _stoken: security.respKey,
      'Content-Type': 'application/json',
      ...config.headers,
    };
    console.log(config.url, '【加密请求发送数据】', { ...data });

    config.data = security.encrypt(JSON.stringify(data));
  }
  return config;
};

const responseInterceptors = async (response) => {
  let { data } = response;

  if (response.headers._enc === 'true' && isEncrypt) {
    data = security.decrypt(data);
    data = JSON.parse(data);

    console.log(response.config.url, '【接收解密数据】', data);
  }

  const { code, message } = data;
  if ([ResponseCode.TRADE_SESSION_INVALID, ResponseCode.TRADE_TIMEOUT].includes(code)) {
    // 登录失效通知
    userStatusChange({
      userStatus: UserStatus.sessioncode_expired,
      message,
    });

    return data;
  }

  // 加密token过期
  if (code === ResponseCode.STOKEN_EXPIRE) {
    tradeReqCondition.encryptToken = ''; // 重置加密token
    const stoken = await encryption(); // 重新获取加密token
    return tradeReq.instanceProxy({ ...response.config, headers: { _stoken: stoken } }); // 重新发送请求
  }

  if (code && code !== ResponseCode.OK && code !== ResponseCode.STOKEN_EXPIRE) {
    Toast.show({ content: message });
  }

  return data;
};

const tradeReq = createReqInstanceByProxy(
  {
    requestInterceptors,
    responseInterceptors,
  },
  {
    proxyInstance: new RequestProxy(RequestProxyScope.TRADE_TOKEN),
    callback: () => {
      const isNext = !values(tradeReqCondition).some((v) => !v);
      console.log(`交易请求-----------${!isNext ? '拦截' : '通过'}-------------->`, tradeReqCondition);
      return isNext;
    },
  },
);
export default tradeReq;
