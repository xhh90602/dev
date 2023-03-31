import { toThousands } from '@/utils';
import { FormattedMessage, useIntl } from 'react-intl';
import { Data } from '@/hooks/stock-roll/use-stock-roll';

import './confirm-info.scss';
import { toFixed } from '@dz-web/o-orange';

const ConfirmInfo = (props: {
  type: 'in' | 'out';
  data: Data;
  addStep: (v) => void;
  stockMarket: string;
  submit: () => void;
}) => {
  const { type, addStep, data, stockMarket, submit } = props;
  const { formatMessage } = useIntl();
  const isIn = type === 'in';
  const inName = <FormattedMessage id={isIn ? 'accept' : 'roll_out'} />;
  const outName = <FormattedMessage id={isIn ? 'roll_out' : 'accept'} />;

  const inOutinfoList = [
    {
      key: 'in_side_info',
      title: (
        <>
          {inName}
          <FormattedMessage id="side" />
          <FormattedMessage id="info" />
        </>
      ),
      list: [
        {
          key: 'in_borker',
          label: (
            <>
              {inName}
              <FormattedMessage id="borker" />
            </>
          ),
          value: isIn ? data.inBroker : data.outBroker,
        },
        {
          key: 'in_account',
          label: (
            <>
              {inName}
              <FormattedMessage id="account" />
            </>
          ),
          value: isIn ? data.inAccount : data.outAccount,
        },
        {
          key: 'account_designation',
          label: (
            <>
              <FormattedMessage id="account" />
              <FormattedMessage id="designation" />
            </>
          ),
          value: isIn ? data.inAccountName : data.outAccountName,
        },
      ],
    },
    {
      key: 'out_side_info',
      title: (
        <>
          {outName}
          <FormattedMessage id="side" />
          <FormattedMessage id="info" />
        </>
      ),
      step: -2,
      list: [
        {
          key: 'out_borker',
          label: (
            <>
              {outName}
              <FormattedMessage id="borker" />
            </>
          ),
          value: isIn ? data.outBroker : data.inBroker,
        },
        {
          key: 'ccass',
          label: `${formatMessage({ id: 'borker' })}CCASS`,
          value: isIn ? data.outCcass : data.inCcass,
        },
        {
          key: 'out_account',
          label: (
            <>
              {outName}
              <FormattedMessage id="account" />
            </>
          ),
          value: isIn ? data.outAccount : data.inAccount,
        },
        {
          key: 'account_designation',
          label: (
            <>
              <FormattedMessage id="account" />
              <FormattedMessage id="designation" />
            </>
          ),
          value: isIn ? data.outAccountName : data.inAccountName,
        },
      ],
    },
    type === 'out' && {
      key: 'fee',
      title: <FormattedMessage id="fee" />,
      list: [
        {
          key: 'roll_out_fee_estimate',
          label: (
            <>
              <FormattedMessage id="roll_out" />
              <FormattedMessage id="fee" />
              (
              <FormattedMessage id="estimate" />
              )
            </>
          ),
          value: data.outPrice
            ? toThousands(toFixed(data.outPrice)) + (stockMarket === 'hk' ? ' HKD' : ' CNY')
            : '--',
        },
      ],
    },
    {
      key: 'stocks_info',
      title: (
        <>
          <FormattedMessage id="stocks" />
          <FormattedMessage id="info" />
        </>
      ),
      step: -1,
      labelTitle: (
        <>
          <FormattedMessage id="stocks" />
          <FormattedMessage id="designation" />
          /
          <FormattedMessage id="code" />
        </>
      ),
      valueTitle: <FormattedMessage id="qty" />,
      list: data.stockInfo.map((stock, index) => ({
        key: stock.stock,
        label: (() => (
          <div className="flex-l-t">
            <div styleName="index-icon" className="num-font">
              {index + 1}
            </div>
            <div>
              <div styleName="name">{stock.stockName}</div>
              <div styleName="code">{stock.stock}</div>
            </div>
          </div>
        ))(),
        value: toThousands(stock.number),
      })),
    },
  ];

  return (
    <div styleName="container">
      {inOutinfoList.map((info) => {
        if (!info) return null;
        return (
          // eslint-disable-next-line react/no-array-index-key
          <div key={info.key}>
            <div styleName="title-box">
              <span styleName="title">{info.title}</span>
              {info.step && (
                <span styleName="action" onClick={() => addStep(info.step)}>
                  <FormattedMessage id="edit" />
                </span>
              )}
            </div>
            <div styleName="basic-card">
              {info.labelTitle && (
                <div styleName="card-title">
                  <span>{info.labelTitle}</span>
                  <span>{info.valueTitle}</span>
                </div>
              )}
              {info.list.map((item) => (
                <div key={item.key} styleName="cell-item">
                  <div styleName="label">{item.label}</div>
                  <div styleName="value">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div styleName="next-btn" onClick={submit}>
        <FormattedMessage id="final_submit_btn_text" />
      </div>
    </div>
  );
};

export default ConfirmInfo;
