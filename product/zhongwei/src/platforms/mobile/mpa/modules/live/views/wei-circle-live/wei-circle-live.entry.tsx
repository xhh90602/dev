import { store } from '@/platforms/mobile/model/store';
import generatePage from '@mobile/helpers/generate-page';

import App from './wei-circle-live';
import zhCN from './lang/zh-cn';
import zhTW from './lang/zh-tw';

generatePage(<App />, {
  store,
  i18n: { messageDict: { 'zh-CN': zhCN, 'zh-TW': zhTW } },
});

export default {
  title: '薇圈直播列表',
};
