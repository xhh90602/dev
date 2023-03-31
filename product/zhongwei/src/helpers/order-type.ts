import { isUSSymbol, isCNSymbol } from '@dz-web/quote-client';

const hk = [
  {
    value: 'ELO', // 增强限价盘(ELO)
    label: 'ELO', // 增强限价盘(ELO)
    labelName: '增强限价盘(ELO)',
  },
  {
    value: 'AL', // 竞价限价盘(AL)
    label: 'AL', // 竞价限价盘(AL)
    labelName: '竞价限价盘(AL)',
  },
  {
    value: 'LMT', // 限价盘(LIMIT)
    label: 'LMT', // 限价盘(LIMIT)
    labelName: '限价盘(LIMIT)',
  },
  // {
  //   value: 'MKT', // 市价单(MKT)
  //   label: 'MKT', // 市价单(MKT)
  //   labelName: 'market_orders', // '市价单(MKT)'
  // },
  {
    value: 'STL', // 限价停损单(STL)
    label: 'STL', // 限价停损单(STL)
    labelName: '限价停损单(STL)', // '限价停损单(STL)'
  },
  {
    value: 'AO', // 竞价单(AO)
    label: 'AO', // 竞价单(AO)
    labelName: '竞价单(AO)', // '竞价单(AO)'
  },
];
const us = [
  {
    label: 'LMT', // 限价盘(LMT)
    value: 'LMT', // 限价盘(LMT)
    labelName: '限价盘(LMT)',
  },
  {
    value: 'PRE', // 盘前盘(Limit-Pre)
    label: 'PRE', // 盘前盘(Limit-Pre)
    labelName: '盘前盘(Limit-Pre)',
  },
  {
    value: 'POST', // 盘后盘(Limit-Post)
    label: 'POST', // 盘后盘(Limit-Post)
    labelName: '盘后盘(Limit-Post)',
  },
];
const a = [
  {
    label: 'LMT', // 限价盘(LMT)
    value: 'LMT', // 限价盘(LMT)
    labelName: '限价盘(LMT)',
  },
];

const getOrderTypeList = (type: string | number) => {
  const isA = typeof type === 'string'
    && (type.toLocaleUpperCase().indexOf('SHMK') > -1
      || type.toLocaleUpperCase().indexOf('SZMK') > -1);
  const isUS = typeof type === 'string' && type.toLocaleUpperCase().indexOf('USA') > -1;

  if (isA || isCNSymbol(+type)) return a;
  if (isUS || isUSSymbol(+type)) return us;
  return hk;
};

export default getOrderTypeList;
