import { useMemo, useEffect, useState } from 'react';
import { useSafeState } from 'ahooks';
import { useIntl } from 'react-intl';
import { toFixed, toPercent, toPositiveSign, toPlaceholderNotZero } from '@dz-web/o-orange';
import type { Market } from '@dz-web/quote-client';
import { getQuoteStateOfMarket, QUOTE_PLUGIN_REQ_CODE, getClassNameByPriceChange } from '@dz-web/quote-client';
import { useQuoteClient, useSubscribeSingleStockQuote } from 'quote-client-react';
import { convertUTCToLocalTime } from '@/helpers/dayjs';
import { getUserQuo, getStockInfo } from '@/api/module-api/trade';
import { useI18nStockName, useI18nBlockName } from '@pc/hooks-pure/use-i18n-field';
import { returnJavaMarket } from '@/utils/market';

import QuoteMarketTypeTag from '@pc/components/quote-market-type-tag/quote-market-type-tag';
import QuoteChart from '../../components/quote-chart/quote-chart';
import topArrow from '../../images/top.png';
import bottomArrow from '../../images/bottom.png';
import optional from '../../images/optional.png';

import './quote-chart-in-trade.scss';

interface IProps {
  market: Market;
  code: string;
}

const QuoteChartInTrade: React.FC<IProps> = (props) => {
  const { market, code } = props;
  const { formatMessage } = useIntl();
  const getStockName = useI18nStockName();
  const getBlockName = useI18nBlockName();

  const [quotePackage, setQuotePackage] = useState();
  const [isCanCreditBuy, setIsCanCreditBuy] = useSafeState(false);

  const { wsClient, isWsClientReady } = useQuoteClient();
  const commodityQuote = useSubscribeSingleStockQuote(market, code);
  const {
    time, now, dec, price_rise: priceRise, price_rise_rate: priceRiseRate, quote_state: quoteState,
  } = commodityQuote;
  const [blockInfo, setBlockInfo] = useSafeState([]);

  const clsNameByPriceChange = useMemo(() => getClassNameByPriceChange(priceRise), [priceRise]);
  const priceRiseArrow = useMemo(() => {
    if (priceRise > 0) return topArrow;
    if (priceRise < 0) return bottomArrow;
    return '';
  }, [priceRise]);
  const getQuoteStateField = useMemo(() => getQuoteStateOfMarket(market), [market]);
  const quoteStateText = useMemo(() => {
    const field = getQuoteStateField(quoteState);
    return field ? formatMessage({ id: field }) : '';
  }, [market, quoteState, formatMessage]);
  const displayTime = useMemo(() => convertUTCToLocalTime(time).format('MM/DD HH:mm:ss'), [time]);
  const price: string = useMemo(() => toPlaceholderNotZero(toFixed(now, { precision: dec })), [now, dec]);
  const priceRiseWithDec: string = useMemo(
    () => toPlaceholderNotZero(toPositiveSign(toFixed(priceRise, { precision: dec }))),
    [priceRise, dec],
  );
  const priceRiseRateWithSign = useMemo(
    () => toPlaceholderNotZero(toPositiveSign(toPercent(priceRiseRate, { multiply: 100 }))),
    [priceRiseRate],
  );

  useEffect(() => {
    if (!isWsClientReady || !market || !code) return;

    wsClient?.send({
      ReqType: QUOTE_PLUGIN_REQ_CODE.blockInfo,
      Data: { Market: +market, Code: code, Type: 0, Level: 2 },
    })
      .promise
      .then((res) => {
        setBlockInfo(res?.Data);
      })
      .catch((err) => {
        console.log(`请求板块数据出错:${err}`, '<-- err');
      });
  }, [isWsClientReady, market, code]);

  useEffect(() => {
    // eslint-disable-next-line consistent-return
    const filterType: any = (type) => {
      switch (type) {
        case 'HKEX':
          return 1;
        case 'USA':
          return 3;
        case 'SHMK':
          return 2;
        case 'SZMK':
          return 2;
        default:
      }
    };
    const type = filterType(returnJavaMarket(market));

    getUserQuo()
      .then((res) => {
        if (!res.result) return;

        const { products } = res.result;
        const permissions = products.filter((item) => item.marketType === type);
        setQuotePackage(permissions[0].code.substr(-2, 2).toUpperCase());
      })
      .catch((err) => {
        console.log(`获取行情权限失败: ${err}`, '<-- ');
      });
  }, []);

  useEffect(() => {
    if (!market || !code) return;

    const tradeMarket = returnJavaMarket(market);
    getStockInfo({
      stockCode: code,
      tradeMarket,
    })
      .then((res) => {
        if (!res.result) return;

        setIsCanCreditBuy(res.result?.eligibleCollateral === 'Y');
      })
      .catch((err) => {
        console.log(`getStockInfo: ${err}`, '<-- err');
      });
  }, [market, code]);

  return (
    <div styleName="qc-trade">
      <div styleName="dashboard">
        <div styleName="basic">
          <div styleName="name-info">
            <span>{toPlaceholderNotZero(getStockName(commodityQuote))}</span>
            <span>{toPlaceholderNotZero(code)}</span>
          </div>

          <div styleName="dashboard-tag-list">
            <QuoteMarketTypeTag market={market} />
            {quotePackage && <span styleName="quote-package-tag">{quotePackage}</span>}
            {isCanCreditBuy && <span styleName="margin-tag">融</span>}
            <img src={optional} alt="" />
          </div>
        </div>

        <div styleName="status">
          <div styleName="status-display">
            <span styleName="quote-state">{quoteStateText}</span>
            <span>{displayTime}</span>
          </div>

          <div styleName="block-list">
            {blockInfo.map((item: any) => (
              <span key={item.BlockCode} styleName="block-info">
                {getBlockName(item)}
              </span>
            ))}
          </div>
        </div>

        <div styleName="price" className={clsNameByPriceChange}>
          <i>{price}</i>
          {priceRiseArrow && <img src={priceRiseArrow} alt="" />}

          <span>{priceRiseWithDec}</span>
          <span>{priceRiseRateWithSign}</span>
        </div>

        <div styleName="conversion">
          <div styleName="conversion-left">
            ADR换算价
            <span>171.736</span>
          </div>

          <div styleName="conversion-rigth">
            相对港股
            <span>-1.34 -0.79%</span>
          </div>
        </div>
      </div>

      <div styleName="quote-chart">
        <QuoteChart market={market} code={code} />
      </div>
    </div>
  );
};

export default QuoteChartInTrade;
