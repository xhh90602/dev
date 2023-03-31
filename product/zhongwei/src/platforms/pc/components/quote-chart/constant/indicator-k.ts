import { IIndicatorList } from './indicator';
import {
  getMaOfKLineConfig, getBollOfKLineConfig, getMacdOfKLineConfig,
  getEmaOfKLineConfig, getSmaOfKLineConfig, getRSIOfKLineConfig,
  getVOLOfKLineConfig, getSarOfKLineConfig, getKDJOfKLineConfig,
  getDMAOfKLineConfig,
} from '../helper/k-line-indicator-dict';

export enum K_MAIN_INDICATOR_DICT {
  MA = 'ma',
  EMA = 'ema',
  BOLL = 'boll',
  SMA = 'sma',
  SAR = 'sar',
}

export enum K_SUB_INDICATOR_DICT {
  VOL = 'vol',
  MACD = 'macd',
  RSI = 'rsi',
  KDJ = 'kdj',
  DMA = 'dma',
}

export const K_MAIN_INDICATOR_LIST: IIndicatorList[] = [
  {
    name: 'MA',
    key: K_MAIN_INDICATOR_DICT.MA,
  },
  {
    name: 'EMA',
    key: K_MAIN_INDICATOR_DICT.EMA,
  },
  {
    name: 'BOLL',
    key: K_MAIN_INDICATOR_DICT.BOLL,
  },
  {
    name: 'SAR',
    key: K_MAIN_INDICATOR_DICT.SAR,
  },
  {
    name: 'SMA',
    key: K_MAIN_INDICATOR_DICT.SMA,
  },
];

export const K_SUB_INDICATOR_LIST: IIndicatorList[] = [
  {
    name: 'VOL',
    key: K_SUB_INDICATOR_DICT.VOL,
  },
  {
    name: 'DMA',
    key: K_SUB_INDICATOR_DICT.DMA,
  },
  {
    name: 'MACD',
    key: K_SUB_INDICATOR_DICT.MACD,
  },
  {
    name: 'KDJ',
    key: K_SUB_INDICATOR_DICT.KDJ,
  },
  {
    name: 'RSI',
    key: K_SUB_INDICATOR_DICT.RSI,
  },
];

export const K_INDICATOR_CONFIG_DICT = {
  [K_MAIN_INDICATOR_DICT.MA]: getMaOfKLineConfig,
  [K_MAIN_INDICATOR_DICT.EMA]: getEmaOfKLineConfig,
  [K_MAIN_INDICATOR_DICT.BOLL]: getBollOfKLineConfig,
  [K_MAIN_INDICATOR_DICT.SAR]: getSarOfKLineConfig,
  [K_MAIN_INDICATOR_DICT.SMA]: getSmaOfKLineConfig,
  [K_SUB_INDICATOR_DICT.VOL]: getVOLOfKLineConfig,
  [K_SUB_INDICATOR_DICT.MACD]: getMacdOfKLineConfig,
  [K_SUB_INDICATOR_DICT.KDJ]: getKDJOfKLineConfig,
  [K_SUB_INDICATOR_DICT.RSI]: getRSIOfKLineConfig,
  [K_SUB_INDICATOR_DICT.DMA]: getDMAOfKLineConfig,
};
