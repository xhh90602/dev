import generatePage from '@mobile/helpers/generate-page';
import { store } from '@mobile/model/store';
import zhHans from './lang/cn';
import zhHant from './lang/tw';
import App from './view/stock-roll/stock-roll';

generatePage(<App />, {
  quote: true,
  store,
  i18n: { messageDict: { 'zh-CN': zhHans, 'zh-TW': zhHant } },
});

export default {
  title: '股票转入转出',
};
