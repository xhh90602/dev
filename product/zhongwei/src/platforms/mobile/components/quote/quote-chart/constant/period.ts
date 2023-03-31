import { US_INTRADAY_TYPE, KLinePeriod, KLineAdjMode } from '@dz-web/quote-client';

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
  'TIME_5': string;
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
  'five_day' = 5,
}

export const hyphen = '-';
export const concatPeriodType = (type: PeriodType, period: Period): string => `${type}${hyphen}${period}`;
const concatTimePeriodType = concatPeriodType.bind(concatPeriodType, periodTypeDict.time);
const concatKPeriodType = concatPeriodType.bind(concatPeriodType, periodTypeDict.k);

const TIME_1 = concatTimePeriodType(timePeriodDict.one_day);
const TIME_5 = concatTimePeriodType(timePeriodDict.five_day);
const K_DAY = concatKPeriodType(KLinePeriod.DAY);
const K_WEEK = concatKPeriodType(KLinePeriod.WEEK);
const K_MONTH = concatKPeriodType(KLinePeriod.MONTH);
const K_SEASON = concatKPeriodType(KLinePeriod.SEASON);
const K_YEAR = concatKPeriodType(KLinePeriod.YEAR);
const K_M1 = concatKPeriodType(KLinePeriod.M1);
const K_M5 = concatKPeriodType(KLinePeriod.M5);
const K_M15 = concatKPeriodType(KLinePeriod.M15);
const K_M30 = concatKPeriodType(KLinePeriod.M30);
const K_M60 = concatKPeriodType(KLinePeriod.M60);

export const PERIOD_DICT: IPERIODDICT = {
  TIME_1,
  TIME_5,
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
    label: intl({ id: 'timeline_five' }),
    key: PERIOD_DICT.TIME_5,
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
    label: intl({ id: 'quarter_k' }),
    key: PERIOD_DICT.K_SEASON,
    type: 'k',
  },
  {
    label: intl({ id: 'year_k' }),
    key: PERIOD_DICT.K_YEAR,
    type: 'k',
  },
  // {
  //   label: intl({ id: 'period' }),
  //   key: 'period',
  //   children: [
  //     {
  //       // label: intl({ id: 'x_min' }, { num: 1 }),
  //       label: `1${intl({ id: 'x_min' })}`,
  //       key: PERIOD_DICT.K_M1,
  //       type: 'k',
  //     },
  //     {
  //       // label: intl({ id: 'x_min' }, { num: 5 }),
  //       label: `5${intl({ id: 'x_min' })}`,
  //       key: PERIOD_DICT.K_M5,
  //       type: 'k',
  //     },
  //     {
  //       // label: intl({ id: 'x_min' }, { num: 15 }),
  //       label: `15${intl({ id: 'x_min' })}`,
  //       key: PERIOD_DICT.K_M15,
  //       type: 'k',
  //     },
  //     {
  //       // label: intl({ id: 'x_min' }, { num: 30 }),
  //       label: `30${intl({ id: 'x_min' })}`,
  //       key: PERIOD_DICT.K_M30,
  //       type: 'k',
  //     },
  //     {
  //       // label: intl({ id: 'x_min' }, { num: 60 }),
  //       label: `60${intl({ id: 'x_min' })}`,
  //       key: PERIOD_DICT.K_M60,
  //       type: 'k',
  //     },
  //     {
  //       label: intl({ id: 'quarter_k' }),
  //       key: PERIOD_DICT.K_SEASON,
  //       type: 'k',
  //     },
  //     {
  //       label: intl({ id: 'year_k' }),
  //       key: PERIOD_DICT.K_YEAR,
  //       type: 'k',
  //     },
  //   ],
  // },
];

export const getCandleModle: (intl: any) => any[] = (intl: any) => [
  {
    label: intl({ id: 'exit_restoration' }),
    key: KLineAdjMode.ACTUAL,
  },
  {
    label: intl({ id: 'former_restoration' }),
    key: KLineAdjMode.FWD,
  },
  {
    label: intl({ id: 'post_restoration' }),
    key: KLineAdjMode.BWD,
  },
];

export const getUSIntradayTypeList: (intl: any) => any[] = (intl: any) => [
  {
    key: US_INTRADAY_TYPE.ALL,
    label: intl({ id: 'us_intraday_all' }),
  },
  {
    key: US_INTRADAY_TYPE.PREV,
    label: intl({ id: 'us_intraday_prev' }),
  },
  {
    key: US_INTRADAY_TYPE.IN,
    label: intl({ id: 'us_intraday_in' }),
  },
  {
    key: US_INTRADAY_TYPE.POST,
    label: intl({ id: 'us_intraday_post' }),
  },
];
