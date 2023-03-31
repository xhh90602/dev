import tradeRequest from '../create-instance/trade-request';

interface IData {
  [propName: string]: any;
}

/**
 * 获取组合列表
 * @param data
 * @returns
 */
export async function getCombinationList(data: IData): Promise<any> {
  return tradeRequest.postByJsonWithToken('/portfolio/query/list', data);
}

/**
 * 组合持仓中列表
 * @param data
 * @returns
 */
export async function getPositionList(data: IData): Promise<any> {
  return tradeRequest.postByJsonWithToken('/portfolio/trade/positionList', data);
}

/**
 * 待调仓列表
 * @param data
 * @returns
 */
export async function getWaitWarehouseList(data: IData): Promise<any> {
  return tradeRequest.postByJsonWithToken('/portfolio/trade/transactionList', data);
}

/**
 * 获取组合详情
 * @param data
 * @returns
 */
export async function getCombiDetails(data: IData): Promise<any> {
  return tradeRequest.postByJsonWithToken('/portfolio/query/basicInfo', data);
}

/**
 * 组合实盘下单信息
 * @param data
 * @returns
 */
export async function getActualEntrustDetail(data: IData): Promise<any> {
  return tradeRequest.postByJsonWithToken('/portfolio/trade/queryActualEntrustDetail', data);
}

/**
 * 修改组合名称
 * @param data
 * @returns
 */
export async function setCombinationName(data: IData): Promise<any> {
  return tradeRequest.postByJsonWithToken('/portfolio/manage/editName', data);
}

/**
 * 个股调仓记录
 * @param data
 * @returns
 */
export async function getStockWarehouseRecord(data: IData): Promise<any> {
  return tradeRequest.postByJsonWithToken('/portfolio/trade/stockEntrustRecord', data);
}

/**
 * 组合调仓记录
 * @param data
 * @returns
 */
export async function getCombinationWarehouseRecord(data: IData): Promise<any> {
  return tradeRequest.postByJsonWithToken('/portfolio/trade/entrustGroupRecordList', data);
}

/**
 * 组合调仓记录详情
 * @param data
 * @returns
 */
export async function getCombinationWarehouseDetail(data: IData): Promise<any> {
  return tradeRequest.postByJsonWithToken('/portfolio/trade/entrustRecordByGroupId', data);
}

/**
 * 编辑组合
 * @param data
 * @returns
 */
export async function editCombination(data: IData): Promise<any> {
  return tradeRequest.postByJsonWithToken('/portfolio/manage/edit', data);
}

/**
 * 组合调仓
 * @param data
 * @returns
 */
export async function combinationActualEntrust(data: IData): Promise<any> {
  return tradeRequest.postByJsonWithToken('/portfolio/trade/actualEntrust', data);
}

/**
 * 撤单
 * @param data
 * @returns
 */
export async function combinationRevokeOrders(data: IData): Promise<any> {
  return tradeRequest.postByJsonWithToken('/portfolio/trade/cancelActualOrder', data);
}

/**
 * 查询组合股票
 * @param data
 * @returns
 */
export async function getPortfolioStock(data: IData): Promise<any> {
  return tradeRequest.postByJsonWithToken('/portfolio/stock/trade/queryPortfolioStock', data);
}

/**
 * 查询账号信息
 * @param data
 * @returns
 */
export async function getUserInfo(data: IData): Promise<any> {
  return tradeRequest.postByJsonWithToken('/uc/trade/info/get', data);
}

/**
 * 查询子账号信息
 * @param data
 * @returns
 */
export async function getSubAccList(data: IData): Promise<any> {
  return tradeRequest.postByJsonWithToken('/uc/trade/subAcc/list', data);
}

/**
 * 获取排行
 * @param data
 * @returns
 */
export async function getCombiRanking(data: IData): Promise<any> {
  return tradeRequest.postByJsonWithToken('/portfolio/query/ranking', data);
}

/**
 * 参与排行
 * @param data
 * @returns
 */
export async function joinRanking(data: IData): Promise<any> {
  return tradeRequest.postByJsonWithToken('/portfolio/manage/joinRanking', data);
}

/**
 * 求订阅申请
 * @param parameter
 * @returns
 */
export function subSeekApply(parameter: any) {
  return tradeRequest.postByJsonWithToken('/sc/consumer/sub/seek/apply', parameter);
}

/**
 * 订阅申请
 * @param parameter
 * @returns
 */
export function subApply(parameter: any) {
  return tradeRequest.postByJsonWithToken('/sc/consumer/sub/apply', parameter);
}
