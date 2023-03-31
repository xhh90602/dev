import bridge from './bridge';
import { IUserConfigRaw } from './register';
import { joinUrl } from './url';

const { getInstance } = bridge;

export enum PageType {
  NATIVE, // 原生页面
  HTML, // H5页面
  PDF, // PDF
}

/**
 * 获取用户信息
 *
 */
export function getUserInfo(): Promise<any> {
  return getInstance()
    .call.msg('NORMAL_GET_USER_INFO')
    .then((res) => res);
}

export function getServerPath() {
  return getInstance()
    .call.msg('QUOTE_GET_SERVER_INFO', {})
    .then((res) => res);
}

/**
 * 获取用户配置
 *
 */
export function getUserConfig(): Promise<IUserConfigRaw> {
  return getInstance().call.msg('NORMAL_GET_USER_CONFIG');
}

interface INavTitle {
  name: string;
}

// 设置导航栏名称
export function settingNavigationTitle(params: INavTitle) {
  if (process.env.NODE_ENV === 'production') {
    getInstance().call.msg('HEADER_SET_TITLE', params);
  } else {
    document.title = params.name;
  }
}

interface IOptions {
  icon?: string; // refresh / setting / clean / close / date / font / url地址
  iconSize?: number; // icon 大小
  text?: string; // 按钮文字
  textColor?: string; // 文字颜色
  fontWeight?: number; // 字体粗细
  fontFamily?: string; // 字体
  textFontSize?: number; // 文字大小
  position: 'left' | 'right'; // 位置
  index: number; // 从1开始计算
  onClickNativeAction?: string; // 点击之后原生的默认行为(优先级小于onClickCallbackEvent)
  clickCallbackParams?: string; // 点击按钮的参数
  onClickCallbackEvent?: string; // 点击按钮的回调
}

type Params = IOptions[];

export enum NativePages {
  LOGIN = 'login', // 登陆页面
  TRADE_LOGIN = 'tradeLogin', // 交易登录
  HOME = 'home', // 首页
  SEARCH = 'search', // 搜索页
  weiquan_center = 'weiquan_center', // 薇圈個人中心
  sub_center = 'sub_center', // 订阅中心
  activity_center = 'activity_center', // 活动中心
  global_search = 'global_search', // 全局搜索
  share = 'share', // 分享
  bangdan = 'bangdan', // 组合盈亏榜单
  siliao = 'siliao', // 私聊
  combination = 'combination', // 组合首页
  sub_send_requests = 'sub_send_requests', // 订阅中心的已发出的订阅请求页面
  add_weiyou = 'add_weiyou', // 请求添加薇友验证页面
}
interface IParams {
  title?: string; // 标题
  fullScreen?: boolean; // 是否为全屏 WebView
  height?: number; // 页面高度
  pageType: PageType; // 页面类型
  path: NativePages | string; // 页面地址
  replace?: boolean; // 是否关闭当前视图
  data?: any; // 传递给下个页面的数据
  setHeaderButton?: IOptions[]; // 参数和HEADER_SET_BUTTON一致
}

type NewPageParams = IParams;

// 设置页面按钮
export function settingHeaderButton(params: Params) {
  return getInstance().call.msg('HEADER_SET_BUTTON', params);
}

// 返回
export function pageBack(params = undefined) {
  if (process.env.NODE_ENV === 'production') {
    getInstance().call.view('PAGE_BACK', params);
  } else {
    window.history.back();
  }
}

// 返回上一个页面
export function goBack(params: any = {}) {
  if (process.env.NODE_ENV === 'production') {
    getInstance().call.view('PAGE_CLOSE', params);
  } else {
    window.history.go(-1);
  }
}

// 跳转行情页面
interface goToSymbolPageParams {
  market: number;
  code: string;
}

export function goToSymbolPage(params: goToSymbolPageParams) {
  return getInstance().call.msg('QUOTE_GO_TO_SYMBOL_INFO', params);
}

// 打开新页面 externalPage
export function openNewPage(params: NewPageParams, isJoin = true) {
  const { path } = params;

  if (params.pageType === PageType.HTML && isJoin) {
    // 拼接url
    const location = joinUrl(path);
    params.path = location;
  }

  if (process.env.NODE_ENV === 'production') {
    getInstance().call.view('PAGE_OPEN', params);
  } else {
    window.location.href = path;
  }
}

// 打开原生APP页面
export function openNativePage(params: NewPageParams) {
  getInstance().call.view('PAGE_OPEN', params);
}

type COptions = {
  closeAllHTML?: boolean;
};

// undefined 代表关闭当前视图
type CParams = COptions | undefined;

// 设置页面按钮
export function pageClose(params: CParams) {
  if (process.env.NODE_ENV === 'production') {
    getInstance().call.view('PAGE_CLOSE', params);
  } else {
    // 关闭当前页面
    window.close();
  }
}

interface ICode {
  smallMarket: number; // 小市场
  code: string; // 代码
}

// 添加自选[单只股票添加]
export function addOptional(params: ICode): Promise<any> {
  return getInstance().call.msg('QUOTE_ADD_OPTIONAL', params);
}

// 添加自选[批量添加]
export function addOptionalList(params: any): Promise<any> {
  return getInstance().call.msg('QUOTE_ADD_OPTIONAL_LIST', params);
}

/**
 * getOptionalList 获取自选股列表
 * @params {pageNum, pageSize} 分页，不传获取全部
 * @return [Array] {code, market}
 */
export function getOptionalList(params: { pageNum?: number; pageSize?: number }): Promise<any> {
  return getInstance().call.msg('QUOTE_GET_OPTIONAL_LIST', params);
}

// 删除自选
export function deleteOptional(params: ICode): Promise<any> {
  return getInstance().call.msg('QUOTE_DELETE_OPTIONAL', params);
}

export enum UserStatus {
  sessioncode_expired = 'sessioncode_expired', // 登录过期
  not_login = 'not_login', // 未登录
  kick_off = ' kick_off', // 中台踢下线
}
type UserStatusChangeParams = { userStatus: UserStatus; message?: string };
// 用户登录失效
export function userStatusChange(params: UserStatusChangeParams): Promise<any> {
  return getInstance().call.msg('NORMAL_USER_STATUS_CHANGE', params);
}

interface StorageSetItem {
  key: string;
  value: any;
}

// 存储
export function sessionStorageSetItem(params: StorageSetItem): Promise<any> {
  return getInstance().call.msg('SESSION_STORAGE_SET_ITEM', params);
}

export function sessionStorageGetItem(params: { key: string }): Promise<any> {
  return getInstance().call.msg('SESSION_STORAGE_GET_ITEM', params);
}

export function sessionStorageRemoveItem(params: { key: string }): Promise<any> {
  return getInstance().call.msg('SESSION_STORAGE_REMOVE_ITEM', params);
}

export function sessionStorageClear(params: { key: string }): Promise<any> {
  return getInstance().call.msg('SESSION_STORAGE_CLEAR', params);
}

/**
 * 获取滚动事件是否到顶
 *
 */
export function isRollTop(): Promise<any> {
  return getInstance().call.msg('rollTop');
}

/**
 * 获取交易登陆信息
 * @returns
 */
export function getTradeUserInfo(): Promise<any> {
  return getInstance().call.msg('TRADE_GET_TRADE_USER_INFO');
}

/**
 * 是否开启原生手势事件
 * @param status: 1-开启/0-关闭
 * @returns
 */
export function normalToggleNativeGesture(status: 0 | 1) {
  return getInstance().call.msg('NORMAL_TOGGLE_NATIVE_GESTURE', { status });
}

export interface ITradeUserConfig {
  orderToConfirmByDialog: boolean; // 交易二次弹框
  orderToConfirmByPwd: boolean; // 交易密码确认
  idleAutoLockDuration: '15m' | '30m' | '60m' | '720m'; // 交易闲置锁定时间
  searchMarketPreference: 'US' | 'HK' | 'SH' | ''; // 市场偏好
  faceId: boolean; // 是否开启faceID
}

/**
 * 获取用户交易配置信息
 * @returns ITradeUserConfig
 */
export function getUserTradeConfigInfo(): Promise<ITradeUserConfig> {
  return getInstance().call.msg('TRADE_GET_TRADE_USER_CONFIG');
}

/**
 * 更新用户交易配置信息
 * @returns ITradeUserConfig
 */
export function updateUserTradeConfigInfo(param: any): Promise<any> {
  return getInstance().call.msg('TRADE_UPDATE_TRADE_USER_CONFIG', param);
}

/**
 * 更新用户交易配置信息
 * @returns ITradeUserConfig
 */
export function activeTradeState(): Promise<any> {
  return getInstance().call.msg('TRADE_ACTIVE_TRADE_STATE');
}

/**
 * 校验交易密码
 * @returns status: 0成功|-1失败
 */
export function tradeCheckPwd(): Promise<{ status: '0' | '-1' }> {
  return getInstance().call.msg('TRADE_CHECK_PASSWORD');
}

interface IPhone {
  tel: string;
  name: string;
}

/**
 * 调用原生的打电话功能
 */
export function normalCall(param: IPhone[]): Promise<undefined> {
  return getInstance().call.msg('NORMAL_CALL', param);
}

export enum ShareType {
  WECHAT_USER, // 微信用户
  WECHAT_MOMENT, // 微信朋友圈
}

interface AShareParams {
  shareType: ShareType;
  link: string; // 文章链接
  ext: Record<string, any>;
}

/**
 * 分享资讯详情
 */
export function consultShare(param: AShareParams): Promise<undefined> {
  return getInstance().call.msg('NEWS_SHARE', param);
}

interface IAddFootMarkParams {
  id: number; // 文章id
  imgUrl: string; // 图片地址
  videoUrl: string; // 视频地址
  title: string; // 文章标题
  content: string; // 文章内容
  dataSource: string; // 数据来源
}

/**
 * 添加足迹
 */
export function addFootmark(param: IAddFootMarkParams): Promise<undefined> {
  return getInstance().call.msg('NEWS_ADD_FOOTMARK', param);
}

interface ConsultCollectParams {
  id: number; // 文章id
  imgUrl: string; // 图片地址
  videoUrl: string; // 视频地址
  title: string; // 文章标题
  content: string; // 文章内容
  isCollect: boolean; // true: 收藏 / false: 取消收藏
  dataSource: string; // 数据来源
}
/**
 * 收藏文章
 */

export function consultCollect(param: ConsultCollectParams): Promise<boolean> {
  return getInstance().call.msg('NEWS_ADD_FAV', param);
}

export enum CShareType {
  PAGE, // 页面
  News, // 新闻
  Data, // 分享数据类 账户持仓、组合相关类
}

export enum PPageType {
  combination, // 组合
  help_center_detail, // 常见问题详情
  live_room, // 直播间
  activity_center, // 活动中心
  poster, // 分享海报
  faceToFace, // 面对面分享
}

interface PageInfo {
  link: string;
  snapshot: boolean; // 是否要分享页面截图
  title?: string;
  desc?: string;
  pictureUrl?: string;
  pageType?: PPageType;
  Id?: string; // 组合id
  userId: string; // 用户id
  type: string; // 组合类型 实盘'1'模拟'0'
}

interface NewsInfo {
  id: number; // 文章id
  imgUrl: string; // 图片地址
  title: string; // 文章标题
  content: string; // 文章内容
  link: string; // 文章链接
}

export enum MarketType {
  A = 'A', // A股
  HK = 'HK', // 港股
  US = 'US', // 美股
}

interface StockData {
  // 股票代码
  // 股票名称
  code?: string;
  name?: string;
  // 现价
  price?: number;
  // 成交价
  costPrice?: number;
  // profitLoss?: number;
  profitLossPct?: number;
  // 市场
  market?: MarketType;
}

export enum shareSourceType {
  AssetsAccount, // 总资产账户
  HKAccount, // 港股账户
  SHSZAccount, // 沪深账户
  USAccount, // 美股账户
  StockAccount, // 个股盈亏
  Combination, // 组合持仓
}
export enum combinationType {
  FirmOffer = '1', // 实盘
  Simulation = '0', // 模拟
}
interface DataInfo {
  // 组合id
  id?: number;
  // 组合名称
  combinationName?: string;
  // 组合创建时间
  createTime?: string;
  // 头像
  headIconUrl?: string;
  // 今日盈亏
  profitLoss?: string;
  // 今日盈亏比率
  profitLossPct?: string;
  // 总盈亏
  totalProfitLoss?: string;
  // 总盈亏比率
  totalProfitLossPct?: string;
  // 30天收益率
  nearly30Profit?: string;
  // 到期日（组合）
  endDate?: string;
  // 持仓列表数据
  holdingStocks?: StockData[]; // StockData[]
  // 关联key[个人持仓=交易账号 , 模拟 / 实盘组合 : 组合id]
  target?: string;
  // 是账户持仓，还是模拟组合或实盘组合
  type?: combinationType;
  // 分享来源(分享具体来源，总账户，港股账户，账户持仓，组合等)
  shareSource?: shareSourceType;
}
interface IShareParams {
  shareType: CShareType;
  info: NewsInfo | PageInfo | DataInfo;
}

/**
 * 分享页面交互
 */
export function sharePage(param: IShareParams): Promise<undefined> {
  return getInstance().call.msg('NORMAL_SHARE', param);
}
