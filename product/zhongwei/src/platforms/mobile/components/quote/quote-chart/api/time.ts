import {
  isUSSymbol,
  queryIntraday,
  queryTradeTime,
  intradayReqDefaultField,
  US_INTRADAY_TYPE,
} from '@dz-web/quote-client';
import type { QueryTradeTimeReq, QueryIntradayReq, QueryIntradayRes } from '@dz-web/quote-client';

export interface ITimeParams {
  market: number;
  code: string;
  day?: string;
  period: number;
  quoteState?: number;
  isLive?: boolean;
  range?: US_INTRADAY_TYPE;
}

interface QueryIntradayWrapRes {
  tickList: Pick<QueryIntradayRes, 'list'>[];
  timeList: string[];
  tickIntervalList: number[];
  tickEndIndex: number;
}

export async function queryIntradayWrap(client: any, params: ITimeParams): Promise<QueryIntradayWrapRes> {
  const { market, code, isLive, quoteState, range, period } = params;
  if (!market || !code) {
    return {
      tickList: [],
      timeList: [],
      tickIntervalList: [],
      tickEndIndex: 0,
    };
  }

  const queryIntradayParams: QueryIntradayReq = {
    fields: intradayReqDefaultField,
    market_id: market,
    code,
    day_count: period,
  };

  const queryTradeTimeParams: QueryTradeTimeReq = {
    by_config: {
      market_id: market,
    },
    tickType: 'MM/dd HH:mm',
    market_id: market,
  };

  if (isUSSymbol(market)) {
    let sections = 'sections';

    switch (range) {
      case US_INTRADAY_TYPE.PREV:
        sections = 'pre_market';
        break;
      case US_INTRADAY_TYPE.POST:
        sections = 'after_market';
        break;
      default:
        break;
    }

    queryIntradayParams.range = range;
    queryTradeTimeParams.matchPath = `cur_day.${sections}`;
  }

  const intradayList = await queryIntraday(client, queryIntradayParams);

  let tickEndIndex = 0;
  const timeList: string[] = [];
  const dayList: Pick<QueryIntradayRes, 'day'>[] = [];
  const tickIntervalList: number[] = [];
  const tickList: Pick<QueryIntradayRes, 'list'>[] = [];
  const tradeTimes = await Promise.all(
    intradayList.map((item) => queryTradeTime(client, { ...queryTradeTimeParams, time: item.day })),
  );
  tradeTimes.forEach((item) => timeList.push(...item.slice(1)));

  intradayList.forEach((intradayItem: QueryIntradayRes) => {
    const { day, list } = intradayItem;

    queryTradeTimeParams.time = day;

    const len = list.length;
    tickIntervalList.push(tickEndIndex);
    tickEndIndex += len;

    dayList.push(day);
    tickList.push(...list);
  });

  return {
    tickList,
    timeList,
    tickIntervalList,
    tickEndIndex,
  };
}
