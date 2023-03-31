interface IHSTrendTabs {
  name: string;
  type: number;
}

export const defaultPageSize = 30;

export const hsTrendTabs: IHSTrendTabs[] = [
  {
    name: 'warrant',
    type: 0,
  },
  {
    name: 'call',
    type: 1,
  },
  {
    name: 'pull',
    type: 2,
  },
  {
    name: 'bull',
    type: 3,
  },
  {
    name: 'bear',
    type: 4,
  },
];

interface TabItem {
  value: number;
  label: string;
  fields: any[];
}

export const activeSharesTabData: TabItem[] = [
  {
    value: 1,
    label: 'call_warrant',
    fields: [
      'call_warrant_amount',
      'call_warrant_ratio',
      'put_warrant_amount',
      'put_warrant_ratio',
      'name',
      'amount',
    ],
  },
  {
    value: 2,
    label: 'bull_bear_certificate',
    fields: [
      'bull_contracts_amount',
      'bull_contracts_ratio',
      'bear_contracts_amount',
      'bear_contracts_ratio',
      'name',
      'amount',
    ],
  },
];

export const varietyDistributionFields = [
  'call_warrant_amount',
  'call_warrant_ratio',
  'put_warrant_amount',
  'put_warrant_ratio',
  'name',
  'short_position_amount',
  'short_position_ratio',
  'long_position_amount',
  'long_position_ratio',
  'bull_contracts_amount',
  'bull_contracts_ratio',
  'bear_contracts_amount',
  'bear_contracts_ratio',
];

export const filterSymbolsData = (symbols: any[] = []) => {
  if (symbols.length === 0) return [];

  // eslint-disable-next-line no-useless-escape
  const dataName = symbols[0].map((item) => item.replace(/\_(\w)/g, (_, letter) => letter.toUpperCase()));

  const data: any[] = [];

  symbols.forEach((stock: [], stockIndex) => {
    if (stockIndex === 0) return;

    const newStock = {};

    stock.forEach((item, index) => {
      newStock[dataName[index]] = item;
    });

    data.push(newStock);
  });

  return data || [];
};
