import { baseReqInstance } from '../create-instance/base-request';

/**
 * 获取所有配置
 */
export function getSetting(data): Promise<any> {
  return baseReqInstance.postByJsonWithToken('/uc/customer/setting/get', data);
}

/**
 * 更新指定类型设置（覆盖）
 */
export function updateSetting(data: {code: string; content: any}): Promise<any> {
  return baseReqInstance.postByJsonWithToken('/uc/customer/setting/update', data);
}
