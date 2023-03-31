import generatePage from '@mobile/helpers/generate-page';
import { store } from '@/model/store';
import App from './add-stock';
import zhCN from '../../lang/zh-CN';
import zhTW from '../../lang/zh-TW';

generatePage(<App />, {
  store,
  quote: true,
  i18n: { messageDict: { 'zh-CN': zhCN, 'zh-TW': zhTW } },
});

export default {
  title: '选股器',
};
