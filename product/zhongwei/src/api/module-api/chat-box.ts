import { baseReqInstance } from '../create-instance/base-request';

const serverAddress = '/chat';
const FORWARD_PREFIX = process.env.NODE_ENV === 'production' ? `${window.GLOBAL_CONFIG.COMMON_SERVERS.commonServer}`
  : 'apiUrl4';

/**
 * 股多多聊天室发送消息(群聊)
 *
 */
export function sendMsg(params): Promise<any> {
  return baseReqInstance.postByJSON(`${FORWARD_PREFIX}${serverAddress}/saveGroupMessage`, params);
}

/**
 * 股多多聊天室用户拉取聊天记录(群聊)
 *
 */
export function personalQueryMsg(params): Promise<any> {
  return baseReqInstance.postByJSON(`${FORWARD_PREFIX}${serverAddress}/personalGroupMessage`, params);
}
