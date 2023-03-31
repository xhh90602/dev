import { Stock } from '@dz-web/quote-client';

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

export interface ITimeData extends Stock {
  priceData: string[];
  volumeData: number[];
  avgData: string[];
  timeData: string[];
  miscData: ITimeMisc[];
  tickIndexList: number[];
  dataType: refreshChartTypeEnum;
  tickIntervalList: number[];
}

interface IKLine {
  open: string;
  close: string;
  high: string;
  low: string;
}

export interface IKLineMisc extends IKLine {
  floatRate: string;
  floatValue: string;
  amount: string;
  floatColorField: string;
  highColorField: string;
  lowColorField: string;
  openColorField: string;
  closeColorField: string;
  barColorField: string;
  isRise: boolean;
  volume: string;
  zhenfu: string;
}

export interface IKLineData {
  timeData: string[],
  kLineData: [string, string, string, string][],
  volumeData: number[],
  amountData: string[],
  miscData: IKLineMisc[],
  dataType: refreshChartTypeEnum;
}
