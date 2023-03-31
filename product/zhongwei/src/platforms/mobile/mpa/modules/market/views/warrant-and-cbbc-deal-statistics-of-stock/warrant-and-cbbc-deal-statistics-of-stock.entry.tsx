import React from 'react';
import { store } from '@/platforms/mobile/model/store';
import generatePage from '@mobile/helpers/generate-page';

import App from './warrant-and-cbbc-deal-statistics-of-stock';
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
