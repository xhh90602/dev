/**
 * 时间格式化
 * @param time
 * @param formatter
 * @example 默认formatter为yyyy/MM/dd(yyyy代表年 MM 代表月 dd 代表日)
 */
export function formatToString(time: Date, formatter = 'yyyy/MM/dd'): string {
  let str = formatter;

  const y = String(time.getFullYear());
  const m = String(time.getMonth() + 1).padStart(2, '0');
  const d = String(time.getDate()).padStart(2, '0');

  if ([y, m, d].includes('NaN')) return '';

  str = str.replace('yyyy', y);
  str = str.replace('MM', m);
  str = str.replace('dd', d);

  return str;
}
