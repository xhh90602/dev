import { createContext } from 'react';
import type { Stock } from '@dz-web/quote-client';
import { US_INTRADAY_TYPE, KLineAdjMode } from '@dz-web/quote-client';
import { K_MAIN_INDICATOR_DICT, K_SUB_INDICATOR_DICT } from '@mobile/components/quote/quote-chart/constant/indicator-k';
import {
  Period,
} from '../constant/period';

interface IQuoteChartContext extends Stock {
  defaultKMainChosenIndicator?: K_MAIN_INDICATOR_DICT[];
  defaultKSubChosenIndicator?: K_SUB_INDICATOR_DICT[];
  periodType: string;
  isShowIndicatorMenu?: boolean;
  period: Period;
  candleModle: KLineAdjMode;
  USIntradayType: US_INTRADAY_TYPE,
}

export const quoteChartContext = createContext<IQuoteChartContext>({
  market: -1,
  code: '',
});
