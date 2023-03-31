import React, { useMemo, useState, useEffect } from 'react';
import { CacheStore } from '@dz-web/cache';
import type { Stock } from '@dz-web/quote-client';
import { US_INTRADAY_TYPE, KLineAdjMode } from '@dz-web/quote-client';
// import { getMarketCategoryTag, MARKET_TYPE_TAG } from '@dz-web/quote-client';

import { K_MAIN_INDICATOR_DICT, K_SUB_INDICATOR_DICT } from '@mobile/components/quote/quote-chart/constant/indicator-k';

import { CacheKeys } from '@/constants/cache';

import PeriodTabs from './components/period-tabs/period-tabs';
import Chart from './components/chart/chart';

import { quoteChartContext } from './contexts/quote-chart';

import {
  periodTypeDict, timePeriodDict,
  PeriodType, Period, IPERIODDICT, PERIOD_DICT,
} from './constant/period';

import './quote-chart.scss';

interface IQuoteChartProps extends Stock {
  defaultKMainChosenIndicator?: K_MAIN_INDICATOR_DICT[];
  defaultKSubChosenIndicator?: K_SUB_INDICATOR_DICT[];
  isShowIndicatorMenu?: boolean;
  keepPeriodsCache?: boolean;
}

const QuoteChart: React.FC<IQuoteChartProps> = (props) => {
  const {
    market,
    code,
    defaultKMainChosenIndicator,
    defaultKSubChosenIndicator,
    isShowIndicatorMenu = true,
    keepPeriodsCache = true,
  } = props;

  const [periodType, setPeriodType] = useState<PeriodType | null>(null);
  const [period, setPeriod] = useState<Period | null>(null);
  const [candleModle, setCandleModle] = useState<KLineAdjMode>(KLineAdjMode.FWD);
  const [USIntradayType, setUSIntradayType] = useState<US_INTRADAY_TYPE>(US_INTRADAY_TYPE.ALL);

  const values = useMemo(() => ({
    market,
    code,
    isShowIndicatorMenu,
    period,
    periodType,
    candleModle,
    USIntradayType,
  }), [
    market,
    code,
    isShowIndicatorMenu,
    period,
    periodType,
    candleModle,
    USIntradayType,
  ]);

  const setPeriodTypeWrap = (value: PeriodType) => {
    setPeriodType(value);

    if (keepPeriodsCache) CacheStore.setItem(CacheKeys.quoteChartPeriodType, value);
  };

  const setPeriodWrap = (value: Period) => {
    setPeriod(value);

    if (keepPeriodsCache) CacheStore.setItem(CacheKeys.quoteChartPeriod, value);
  };

  useEffect(() => {
    if (!keepPeriodsCache) {
      setPeriodType(periodTypeDict.time);
      setPeriod(timePeriodDict.one_day);
      return;
    }

    setPeriodType(periodTypeDict.time);
    setPeriod(timePeriodDict.one_day);
  }, [keepPeriodsCache]);

  if (!period || !periodType) return null;

  return (
    <div styleName="quote-chart">
      <quoteChartContext.Provider value={values}>
        <PeriodTabs
          changePeriodType={setPeriodTypeWrap}
          changePeriod={setPeriodWrap}
          changeCandleModle={setCandleModle}
          setUSIntradayType={setUSIntradayType}
        />

        <Chart
          defaultKMainChosenIndicator={defaultKMainChosenIndicator}
          defaultKSubChosenIndicator={defaultKSubChosenIndicator}
        />
      </quoteChartContext.Provider>
    </div>
  );
};

QuoteChart.defaultProps = {
  defaultKMainChosenIndicator: undefined,
  defaultKSubChosenIndicator: undefined,
  isShowIndicatorMenu: true,
  keepPeriodsCache: true,
};

export default QuoteChart;
