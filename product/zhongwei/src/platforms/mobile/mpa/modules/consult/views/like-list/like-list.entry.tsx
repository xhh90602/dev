import { store } from '@/platforms/mobile/model/store';
import generatePage from '@mobile/helpers/generate-page';

import zhCN from '@mobile-mpa/modules/consult/lang/zh-cn';
import zhTW from '@mobile-mpa/modules/consult/lang/zh-tw';
import App from './like-list';

generatePage(<App />, {
  store,
  i18n: { messageDict: { 'zh-CN': zhCN, 'zh-TW': zhTW } },
});

export default {
  title: '点赞列表',
};
