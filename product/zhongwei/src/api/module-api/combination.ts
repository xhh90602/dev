import { createReqInstanceByProxy, userTokenProxyInfo } from '../create-instance/base-request';

const { commonServer } = window.GLOBAL_CONFIG.COMMON_SERVERS;

// 组合的请求
const Request = createReqInstanceByProxy({ defaultBaseUrl: commonServer }, userTokenProxyInfo);

/**
 * 查询组合列表
 */
export function getCombinationList(parameter: any) {
  return Request.postByJson<any>('/portfolio/query/list', parameter);
}
/**
 * 订阅价格
 */
export function subPrices(parameter: any) {
  return Request.postByJson<any>('/sc/consumer/sub/prices', parameter);
}
/**
 * 获取钱包余额
 */
export function getBalanceNum(parameter: any) {
  return Request.postByJson<any>('/pay/wallet/balance', parameter);
}
/**
 * 订阅申请
 */
export function subApply(parameter: any) {
  return Request.postByJson<any>('/sc/consumer/sub/apply', parameter);
}
/**
 * 求订阅申请
 */
export function subSeekApply(parameter: any) {
  return Request.postByJson<any>('/sc/consumer/sub/seek/apply', parameter);
}
/**
 * 加关注
 */
export function addFollow(parameter: any) {
  return Request.postByJson<any>('/sns/his/follow/add', parameter);
}
/**
 * 取消关注
 */
export function cancelFollow(parameter: any) {
  return Request.postByJson<any>('/sns/his/follow/cancel', parameter);
}
/**
 * 加薇友
 */
export function addWeiyou(parameter: any) {
  return Request.postByJson<any>('/sns/customer/friendAdd/send', parameter);
}
/**
 * 获取组合基础详情
 */
export function getCombiDetailBasicInfo(parameter: any) {
  return Request.postByJson<any>('/portfolio/query/basicInfo', parameter);
}
/**
 * 获取组合顾问详情
 */
export function getCombiDetailDataInfo(parameter: any) {
  return Request.postByJson<any>('/portfolio/query/dataInfo', parameter);
}
/**
 * 获取排行
 */
export function getCombiRanking(parameter: any) {
  return Request.postByJson<any>('/portfolio/query/ranking', parameter);
}
/**
 * 获取收益走势（详情里折线图数据）
 */
export function getCombiYieIdCurve(parameter: any) {
  return Request.postByJson<any>('/portfolio/query/yieIdCurve', parameter);
}
/**
 * 获取历史收益
 */
export function getHistoryProfitRatio(parameter: any) {
  return Request.postByJson<any>('/portfolio/query/historyProfitRatio', parameter);
}
/**
 * 获取资产分布
 */
export function getAssetsDistribute(parameter: any) {
  return Request.postByJson<any>('/portfolio/query/assetsDistribute', parameter);
}
/**
 * 获取行业分布
 */
export function getIndustryDistribute(parameter: any) {
  return Request.postByJson<any>('/portfolio/query/industryDistribute', parameter);
}
/**
 * 获取市场分布
 */
export function getMarketDistribute(parameter: any) {
  return Request.postByJson<any>('/portfolio/query/marketDistribute', parameter);
}
/**
 * 获取调仓记录
 */
export function getEntrustRecord(parameter: any) {
  return Request.postByJson<any>('/portfolio/trade/entrustRecord', parameter);
}
/**
 * 获取个股收益贡献
 */
export function getStockContribution(parameter: any) {
  return Request.postByJson<any>('/portfolio/query/stockContribution', parameter);
}
/**
 * 复制组合
 */
export function copyCombination(parameter: any) {
  return Request.postByJson<any>('/portfolio/manage/copy', parameter);
}
/**
 * 验证是否存在实盘
 */
export function existActual(parameter: any) {
  return Request.postByJson<any>('/portfolio/manage/existActual', parameter);
}
/**
 * 创建实盘
 */
export function createActual(parameter: any) {
  return Request.postByJson<any>('/portfolio/manage/createActual', parameter);
}
/**
 * 创建保存组合
 */
export function saveCombination(parameter: any) {
  return Request.postByJson<any>('/portfolio/manage/create', parameter);
}
/**
 * 获取组合列表
 */
export function getCombination(parameter: any) {
  return Request.postByJson<any>('/portfolio/manage/queryEditList', parameter);
}
/**
 * 编辑保存组合
 */
export function saveEditCombination(parameter: any) {
  return Request.postByJson<any>('/portfolio/manage/edit', parameter);
}
/**
 * 获取组合基础详情
 */
export function getCombinationDetail(parameter: any) {
  return Request.postByJson<any>('/portfolio/manage/edit', parameter);
}
/**
 * 获取调仓记录列表
 */
export function getAdjustmentRecord(parameter: any) {
  return Request.postByJson<any>('/portfolio/trade/entrustGroupRecordList', parameter);
}
/**
 * 获取调仓记录列表(详情)
 */
export function getAdjustmentRecordDetail(parameter: any) {
  return Request.postByJson<any>('/portfolio/trade/entrustRecordByGroupId', parameter);
}
/**
 * 组合删除
 */
export function delCombination(parameter: any) {
  return Request.postByJson<any>('/portfolio/manage/deletePortfolio', parameter);
}
/**
 * 组合排序
 */
export function combinationSort(parameter: any) {
  return Request.postByJson<any>('/portfolio/manage/sort', parameter);
}
/**
 * 参与排行
 */
export function joinRanking(parameter: any) {
  return Request.postByJson<any>('/portfolio/manage/joinRanking', parameter);
}
/**
 * 获取模拟组合调仓列表
 */
export function getSimulateCombinationAdjustment(parameter: any) {
  return Request.postByJson<any>('/portfolio/trade/queryEntrustDetail', parameter);
}
/**
 * 保存模拟组合调仓
 */
export function saveSimulatedRebalancing(parameter: any) {
  return Request.postByJson<any>('/portfolio/trade/entrust', parameter);
}
/**
 * 删除模拟组合调仓里的股票（只删除持仓比例为0的股票）
 */
export function deleteStock(parameter: any) {
  return Request.postByJson<any>('/portfolio/manage/deleteStock', parameter);
}
/**
 * 薇圈-组合列表
 */
export function getwqCombinationList(parameter: any) {
  return Request.postByJson<any>('/portfolio/social/queryPortfolioList', parameter);
}
/**
 * 添加股票到组合里
 */
export function addStockCombination(parameter: any) {
  return Request.postByJson<any>('/portfolio/manage/createStock', parameter);
}
/**
 * 查询股票组合
 */
export function searchStockGroups(parameter: any) {
  return Request.postByJson<any>('/portfolio/stock/trade/queryPortfolioStock', parameter);
}
/**
 * 组合个股调仓
 */
export function stockTradeEntrust(parameter: any) {
  return Request.postByJson<any>('/portfolio/stock/trade/entrust', parameter);
}
/**
 * 获取自选股list
 */
export function getSelf(parameter: any) {
  return Request.postByJson<any>('/self/self/queryAllGroup', parameter);
}
/**
 * 添加自选股
 */
export function addSelf(parameter: any) {
  return Request.postByJson<any>('/self/self/addStockBatch', parameter);
}
/**
 * 删除自选股
 */
export function delSelf(parameter: any) {
  return Request.postByJson<any>('/self/self/delStock', parameter);
}
/**
 * 判断是否已加入自选股
 */
export function queryStockIsExist(parameter: any) {
  return Request.postByJson<any>('/self/self/queryStockIsExist', parameter);
}
