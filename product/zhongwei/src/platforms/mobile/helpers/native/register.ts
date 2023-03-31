import { THEME, GREEN, RED, LAN_ENUM } from '@mobile/constants/config';
import bridge from './bridge';

const { getInstance } = bridge;

/**
 * 更新用户信息
 *
 */
export interface IUserInfoRaw {
  sessionCode: string;
}

export function updateUserInfo(func: (config: IUserInfoRaw) => void): void {
  getInstance().register('NORMAL_UPDATE_USER_INFO', func, () => 'updateUserInfo ===> received message');
}

/**
 * 用户更新配置
 *
 */
export interface IUserConfigRaw {
  raise: GREEN | RED; // 涨跌色
  theme: THEME;
  language: LAN_ENUM;
  font_size: number;
  global_font_scale: number;
  quote_change_color: string;
  [prop: string]: any;
}

export function updateUserConfig(func: (config: IUserConfigRaw) => void): void {
  getInstance().register('NORMAL_UPDATE_USER_CONFIG', func, () => 'updateUserConfiguration ===> received message');
}

// 顶部返回按钮
export function headerButtonCallBack(func: (config: any) => void): void {
  getInstance().register('headerButtonCallBack', func, () => 'headerButton ===> received message');
}
// 顶部完成按钮
export function headerButtonCallComplete(func: (config: any) => void): void {
  getInstance().register('headerButtonCallComplete', func, () => 'headerButton ===> received message');
}
// 顶部取消按钮
export function headerButtonCallCancel(func: (config: any) => void): void {
  getInstance().register('headerButtonCallCancel', func, () => 'headerButton ===> received message');
}
// 顶部分享按钮
export function headerButtonCallShare(func: (config: any) => void): void {
  getInstance().register('headerButtonCallShare', func, () => 'headerButton ===> received message');
}
// 顶部搜索按钮
export function headerSearchCallBack(func: (config: any) => void): void {
  getInstance().register('headerSearchCallBack', func, () => 'headerButton ===> received message');
}

/**
 * 交易搜索
 */
export interface ISearchStockProps {
  market: number;
  name: string;
  code: string;
}

export function searchStockCallback(func: ({ market, code, name }: ISearchStockProps) => void) {
  getInstance().register('searchStockCallback', func, () => 'searchStockCallback');
}

export function webViewTouch(func): void {
  getInstance().register('onWebViewTouchEvent', func, () => 'onWebViewTouchEvent ===> received message');
}

// 生命周期-进入当前页面
export function pageOnShow(func: () => void): void {
  getInstance().register('PAGE_LIFECYCLE_SHOW', func, () => 'page onShow');
}

// 生命周期-离开当前页面
export function pageOnHide(func: () => void): void {
  getInstance().register('PAGE_LIFECYCLE_HIDE', func, () => 'page onHide');
}

// 返回上一页
export function back(func: () => void): void {
  getInstance().register('back', func, () => 'page back');
}

export function disableIosScroll(func): void {
  getInstance().register('webViewScrollDisable', func, () => 'onWebViewTouchEvent ===> received message');
}
// 公共回调事件
interface ICommonCallBackProps {
  callbackEventName: string; // 回调事件名称【必填】, 其他自定义参数不限制
  // ...其他自定义参数
}
export function commonCallBack(func: ({ callbackEventName }: ICommonCallBackProps) => void) {
  getInstance().register('COMMON_CALLBACK', func, () => 'common callBack');
}
// 监听缓存变化
export function sessionStorageWatch(func: any) {
  return getInstance().register('sessionStorageWatch', func);
}
/**
 * @param show: boolean; // 是否展示 true为展开 false为收起
 * @param height: number; // 键盘高度 px
 * 键盘高度变化
 */
export function keyBoardChange(func) {
  getInstance().register('NORMAL_KEYBOARD', func, () => 'common callBack');
}

export function updateTradeSetting(func) {
  getInstance().register('TRADE_UPDATE_USER_CONFIG', func, () => 'updateTradeSetting');
}
