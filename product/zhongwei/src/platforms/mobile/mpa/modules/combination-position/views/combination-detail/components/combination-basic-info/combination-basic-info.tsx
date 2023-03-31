import { useIntl, FormattedMessage } from 'react-intl';
import { toThousand } from '@dz-web/o-orange';
import { getClassNameByPriceChange } from '@dz-web/quote-client';
import { setPositiveSign } from '@/utils';

import dayjs from 'dayjs';
import classNames from 'classnames';
import './combination-basic-info.scss';

const infoCardList = [
  {
    key: 'netValue',
    styleName: 'atest-net',
    label: <FormattedMessage id="the_latest_net" />,
    render: (val: any) => <span>{val}</span>,
  },
  {
    key: 'nearly30Profit',
    label: <FormattedMessage id="last_30_days_yield" />,
    render: (val: any) => <span className={`${getClassNameByPriceChange(val)}`}>{setPositiveSign(val)}</span>,
  },
  {
    key: 'marketValue',
    label: <FormattedMessage id="combined_total_assets" />,
    render: (val: any) => <span>{toThousand(val)}</span>,
  },
  {
    key: 'position',
    label: <FormattedMessage id="combination_of_positions" />,
    render: (val: any) => <span>{val}</span>,
  },
  {
    key: 'totalProfitLoss',
    label: <FormattedMessage id="accumulative_total_profit_and_loss" />,
    render: (val: any) => <span className={`${getClassNameByPriceChange(val)}`}>{val}</span>,
  },
  {
    key: 'createTime',
    label: <FormattedMessage id="creation_date" />,
    render: (val: any) => <span>{dayjs(val).format('DD/MM/YYYY')}</span>,
  },
];

interface IProps {
  name: string;
  info: Record<string, any>;
}

const CombinationBasicInfo: React.FC<IProps> = (props) => {
  const { name = '', info = {} } = props;
  const { formatMessage } = useIntl();

  return (
    <div styleName="combination-basic-info">
      {info.type === '1' ? (
        <div styleName="icon-firm-offer">{formatMessage({ id: 'firm_offer' })}</div>
      ) : (
        <div styleName="icon-simulation">{formatMessage({ id: 'simulation' })}</div>
      )}

      <div styleName="combination-card-name">{name}</div>
      <div styleName="combination-card-earnings">
        <div styleName="earnings-value" className={`${getClassNameByPriceChange(info.totalProfitRatio)}`}>
          {setPositiveSign(info.totalProfitRatio)}
        </div>
        <div styleName="earnings-label">{formatMessage({ id: 'winner_portfolio_renditen' })}</div>
      </div>

      {infoCardList.map((item) => (
        <div styleName={classNames(['card-item', item.styleName])} key={item.key}>
          <div styleName="card-item-label">{item.label}</div>
          <div styleName="card-item-content">{item.render(info[item.key])}</div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(CombinationBasicInfo);
