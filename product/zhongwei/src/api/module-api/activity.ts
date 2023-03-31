import { createReqInstanceByProxy, userTokenProxyInfo } from '../create-instance/base-request';

const { commonServer } = window.GLOBAL_CONFIG.COMMON_SERVERS;
console.log('commonServer', commonServer);

// 活动的请求
const Request = createReqInstanceByProxy({ defaultBaseUrl: 'http://10.10.11.234:8831' });
// Base的请求
const BaseRequest = createReqInstanceByProxy({ defaultBaseUrl: commonServer }, userTokenProxyInfo);

/**
 * 判断是否开户
 */
export function openAccountJudge(parameter: any): Promise<any> {
  return BaseRequest.postByJsonWithToken<any>('/openaccount/page/getMobileByAccount', parameter);
}

/**
 * 返回开户状态/trade/info/get
 */
export function openAccountStatus(parameter: any): Promise<any> {
  return BaseRequest.postByJsonWithToken<any>('/uc/trade/info/get', parameter);
}

/**
 * 查询历史卡券列表
 */
export function getHistoryCoypon(parameter: any): Promise<any> {
  return BaseRequest.postByJsonWithToken<any>('/myCoupon/history', parameter);
}

/**
 * 查询我的卡券列表
 */
export function getMyCoypon(parameter: any): Promise<any> {
  return BaseRequest.postByJsonWithToken<any>('/activity/myCoupon/list', parameter);
}

/**
 * 查询活动列表
 */
export function getActivitys(parameter: any) {
  return BaseRequest.postByJsonWithToken<any>('/activity/activity/list', parameter);
}

/**
 * 领取奖励
 */
export function getAward(parameter: any) {
  return BaseRequest.postByJsonWithToken<any>('/activity/activity/getRewards', parameter);
}

/**
 * 活动详情
 */
export function getActivityDetail(parameter: any) {
  return BaseRequest.postByJsonWithToken<any>('/activity/activity/info', parameter);
}

/**
 * 领取奖励
 */
export function getInviteFriendOpenAccountAward(parameter: any) {
  return BaseRequest.postByJsonWithToken<any>('/activity/activity/getCountRewards', parameter);
}

/**
 * 获取区号
 */
export function getAreaCode(parameter: any) {
  return BaseRequest.getByJson<any>('/platform/areaCode/list', parameter);
}

/**
 * 获取验证码
 */
export function getVerifyCode(parameter: any) {
  return BaseRequest.postByJsonWithToken<any>('/uc/sms/send', parameter);
}

/**
 * 验证码登录
 */
export function verifyCodeLogin(parameter: any) {
  return BaseRequest.postByJsonWithToken<any>('/uc/login/byMobileCode', parameter);
}

/**
 * 我的薇币
 */
export function getMyWeiCoin(parameter: any) {
  return BaseRequest.postByJsonWithToken<any>('/pay/wallet/balance', parameter);
}

/**
 * 我的薇币流水
 */
export function getMyWeiCoinWallet(parameter: any) {
  return BaseRequest.postByJsonWithToken<any>('/pay/wallet/bill', parameter);
}

/**
 * 薇币清零查询即将到期的数量
 */
export function getRetsetWeiCoincount(parameter: any) {
  return BaseRequest.postByJsonWithToken<any>('/pay/wallet/willExpire', parameter);
}

/**
 * 薇币清零查询流水
 */
export function getRetsetWeiCoinWallet(parameter: any) {
  return BaseRequest.postByJsonWithToken<any>('/pay/wallet/expireList', parameter);
}

/**
 * 邀请好友开户奖励明细
 */
export function getinviteOpenAccountAward(parameter: any) {
  return BaseRequest.postByJsonWithToken<any>('/activity/activity/getRewardsDetail', parameter);
}
