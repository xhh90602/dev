import { baseReqInstance } from '@/api/create-instance/base-request';

export function getFTenApiMethod(data = {}): Promise<any> {
  return baseReqInstance.postByJson<any>('/f10/api', data);
}
