/* eslint-disable react/require-default-props */
import { useMemo, useRef } from 'react';
import { Popover } from 'antd-mobile';
import CountInput from '@mobile/components/count-input/count-input';
import { TRADE_ORDER_TYPE } from '@/constants/trade';
import { useStockInfoStore } from '@mobile/model/stock-info-store';
import useBidAsk from '@/hooks/quote/use-bid-ask';
import { useIntl } from 'react-intl';
import { TRIGGER_EXECUTE_TYPE, TRIGGER_TYPE } from '@/constants/trigger-trade';
import {
  add,
  countPrice,
  countType,
  div,
  getStockDec,
  initCountPrice,
  JavaMarket,
  mul,
  strToNumber,
  sub,
} from '@/utils';

const { defaultPriceChange = [1, 1] } = window.GLOBAL_CONFIG.TRADE_CONFIG;

interface IPriceProps {
  bs: TRADE_ORDER_TYPE;
  executeType: string;
  type: string;
  lPrice: number;
  isCondition: boolean;
  value: string;
  changeValue: (v: string) => void;
  changeNum?: number[] | null;
  market?: keyof typeof JavaMarket;
  disabled?: boolean;
}

/**
 * 限价价格输入框
 * @remark
 * 买单
 *
 *    ＞卖9档 气泡提示：价格偏离市价太高，可能导致下单失败
 *
 *    ＜买24档 气泡提示：价格偏离市价太高，可能导致下单失败
 *
 * 卖单
 *
 *    ＞卖24档 气泡提示：价格偏离市价太高，可能导致下单失败
 *
 *    ＜买9档 气泡提示：价格偏离市价太高，可能导致下单失败
 */
const PriceInput = (props: IPriceProps) => {
  const { formatMessage } = useIntl();
  const {
    bs,
    executeType,
    type,
    lPrice = 0,
    isCondition = false,
    value,
    changeValue,
    changeNum = null,
    market = JavaMarket.HKEX,
    disabled,
  } = props;
  const stockInfo = useStockInfoStore((state) => state.stockInfo);
  const { bidGrp, askGrp, dec, prevClose, marketId } = stockInfo;
  const { bidPriceList, askPriceList } = useBidAsk({ bidGrp, askGrp, dec, prevClose, marketId });

  const now = useMemo(() => stockInfo?.now || 0, [stockInfo?.now]);

  const buyFirstPrice = useMemo(() => (bidPriceList.length > 0 ? bidPriceList[0].price : now), [
    bidPriceList,
    now,
  ]);
  const sellFirstPrice = useMemo(() => (askPriceList.length > 0 ? askPriceList[0].price : now), [
    askPriceList,
    now,
  ]);

  const isBuy = bs === TRADE_ORDER_TYPE.BUY;

  const changeNumber = useMemo(() => {
    // if (!isShow) return defaultPriceChange;

    if (Array.isArray(changeNum)) return changeNum;

    if (value) {
      return initCountPrice(market, {
        now: Number(value || 0),
      });
    }

    return defaultPriceChange;
  }, [value, changeNum, market]);

  const tip = useMemo(() => {
    let text = '';
    if (!value || !now) return text;

    const minus = changeNumber[0];
    const plus = changeNumber[1] || changeNumber[0];

    const fromatText = formatMessage({ id: 'price_over_budget_tip' });

    if (isBuy) {
      if (Number(value) > add(sellFirstPrice, mul(8, plus))) text = fromatText;
      if (Number(value) < sub(buyFirstPrice, mul(23, minus))) text = fromatText;
    } else {
      if (Number(value) > add(sellFirstPrice, mul(23, plus))) text = fromatText;
      if (Number(value) < sub(buyFirstPrice, mul(8, minus))) text = fromatText;
    }

    return text;
  }, [bs, changeNumber, value, now]);

  const conditionTip = useMemo(() => {
    let text = '';
    if (!value || executeType !== TRIGGER_EXECUTE_TYPE.Z || type !== TRIGGER_TYPE.L) return '';
    /* 指定价高于触发价的比例超过5% */
    if (div(sub(Number(value), Number(lPrice)), lPrice) > 0.05) {
      text = formatMessage({
        id: isBuy ? 'condition_high_price_over_budget_tip' : 'condition_high_price_over_budget_tip_sell',
      });
    }
    /* 指定价低于触发价的比例超过5% */
    if (div(sub(Number(lPrice), Number(value)), lPrice) > 0.05) {
      text = formatMessage({
        id: isBuy ? 'condition_low_price_over_budget_tip' : 'condition_low_price_over_budget_tip_sell',
      });
    }

    return text;
  }, [bs, value, lPrice, executeType]);

  const inputRef = useRef<any>(null);

  return (
    <Popover
      mode="dark"
      content={isCondition ? conditionTip : tip}
      visible={isCondition ? !!conditionTip : !!tip}
      getContainer={() => inputRef.current}
    >
      <CountInput
        className="t-normal"
        size={36}
        weight="bold"
        disabled={disabled}
        ref={inputRef}
        placeholder={formatMessage({ id: 'please_enter_price' })}
        value={value}
        plus={() => {
          countPrice({
            type: countType.PLUS,
            price: strToNumber(value),
            setPrice: changeValue,
            changePrice: changeNumber,
            market,
          });
        }}
        minus={() => {
          countPrice({
            type: countType.MINUS,
            price: strToNumber(value),
            setPrice: changeValue,
            changePrice: changeNumber,
            market,
          });
        }}
        change={(v) => {
          changeValue(v);
        }}
        blur={() => {
          // eslint-disable-next-line @typescript-eslint/no-shadow
          const dec = getStockDec(market, Number(value));
          changeValue(Number(value).toFixed(dec));
        }}
      />
    </Popover>
  );
};

export default PriceInput;
