import { useMemo } from 'react';
import { getClassNameByPriceChange, getMarketCategoryTag, MARKET_TYPE_TAG } from '@dz-web/quote-client';

import useQuoteNow from '@/hooks-pure/quote/use-quote-now';
import useQuoteChangeRate from '@/hooks-pure/quote/use-quote-change-rate';
import { addOptional, deleteOptional, goToSymbolPage } from '@/platforms/mobile/helpers/native/msg';

import IconHK from '@/platforms/mobile/images/icon_HK.svg';
import IconSH from '@/platforms/mobile/images/icon_SH.svg';
import IconSZ from '@/platforms/mobile/images/icon_SZ.svg';
import IconUS from '@/platforms/mobile/images/icon_US.svg';
import iconNotSelectStock from '@/platforms/mobile/images/icon_not_select_stock.svg';
import iconSelfSelectStock from '@/platforms/mobile/images/icon_self_select_stock.svg';

import './stock-data.scss';

interface IProps {
  stock: any;
  optionList: any[];
  optionHandler: () => any;
}

const marketTypeTag = {
  [MARKET_TYPE_TAG.hk]: IconHK,
  [MARKET_TYPE_TAG.sh]: IconSH,
  [MARKET_TYPE_TAG.sz]: IconSZ,
  [MARKET_TYPE_TAG.us]: IconUS,
};

const StockData: React.FC<IProps> = ({ stock, optionList = [], optionHandler }) => {
  const nowPrice = useQuoteNow(stock);

  const changeRateText = useQuoteChangeRate(stock);

  // 涨跌类名
  const clsNameByPriceChange = useMemo(() => getClassNameByPriceChange(changeRateText), [changeRateText]);

  // 添加自选
  const handleOptional = async (smallMarket: number, code: string, self: boolean) => {
    try {
      const res = !self ? await addOptional({ smallMarket, code }) : await deleteOptional({ smallMarket, code });
      console.log(res, '自选操作状态');
      const { result } = res;

      if (result && optionHandler) optionHandler();
    } catch (e) {
      console.log(e, 'e');
    }
  };

  // 是否自选
  const isOption = () => {
    const self = optionList.filter((item: any) => item.stockCode === stock.code);

    return self.length > 0;
  };

  // 市场tag
  const remak = useMemo(() => getMarketCategoryTag(stock.marketId), [stock.marketId]);

  return (
    <div styleName="item">
      <div styleName="name-code" onClick={() => goToSymbolPage({ market: stock.marketId, code: stock.code })}>
        <div styleName="name">{stock.name}</div>
        <div styleName="code">
          <img src={remak ? marketTypeTag[remak] : ''} alt="" />
          {stock.code}
        </div>
      </div>
      <div styleName="main-num" className="num-font">
        {nowPrice}
      </div>
      <div styleName="main-num" className={`num-font ${clsNameByPriceChange}`}>
        {changeRateText}
      </div>
      <div
        styleName="self-select"
        onClick={() => {
          handleOptional(stock.marketId, stock.code, isOption());
        }}
      >
        <img src={isOption() ? iconSelfSelectStock : iconNotSelectStock} alt="" />
      </div>
    </div>
  );
};

export default StockData;
