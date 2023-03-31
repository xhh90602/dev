export default function HandleParams({ bigMarket, code, tradeMarket, lan }) {
  if (bigMarket === 2) {
    return {
      body: {
        stk_id: `${code}.hk`,
        tradeMarket,
        language: lan,
        // language: 'zh-CN',
      },
      mf: 7,
      key: 'HK',
    };
  }
  if (tradeMarket === 'USA') {
    return { body: { code_nasdq: code, stk_id: code, language: lan }, mf: 8, key: 'USA' };
  }
  return {
    body: {
      stk_id: code,
      tradeMarket,
      language: lan,
      // language: 'zh-CN',
    },
    mf: 7,
    key: 'HK',
  };
}
