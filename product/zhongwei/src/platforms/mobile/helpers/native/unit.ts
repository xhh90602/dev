import { isTrue } from '@dz-web/o-orange';

export function getUnit(value: number, formatMessage): any {
  const absValue = Math.abs(value);
  if (absValue <= 9999) {
    return { unit: '', multi: 1 };
  }

  if (absValue <= 99999999) {
    return { unit: formatMessage({ id: 'tenThousand' }), multi: 10000 };
  }

  if (absValue <= 999999999999) {
    return { unit: formatMessage({ id: 'hundredMillion' }), multi: 100000000 };
  }

  // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
  if (absValue <= 9999999999999999) {
    return { unit: formatMessage({ id: 'trillion' }), multi: 1000000000000 };
  }

  return { unit: '' };
}

// eslint-disable-next-line default-param-last
export function convertWithUnit(value: number, precision = 2, formatMessage): string {
  const { unit, multi } = getUnit(value, formatMessage);

  if (!isTrue(value)) return '--';

  return `${(value / multi).toFixed(precision)}${unit}`;
}

export function identifySystem() {
  const u = navigator.userAgent;
  const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  if (isiOS) return true;
  return false;
}
