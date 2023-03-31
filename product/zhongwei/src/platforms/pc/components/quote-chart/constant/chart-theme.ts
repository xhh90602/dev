export type TYPE_THEME = 'white' | 'black';

export interface ITHEME {
  [proper: string]: string;
}

interface ITHEMELIST {
  white: ITHEME;
  black: ITHEME;
}

export const colorModeMap = {
  RAISE_RED_DECLINE_GREEN: {
    riseColor: '#ef5656',
    fallColor: '#0a9a38',
  },
  RAISE_GREEN_DECLINE_RED: {
    fallColor: '#ef5656',
    riseColor: '#0a9a38',
  },
};

export const THEME_DICT: ITHEMELIST = {
  white: {
    textColor: '#3e3e3e',
    riseColor: '#ef5656',
    fallColor: '#0a9a38',
    equalColor: '#7d8ba0',
    avgPriceColor: '#f58e26',
    nowPriceColor: '#289bfb',
  },
  black: {
    textColor: '#e6e6e6',
    riseColor: '#ef5656',
    fallColor: '#0a9a38',
    equalColor: '#7d8ba0',
    splitLineColor: '#34343d',
    axisPointerBorderColor: '#357ce1',
    axisPointerBackgroundColor: '#25252b',
    avgPriceColor: '#f58e26',
    nowPriceColor: '#289bfb',
  },
};
