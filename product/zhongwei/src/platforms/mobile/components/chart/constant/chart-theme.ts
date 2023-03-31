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
    textColor: '#999',
    riseColor: '#ef5656',
    fallColor: '#0a9a38',
    equalColor: '#7d8ba0',
    avgPriceColor: '#ff8d3a',
    nowPriceColor: '#5c85ec',
  },
  black: {
    textColor: '#666',
    riseColor: '#ef5656',
    fallColor: '#0a9a38',
    equalColor: '#7d8ba0',
    splitLineColor: '#34343d',
    axisPointerBorderColor: '#0093ff',
    axisPointerBackgroundColor: '#ff8d3a',
    avgPriceColor: '#ff8d3a',
    nowPriceColor: '#5c85ec',
  },
};
