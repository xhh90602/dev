import { QUOTE_CATEGORY_FIELD } from '@dz-web/quote-client';
import { useSubscribeSingleStockQuote } from '@dz-web/quote-client-react';
import { useDeepCompareEffect } from 'ahooks';
import { omit } from 'lodash-es';
import { useState } from 'react';

interface ISubscribeCom {
  market: number;
  code: string;
}

/** 行情订阅hooks */
const useSubscribeComponent: (props: ISubscribeCom) => any = (props) => {
  const { market, code } = props;

  const stockList = useSubscribeSingleStockQuote(market, code, [`${QUOTE_CATEGORY_FIELD.BS_N}10`]);

  const [stockInfo, setIndexList] = useState(stockList);

  useDeepCompareEffect(() => {
    setIndexList(stockList);
  }, [omit(stockList, ['time'])]);

  return stockInfo;
};

export default useSubscribeComponent;
