import generatePage from '@mobile/helpers/generate-page';
import { store } from '@mobile/model/store';
import AccountDetails from './account-details';
import zhHans from './lang/zh-hans';
import zhHant from './lang/zh-hant';

generatePage(<AccountDetails />, {
  quote: true,
  store,
  i18n: { messageDict: { 'zh-CN': zhHans, 'zh-TW': zhHant } },
});

export default {
  title: '账户详情',
};
