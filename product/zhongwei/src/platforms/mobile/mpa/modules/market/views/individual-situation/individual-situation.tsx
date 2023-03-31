import React, { useContext, useEffect, useState } from 'react';
import { parseUrlBySearch } from '@dz-web/o-orange';

import { userConfigContext } from '@/platforms/mobile/helpers/entry/native';
import { IUserConfig } from '@/platforms/mobile/hooks/use-init-native';
import { getBigMatketData } from '@/api/module-api/market';
import ETFSituation from './views/ETF-situation/ETF-situation';
import StockSituation from './views/stock-situation/stock-situation';

import './individual-situation.scss';

const { HKETFMarket } = window.GLOBAL_CONFIG.INFORMATION_MODULE;

const IndividualSituation: React.FC = () => {
  const userConfig = useContext<IUserConfig>(userConfigContext);
  const { language } = userConfig;

  const [params, setParams] = useState<any>(null); // 请求参数
  const [isETF, setIsETF] = useState(false);

  // useEffect(() => {
  //   console.log(language, 'language');
  //   if (!parseUrlBySearch('market') || !parseUrlBySearch('code')) return;
  //   const marketFun = ({ bigMarket, code, tradeMarket, smallMarket }) => {
  //     let isHkEtf = false;
  //     if (bigMarket === 2) {
  //       console.log('HKETFMarket::::::', !!HKETFMarket[`${smallMarket}`]);
  //       isHkEtf = !!HKETFMarket[`${smallMarket}`];
  //       return { body: { stk_id: `${code}.hk`, language, trade_market: tradeMarket }, mf: '7', isHkEtf };
  //     }
  //     if (tradeMarket === 'USA') {
  //       return {
  //         body: {
  //           code_nasdq: code,
  //           stk_id: code,
  //           stockType: tradeMarket,
  //           language,
  //           trade_market: tradeMarket,
  //         },
  //         mf: '8',
  //       };
  //     }
  //     return { body: { stk_id: code, language, trade_market: tradeMarket }, mf: '7', isHkEtf };
  //   };
  //   getBigMatketData([
  //     {
  //       code: parseUrlBySearch('code'),
  //       smallMarket: parseUrlBySearch('market'),
  //     },
  //   ]).then((res) => {
  //     console.log('res:::::', res);
  //     if (!res) return;
  //     const { result } = res;
  //     const obj = result[0];
  //     const finalParam = marketFun(obj);
  //     console.log('finalParam33333333333::::::::::', finalParam);
  //     const { isHkEtf } = finalParam;
  //     setIsETF(isHkEtf);
  //     setParams(finalParam);
  //   });
  // }, [language]);
  useEffect(() => {
    if (!parseUrlBySearch('market') || !parseUrlBySearch('code')) return;
    const marketFun = ({ bigMarket, code, tradeMarket, smallMarket }) => {
      let isHkEtf = false;
      if (bigMarket === 2) {
        isHkEtf = !!HKETFMarket[`${smallMarket}`];
        return { body: { stk_id: `${code}.hk`, language, trade_market: tradeMarket }, isHkEtf };
      }
      if (tradeMarket === 'USA') {
        return {
          body: {
            code_nasdq: code,
            stk_id: code,
            stockType: tradeMarket,
            language,
            trade_market: tradeMarket,
          },
        };
      }
      return { body: { stk_id: code, language, trade_market: tradeMarket }, isHkEtf };
    };
    getBigMatketData([
      {
        code: parseUrlBySearch('code'),
        smallMarket: parseUrlBySearch('market'),
      },
    ]).then((res) => {
      if (!res) return;
      const { result } = res;
      const obj = result[0];
      const finalParam = marketFun(obj);
      const { isHkEtf } = finalParam;
      setIsETF(isHkEtf);
      setParams(finalParam);
    });
  }, [language]);

  return (
    <div styleName="wrapper">
      {isETF
        ? <ETFSituation params={params} />
        : <StockSituation params={params} />}
      {/* <ETFSituation params={params} /> */}
    </div>
  );
};

export default IndividualSituation;
