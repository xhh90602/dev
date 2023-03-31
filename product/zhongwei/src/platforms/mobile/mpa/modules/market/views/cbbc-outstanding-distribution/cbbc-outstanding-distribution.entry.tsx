import { store } from '@/platforms/mobile/model/store';
import generatePage from '@mobile/helpers/generate-page';

import App from './cbbc-outstanding-distribution';
import zhCN from '../../lang/zh-cn';
import zhTW from '../../lang/zh-tw';

generatePage(<App />, {
  store,
  quote: true,
  i18n: { messageDict: { 'zh-CN': zhCN, 'zh-TW': zhTW } },
});

export default {
  title: '牛熊街货分布',
};
