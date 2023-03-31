import React, { useMemo } from 'react';
import { getMarketTypeTag, MARKET_TYPE_TAG } from '@dz-web/quote-client';
import type { Market } from '@dz-web/quote-client';

import './quote-market-type-tag.scss';

interface IProps {
  market: Market,
}

const colorDict = {
  [MARKET_TYPE_TAG.sz]: 'red',
  [MARKET_TYPE_TAG.hk]: '#8164EA',
  [MARKET_TYPE_TAG.us]: 'skyblue',
  [MARKET_TYPE_TAG.sh]: 'purple',
};

const QuoteMarketTypeTag: React.FC<IProps> = (props) => {
  const { market } = props;

  const marketText = useMemo<string>(() => getMarketTypeTag(market), [market]);
  const bgColor = useMemo(() => colorDict[marketText], [marketText]);

  if (!market) return null;

  return (
    <div style={{ background: bgColor }} styleName="market-tag">{marketText}</div>
  );
};

export default QuoteMarketTypeTag;
