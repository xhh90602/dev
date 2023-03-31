import { QuoteClient, US_TIME_TYPE, QUOTE_STATE } from 'quote-ws-client-for-dz';

export interface ITimeParams {
  market: number,
  code: string,
  day?: string;
  quoteState?: number;
  isLive?: boolean;
}

export async function queryUSTimeTrend(client: QuoteClient, params: ITimeParams): Promise<any> {
  const { market, code, isLive, quoteState } = params;
  let range = US_TIME_TYPE.IN;
  let section = 'sections';

  if (isLive) {
    switch (quoteState) {
      case QUOTE_STATE.PREV:
        range = US_TIME_TYPE.PREV;
        section = 'pre_market';
        break;
      case QUOTE_STATE.POST:
        range = US_TIME_TYPE.POST;
        section = 'after_market';
        break;
      default: break;
    }
  }

  const tendency = await client.getUSTendency({ market, code, range }).promise;
  const timeList = await client.queryMarketTradeTickList({ market, section }).promise;

  return {
    tendency,
    timeList,
  };
}

export async function queryTimeTrend(client: QuoteClient, params: ITimeParams): Promise<any> {
  const tendencyList = await client.getTendency(params).promise;

  const timeList = await client.queryMarketTradeTickList({ market: params.market }).promise;

  return {
    tendency: tendencyList[0],
    timeList,
  };
}
