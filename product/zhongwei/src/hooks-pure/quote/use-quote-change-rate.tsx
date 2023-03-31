import { useMemo } from 'react';
import { toPositiveSign, toPercent, toPlaceholder } from '@dz-web/o-orange';

import { IQuoteFieldProps } from './types';

const useQuoteChangeRate = (props: IQuoteFieldProps): string => {
  const { priceRiseRate } = props;

  return useMemo(
    () => toPlaceholder(toPositiveSign(toPercent(priceRiseRate, { multiply: 100 }))),
    [priceRiseRate],
  );
};

export default useQuoteChangeRate;
