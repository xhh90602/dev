import { ICommodity } from 'quote-ws-client-for-dz';
import { ITHEME } from './chart-theme';

export interface ICommonParams {
  themeConfig: ITHEME;
  commodityQuotes: ICommodity;
  closeCallback?: any; // 关闭反馈信息
  volumeUnit?: string;
}
