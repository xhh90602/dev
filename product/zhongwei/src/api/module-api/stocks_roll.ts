import { createReqInstanceByProxy, userTokenProxyInfo } from '../create-instance/base-request';

const { commonServer } = window.GLOBAL_CONFIG.COMMON_SERVERS;

const Request = createReqInstanceByProxy({ defaultBaseUrl: `${commonServer}/vgro` }, userTokenProxyInfo);
/**
 * 股票转入转出提交
 * @returns
 */
export async function postStockTransfer(data): Promise<any> {
  return Request.postByJsonWithToken('/api/stockTransfer/createStockTransfer', data);
}
