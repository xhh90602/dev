import { baseReqInstanceByProxy, createReqInstance } from '@/api/create-instance/base-request';

import { filterStockServer } from '../create-instance/base-url';

type IResponse = any;

const createPath = (path: string) => `/condition/condition/${path}`;

const req = createReqInstance({ defaultBaseUrl: `${filterStockServer}/api` });

/**
 * 查询选股器分类
 *
 */
export function queryCategory(marketCode: string): Promise<IResponse> {
  return baseReqInstanceByProxy.postByJsonWithToken<IResponse>(createPath('getCategory'), {
    code: marketCode,
  });
}

/**
 * 查询选股器分类
 *
 */
interface IDialogInfo {
  categoryId: number; // 类别id
  type: string; // 类型编码
}

export function queryDialogInfo(data: IDialogInfo) :Promise<IResponse> {
  return baseReqInstanceByProxy.postByJsonWithToken<IResponse>(createPath('/getTypeCategory'), data);
}

/**
 * 查询行业列表
 *
 */
export function queryIndustrys(data: any) :Promise<IResponse> {
  return req.postByJson<IResponse>('', { mf: 9,
    sf: 3,
    body: data,
  });
}

/**
 * 搜索行业列表
 *
 */
export function querySelectIndustrys(data: any): Promise<IResponse> {
  return req.postByJson<IResponse>('', { mf: 9, sf: 4, body: data });
}

/**
 * 条件查询股票总数
 *
 */
export function queryFilterStockTotal(data: any[]) :Promise<IResponse> {
  return req.postByJson<IResponse>('', { mf: 9,
    sf: 1,
    body: {
      conditions: data,
    },
  });
}

/**
 * 条件查询股票列表
 *
 */
export function queryFilterStockList(data: any) :Promise<IResponse> {
  return req.postByJson<IResponse>('', { mf: 9,
    sf: 2,
    body: data,
  });
}
