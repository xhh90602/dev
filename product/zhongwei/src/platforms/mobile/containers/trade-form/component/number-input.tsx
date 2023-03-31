/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unused-prop-types */
import CountInput from '@/platforms/mobile/components/count-input/count-input';
import { countNumber, countType, JavaMarket } from '@/utils';
import { useMemo, useRef } from 'react';
import { useIntl } from 'react-intl';
import { TRADE_ORDER_TYPE } from '@/constants/trade';
import { Popover } from 'antd-mobile';
import { strToNumber } from '@/utils/num';
import { toThousand } from '@dz-web/o-orange';
import { useStockInfoStore } from '@mobile/model/stock-info-store';
import { isNil } from 'lodash-es';

const { defaultLotSize = 1 } = window.GLOBAL_CONFIG.TRADE_CONFIG;

interface IQtyProps {
  bs: TRADE_ORDER_TYPE;
  value: string;
  changeValue: (v: string) => void;
  countMax?: number; // 最大可买|卖
  market?: keyof typeof JavaMarket;
}

/**
 * 数量输入框
 */
const NumberInput = (props: IQtyProps) => {
  const {
    bs,
    value,
    changeValue,
    countMax = undefined,
  } = props;

  const { formatMessage } = useIntl();

  const stockInfo = useStockInfoStore((state) => state.stockInfo);

  const changeNum = useMemo(() => stockInfo?.lotSize || defaultLotSize, [stockInfo?.lotSize]);

  const isBuy = bs === TRADE_ORDER_TYPE.BUY;

  const tip = useMemo(() => {
    if (!value || isNil(countMax)) return '';

    if (!isBuy && Number(value) > countMax) return formatMessage({ id: 'qty_exceeded_maximum_vendibility' });

    return '';
  }, [bs, value, countMax]);

  const inputRef = useRef<any>(null);

  return (
    <Popover
      mode="dark"
      content={tip}
      visible={!!tip}
      getContainer={() => inputRef.current}
    >
      <CountInput
        className="t-normal"
        size={36}
        weight="bold"
        ref={inputRef}
        placeholder={formatMessage({ id: 'please_enter_qty' })}
        value={value ? toThousand(value) : ''}
        plus={() => {
          countNumber({
            type: countType.PLUS,
            number: strToNumber(String(value)),
            setNumber: (v) => changeValue(v),
            changeNumber: changeNum,
            countMax,
          });
        }}
        minus={() => {
          countNumber({
            type: countType.MINUS,
            number: strToNumber(String(value)),
            setNumber: (v) => changeValue(v),
            changeNumber: changeNum,
            countMax,
          });
        }}
        change={(v) => {
          if (!v) {
            changeValue('');
            return;
          }
          changeValue(String(strToNumber(String(v))));
        }}
        focus={() => {
          changeValue(value ? String(strToNumber(value)) : '');
        }}
        blur={() => {
          changeValue(value || '');
        }}
      />
    </Popover>
  );
};

export default NumberInput;
