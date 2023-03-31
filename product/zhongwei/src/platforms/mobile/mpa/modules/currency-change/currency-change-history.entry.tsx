import generatePage from '@mobile/helpers/generate-page';
import zhHans from './lang/cn';
import zhHant from './lang/tw';
import App from './view/history/currency-change-history';

generatePage(<App />, {
  i18n: { messageDict: { 'zh-CN': zhHans, 'zh-TW': zhHant } },
});

export default {
  title: '兑换记录',
};
