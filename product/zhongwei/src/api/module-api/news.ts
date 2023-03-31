import { baseReqInstanceByProxy } from '../create-instance/base-request';

/**
 * 获取目录列表
 */
export async function getCategoryList(params): Promise<any> {
  return baseReqInstanceByProxy.getByJson('info/category/list', params);
}

/**
 * 获取新闻列表
 */
export async function getNewsList(params): Promise<any> {
  return baseReqInstanceByProxy.getByJson('info/info', params);
}

/**
 * 获取新闻列表
 */
export async function getNewsDetail(params): Promise<any> {
  return baseReqInstanceByProxy.getByJson(`info/info/${params}`);
}
