import bridge from './bridge';

const { getInstance } = bridge;

/**
 * 打开原生搜索页
 *
 */
export function openSearchPage(params: {
  marketScope?: ({ marketid: number } & Record<string, any>)[];
  warrantAndCBBC?: boolean;
}): Promise<any> {
  return getInstance().call.view('PAGE_OPEN', params);
}

/**
 * 打开股票行情
 *
 */
export function openStockQuote(params): Promise<any> {
  return getInstance().call.view('openStockQuote', params);
}
