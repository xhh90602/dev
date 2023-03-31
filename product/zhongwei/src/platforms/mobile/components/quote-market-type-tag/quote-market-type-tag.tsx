import React, { useMemo } from 'react';
import { getMarketCategoryTag, MARKET_TYPE_TAG } from '@dz-web/quote-client';
import type { Market } from '@dz-web/quote-client';

import './quote-market-type-tag.scss';

interface IProps {
  market: Market,
}

const colorDict = {
  [MARKET_TYPE_TAG.sz]: 'var(--cn-color)',
  [MARKET_TYPE_TAG.hk]: 'var(--hk-color)',
  [MARKET_TYPE_TAG.us]: 'var(--us-color)',
  [MARKET_TYPE_TAG.sh]: 'var(--cn-color)',
};

const QuoteMarketTypeTag: React.FC<IProps> = (props) => {
  const { market } = props;

  const marketText = useMemo<string>(() => getMarketCategoryTag(market) || '', [market]);
  const color = useMemo(() => colorDict[marketText?.toLocaleUpperCase()], [marketText]);

  if (!market) return null;

  return (
    <div style={{ color }} styleName="market-tag">{marketText?.toLocaleUpperCase()}</div>
  );
};

export default QuoteMarketTypeTag;
