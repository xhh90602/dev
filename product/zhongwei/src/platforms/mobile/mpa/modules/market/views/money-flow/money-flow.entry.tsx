import { store } from '@/platforms/mobile/model/store';
import generatePage from '@mobile/helpers/generate-page';

import App from './money-flow';
import zhCN from '../../lang/zh-cn';
import zhTW from '../../lang/zh-tw';

generatePage(
  <App />,
  {
    store,
    quote: true,
    i18n: { messageDict: { 'zh-CN': zhCN, 'zh-TW': zhTW } },
  },
  true,
);

export default {
  title: '资金流向',
};
