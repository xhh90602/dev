import './buy-sell-gear.scss';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

const InfoItem = (props) => {
  const { textName, price, qty, index, className, changePrice, bStr, level, vol } = props;

  return (
    <div
      // styleName={classNames('gear-item', { bid: true })}
      styleName="gear-item"
      onClick={() => {
        changePrice(price);
      }}
    >
      <div styleName="label">
        {textName}
        {level}
      </div>
      <div styleName="price" className={className}>
        {price}
      </div>
      <div styleName="qty">
        {vol}
        {bStr !== '' && (
          // eslint-disable-next-line react/no-danger
          <span dangerouslySetInnerHTML={{ __html: bStr }} />
        )}
      </div>
    </div>
  );
};

export type stockHandicapList = {
  index: number;
  price: StrNumber;
  qty: StrNumber;
  priceText: string;
};

interface IBuySellGear {
  riseList: stockHandicapList[];
  fallList: stockHandicapList[];
  changePrice: any;
  noTouch: boolean;
  defaultText: string;
  bidPriceList: any[];
  askPriceList: any[];
}

function getBStr(d, defaultText) {
  if (d === 0 || d === '0') {
    return defaultText ? `(${String(defaultText).padStart(3, '_').replace(/_/g, '&nbsp;')})` : '';
  }
  if (!d) return '';
  return `(${String(d).padStart(3, '_').replace(/_/g, '&nbsp;')})`;
}

/**
 * 买卖档档位详情
 * @param { IBuySellGear } props
 * @returns
 */
const BuySellGear: React.FC<IBuySellGear> = (props) => {
  const {
    // riseList = [],
    // fallList = [],
    changePrice,
    noTouch,
    defaultText,
    bidPriceList = [],
    askPriceList = [],
  } = props;

  const change = (v) => {
    if (noTouch) {
      changePrice(v);
    }
  };

  return (
    <div
      className="m-t-15 m-b-5"
      styleName="buy-sell-gear"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div
        // styleName="buy-box"
        styleName={classNames('buy-box', { bid: true })}
      >
        {bidPriceList.map((buy) => (
          <InfoItem
            {...buy}
            changePrice={change}
            textName={<FormattedMessage id="买" />}
            // className="orange-color"
            bStr={getBStr(buy.count, defaultText)}
          />
        ))}
      </div>
      <div
        // styleName="sell-box"
        styleName={classNames('sell-box', { ask: true })}
      >
        {askPriceList.map((sell) => (
          <InfoItem
            {...sell}
            changePrice={change}
            textName={<FormattedMessage id="卖" />}
            // className="blue-color"
            bStr={getBStr(sell.count, defaultText)}
          />
        ))}
      </div>
    </div>
  );
};

export default BuySellGear;
