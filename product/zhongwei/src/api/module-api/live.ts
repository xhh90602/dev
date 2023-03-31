import { createReqInstanceByProxy, userTokenProxyInfo } from '../create-instance/base-request';

const { commonServer } = window.GLOBAL_CONFIG.COMMON_SERVERS;

// 直播的请求
const liveRequest = createReqInstanceByProxy({ defaultBaseUrl: commonServer }, userTokenProxyInfo);
const liveAddress = '/live';

/**
 * 中薇查询直播列表接口
 * 2022-09-16
 * TODO dev接口需要加上liveAddress
 */
export function getLiveList(params, config?: any): Promise<any> {
  return liveRequest.postByJson(
    `${liveAddress}/liveCourse/list`,
    // `${LOCAL_PREFIX}/liveCourse/list`,
    params,
    config,
  );
}

/**
 * 中薇查询录播列表接口
 * 2022-09-16
 */
export function getLiveRecordList(params, config?: any): Promise<any> {
  return liveRequest.postByJson(
    `${liveAddress}/liveRecord/list`,
    params,
    config,
  );
}

/**
 * 中薇查询预告列表接口
 * 2022-09-16
 */
export function getLiveTrailerList(params, config?: any): Promise<any> {
  return liveRequest.postByJson(
    `${liveAddress}/liveCourse/trailer`,
    params,
    config,
  );
}

/**
 * 中薇直播订阅接口
 * 2022-09-16
 */
export function subscribeLive(params, config?: any): Promise<any> {
  return liveRequest.postByJson(
    `${liveAddress}/liveNotice/subscribe`,
    params,
    config,
  );
}

/**
 * 中薇直播浏览量
 * 2022-09-16
 */
export function getLiveViewNum(params, config?: any): Promise<any> {
  return liveRequest.postByJson(
    `${liveAddress}/liveCourse/updateShowCount`,
    // '/liveCourse/updateShowCount',
    params,
    config,
  );
}

/**
 * 中薇直播点赞
 * 2022-09-16
 */
export function getLiveLikeNum(params, config?: any): Promise<any> {
  return liveRequest.postByJson(
    `${liveAddress}/liveCourse/updateUpCount`,
    // '/liveCourse/updateUpCount',
    params,
    config,
  );
}

/**
 * 中薇直播获取成员
 * 2022-09-16
 */
export function getMember(params, config?: any): Promise<any> {
  return liveRequest.postByJson(
    `${liveAddress}/chat/listRoomMembers`,
    // '/chat/roomMembersAll',
    params,
    config,
  );
}

/**
 * 添加薇友
 * 2022-09-16
 */
export function addWeiFriend(params, config?: any): Promise<any> {
  return liveRequest.postByJson(
    '/sns/customer/friendAdd/send',
    params,
    config,
  );
}

/**
 * 关注分析师
 * 2022-09-16
 */
export function focus(params, config?: any): Promise<any> {
  return liveRequest.postByJson(
    '/sns/his/follow/add',
    params,
    config,
  );
}

/**
 * 取消关注分析师
 * 2022-09-16
 */
export function cancleFocus(params, config?: any): Promise<any> {
  return liveRequest.postByJson(
    '/sns/his/follow/cancel',
    params,
    config,
  );
}

/**
 * 直播间发送消息
 * 2022-09-16
 */
export function sendLiveMsg(params, config?: any): Promise<any> {
  return liveRequest.postByJson(
    `${liveAddress}/chat/saveGroupMessage`,
    params,
    config,
  );
}

/**
 * 直播间获取历史消息
 * 2022-09-16
 */
export function getHistoryMsg(params, config?: any): Promise<any> {
  return liveRequest.postByJson(
    `${liveAddress}/chat/personalGroupMessage`,
    params,
    config,
  );
}

/**
 * 将环信用户加入聊天室
 * 2022-09-16
 */
export function addRoomMember(params, config?: any): Promise<any> {
  return liveRequest.postByJson(
    `${liveAddress}/chat/addRoomMember`,
    params,
    config,
  );
}
