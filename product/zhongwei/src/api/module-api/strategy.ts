import { createReqInstanceByProxy, userTokenProxyInfo } from '../create-instance/base-request';

const { commonServer, quoServer } = window.GLOBAL_CONFIG.COMMON_SERVERS;

const env = process.env.NODE_ENV === 'development';

// 组合的接口地址
const Request = createReqInstanceByProxy({ defaultBaseUrl: commonServer }, userTokenProxyInfo);
// C++的行情接口地址
const QuoRequest = createReqInstanceByProxy({ defaultBaseUrl: env ? '/quotation' : quoServer }, userTokenProxyInfo);

/**
 * 查询分析师荐股列表
 */
export function getStrategyAnalystList(params: any) {
  return Request.postByJson<any>('/sns/stockRecommend/strategy/analystList', params);
}
/**
 * 查询优质股票列表
 */
export function getStocksPeopleNumberList(params: any) {
  return Request.postByJson<any>('/sns/stockRecommend/strategy/stocksPeopleNumberList', params);
}
/**
 * 查询 - 热门推荐列表（股票推荐数）
 */
export function getPopularStockList(params: any) {
  return Request.postByJson<any>('/sns/stockRecommend/strategy/popularStockList', params);
}
/**
 * 查询 - 热门推荐列表（分析师列表）
 */
export function getPopularStockDetail(params: any) {
  return Request.postByJson<any>('/sns/stockRecommend/strategy/popularStockDetail', params);
}
/**
 * 查询异动名单列表
 */
export function getStrategyChangeList(params: any) {
  return Request.postByJson<any>('/vgro/strategy/changeList', params);
}
/**
 * 查询C++行情接口数据
 */
export function getQuoData(params: any) {
  return QuoRequest.postByJson<any>('', params);
}
/**
 * 公共接口【查询股票PK数据】
 */
export function CommonApi(params: any) {
  return Request.postByJson<any>('/choosestock/api', params);
}
