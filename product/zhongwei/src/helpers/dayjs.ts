import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export function convertUTCToLocalTime(time: any) {
  return dayjs.utc(time).local();
}
