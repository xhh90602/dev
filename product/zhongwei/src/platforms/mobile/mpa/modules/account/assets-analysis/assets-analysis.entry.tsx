import generatePage from '@mobile/helpers/generate-page';
import { store } from '@mobile/model/store';
import AssetsAnalysis from './assets-analysis';
import zhHans from './lang/zh-hans';
import zhHant from './lang/zh-hant';

generatePage(<AssetsAnalysis />, {
  quote: true,
  store,
  i18n: { messageDict: { 'zh-CN': zhHans, 'zh-TW': zhHant } },
});

export default {
  title: '资产分析',
};
