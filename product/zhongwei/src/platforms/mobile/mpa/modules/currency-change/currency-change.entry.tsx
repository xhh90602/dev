import generatePage from '@mobile/helpers/generate-page';
import zhHans from './lang/cn';
import zhHant from './lang/tw';
import App from './view/index/currency-change';

generatePage(<App />, {
  i18n: { messageDict: { 'zh-CN': zhHans, 'zh-TW': zhHant } },
});

export default {
  title: '货币兑换',
};
