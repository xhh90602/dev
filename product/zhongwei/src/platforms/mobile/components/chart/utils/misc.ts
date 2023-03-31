interface IColorDict {
  riseColor: string;
  fallColor: string;
  equalColor?: string;
}

type strNum = string | number;

/**
 * 比较两个值得到颜色
 *
 */
export function judgeColor(
  target: strNum,
  reference: strNum,
  colorDict: IColorDict,
): string {
  const targetNum = +target;
  const referenceNum = +reference;

  if (targetNum > referenceNum) return colorDict.riseColor;
  if (targetNum < referenceNum) return colorDict.fallColor;

  return colorDict.equalColor;
}

/**
 * 大于10000的数值不保留小数
 *
 */
const MAX_LEN = 8;

export function specialNumToFixed(num: string | number): string | number {
  const strNum = String(num);
  const len = strNum.length;

  if (len <= MAX_LEN) return num;

  let offset = len - MAX_LEN;
  const splitArr = strNum.split('.');
  const integer = splitArr[0];
  let decimal = splitArr[1];

  while (offset > 0 && decimal) {
    decimal = decimal.slice(0, -1);
    offset -= 1;
  }

  return `${integer}${decimal ? '.' : ''}${decimal}`;
}