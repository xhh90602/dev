import bridge from './bridge';

const { getInstance } = bridge;

// 解析msg结果
function parseResult(res) {
  try {
    const { code, data } = res.result;
    return code === 0 ? JSON.parse(data) : {};
  } catch (err) {
    return {};
  }
}

/**
 * H5页面加载成功通知PC
 */
export function H5Mounted(): Promise<any> {
  return getInstance().call.msg('H5Mounted', '');
}

/**
 * 关闭当前H5视图
 *
 */
export function closePage(): Promise<any> {
  return getInstance().call.msg('closePage', '');
}

/**
 * 获取用户配置
 *
 */
export function queryUserConfig(): Promise<any> {
  return getInstance()
    .call.msg('getUserConfiguration', '')
    .then((res) => parseResult(res));
}

/**
 * 获取用户信息
 *
 */
export function queryUserInfo(): Promise<any> {
  return getInstance()
    .call.msg('userInfo', '')
    .then((res) => parseResult(res));
}

/**
 * 唤起登录框
 *
 */
export function queryLoginDialog(): Promise<any> {
  return getInstance().call.msg('Relogin', { reason: '修改中台密码', showReason: '' });
}

/**
 * 通知修改昵称，更新用户信息
 *
 */
export function notifiedName(): Promise<any> {
  return getInstance().call.msg('RefreshUser', { userId: 1 });
}

/**
 * 获取行情地址
 *
 */
export function queryServerConfig(): Promise<any> {
  return getInstance()
    .call.msg('getServerConfig', '')
    .then((res) => parseResult(res));
}

/**
 * 获取交易配置
 *
 */
export function getTradeConfig(): Promise<any> {
  return getInstance().call.msg('getTradeConfig');
}

/**
 * 更新交易配置
 *
 */
export function updateTradeConfigNative(params): Promise<any> {
  return getInstance().call.msg('updateTradeConfig', params);
}

// 是否显示一键已读按钮
export function showReadKey(params = {}) {
  return getInstance().call.msg('showReadAll', params);
}

// 唤起交易登录
export function TradeLogin() {
  return getInstance().call.msg('tradeLogin');
}

// 打开股票行情
export function openStockQuote(params: Record<string, any>) {
  return getInstance().call.view('openStockQuote', params);
}

// 是否登录交易账号
export function isLoginTradingAccount(params = {}) {
  return getInstance().call.view('isLoginTradingAccount', params);
}

// 唤起弹框
// 弹框
export function openWindow(title = '', url = '') {
  return getInstance()
    .call.msg('openWindow', { title, url })
    .catch((err) => new Error(err));
}

const nativeFun = (location: string) => {
  openWindow('资讯详情', location);
};

/**
 *  拼接url地址
 * @param url 跳转的pathname
 * @returns
 */
export const joinUrl = (url: string) => {
  const { origin, pathname } = window.location;
  const newPathname = pathname.split('/');
  const { length } = newPathname;
  newPathname[length - 1] = url;
  return origin + newPathname.join('/');
};

export function nativeOpenPage(html: string): void {
  const location = joinUrl(html);
  nativeFun(location);
}
