import { baseReqInstance } from '../create-instance/base-request';
import tradeRequest from '../create-instance/trade-request';

interface IData {
  [propName: string]: any;
}

export enum ITypeIpo {
  AMOUNT_TENDERED = '1', // 已递表
  WAIT_LISTED = '3', // 待上市(暗盘)
  ALREADY_LISTED = '4', // 已上市
}

const tableTimeOut = { timeout: window.GLOBAL_CONFIG.LOADING_TIME_OUT };

// 交易网关请求封装
const baseApi = async (MF: number, data?: IData, config?: IData): Promise<any> => {
  const rs = await tradeRequest.postByJsonWithToken('/trading/trans/Handle.aspx', data, {
    ...config,
    MF,
  });
  return rs;
};

// ipo的tab
const requestIpo = async (data?: IData) => {
  const rs = await baseReqInstance.postByJsonWithToken('/ipo/api', {
    body: {
      ...data,
    },
    mf: 7,
    req_id: '1',
    sf: 9,
  });

  return rs;
};

/**
 * 新股订购 - 认购中
 * @param data
 * @returns
 */
export async function getSubscribeList(data?: IData): Promise<any> {
  return baseApi(2401, data, tableTimeOut);
}

/**
 * 新股订购 - 已递表
 * @param data
 * @returns
 */
export async function getAmountTenderedList(data: IData): Promise<any> {
  return requestIpo({
    type: ITypeIpo.AMOUNT_TENDERED,
    ...data,
  });
}

/**
 * 新股订购 - 待上市(暗盘)
 * @param data
 * @returns
 */
export async function getWaitListedList(data: IData): Promise<any> {
  return requestIpo({
    type: ITypeIpo.WAIT_LISTED,
    ...data,
  });
}

/**
 * 新股订购 - 已上市
 * @param data
 * @returns
 */
export async function getAlreadyListedList(data: IData): Promise<any> {
  return requestIpo({
    type: ITypeIpo.ALREADY_LISTED,
    ...data,
  });
}

/**
 * 新股订购 - 新股详情
 * @param data
 * @returns
 */
export async function getIpoDetails(data?: IData): Promise<any> {
  return baseApi(2402, data, tableTimeOut);
}

/**
 * 新股订购 - 获取手续费
 * @param data
 * @returns
 */
export async function getIpoPoundage(data?: IData): Promise<any> {
  return baseApi(2411, data, tableTimeOut);
}

/**
 * 新股订购 - 认购中 - 获取手续费
 * @param data
 * @returns
 */
export async function getIpoCharges(data?: IData): Promise<any> {
  return baseApi(2411, data, tableTimeOut);
}

/**
 * 新股订购 - 提交认购
 * @param data
 * @returns
 */
export async function submittedSubscribe(data?: IData): Promise<any> {
  return baseApi(2403, data, tableTimeOut);
}

/**
 * 新股订购 - 认购记录
 * @param data
 * @returns
 */
export async function getSubscribeRecord(data: IData): Promise<any> {
  return baseApi(2405, data, tableTimeOut);
}

/**
 * 新股订购 - 认购记录详情
 * @param data
 * @returns
 */
export async function getSubscribeRecordDetails(data: IData): Promise<any> {
  return baseApi(2406, data, tableTimeOut);
}

/**
 * 获取招股书
 * @param data
 * @returns
 */
export async function getProspectus(data: IData): Promise<any> {
  return tradeRequest.postByJsonWithToken('ipo/prospectus', data);
}
