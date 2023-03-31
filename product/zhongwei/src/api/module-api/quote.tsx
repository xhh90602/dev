import { baseReqInstance } from '../create-instance/base-request';

/**
 * 获取我的行情列表
 * @returns
 */
export async function getQuoteList(): Promise<any> {
  return baseReqInstance.postByJsonWithToken('/quotation/package/purchased');
}

/**
 * 获取订购记录列表
 * @returns
 */
export async function getOrderRecordList(): Promise<any> {
  return baseReqInstance.postByJsonWithToken('/quotation/order/list');
}
