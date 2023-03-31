import { baseReqInstance } from '../create-instance/base-request';
/**
 * 获取验证码
 * @returns
 */
export async function getSmsCode(data): Promise<any> {
  return baseReqInstance.postByJsonWithToken('/uc/sms/send', data);
}

/**
 * 获取用户信息
 * @returns
 */
export async function getUserInfo(): Promise<any> {
  return baseReqInstance.postByJsonWithToken('/uc/customer/info/get');
}

/**
 * 修改昵称
 * @returns
 * params
 * {
    "nickname": "TESTTT"
   }
 */
export async function getUserTitle(data): Promise<any> {
  return baseReqInstance.postByJsonWithToken('/uc/customer/info/updateNickname', data);
}

/**
 * 修改头像
 * @returns
 * params
 * {
  "avatar": "http://127.0.0.1/test.png"
   }
 */
export async function getUserAvatar(data): Promise<any> {
  return baseReqInstance.postByJsonWithToken('/uc/customer/info/updateAvatar', data);
}

/**
 * 修改密码
 * @returns
 * params
 */

export async function getUserPwd(data): Promise<any> {
  return baseReqInstance.postByJsonWithToken('/uc/customer/info/updatePwd', data);
}

/**
 * 图片上传
 * @returns
 * type:multipart/form-data
 */

export async function getUpload(data): Promise<any> {
  return baseReqInstance.postByFromData('/uc/sys/file/upload/modify_avatar', data);
}
