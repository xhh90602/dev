/* eslint-disable react/no-array-index-key */
import Tabs from '@/platforms/mobile/components/tabs/tabs';
import BasicCard from '@mobile/components/basic-card/basic-card';
import { useMemo, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import useUserCard from '@/hooks/trade/use-user-card';
import './my-fee.scss';
import IconSvg from '@/platforms/mobile/components/icon-svg';
import { Modal } from 'antd-mobile';

const feeListHK = [
  {
    label: (
      <div>
        <FormattedMessage id="trade_commission" />
        {/* <div styleName="desc-text">中薇证券</div> */}
      </div>
    ),
    content: (
      <div>
        <div className="f-bold">
          0.05%*
          <FormattedMessage id="make_bargain_price" />
        </div>
        {/* <div styleName="desc-text">单笔最低3 HKD</div> */}
      </div>
    ),
  },
  { label: <FormattedMessage id="finan_rate" />, content: (<div className="f-bold">8.375%</div>) },
];

const feeListA = [
  {
    label: (
      <div>
        <FormattedMessage id="trade_commission" />
        {/* <div styleName="desc-text">中薇证券</div> */}
      </div>
    ),
    content: (
      <div>
        <div className="f-bold">
          0.05%*
          <FormattedMessage id="make_bargain_price" />
        </div>
        {/* <div styleName="desc-text">单笔最低3 RMB</div> */}
      </div>
    ),
  },
  { label: <FormattedMessage id="finan_rate" />, content: (<div className="f-bold">8.375%</div>) },
];

const otherFeeListA = [
  {
    label: (
      <div>
        <div>
          <FormattedMessage id="brokerage" />
        </div>
        <div styleName="desc-text">
          <FormattedMessage id="sh_stock_exchange" />
          /
          <FormattedMessage id="sz_stock_exchange" />
        </div>
      </div>
    ),
    content: (
      <div className="f-bold">
        0.00487%*
        <FormattedMessage id="make_bargain_price" />
      </div>
    ),
  },
  {
    label: (
      <div>
        <div>
          <FormattedMessage id="certificate_control_fee" />
        </div>
        <div styleName="desc-text">
          <FormattedMessage id="CSRC" />
        </div>
      </div>
    ),
    content: (
      <div className="f-bold">
        0.002%*
        <FormattedMessage id="make_bargain_price" />
      </div>
    ),
  },
  {
    label: (
      <div>
        <div>
          <FormattedMessage id="transfer_fee" />
          /
          <FormattedMessage id="register" />
          <FormattedMessage id="transfer_fee" />
        </div>
        <div styleName="desc-text">
          <FormattedMessage id="china_settlement_sh" />
          /
          <FormattedMessage id="china_settlement_sz" />
        </div>
      </div>
    ),
    content: (
      <div className="f-bold">
        0.001%*
        <FormattedMessage id="make_bargain_price" />
      </div>
    ),
  },
  {
    label: (
      <div>
        <div>
          <FormattedMessage id="transfer_fee" />
          /
          <FormattedMessage id="register" />
          <FormattedMessage id="transfer" />
        </div>
        <div styleName="desc-text">
          <FormattedMessage id="hk_settlement" />
        </div>
      </div>
    ),
    content: (
      <div className="f-bold">
        0.002%*
        <FormattedMessage id="make_bargain_price" />
      </div>
    ),
  },
  {
    label: (
      <div>
        <div>
          <FormattedMessage id="trade" />
          <FormattedMessage id="stamp_duty" />
        </div>
        <div styleName="desc-text">
          <FormattedMessage id="SAT" />
        </div>
      </div>
    ),
    content: (
      <div>
        <div className="f-bold">
          0.1%*
          <FormattedMessage id="make_bargain_price" />
        </div>
        <div styleName="desc-text">
          （
          <FormattedMessage id="only_sale_collect" />
          ）
        </div>
      </div>
    ),
  },
  {
    label: <FormattedMessage id="security_combination_fee" />,
    content: (
      <div>
        <div className="f-bold">
          <FormattedMessage id="share_stock_value" />
          *0.008%/365
        </div>
        <div styleName="desc-text">
          （
          <FormattedMessage id="everyday_count" />
          ，
          <FormattedMessage id="monthly_charge" />
          ），
          <FormattedMessage id="no_minimum_fee" />
        </div>
      </div>
    ),
  },
  {
    label: (
      <div>
        <div>
          <FormattedMessage id="tax_on_dividends" />
        </div>
        <div styleName="desc-text">
          <FormattedMessage id="SAT" />
        </div>
      </div>
    ),
    content: (
      <div>
        <div className="f-bold">
          <FormattedMessage id="total_dividend_bonus_shares" />
          *10%
        </div>
        <div styleName="desc-text">
          （
          <FormattedMessage id="sat_deductible_at_the_time_of_dividend_payment" />
          ）
        </div>
      </div>
    ),
  },
];

const otherFeeListHK = [
  {
    label: (
      <div>
        <div>
          <FormattedMessage id="use_of_trading_system" />
        </div>
        <div styleName="desc-text">
          <FormattedMessage id="hk_stock_exchange_fees" />
        </div>
      </div>
    ),
    content: (
      <div className="f-bold">
        0.50HKD/
        <FormattedMessage id="pan" />
      </div>
    ),
  },
  {
    label: (
      <div>
        <div>
          <FormattedMessage id="pay_a_fee" />
        </div>
        <div styleName="desc-text">
          <FormattedMessage id="hk_clearing_house_charges" />
        </div>
      </div>
    ),
    content: (
      <div>
        <div className="f-bold">
          0.002%*
          <FormattedMessage id="make_bargain_price" />
        </div>
        <div styleName="desc-text">
          <FormattedMessage id="lowest" />
          2.00HKD，
          <FormattedMessage id="highest" />
          100.00HKD
        </div>
      </div>
    ),
  },
  {
    label: (
      <div>
        <div>
          <FormattedMessage id="stamp_duty" />
        </div>
        <div styleName="desc-text">
          <FormattedMessage id="hk_government_fees" />
        </div>
      </div>
    ),
    content: (
      <div>
        <div className="f-bold">
          0.13%*
          <FormattedMessage id="make_bargain_price" />
        </div>
        <div styleName="desc-text">
          <FormattedMessage id="long_text_1" />
        </div>
      </div>
    ),
  },
  {
    label: (
      <div>
        <div>
          <FormattedMessage id="trade_fee" />
        </div>
        <div styleName="desc-text">
          <FormattedMessage id="hk_stock_exchange_fees" />
        </div>
      </div>
    ),
    content: (
      <div>
        <div className="f-bold">
          0.005%*
          <FormattedMessage id="make_bargain_price" />
        </div>
        <div styleName="desc-text">
          <FormattedMessage id="lowest" />
          0.01HKD
        </div>
      </div>
    ),
  },
  {
    label: (
      <div>
        <div>
          <FormattedMessage id="trade_license_fee" />
        </div>
        <div styleName="desc-text">
          <FormattedMessage id="sfc_fees" />
        </div>
      </div>
    ),
    content: (
      <div>
        <div className="f-bold">
          0.0027%*
          <FormattedMessage id="make_bargain_price" />
        </div>
        <div styleName="desc-text">
          <FormattedMessage id="lowest" />
          0.01HKD
        </div>
      </div>
    ),
  },
  {
    label: (
      <div>
        <div>
          <FormattedMessage id="money_remitted_trade_license_fee" />
        </div>
        <div styleName="desc-text">
          <FormattedMessage id="frc_fee" />
        </div>
      </div>
    ),
    content: (
      <div>
        <div className="f-bold">
          0.00015%*
          <FormattedMessage id="make_bargain_price" />
        </div>
        <div styleName="desc-text">
          <FormattedMessage id="lowest" />
          0.01HKD
        </div>
      </div>
    ),
  },
];

const MyFee = () => {
  const { formatMessage } = useIntl();
  const list = [
    { title: formatMessage({ id: 'hk_stocks' }), key: 'HK' },
    { title: formatMessage({ id: 'sz_sh_stocks' }), key: 'A' },
  ];
  const [active, setActive] = useState('HK');

  const { isMainlandIdentityCard } = useUserCard();

  const { feeList, otherFeeList } = useMemo(() => {
    if (active === 'HK') {
      return {
        feeList: feeListHK,
        otherFeeList: otherFeeListHK,
      };
    }

    return {
      feeList: feeListA,
      otherFeeList: otherFeeListA,
    };
  }, [active]);

  const ref = useRef<HTMLDivElement>(null);

  const zwFeesExplainHint = () => {
    Modal.show({
      getContainer: ref.current,
      bodyClassName: 'basic-modal',
      title: formatMessage({ id: 'zw_fees_explain' }),
      content: formatMessage({ id: 'zw_fees_hint_text' }),
      actions: [{
        key: 'confirm',
        className: 'modal-confirm-btn',
        text: formatMessage({ id: 'ok' }),
        onClick: () => Modal.clear(),
      }],
      closeOnAction: true,
    });
  };

  return (
    <div styleName="page" ref={ref}>
      {!isMainlandIdentityCard && (
        <BasicCard className="shadow-bg m-b-40">
          <Tabs list={list} activeKey={active} onChange={(v) => setActive(v)} />
        </BasicCard>
      )}
      <div styleName="title-text" className="flex-l-c">
        <FormattedMessage id="zw_fees" />
        <IconSvg path="icon_hint" className="m-l-10" click={zwFeesExplainHint} />
      </div>
      <div styleName="info-box" className="basic-card">
        {feeList.map((f, i) => (
          <div key={i} styleName="info-list">
            <div styleName="info-label">{f.label}</div>
            <div styleName="info-content">{f.content}</div>
          </div>
        ))}
      </div>
      <div styleName="title-text">
        <FormattedMessage id="other_fees" />
      </div>
      <div styleName="info-box" className="basic-card">
        {otherFeeList.map((f, i) => (
          <div key={i} styleName="info-list">
            <div styleName="info-label">{f.label}</div>
            <div styleName="info-content">{f.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyFee;
