export const amountFormatToCN = (amount: (number|string)) :string => {
  if (!amount) return '--';
  let sign = '';
  if ((`${amount}`).includes('-')) {
    amount = (`${amount}`).replace(/-/g, '');
    sign = '-';
  }
  if (+amount > 100000000) return `${sign}${((+amount) / 100000000).toFixed(2)}亿`;
  if (+amount > 10000) return `${sign}${((+amount) / 10000).toFixed(2)}万`;
  return `${sign}${amount}`;
};
