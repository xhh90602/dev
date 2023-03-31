import { baseReqInstanceByProxy } from '../create-instance/base-request';

/**
 * 获取高级行情套餐列表
 * @returns
 */
export async function postQuoteList(): Promise<any> {
  return baseReqInstanceByProxy.postByJsonWithToken('/quotation/package/list', {});
}

/**
 * 获取高级行情套餐列表
 * @returns
 */
export async function postQuoteHistoryList(): Promise<any> {
  return baseReqInstanceByProxy.postByJsonWithToken('/quotation/order/list', {});
}

/**
 * 获取高级行情套餐列表
 * @returns
 */
export async function postPurchasedQuoteList(): Promise<any> {
  return baseReqInstanceByProxy.postByJsonWithToken('/quotation/package/purchased', {});
}

/**
 * 获取行情详情
 */
export async function getQuoteInfo(data): Promise<any> {
  return baseReqInstanceByProxy.postByJsonWithToken('/quotation/package/detail', data);
}

/**
 * 订单验证
 */
export async function verifyQuoteOrder(data): Promise<any> {
  return baseReqInstanceByProxy.postByJsonWithToken('/quotation/order/verify', data);
}

/**
 * 购买套餐
 */
export async function buyQuote(data): Promise<any> {
  return baseReqInstanceByProxy.postByJsonWithToken('/quotation/order/buy', data);
}
