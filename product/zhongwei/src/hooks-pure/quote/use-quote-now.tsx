import { useMemo } from 'react';
import { toFixedNum } from '@/utils/quote-num';

import { IQuoteFieldProps } from './types';

const useQuoteNow = (props: IQuoteFieldProps): string => {
  const { now, dec } = props;

  return useMemo(() => toFixedNum(now, dec), [now, dec]);
};

export default useQuoteNow;
