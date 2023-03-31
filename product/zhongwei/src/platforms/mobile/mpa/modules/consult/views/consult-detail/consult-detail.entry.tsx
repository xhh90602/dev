import { store } from '@/platforms/mobile/model/store';
import generatePage from '@mobile/helpers/generate-page';

import zhCN from '@mobile-mpa/modules/consult/lang/zh-cn';
import zhTW from '@mobile-mpa/modules/consult/lang/zh-tw';
import App from './consult-detail';

import '@mobile/styles/global.scss';

generatePage(<App />, {
  quote: true,
  store,
  i18n: { messageDict: { 'zh-CN': zhCN, 'zh-TW': zhTW } },
});

export default {
  title: '资讯详情',
};
