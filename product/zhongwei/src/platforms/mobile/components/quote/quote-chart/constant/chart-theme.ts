export type TYPE_THEME = 'white' | 'black';

export interface ITHEME {
  [proper: string]: string;
}

interface ITHEMELIST {
  white: ITHEME;
  black: ITHEME;
}

export const colorModeMap = {
  red: {
    riseColor: '#DA070E',
    fallColor: '#06B899',
  },
  green: {
    fallColor: '##DA070E',
    riseColor: '#06B899',
  },
};

export const THEME_DICT: ITHEMELIST = {
  white: {
    textColor: '#999',
    riseColor: '##DA070E',
    fallColor: '#06B899',
    equalColor: '#7d8ba0',
    avgPriceColor: '#f58e26',
    nowPriceColor: '#289bfb',
    axisPointerBorderColor: '#EAEDF2',
    axisPointerBackgroundColor: '#EAEDF2',
  },
  black: {
    textColor: '#e6e6e6',
    riseColor: '##DA070E',
    fallColor: '#06B899',
    equalColor: '#7d8ba0',
    splitLineColor: '#34343d',
    axisPointerBorderColor: '#357ce1',
    axisPointerBackgroundColor: '#25252b',
    avgPriceColor: '#f58e26',
    nowPriceColor: '#289bfb',
  },
};
