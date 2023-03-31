// 直播模块管理中台接口
// import { getUrlParam } from '@/utils';
import { createReqInstanceByProxy, userTokenProxyInfo } from '../create-instance/base-request';

const { commonServer } = window.GLOBAL_CONFIG.COMMON_SERVERS;

// const token = getUrlParam({ token: '' });
// console.log('token', token);

// 直播的请求
const liveRequest = createReqInstanceByProxy({ defaultBaseUrl: commonServer }, userTokenProxyInfo);
const liveAddress = '/investment-adviser-live/live';
const serverAddress = '/investment-adviser/file';
const chatAddress = '/im-api/chat';
const adminLiveAddress = '/live';
const imAddress = '/sns';

const chatRoomAddress = '/investment-adviser/chatRoom';
const muteAddress = '/investment-adviser/customer';
/**
 * //TODO 暂时用股多多直播详情
 * 2022-11-28
 */
export function queryLiveInfo(params, config?: any): Promise<any> {
  return liveRequest.postByJson(
    `${liveAddress}/detailed`,
    params,
    config,
  );
}

/**
 * //TODO 暂时用股多多接口
 * 2022-11-28
 * 上传图片
 */
export function uploadFile(params, config?: any): Promise<any> {
  return liveRequest.postByJson(
    `${serverAddress}/upload`,
    params,
    config,
  );
}

/**
 * 股多多聊天室发送消息(群聊)
 *
 */
export function sendMsg(params): Promise<any> {
  return liveRequest.postByJson(
    `${chatAddress}/saveGroupMessage`,
    params,
  );
}

/**
 * 股多多聊天室用户拉取聊天记录(群聊)
 *
 */
export function personalQueryMsg(params, config?: any): Promise<any> {
  return liveRequest.postByJson(
    `${chatAddress}/personalGroupMessage`,
    params,
    config,
  );
}

/**
 * 股多多聊天室管理员拉取聊天记录(群聊)
 *
 */
export function adminQueryMsg(params, config?: any): Promise<any> {
  return liveRequest.postByJson(
    `${chatAddress}/selectAdminMessage`,
    params,
    config,
  );
}

/**
 * 查询聊天室成员列表
 *
 */
export function queryChatRoomCustomerList(params: any, config?: any): Promise<any> {
  return liveRequest.postByJson(
    `${adminLiveAddress}/chat/listRoomMembers`,
    params,
    config,
  );
}

/**
 * 禁言/取消禁言聊天室成员列表
 *
 */
export function updateChatRoomCustomerStatus(params: any): Promise<any> {
  return liveRequest.postByJson(
    `${adminLiveAddress}/chat/blockUserSendMsgToRoom`,
    params,
  );
}

/**
 * 获取消息列表接口
 *
 */
export function getHistoryMsg(params: any): Promise<any> {
  return liveRequest.postByJson(
    `${adminLiveAddress}/chat/personalGroupMessage`,
    params,
  );
}

/**
 * 直播间发送消息
 * 2022-09-16
 */
export function sendLiveMsg(params, config?: any): Promise<any> {
  return liveRequest.postByJson(
    `${adminLiveAddress}/chat/saveGroupMessage`,
    params,
    config,
  );
}

/**
 * 查询直播间详情
 * 2022-09-16
 */
export function getLiveRoomDetail(params, config?: any): Promise<any> {
  return liveRequest.postByJson(
    `${adminLiveAddress}/liveCourse/info`,
    params,
    config,
  );
}

/**
 * 删除聊天室消息
 * 2023-01-06
 */
export function delMessage(params, config?: any): Promise<any> {
  return liveRequest.postByJson(
    `${adminLiveAddress}/chat/delMessage`,
    params,
    config,
  );
}

/**
 * 上传图片
 * 2023-01-06
 */
export function uploadImage(params, config?: any): Promise<any> {
  return liveRequest.postByJson(
    `${adminLiveAddress}/sys/file/upload/new`,
    params,
    config,
  );
}

/**
 * 获取分析师imToken
 * 2022-09-16
 */
export function getAnalystToken(params, config?: any): Promise<any> {
  return liveRequest.postByJson(
    `${imAddress}/im/userToken/getAnalystToken`,
    params,
    config,
  );
}
