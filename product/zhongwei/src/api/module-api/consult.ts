import { createReqInstanceByProxy } from '@/api/create-instance/base-request';

const { commonServer } = window.GLOBAL_CONFIG.COMMON_SERVERS;

const consultRequest = createReqInstanceByProxy({ defaultBaseUrl: commonServer });
const coServerRequest = createReqInstanceByProxy({ defaultBaseUrl: `${commonServer}/co` });
const snsServerRequest = createReqInstanceByProxy({ defaultBaseUrl: `${commonServer}/sns` });

/* 咨询详情 */
export function getConsultDetail(param: { id, type, model }) {
  return consultRequest.getByJson<any>('/info/V2/info/getDetail', param);
}

/* 文章详情 */
export function getArticleDetail(id) {
  return snsServerRequest.postByJson<any>('/article/info/get', { id });
}

/* 内容详情（点赞数、评论数、分享数等，整合接口） */
export function getContent(data: {
  contentId: number;
  contentType: string;
}) {
  return coServerRequest.postByJson<any>('/content/get', data);
}

/* 点赞 */
export function postLikeAdd(data: {
  contentId: number;
  contentType: string;
  contentCid: number;
  // contentDetail: string;
  // contentTitle: string;
}) {
  return coServerRequest.postByJson<any>('/like/add', data);
}

/* 取消点赞 */
export function postLikeCancel(data: { contentId: number; contentType: string; }) {
  return coServerRequest.postByJson<any>('/like/cancel', data);
}

/* 点赞列表 */
export function postLikeList(data: { contentId: number; contentType: string; }) {
  return coServerRequest.postByJson<any>('/like/list', data);
}

/* 评论列表 */
export function postCommentList(data: {
  contentId: number;
  contentType: string;
  lastId?: number;
  down?: boolean;
  keyword?: string;
  pageSize?: number;
}) {
  return coServerRequest.postByJson<any>('/comment/list', data);
}

/* 评论 */
export function postCommentAdd(data: {
  content: string;
  replyId?: number;
  contentId: number;
  contentTitle: string;
  contentType: string;
  contentCid: number;
  contentDetail: string;
  pictures?: string[];
  profitLossToday?: any[];
  remindRriends?: number[];
  combination?: any[];
  stock?: { stockCode: string; marketCode: string }[];
}) {
  return coServerRequest.postByJson<any>('/comment/add', data);
}

/* 删除评论 */
export function postCommentDel(id: number) {
  return coServerRequest.postByJson<any>('/comment/delete', { id });
}

/* 评论点赞 */
export function postCommentLikeAdd(id) {
  return coServerRequest.postByJson<any>('/comment/likeAdd', { id });
}

/* 评论取消点赞 */
export function postCommentLikeCancel(id) {
  return coServerRequest.postByJson<any>('/comment/likeCancel', { id });
}
