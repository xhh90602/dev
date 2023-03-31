import { createReqInstanceByProxy, userTokenProxyInfo } from '../create-instance/base-request';

const { commonServer } = window.GLOBAL_CONFIG.COMMON_SERVERS;
const Request = createReqInstanceByProxy({ defaultBaseUrl: commonServer }, userTokenProxyInfo);

interface IData {
  [propName: string]: any;
}

/**
 * 查询某子类最新消息, 根据扩展属性分组
 * @param data
 * @returns
 */
export async function getMsgListByType(data: IData): Promise<any> {
  return Request.postByJsonWithToken('/message/lastMsg2 ', data);
}

/**
 * 消息读取
 * @param data
 * @returns
 */
export async function readAll(data: IData): Promise<any> {
  return Request.postByJsonWithToken('/message/readAll ', data);
}
