import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Checkbox, Popover } from 'antd-mobile';
import { toThousand, toFixed } from '@dz-web/o-orange';
import { TRADE_ACCOUNT_TYPE } from '@/constants/trade';
import { openStockSearch } from '@mobile/helpers/native/url';
import IconSvg from '@mobile/components/icon-svg';
import './order-footer.scss';

interface IProps {
  combineInfo: Record<string, any>;
  checkedList: Record<string, any>[];
  tradeAccountInfo: Record<string, any>;
  tradeMoneyInfo: Record<string, any>;
  tradeTotalAmount: Record<string, number>;
  setIsHoldings: (...args: any[]) => any;
  handleSubmit: (...args: any[]) => any;
}

const OrderFooter: React.FC<IProps> = (props) => {
  const { checkedList = [], tradeAccountInfo, tradeMoneyInfo, tradeTotalAmount, setIsHoldings, handleSubmit } = props;

  const { formatMessage } = useIntl();
  const [bubbleVisible, setBubbleVisible] = useState<boolean>(false);

  useEffect(() => {
    if (bubbleVisible) {
      setBubbleVisible(false);
    }
  }, [tradeTotalAmount]);

  return (
    <>
      <div styleName="operation-box">
        <div
          styleName="add-stock"
          onClick={() => {
            openStockSearch({
              callbackEvent: 'searchStockCallback',
            });
          }}
        >
          {formatMessage({ id: 'add_stock' })}
        </div>

        <Checkbox onChange={(val) => setIsHoldings(val)}>{formatMessage({ id: 'only_positions_are_shown' })}</Checkbox>
      </div>

      <div styleName="cost-box">
        <div styleName="cost-item deal-amount-box">
          <p styleName="label">{formatMessage({ id: 'total_purchase_amount' })}</p>
          <p styleName="value" className="num-font">
            {toThousand(toFixed(tradeTotalAmount.buyAmount))}
          </p>
        </div>

        <div styleName="cost-item">
          {tradeAccountInfo.accountType === TRADE_ACCOUNT_TYPE.FINANCING && !!tradeTotalAmount.loanAmounts && (
            <div styleName="purchasing-power-box">
              <p styleName="label content-hint">
                <span>{formatMessage({ id: 'order_amount_of_loan' })}</span>
                <IconSvg path="icon_hint" />
              </p>
              <p styleName="value red-color" className="num-font">
                {toThousand(toFixed(tradeTotalAmount.loanAmounts))}
              </p>
            </div>
          )}

          <div styleName="purchasing-power-box">
            <p styleName="label">{formatMessage({ id: 'maximum_purchasing_power' })}</p>
            <p styleName="value" className="num-font">
              {toThousand(toFixed(tradeMoneyInfo.buyingPower))}
            </p>
          </div>
        </div>
      </div>

      <div styleName="order-btn-box">
        <div styleName="cost-item deal-amount-box">
          <p styleName="label">{formatMessage({ id: 'total_amount_sold' })}</p>
          <p styleName="value" className="num-font">
            {toThousand(toFixed(tradeTotalAmount.sellAmount))}
          </p>
        </div>

        <Popover
          visible={bubbleVisible}
          content={<span>{formatMessage({ id: 'lack_of_purchasing_power' })}</span>}
          trigger="click"
          mode="dark"
          placement="top"
        >
          <button
            type="button"
            styleName="submit-btn"
            disabled={!checkedList.length}
            onClick={() => {
              if (
                tradeAccountInfo.accountType === TRADE_ACCOUNT_TYPE.CASH
                && tradeTotalAmount.buyAmount > tradeMoneyInfo.buyingPower
              ) {
                return setBubbleVisible(true);
              }

              return handleSubmit();
            }}
          >
            {formatMessage({ id: 'submit' })}
          </button>
        </Popover>
      </div>
    </>
  );
};

export default React.memo(OrderFooter);
