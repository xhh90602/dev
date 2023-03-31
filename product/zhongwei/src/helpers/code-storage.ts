interface ICodeStorageData {
  [prop: string]: any;
}
class CodeStorage {
  data: ICodeStorageData = {};

  language = 'zh-CN';

  token = '';

  tradeToken = '';

  // 交易偏好设置
  searchMarketPreference = 'HK';

  // 下单二次弹窗
  orderToConfirmByDialog = false;

  // 下单输入密码
  orderToConfirmByPwd = true;

  hasIdleAutoLockDuration = false;

  idleAutoLockDuration = '15m';

  quoteWsAddress = '';

  userInfo = {
    sessionCode: '',
    tradeToken: '',
    mobile: '',
  };

  set(key: string, data: any): void {
    this[key] = data;
  }

  get(key: string) {
    return this.data[key];
  }
}

export default new CodeStorage();
