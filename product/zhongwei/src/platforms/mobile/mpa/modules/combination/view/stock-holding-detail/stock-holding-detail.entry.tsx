import generatePage from '@mobile/helpers/generate-page';
import { store } from '@/model/store';
import App from './stock-holding-detail';
import zhCN from '../../lang/zh-CN';
import zhTW from '../../lang/zh-TW';

generatePage(<App />, {
  store,
  i18n: { messageDict: { 'zh-CN': zhCN, 'zh-TW': zhTW } },
});

export default {
  title: '账户持仓详情',
};
