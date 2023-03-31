import dayjs from 'dayjs';

/**
 * 判断是否是交易时间
 * @param {String}  serverTime    服务器时间(服务器上的北京时间，默认用本地时间，如果服务器上获取到了就用服务器的时间)
 * @param {Boolean} isTradeDay    是否是交易日(默认是true，怕接口出错了不轮询)
 */

export function CheckTradeTime({
  isTradeDay = true,
  serverTime = dayjs().format('YYYY-MM-DD HH:mm:ss'),
  marketType = 'A',
}: {
  isTradeDay?: boolean;
  serverTime?: string;
  marketType?: string;
} = {}): boolean {
  const aPeriod = {
    amOpen: '08:55:00',
    amClose: '11:35:00',
    pmOpen: '12:55:00',
    pmClose: '15:05:00',
  }; // 时间间隔（包含港股时间）
  const hkPeriod = {
    amOpen: '08:55:00',
    amClose: '12:05:00',
    pmOpen: '12:55:00',
    pmClose: '16:10:00',
  }; // 时间间隔（包含港股时间）
  let period:any = {};
  if (marketType === 'A') {
    period = aPeriod;
  } else {
    period = hkPeriod;
  }
  const nowDate = dayjs(serverTime).format('YYYY-MM-DD');
  const week = dayjs(nowDate).day(); // 0 ~ 6 周日 ~ 周六
  const isWeek = !(week === 0 || week === 6);
  if (serverTime && isTradeDay && isWeek) {
    const nowDateTime = dayjs(serverTime).unix();
    const amOpenTime = dayjs(`${nowDate} ${period.amOpen}`).unix();
    const amCloseTime = dayjs(`${nowDate} ${period.amClose}`).unix();
    const pmOpenTime = dayjs(`${nowDate} ${period.pmOpen}`).unix();
    const pmCloseTime = dayjs(`${nowDate} ${period.pmClose}`).unix();
    if (
      (nowDateTime >= amOpenTime && nowDateTime <= amCloseTime)
      || (nowDateTime >= pmOpenTime && nowDateTime <= pmCloseTime)
    ) {
      // console.log('--->开盘中，轮询中...');
      return true;
    }
    // console.log('--->已停盘，不轮询');
    return false;
  }
  // console.log('--->非交易日，不轮询');
  return false;
}
