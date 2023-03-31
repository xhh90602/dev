import { store } from '@/platforms/mobile/model/store';
import generatePage from '@mobile/helpers/generate-page';

import zhCN from '@mobile-mpa/modules/quotation/lang/zh-CN';
import zhTW from '@mobile-mpa/modules/quotation/lang/zh-TW';
import App from './submit-quotation-order';

generatePage(<App />, {
  store,
  i18n: { messageDict: { 'zh-CN': zhCN, 'zh-TW': zhTW } },
});

export default {
  title: '提交订单',
};
