import { amountFormatToBMK } from '@mobile/mpa/modules/market/utils/amount-format-bmk';
import { transformCode } from './transform-code';
import { ameTransformCode } from './ame-stock-code';

export const dataTranform = (data :number, code: string) :string => {
  const transformType = { ...transformCode, ...ameTransformCode };
  if (transformType[code]) {
    if (transformType[code] === 'percent') {
      return `${data}%`;
    }
    return `${data}`;
  }
  return amountFormatToBMK(data);
};
