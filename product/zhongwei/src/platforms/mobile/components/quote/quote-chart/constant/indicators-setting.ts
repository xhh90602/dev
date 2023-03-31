import { get } from 'lodash-es';
import { CacheStore } from '@dz-web/cache';
// import { getDefautChartIndicators } from '@pc/model/quote';
import { K_MAIN_INDICATOR_DICT, K_SUB_INDICATOR_DICT } from './indicator-k';

export const defaultIndicatorValue = get(window, 'GLOBAL_CONFIG.QUOTES_CONFIG.chartIndicatorsParamsList');

export const TEMP_INDICATORS_CACHE_KEY = 'TEMP_K_INDICATORS';

function generateRepeatArr({ indicatorValues, tab, paramName, indicator, min = 1, max = 1000, isRequired = true }) {
  const defaultArr = get(indicatorValues, tab, null) || get(defaultIndicatorValue, tab, []);

  return defaultArr.map((v, i) => ({
    key: `${indicator}${i + 1}`,
    paramName,
    indicator: `${indicator}${i + 1}`,
    isRequired,
    value: v,
    defaultValue: get(defaultIndicatorValue, `${tab}[${i}]`, undefined),
    min,
    max,
  }));
}

const { boll = [], sar = [], dma = [], macd, kdj = [], rsi = [] } = defaultIndicatorValue;

export const DEFAULT_INDICTORS_VALUE = {
  [K_MAIN_INDICATOR_DICT.MA]: (indicatorValues) => generateRepeatArr({
    indicatorValues,
    tab: K_MAIN_INDICATOR_DICT.MA,
    paramName: 'moving_avg_period',
    indicator: 'MA',
    min: 1,
    max: 1000,
  }),
  [K_MAIN_INDICATOR_DICT.EMA]: (indicatorValues) => generateRepeatArr({
    indicatorValues,
    tab: K_MAIN_INDICATOR_DICT.EMA,
    paramName: 'moving_avg_period',
    indicator: 'EMA',
    min: 1,
    max: 1000,
  }),
  [K_MAIN_INDICATOR_DICT.BOLL]: (indicatorValues) => {
    console.log(indicatorValues, '<-- indicatorValues');
    return [
      {
        key: 'MID',
        paramName: 'cacl_period',
        indicator: 'MID',
        isRequired: true,
        value: get(indicatorValues, `${K_MAIN_INDICATOR_DICT.BOLL}[0]`, boll[0]),
        defaultValue: boll[0],
        max: 120,
      },
      {
        key: 'UPPER',
        paramName: 'stock_charactor_param',
        indicator: 'UPPER',
        isRequired: true,
        value: get(indicatorValues, `${K_MAIN_INDICATOR_DICT.BOLL}[1]`, boll[1]),
        defaultValue: boll[1],
        max: 100,
      },
      // {
      //   key: 'LOWER',
      //   paramName: '',
      //   indicator: 'LOWER',
      //   value: undefined,
      //   defaultValue: undefined,
      // },
    ];
  },
  [K_MAIN_INDICATOR_DICT.SAR]: (indicatorValues) => ([
    {
      key: 'S',
      paramName: 'cacl_period',
      indicator: 'BB',
      isRequired: true,
      value: get(indicatorValues, `${K_MAIN_INDICATOR_DICT.SAR}[0]`, sar[0]),
      defaultValue: sar[0],
      max: 100,
      // readonly: true,
    },
    {
      key: 'A',
      paramName: 'increment',
      indicator: '',
      isRequired: true,
      value: get(indicatorValues, `${K_MAIN_INDICATOR_DICT.SAR}[1]`, sar[1]),
      defaultValue: sar[1],
      max: 100,
    },
    {
      key: 'R',
      paramName: 'extreme_value',
      indicator: '',
      isRequired: true,
      value: get(indicatorValues, `${K_MAIN_INDICATOR_DICT.SAR}[2]`, sar[2]),
      defaultValue: sar[2],
      max: 100,
    },
  ]),
  [K_MAIN_INDICATOR_DICT.SMA]: (indicatorValues) => generateRepeatArr({
    indicatorValues,
    tab: K_MAIN_INDICATOR_DICT.SMA,
    paramName: 'moving_avg_period',
    indicator: 'SMA',
    min: 1,
    max: 1000,
  }),
  [K_SUB_INDICATOR_DICT.VOL]: (indicatorValues) => generateRepeatArr({
    indicatorValues,
    tab: K_SUB_INDICATOR_DICT.VOL,
    paramName: 'moving_avg_period',
    indicator: 'VOL',
    min: 1,
    max: 1000,
  }),
  [K_SUB_INDICATOR_DICT.DMA]: (indicatorValues) => ([
    {
      key: 'D',
      paramName: 'short_period',
      indicator: 'DDD',
      isRequired: true,
      value: get(indicatorValues, `${K_SUB_INDICATOR_DICT.DMA}[0]`, dma[0]),
      defaultValue: dma[0],
      max: 60,
    },
    {
      key: 'M',
      paramName: 'long_period',
      indicator: 'DDDMA',
      isRequired: true,
      value: get(indicatorValues, `${K_SUB_INDICATOR_DICT.DMA}[1]`, dma[1]),
      defaultValue: dma[1],
      max: 250,
    },
    {
      key: 'A',
      paramName: 'moving_avg_period',
      indicator: '',
      isRequired: true,
      value: get(indicatorValues, `${K_SUB_INDICATOR_DICT.DMA}[2]`, dma[2]),
      defaultValue: dma[2],
      max: 100,
    },
  ]),
  [K_SUB_INDICATOR_DICT.MACD]: (indicatorValues) => ([
    {
      key: 'DIF',
      paramName: 'short_period',
      indicator: 'DIF',
      isRequired: true,
      value: get(indicatorValues, `${K_SUB_INDICATOR_DICT.MACD}[0]`, macd[0]),
      defaultValue: macd[0],
      max: 200,
    },
    {
      key: 'DEA',
      paramName: 'long_period',
      indicator: 'DEA',
      isRequired: true,
      value: get(indicatorValues, `${K_SUB_INDICATOR_DICT.MACD}[1]`, macd[1]),
      defaultValue: macd[1],
      max: 200,
    },
    {
      key: 'MACD',
      paramName: 'moving_avg_period',
      indicator: 'MACD',
      isRequired: true,
      value: get(indicatorValues, `${K_SUB_INDICATOR_DICT.MACD}[2]`, macd[2]),
      defaultValue: macd[2],
      max: 200,
    },
  ]),
  [K_SUB_INDICATOR_DICT.KDJ]: (indicatorValues) => ([
    {
      key: 'K',
      paramName: 'cacl_period',
      indicator: 'K',
      isRequired: true,
      value: get(indicatorValues, `${K_SUB_INDICATOR_DICT.KDJ}[0]`, kdj[0]),
      defaultValue: kdj[0],
      max: 90,
    },
    {
      key: 'D',
      paramName: 'moving_avg_period',
      indicator: 'D',
      isRequired: true,
      value: get(indicatorValues, `${K_SUB_INDICATOR_DICT.KDJ}[1]`, kdj[1]),
      defaultValue: kdj[1],
      max: 30,
    },
    {
      key: 'J',
      paramName: 'moving_avg_period',
      indicator: 'J',
      isRequired: true,
      value: get(indicatorValues, `${K_SUB_INDICATOR_DICT.KDJ}[2]`, kdj[2]),
      defaultValue: kdj[2],
      max: 30,
    },
  ]),
  [K_SUB_INDICATOR_DICT.RSI]: (indicatorValues) => ([
    {
      key: 'RSI1',
      paramName: 'moving_avg_period',
      indicator: 'RSI1',
      isRequired: true,
      value: get(indicatorValues, `${K_SUB_INDICATOR_DICT.RSI}[0]`, rsi[0]),
      defaultValue: rsi[0],
      max: 120,
    },
    {
      key: 'RSI2',
      paramName: 'moving_avg_period',
      indicator: 'RSI2',
      isRequired: true,
      value: get(indicatorValues, `${K_SUB_INDICATOR_DICT.RSI}[1]`, rsi[1]),
      defaultValue: rsi[1],
      max: 250,
    },
    {
      key: 'RSI3',
      paramName: 'moving_avg_period',
      indicator: 'RSI3',
      isRequired: true,
      value: get(indicatorValues, `${K_SUB_INDICATOR_DICT.RSI}[2]`, rsi[2]),
      defaultValue: rsi[2],
      max: 500,
    },
  ]),
};

const IndicatorColumnMap = {
  paramName: {
    title: 'param_name',
    key: 'paramName',
    dataKey: 'paramName',
    width: 120,
  },
  inputNumber: {
    title: 'param_value',
    key: 'paramValue',
    width: 140,
    inputType: 'RenderInputNumber',
    // render: (row) => renderInput(row),
  },
  indicator: {
    title: 'indicator_line',
    key: 'indicator',
    width: 90,
    dataKey: 'indicator',
  },
};

const defaultColumns = [IndicatorColumnMap.paramName, IndicatorColumnMap.inputNumber, IndicatorColumnMap.indicator];

export const K_INDICATORS_CONFIG_MAP = {
  [K_MAIN_INDICATOR_DICT.MA]: {
    key: K_MAIN_INDICATOR_DICT.MA,
    title: 'ma_description',
    explanation: '',
    columns: defaultColumns,
    renderDataSourceFn: DEFAULT_INDICTORS_VALUE[K_MAIN_INDICATOR_DICT.MA],
  },
  [K_MAIN_INDICATOR_DICT.EMA]: {
    key: K_MAIN_INDICATOR_DICT.EMA,
    title: 'ema_description',
    explanation: '',
    columns: defaultColumns,
    renderDataSourceFn: DEFAULT_INDICTORS_VALUE[K_MAIN_INDICATOR_DICT.EMA],
  },
  [K_MAIN_INDICATOR_DICT.BOLL]: {
    key: K_MAIN_INDICATOR_DICT.BOLL,
    title: 'boll_description',
    explanation: '',
    columns: defaultColumns,
    renderDataSourceFn: DEFAULT_INDICTORS_VALUE[K_MAIN_INDICATOR_DICT.BOLL],
  },
  [K_MAIN_INDICATOR_DICT.SMA]: {
    key: K_MAIN_INDICATOR_DICT.SMA,
    title: 'sma_description',
    explanation: '',
    columns: defaultColumns,
    renderDataSourceFn: DEFAULT_INDICTORS_VALUE[K_MAIN_INDICATOR_DICT.SMA],
  },
  [K_MAIN_INDICATOR_DICT.SAR]: {
    key: K_MAIN_INDICATOR_DICT.SAR,
    title: 'sar_description',
    explanation: '',
    columns: defaultColumns,
    renderDataSourceFn: DEFAULT_INDICTORS_VALUE[K_MAIN_INDICATOR_DICT.SAR],
  },
  [K_SUB_INDICATOR_DICT.VOL]: {
    key: K_SUB_INDICATOR_DICT.VOL,
    title: 'vol_description',
    explanation: '',
    columns: defaultColumns,
    renderDataSourceFn: DEFAULT_INDICTORS_VALUE[K_SUB_INDICATOR_DICT.VOL],
  },
  [K_SUB_INDICATOR_DICT.MACD]: {
    key: K_SUB_INDICATOR_DICT.MACD,
    title: 'macd_description',
    explanation: '',
    columns: defaultColumns,
    renderDataSourceFn: DEFAULT_INDICTORS_VALUE[K_SUB_INDICATOR_DICT.MACD],
  },
  [K_SUB_INDICATOR_DICT.KDJ]: {
    key: K_SUB_INDICATOR_DICT.KDJ,
    title: 'kdj_description',
    explanation: '',
    columns: defaultColumns,
    renderDataSourceFn: DEFAULT_INDICTORS_VALUE[K_SUB_INDICATOR_DICT.KDJ],
  },
  [K_SUB_INDICATOR_DICT.RSI]: {
    key: K_SUB_INDICATOR_DICT.RSI,
    title: 'rsi_description',
    explanation: '',
    columns: defaultColumns,
    renderDataSourceFn: DEFAULT_INDICTORS_VALUE[K_SUB_INDICATOR_DICT.RSI],
  },
  [K_SUB_INDICATOR_DICT.DMA]: {
    key: K_SUB_INDICATOR_DICT.DMA,
    title: 'dma_description',
    explanation: '',
    columns: defaultColumns,
    renderDataSourceFn: DEFAULT_INDICTORS_VALUE[K_SUB_INDICATOR_DICT.DMA],
  },
};

export const K_INDICATORS_CONFIG_LIST = [
  K_INDICATORS_CONFIG_MAP[K_MAIN_INDICATOR_DICT.MA],
  K_INDICATORS_CONFIG_MAP[K_MAIN_INDICATOR_DICT.EMA],
  K_INDICATORS_CONFIG_MAP[K_MAIN_INDICATOR_DICT.BOLL],
  K_INDICATORS_CONFIG_MAP[K_MAIN_INDICATOR_DICT.SAR],
  K_INDICATORS_CONFIG_MAP[K_MAIN_INDICATOR_DICT.SMA],
  K_INDICATORS_CONFIG_MAP[K_SUB_INDICATOR_DICT.VOL],
  K_INDICATORS_CONFIG_MAP[K_SUB_INDICATOR_DICT.DMA],
  K_INDICATORS_CONFIG_MAP[K_SUB_INDICATOR_DICT.MACD],
  K_INDICATORS_CONFIG_MAP[K_SUB_INDICATOR_DICT.KDJ],
  K_INDICATORS_CONFIG_MAP[K_SUB_INDICATOR_DICT.RSI],
];

export function changeTempCachedValues(tab: string, index: number, value) {
  if (index === null) return;
  const prev = CacheStore.getItem(TEMP_INDICATORS_CACHE_KEY) || {};
  const defaultVal = [];
  // const defaultVal = get(getDefautChartIndicators(), tab, []);
  const cur = [...get(prev, tab, defaultVal)];
  cur[index] = value;
  CacheStore.setItem(TEMP_INDICATORS_CACHE_KEY, { ...prev, [tab]: cur });
}

export function getTempCachedValues(key: string) {
  return get(CacheStore.getItem(TEMP_INDICATORS_CACHE_KEY), key, []);
}

export function removeTempCachedValue(key: string) {
  const values = CacheStore.getItem(TEMP_INDICATORS_CACHE_KEY) || {};
  delete values[key];
  CacheStore.setItem(TEMP_INDICATORS_CACHE_KEY, values);
}

export function saveTempCachedValue(key: string, value: []) {
  const prev = CacheStore.getItem(TEMP_INDICATORS_CACHE_KEY) || {};
  CacheStore.setItem(TEMP_INDICATORS_CACHE_KEY, { ...prev, [key]: value });
}
