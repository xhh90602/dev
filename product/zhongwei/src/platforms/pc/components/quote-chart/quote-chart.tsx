import React, { useState } from 'react';
import type { Stock } from 'quote-ws-client-for-dz';
import { WeightType } from 'quote-ws-client-for-dz';
import PeriodTabs from './components/period-tabs/period-tabs';

import Chart from './components/chart/chart';

import {
  periodTypeDict, timePeriodDict,
  PeriodType, Period,
} from './constant/period';

import './quote-chart.scss';

interface IProps extends Stock {
  candleModle?: WeightType;
}

const QuoteChart: React.FC<IProps> = (props) => {
  const {
    market, code,
    candleModle: defaultCandleModle = WeightType.FORWARD,
  } = props;

  const [periodType, setPeriodType] = useState<PeriodType>(periodTypeDict.time);
  const [period, setPeriod] = useState<Period>(timePeriodDict.one_day);
  const [candleModle, setCandleModle] = useState<WeightType>(defaultCandleModle);

  return (
    <div styleName="quote-chart">
      <PeriodTabs
        periodType={periodType}
        changePeriodType={setPeriodType}
        period={period}
        changePeriod={setPeriod}
        candleModle={candleModle}
        changeCandleModle={setCandleModle}
        market={market}
        code={code}
      />

      <Chart
        candleModle={candleModle}
        period={period}
        periodType={periodType}
        market={market}
        code={code}
      />
    </div>
  );
};

QuoteChart.defaultProps = {
  candleModle: WeightType.FORWARD,
};

export default QuoteChart;
