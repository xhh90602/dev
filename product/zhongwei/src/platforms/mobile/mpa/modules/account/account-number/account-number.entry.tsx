import generatePage from '@mobile/helpers/generate-page';
import zhHans from './lang/zh-hans';
import zhHant from './lang/zh-hant';
import App from './account-number';

generatePage(<App />, {
  i18n: { messageDict: { 'zh-CN': zhHans, 'zh-TW': zhHant } },
});

export default {
  title: '账户号码',
};
