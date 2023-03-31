import { ICommodity } from 'quote-ws-client-for-dz';
import { ITHEME } from './constant/chart-theme';

export enum queryDataType {
  create,
  push,
  unshift,
}

export enum refreshChartTypeEnum {
  resetData,
  unshiftData,
  pushData,
  changeTheme,
}

export interface ICommonParams {
  themeConfig: ITHEME;
  commodityQuotes: ICommodity;
  closeCallback?: any; // 关闭反馈信息
  volumeUnit?: string;
}

export interface ITimeData {
  priceData: string[];
  volumeData: number[];
  avgData: string[];
  timeData: string[];
  miscData: ITimeMisc[];
  tickIndexList: number[];
  code: string;
  market: number;
  dataType: refreshChartTypeEnum;
}

export interface ITradeTime {
  open: number;
  close: number;
}

interface ITimeMisc {
  floatRate: string;
  floatValue: string;
  amount: string;
  avgColorField: string;
  floatColorField: string;
  volume: string;
}
