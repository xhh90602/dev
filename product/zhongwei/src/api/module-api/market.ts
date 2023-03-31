import { baseReqInstance } from '@/api/create-instance/base-request';

/*
 * 获取大市场
 * @Date: 2022-09-19 10:45
 */
export function getBigMatketData(data = {}) :Promise<any> {
  return baseReqInstance.postByJson<any>('/market/symbol/getMarket', data);
}
