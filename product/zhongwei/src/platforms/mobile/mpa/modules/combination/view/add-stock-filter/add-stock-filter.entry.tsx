import { store } from '@/platforms/mobile/model/store';
import generatePage from '@mobile/helpers/generate-page';

import App from './add-stock-filter';
import zhCN from '../../lang/zh-CN';
import zhTW from '../../lang/zh-TW';

generatePage(<App />, {
  store,
  quote: true,
  i18n: { messageDict: { 'zh-CN': zhCN, 'zh-TW': zhTW } },
});

export default {
  title: '添加股票',
};
