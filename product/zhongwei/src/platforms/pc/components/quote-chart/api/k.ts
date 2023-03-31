import dayjs from 'dayjs';
import { WeightType } from 'quote-ws-client-for-dz';

interface IQueryKlineParams {
  wsClient: any,
  market: number;
  code: string;
  period: number;
  adjMode?: WeightType;
  count?: number;
  endTime?: string;
}

export async function queryKline(info: IQueryKlineParams): Promise<any> {
  const {
    wsClient,
    market, code, period, adjMode,
    count = 50, endTime,
  } = info;
  console.log(info, '<-- info');

  console.log(adjMode, '<-- adjMode');
  const klines = await wsClient.getKLine({
    market_id: market,
    code,
    period,
    adj_mode: adjMode,
    last_count: [endTime || dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'), count],
  }).promise;

  return klines;
}
