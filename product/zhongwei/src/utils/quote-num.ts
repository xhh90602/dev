import { toFixed, toPlaceholder, toUnit, ensure } from '@dz-web/o-orange';

export function toFixedNum(num: string | number, dec: number) {
  return toPlaceholder(toFixed(num, { precision: dec }));
}

export function toUnitNum(num: number, dec): string {
  return ensure(
    num,
    undefined,
    toPlaceholder(toUnit(num, { precision: dec, ignoreIntegerPrecision: true })),
  );
}
