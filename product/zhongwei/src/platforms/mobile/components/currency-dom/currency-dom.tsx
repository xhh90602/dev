import IconSvg from '@/platforms/mobile/components/icon-svg';
import { CURRENCY_TYPE } from '@/platforms/mobile/constants/config';

/* eslint-disable react/require-default-props */
const currencyIcon = {
  HKD: 'icon_hk',
  USD: 'icon_us',
  CNY: 'icon_a',
};

type Currency = `${CURRENCY_TYPE}`;

interface ICurrencyDom {
  currency: Currency;
  className?: string;
  text?: any;
}

const CurrencyDom = (props: ICurrencyDom) => {
  const { currency, className = '', text = '' } = props;

  return (
    <div className={className}>
      <IconSvg path={currencyIcon[currency]} />
      <span className="p-l-10">{text}</span>
    </div>
  );
};

export default CurrencyDom;
