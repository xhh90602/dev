import generatePage from '@mobile/helpers/generate-page';
import { store } from '@/platforms/mobile/model/store';
import App from './warrant-and-cbbc-deal-statistics-of-market';
import zhCN from './lang/zh-cn';
import zhTW from './lang/zh-tw';

generatePage(<App />, {
  store,
  quote: true,
  i18n: { messageDict: { 'zh-CN': zhCN, 'zh-TW': zhTW } },
});

export default {
  title: '轮证成交统计',
};
