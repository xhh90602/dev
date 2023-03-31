import dayjs from 'dayjs';
import { queryKLine } from '@dz-web/quote-client';

interface IQueryKlineParams {
  wsClient: any;
  market: number;
  code: string;
  period: string;
  adjMode?: any;
  count?: number;
  endTime?: string;
  last_count?: any;
}

interface QueryKLineReq {
  fields?: string[];
  market_id: number;
  code: string;
  period: string;
  adj_mode?: '' | 'before' | 'after';
  mmk_combine_mode?: '' | 'in_section' | 'in_day';
  time_range?: [string, string];
  first_count?: [string, number];
  last_count?: [string, number];
}

export async function fetchKLine(info: IQueryKlineParams): Promise<any> {
  const { wsClient, market, code, period, adjMode, count = 50, endTime } = info;

  const params: QueryKLineReq = {
    market_id: market,
    code,
    period,
    last_count: [endTime || dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'), count],
  };

  if (adjMode !== 'none') {
    params.adj_mode = adjMode;
  }

  const klines = await queryKLine(wsClient, params);

  return klines;
}
