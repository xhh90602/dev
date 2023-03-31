import generatePage from '@mobile/helpers/generate-page';
import zhHans from './lang/cn';
import zhHant from './lang/tw';
import App from './my-fee';

generatePage(<App />, {
  i18n: { messageDict: { 'zh-CN': zhHans, 'zh-TW': zhHant } },
});

export default {
  title: '我的费率',
};
