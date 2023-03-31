export function getFinancialTabData(tradeMarket = 'HK') :any[] {
  return [
    {
      value: '2001',
      label: 'ZYZB',
    },
    tradeMarket === 'HK' && {
      value: '2002',
      label: 'CWBL',
    },
    {
      value: '2003',
      label: 'ZHSY',
    },
    {
      value: '2004',
      label: 'ZCFZ',
    },
    {
      value: '2005',
      label: 'XJLL',
    },
  ].filter((k) => Boolean(k));
}
