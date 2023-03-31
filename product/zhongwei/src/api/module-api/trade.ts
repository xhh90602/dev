import { createReqInstanceByProxy, userTokenProxyInfo } from '../create-instance/base-request';
import tradeRequest from '../create-instance/trade-request';

interface IData {
  [propName: string]: any;
}

const tableTimeOut = { timeout: window.GLOBAL_CONFIG.LOADING_TIME_OUT };
const { commonServer } = window.GLOBAL_CONFIG.COMMON_SERVERS;

// 请求封装
const baseApi = async (MF: number, data?: IData, config?: IData): Promise<any> => {
  const rs = await tradeRequest.postByJsonWithToken(window.GLOBAL_CONFIG.COMMON_SERVERS.tradeGateway, data, {
    ...config,
    MF,
  });
  return rs;
};

/**
 * 获取自选列表
 */
export async function getOptions(data): Promise<any> {
  return tradeRequest.postByJsonWithToken('/self/self/listByBigMarket', data);
}

/**
 * 获取自选列表
 */
export async function querySelfList(data): Promise<any> {
  return tradeRequest.postByJsonWithToken('/self/self/selfList', data);
}

/**
 * 获取套餐权限
 */
export async function getUserQuo(data = {}): Promise<any> {
  return tradeRequest.postByJsonWithToken('/quotation/user/product/permissions', data);
}

interface IGroupOrder {
  portfolioId: number; // 组合ID
  stockList: StockList[]; // 组合股票信息
}

interface StockList {
  bigMarket?: number;
  currency?: string;
  id?: number;
  smallMarket?: number;
  stockCode?: string;
  stockName?: string;
  bs: string;
  nowPrice: number;
  qty: number;
  originalProportion: number;
  process: boolean;
  proportion: number;
}

/**
 * 实盘下单
 */
export async function placeGroupOrder(data: IGroupOrder): Promise<any> {
  return tradeRequest.postByJsonWithToken('/portfolio/trade/actualEntrust', data);
}

/**
 * 条件单 - 获取商品行情
 */
export async function getProductInfo(data): Promise<any> {
  return baseApi(2209, data);
}

/**
 * 详情 - 交易费用估算
 */
export async function getFee(data): Promise<any> {
  return baseApi(2206, data);
}

/**
 * 交易首页 - 持仓
 */
export async function getPosition(data): Promise<any> {
  return baseApi(2301, data, tableTimeOut);
}

/**
 * 交易首页 - 当日成交
 */
export async function getBuyDate(data): Promise<any> {
  return baseApi(2305, data, tableTimeOut);
}

/**
 * 交易首页 - 当日委托
 */
export async function getEntrustedDate(data): Promise<any> {
  return baseApi(2302, data, tableTimeOut);
}

/**
 * 委托生效
 */
export async function entrustOk(data): Promise<any> {
  return baseApi(2204, data);
}

/**
 * 交易 - 历史委托
 */
export async function getHistoryEntrusted(data): Promise<any> {
  return baseApi(2303, data, tableTimeOut);
}

/**
 * 交易首页 - 资金总汇
 */
export async function getMoneyList(data?: any): Promise<any> {
  return baseApi(2501, data);
}

/**
 * 交易首页 - 资金明细
 */
export async function getMoneyInfo(data = {}): Promise<any> {
  return baseApi(2505, data);
}

/**
 * 交易首页 - 持仓盈亏
 */
export async function getProfitLossInfo(data = {}): Promise<any> {
  return baseApi(2310, data);
}

/**
 * 交易首页 - 历史成交
 */
export async function getHistoryBuy(data): Promise<any> {
  return baseApi(2306, data, tableTimeOut);
}

/**
 * 委托详情
 */
export async function getEntrustedInfo(data): Promise<any> {
  return baseApi(2304, data);
}

/**
 * 成交详情
 */
export async function getAgreeInfo(data): Promise<any> {
  return baseApi(2309, data);
}

/**
 * 交易页面 - 查询最大买卖量
 */
export async function getMaxBuy(data): Promise<any> {
  return baseApi(2308, data);
}

/**
 * 交易页面 - 委托下单
 */
export async function buyStock(data): Promise<any> {
  return baseApi(2202, data);
}

/**
 * 改撤单
 */
export async function operateBusiness(data): Promise<any> {
  return baseApi(2203, data);
}

/**
 * 条件单撤单
 */
export async function cancelConditionOrder(data: { clientId?: string; conditionNo: string }): Promise<any> {
  return baseApi(2224, data);
}

/**
 * 获取市场tab权限
 */
export async function getMarketTab(): Promise<any> {
  return baseApi(2311, {});
}

/**
 * 获取资金流水
 */
export async function getFundFlow(data): Promise<any> {
  return baseApi(2502, data);
}

/**
 * 获取股票详情
 */
export async function getStockInfo(data): Promise<any> {
  return baseApi(2407, data);
}

/**
 * 修改密码
 */
export async function getTradePwd(data): Promise<any> {
  return baseApi(2104, data);
}

/**
 * 校验密码
 */
export async function verifyTradePwd(data): Promise<any> {
  return baseApi(2127, data);
}

/**
 * 查询条件单列表
 */
export async function getTriggerOrderList(data?: any): Promise<any> {
  return baseApi(2225, data);
}

/**
 * 新增条件单
 */
export async function addTriggerOrder(data?: any): Promise<any> {
  return baseApi(2222, data);
}

/**
 * 用户信息
 */
export async function getTradeAccountInfo(data?: any): Promise<any> {
  return baseApi(2120, data);
}

/**
 * 待成交订单列表
 * @param data
 * @returns
 */
export async function getWaitingOrders(data?: any): Promise<any> {
  return baseApi(2312, data);
}

/**
 * 历史订单列表
 * @param data
 * @returns
 */
export async function getHistoryOrders(data?: any): Promise<any> {
  return baseApi(2313, data);
}

/**
 * 获取订单详情
 * @param data
 * @returns
 */
export async function getOrderDetail(data: IData): Promise<any> {
  return baseApi(2314, data);
}

/**
 * 获取条件单详情
 * @param data
 * @returns
 */
export async function getTriggerDetail(data?: any): Promise<any> {
  return baseApi(2226, data);
}

/**
 * 提交修改条件单
 * @param data
 * @returns
 */
export async function editTriggerOrder(data?: any): Promise<any> {
  return baseApi(2223, data);
}

/**
 * 个股持仓数据
 * @param data
 * @returns
 */
export async function getPositionData(data: any): Promise<any> {
  return baseApi(2301, data);
}

/**
 * 获取汇率
 * @param data
 * @returns
 */
export async function getCurrencyRate(data: any): Promise<any> {
  return baseApi(2504, data);
}

/**
 * 出金
 * @param data
 * @returns
 */
export async function withdraw(data: any): Promise<any> {
  return baseApi(2504, data);
}

/**
 * 获取交易时间段
 * @param data
 * @returns
 */
export async function tradeTimeQuantum(data: any): Promise<any> {
  return baseApi(2333, data);
}

const Request = createReqInstanceByProxy({ defaultBaseUrl: commonServer }, userTokenProxyInfo);

/**
 * 获取消息提示
 */
export function getMessageReminder(params: any) {
  return Request.postByJson<any>('/vgro/api/messageReminder/queryMessageReminder', params);
}

/**
 * 关闭消息提示
 */
export function closeMessageReminder(params: { messages: any[] }) {
  return Request.postByJson<any>('/vgro/api/messageReminder/viewMessageReminder', params);
}
