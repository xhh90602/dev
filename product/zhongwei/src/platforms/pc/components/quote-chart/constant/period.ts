import { KLineType, WeightType } from 'quote-ws-client-for-dz';

export interface IBasePeriodList {
  label: string;
  key: string;
  type?: string;
}

export interface IPeriodList extends IBasePeriodList {
  children?: IBasePeriodList[];
}

export interface IPERIODDICT {
  'TIME_1': string;
  'K_DAY': string;
  'K_WEEK': string;
  'K_MONTH': string;
  'K_SEASON': string;
  'K_YEAR': string;
  'K_M1': string;
  'K_M5': string;
  'K_M15': string;
  'K_M30': string;
  'K_M60': string;
}

export type PeriodType = string;
export type Period = string | number;

export enum periodTypeDict {
  time = 'time',
  k = 'k',
}

export enum timePeriodDict {
  'one_day' = 1,
}

export const hyphen = '-';
export const concatPeriodType = (type: PeriodType, period: Period): string => `${type}${hyphen}${period}`;
const concatTimePeriodType = concatPeriodType.bind(concatPeriodType, periodTypeDict.time);
const concatKPeriodType = concatPeriodType.bind(concatPeriodType, periodTypeDict.k);

const TIME_1 = concatTimePeriodType(timePeriodDict.one_day);
const K_DAY = concatKPeriodType(KLineType.DAY);
const K_WEEK = concatKPeriodType(KLineType.WEEK);
const K_MONTH = concatKPeriodType(KLineType.MONTH);
const K_SEASON = concatKPeriodType(KLineType.SEASON);
const K_YEAR = concatKPeriodType(KLineType.YEAR);
const K_M1 = concatKPeriodType(KLineType.M1);
const K_M5 = concatKPeriodType(KLineType.M5);
const K_M15 = concatKPeriodType(KLineType.M15);
const K_M30 = concatKPeriodType(KLineType.M30);
const K_M60 = concatKPeriodType(KLineType.M60);

export const PERIOD_DICT: IPERIODDICT = {
  TIME_1,
  K_DAY,
  K_WEEK,
  K_MONTH,
  K_SEASON,
  K_YEAR,
  K_M1,
  K_M5,
  K_M15,
  K_M30,
  K_M60,
};

// 适配交易页面小屏幕 1280
export const getTradePeriodList: ()=> IPeriodList[] = () => [
  {
    label: 'timeline',
    key: PERIOD_DICT.TIME_1,
    type: 'time',
  },
  {
    label: 'period',
    key: 'period',
    children: [
      {
        label: '1_minute',
        key: PERIOD_DICT.K_M1,
        type: 'k',
      },
      {
        label: '5_minute',
        key: PERIOD_DICT.K_M5,
        type: 'k',
      },
      {
        label: '15_minute',
        key: PERIOD_DICT.K_M15,
        type: 'k',
      },
      {
        label: '30_minute',
        key: PERIOD_DICT.K_M30,
        type: 'k',
      },
      {
        label: '60_minute',
        key: PERIOD_DICT.K_M60,
        type: 'k',
      },
      {
        label: 'day_k',
        key: PERIOD_DICT.K_DAY,
        type: 'k',
      },
      {
        label: 'week_k',
        key: PERIOD_DICT.K_WEEK,
        type: 'k',
      },
      {
        label: 'month_k',
        key: PERIOD_DICT.K_MONTH,
        type: 'k',
      },
      {
        label: 'quarter_k',
        key: PERIOD_DICT.K_SEASON,
        type: 'k',
      },
      {
        label: 'year_k',
        key: PERIOD_DICT.K_YEAR,
        type: 'k',
      },
    ],
  },
];

export const getPeriodList: (intl)=> IPeriodList[] = (intl) => [
  {
    label: intl({ id: 'timeline' }),
    key: PERIOD_DICT.TIME_1,
    type: 'time',
  },
  {
    label: intl({ id: 'day_k' }),
    key: PERIOD_DICT.K_DAY,
    type: 'k',
  },
  {
    label: intl({ id: 'week_k' }),
    key: PERIOD_DICT.K_WEEK,
    type: 'k',
  },
  {
    label: intl({ id: 'month_k' }),
    key: PERIOD_DICT.K_MONTH,
    type: 'k',
  },
  {
    label: intl({ id: 'period' }),
    key: 'period',
    children: [
      {
        label: intl({ id: 'x_min' }, { num: 1 }),
        key: PERIOD_DICT.K_M1,
        type: 'k',
      },
      {
        label: intl({ id: 'x_min' }, { num: 5 }),
        key: PERIOD_DICT.K_M5,
        type: 'k',
      },
      {
        label: intl({ id: 'x_min' }, { num: 15 }),
        key: PERIOD_DICT.K_M15,
        type: 'k',
      },
      {
        label: intl({ id: 'x_min' }, { num: 30 }),
        key: PERIOD_DICT.K_M30,
        type: 'k',
      },
      {
        label: intl({ id: 'x_min' }, { num: 60 }),
        key: PERIOD_DICT.K_M60,
        type: 'k',
      },
      {
        label: intl({ id: 'quarter_k' }),
        key: PERIOD_DICT.K_SEASON,
        type: 'k',
      },
      {
        label: intl({ id: 'year_k' }),
        key: PERIOD_DICT.K_YEAR,
        type: 'k',
      },
    ],
  },
];

export const getCandleModle: (intl: any) => any[] = (intl: any) => [
  {
    label: intl({ id: 'exit_restoration' }),
    key: WeightType.RAW,
  },
  {
    label: intl({ id: 'former_restoration' }),
    key: WeightType.FORWARD,
  },
  {
    label: intl({ id: 'post_restoration' }),
    key: WeightType.BACKWARD,
  },
];
