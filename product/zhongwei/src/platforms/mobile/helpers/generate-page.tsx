import ReactDOM from 'react-dom';
import { watchGlobalError } from '@dz-web/police-browser';
import { ErrorBoundaryWithLogger } from '@dz-web/police-react';
import { initEncryptKey, security } from '@/encrypt';
import { TradeConditionKey, tradeReqCondition } from '@/api/create-instance/trade-request';
import { back } from './native/register';
import { pageBack } from './native/msg';
import logger from './logger';
import '@/global-css/main.scss';
import '@mobile/styles/global.scss';

import wrapNative from './entry/native';
import wrapI18n, { I18nOption } from './entry/i18n';
import wrapRedux from './entry/redux';
import bridge from './native/bridge';

import wrapQuote from './entry/quote';

interface IOptions {
  store?: any;
  native?: boolean;
  quote?: boolean;
  i18n?: I18nOption;
}

export async function encryption() {
  try {
    const { commonServer } = window.GLOBAL_CONFIG.COMMON_SERVERS;
    const stoken = await initEncryptKey(commonServer, security.postKey);
    security.respKey = stoken;
    tradeReqCondition[TradeConditionKey.ENCRYPTTOKEN] = stoken;
    return stoken;
  } catch (error) {
    console.log(error);
    return '';
  }
}

function mounte(native: boolean, innerApp: React.ReactElement) {
  if (native) {
    bridge.ready(() => {
      ReactDOM.render(innerApp, document.getElementById('root'));
    });
  } else {
    ReactDOM.render(innerApp, document.getElementById('root'));
  }
}

export default function generatePage(App: React.ReactNode, options: IOptions = {}): void {
  const { store, native = true, i18n, quote = false } = options;
  let wrapApp: React.ReactNode = (
    <ErrorBoundaryWithLogger logger={logger} fallback={null}>
      {App as React.ReactElement}
    </ErrorBoundaryWithLogger>
  );

  if (store) wrapApp = wrapRedux(wrapApp, store);
  if (i18n) wrapApp = wrapI18n(wrapApp, i18n);
  if (quote) wrapApp = wrapQuote(wrapApp);
  if (native) wrapApp = wrapNative(wrapApp);
  if (window.GLOBAL_CONFIG.ENABLE_ENCRYPT) encryption();

  // 全局注册Native头部交互，返回上一页箭头点击回调
  back(() => {
    const { history } = window;

    if (!history.state || [0, '0'].includes(history.state.idx) || history.length === 1) {
      pageBack();
      return;
    }

    window.history.back();
  });

  watchGlobalError(logger);
  mounte(native, wrapApp as React.ReactElement);
}
