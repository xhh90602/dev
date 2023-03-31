import { FormattedMessage } from 'react-intl';
import { sliceString } from '@/utils';
import { MouseEventHandler } from 'react';
import { LEVEL, LEVELNAME } from '@/hooks/trade/use-get-capital';
import useModalHint from '@/hooks/trade/use-modal-hint';
import IconSvg from '../components/icon-svg';

export interface IRenderTemplate {
  key: string;
  label: React.FC<any>;
  content: <T>(d?: T) => string | JSX.Element;
  align?: 'left' | 'center' | 'right';
}

export enum AlignType {
  left = 't-l',
  center = 't-c',
  right = 't-r',
}

const BorrowingBalanceLabel = (props) => {
  const { debtLevel = LEVEL.L1 } = props;
  const { riskLevelHint } = useModalHint();
  const handleIconClick: MouseEventHandler<any> = (e) => {
    e.stopPropagation();
    riskLevelHint();
  };

  return (
    <div className="flex-l-c">
      <FormattedMessage id="borrowing_balance" />
      <div className="risk-tag">
        <FormattedMessage id={LEVELNAME[debtLevel]} />
      </div>
      <IconSvg path="icon_hint" click={handleIconClick} />
    </div>
  );
};

/** 资产详情渲染列表 */
export const capitalList: IRenderTemplate[] = [
  {
    key: 'security_market_value',
    label: () => <FormattedMessage id="security_market_value" />,
    content: (d: any) => sliceString(d?.totalMarketValue),
  },
  {
    key: 'available_capital',
    label: () => <FormattedMessage id="available_capital" />,
    content: (d: any) => sliceString(d?.ledgerBalace),
    align: 'center',
  },
  {
    key: 'position_income',
    label: () => <FormattedMessage id="position_income" />,
    content: (d: any) => sliceString(d?.totalIncome, { sign: true }),
    align: 'right',
  },
  // ----
  {
    key: 'borrowing_balance',
    label: BorrowingBalanceLabel,
    content: (d: any) => sliceString(d?.debtAmount),
  },
  {
    key: 'frozen_capital',
    label: () => <FormattedMessage id="frozen_capital" />,
    content: (d: any) => sliceString(d?.holdAmount),
    align: 'center',
  },
  {
    key: 'max_buy_power',
    label: () => <FormattedMessage id="max_buy_power" />,
    content: (d: any) => sliceString(d?.buyingPower),
    align: 'right',
  },
];
