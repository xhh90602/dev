import { store } from '@/platforms/mobile/model/store';
import generatePage from '@mobile/helpers/generate-page';

import App from './my-coupon';
import zhCN from '../../lang/zh-CN';
import zhTW from '../../lang/zh-TW';

generatePage(<App />, {
  store,
  i18n: { messageDict: { 'zh-CN': zhCN, 'zh-TW': zhTW } },
});

export default {
  title: '我的卡券',
};
