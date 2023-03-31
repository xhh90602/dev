export const amountFormatToBMK = (amount: (number|string)) :string => {
  if (!amount) return `${amount}`;
  let sign = '';
  if ((`${amount}`).includes('-')) {
    amount = (`${amount}`).replace(/-/g, '');
    sign = '-';
  }
  if (+amount > 1000000000) return `${sign}${((+amount) / 1000000000).toFixed(2)}B`;
  if (+amount > 1000000) return `${sign}${((+amount) / 1000000).toFixed(2)}M`;
  if (+amount > 1000) return `${sign}${((+amount) / 1000).toFixed(2)}K`;
  return `${sign}${amount}`;
};
