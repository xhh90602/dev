import { useState } from 'react';
import ProgressPercent from '@mobile/components/progress-percent/progress-percent';
import BuySellGear from '@mobile/components/buy-sell-gear/buy-sell-gear';
import IconSvg from '@mobile/components/icon-svg';
import useBidAsk from '@/hooks/quote/use-bid-ask';

import './handicap.scss';
import useHandicap from '@/hooks/trade/use-handicap';
import { useStockInfoStore } from '@mobile/model/stock-info-store';

const Handicap = (props) => {
  const { state, setState, noTouch = false } = props;
  const stockInfo = useStockInfoStore((s) => s.stockInfo);

  const { bidGrp, askGrp, dec, prevClose, marketId } = stockInfo;
  const { bidPriceList, askPriceList, defaultText } = useBidAsk({ bidGrp, askGrp, dec, prevClose, marketId });
  // console.log(bidGrp, askGrp, 'defaultText');

  const [isExtend, setExtend] = useState(false);
  const { riseList, fallList, changePrice } = useHandicap(state, stockInfo, setState);

  return (
    <div
      styleName="handicap-box"
      onClick={() => {
        setExtend(!isExtend);
      }}
    >
      <div
        onClick={() => {
          setExtend(!isExtend);
        }}
      >
        <ProgressPercent left={bidGrp} right={askGrp} />
      </div>
      {isExtend && (
        <BuySellGear {...{ riseList, fallList, changePrice, noTouch, defaultText, bidPriceList, askPriceList }} />
      )}
      <div
        onClick={() => {
          setExtend(!isExtend);
        }}
      >
        <IconSvg path={isExtend ? 'icon_arrow_close' : 'icon_arrow_open'} />
      </div>
    </div>
  );
};

export default Handicap;
