/**
 * 获取消息中心tab页标题
 * @returns
 */
import { baseReqInstance } from '../create-instance/base-request';

export async function getMsgTab(lang:string): Promise<any> {
  return baseReqInstance.postByJsonWithToken('/push/query/typeInfo', {}, { 'Accept-Language': lang });
}

/**
 * 获取消息中心tab页内容
 * @returns
 */

export async function getMessageCenterData(data, lang:string): Promise<any> {
  return baseReqInstance.postByJsonWithToken('/push/query/msgList', data, { 'Accept-Language': lang });
}

/**
 * 获取消息中心已读
 * @returns
 */

export async function getSendRead(data, lang:string): Promise<any> {
  return baseReqInstance.postByJsonWithToken('/push/query/read', data, { 'Accept-Language': lang });
}

/**
 * 获取消息中心删除
 * @returns
 */
export async function getMsgDelete(data, lang:string): Promise<any> {
  return baseReqInstance.postByJsonWithToken('/push/query/delete', data, { 'Accept-Language': lang });
}

/**
 * 获取资讯详情
 */
export async function getDetailList(data, lang:string): Promise<any> {
  return baseReqInstance.getByJson('/info/info/getDetail', data, { 'Accept-Language': lang });
}
