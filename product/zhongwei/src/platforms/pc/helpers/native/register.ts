import bridge from './bridge';

const { getInstance } = bridge;

/**
 * 用户更新配置
 *
 */
export interface IUserConfigRaw {
  env: 'dev';
  theme: 'light'; // dark light red
  language: 'zh-CN'; // zh-TW  zh-CN
  font_size: 2; // 0 - 4  最小 - 最大 默认值2
  global_font_scale: 2;
  raise: 'green'; // 红涨绿跌 还是绿涨红跌
  orderToConfirmByDialog: true;
}

/**
 * pc修改完个人信息返回修改过后信息
 * @param {Function} handle 处理函数
 *
 */
export function updateUserInfo(handle: unknown): unknown {
  return getInstance().register('receivedNativeUserInfoC', handle);
}

/**
 * pc换肤回调
 *
 */
export function updateUserConfig(handle: unknown): unknown {
  return getInstance().register('updateUserConfig', handle);
}
