import generatePage from '@mobile/helpers/generate-page';
import { store } from '@mobile/model/store';
import RouterApp from './routers';
import zhHans from './lang/zh-hans';
import zhHant from './lang/zh-hant';

generatePage(<RouterApp />, {
  quote: true,
  store,
  i18n: { messageDict: { 'zh-CN': zhHans, 'zh-TW': zhHant } },
});

export default {
  title: '持仓组合',
};
