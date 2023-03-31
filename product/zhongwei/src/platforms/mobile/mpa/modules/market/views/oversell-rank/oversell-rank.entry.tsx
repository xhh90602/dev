import { store } from '@/platforms/mobile/model/store';
import generatePage from '@mobile/helpers/generate-page';

import zhCN from '@mobile-mpa/modules/market/lang/zh-cn';
import zhTW from '@mobile-mpa/modules/market/lang/zh-tw';
import App from './oversell-rank';

generatePage(<App />, {
  quote: true,
  store,
  i18n: { messageDict: { 'zh-CN': zhCN, 'zh-TW': zhTW } },
});

export default {
  title: '賣空榜單',
};
