import { CommodityQuote } from '@dz-web/quote-client';
import { ITHEME } from './chart-theme';

export interface ICommonParams {
  themeConfig: ITHEME;
  commodityQuotes: CommodityQuote;
  closeCallback?: any; // 关闭反馈信息
  volumeUnit?: string;
  formatMessage: any;
}
