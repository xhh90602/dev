import './select-market.scss';
import IconSvg from '@/platforms/mobile/components/icon-svg';
import rightArrowIcon from '@mobile/images/icon_zh_more.svg';
import { useState } from 'react';
import copy from 'copy-to-clipboard';
import { Modal } from 'antd-mobile';
import { FormattedMessage } from 'react-intl';
import { Data } from '@/hooks/stock-roll/use-stock-roll';
import useUserCard from '@/hooks/trade/use-user-card';

const marketList = [
  {
    key: 'hk',
    name: <FormattedMessage id="hk_stocks" />,
    icon: 'icon_hk',
  },
  {
    key: 'a',
    name: <FormattedMessage id="a_stocks" />,
    icon: 'icon_a',
  },
];

export const AccountInfo: React.FC<{ data: Data }> = (props) => {
  const { data } = props;
  const inAccountInfo = [
    {
      key: 'accept_account_number',
      label: (
        <>
          <FormattedMessage id="accept" />
          <FormattedMessage id="account" />
          <FormattedMessage id="number" />
        </>
      ),
      info: (() => (
        <>
          {data.clientAccount}
          <span
            styleName="btn"
            onClick={() => {
              copy(data.clientAccount);
            }}
          >
            <FormattedMessage id="copy" />
          </span>
        </>
      ))(),
    },
    {
      key: 'accept_account_designation',
      label: (
        <>
          <FormattedMessage id="accept" />
          <FormattedMessage id="account" />
          <FormattedMessage id="designation" />
        </>
      ),
      info: data.clientName,
    },
    {
      key: 'accept_side_designation',
      label: (
        <>
          <FormattedMessage id="accept" />
          <FormattedMessage id="side" />
          <FormattedMessage id="designation" />
        </>
      ),
      info: (
        <>
          <FormattedMessage id="zhongwei" />
          <FormattedMessage id="security" />
          <FormattedMessage id="LLC" />
        </>
      ),
    },
    {
      key: 'CCASS_code',
      label: <FormattedMessage id="CCASS_code" />,
      info: 'B01969',
    },
    {
      key: 'zhongwei_linkman',
      label: (
        <>
          <FormattedMessage id="zhongwei" />
          <FormattedMessage id="linkman" />
        </>
      ),
      info: <FormattedMessage id="settlement_department" />,
    },
    {
      key: 'zhongwei_contact_phone',
      label: (
        <>
          <FormattedMessage id="zhongwei" />
          <FormattedMessage id="contact_phone" />
        </>
      ),
      info: (
        <span>
          <FormattedMessage id="contact_number_1" />
          <br />
          <FormattedMessage id="contact_number_2" />
        </span>
      ),
    },
    {
      key: 'zhongwei_contact_email',
      label: (
        <>
          <FormattedMessage id="zhongwei" />
          <FormattedMessage id="contact_email" />
        </>
      ),
      info: 'settlement3@veredsec.com',
    },
  ];

  return (
    <>
      {inAccountInfo.map((item) => (
        <div key={item.key} styleName="account-item-info">
          <span styleName="label">{item.label}</span>
          <span styleName="info" className="num-font flex-c-c">
            {item.info}
          </span>
        </div>
      ))}
    </>
  );
};

const SelectMarket = (props: { type: 'in' | 'out'; data: Data; onSelect: (v) => void }) => {
  const { type, onSelect, data } = props;

  const inOutName = <FormattedMessage id={type === 'in' ? 'roll_in' : 'roll_out'} />;
  const [visable, setVisable] = useState(false);
  const { isMainlandIdentityCard } = useUserCard(true);

  return (
    <div styleName="container">
      <div styleName="title">
        <FormattedMessage id="select" />
        <FormattedMessage id="market" />
      </div>
      {marketList.filter((market) => {
        if (market.key === 'a') {
          return !isMainlandIdentityCard;
        }
        return true;
      }).map((market) => (
        <div key={market.key} styleName="market-item" onClick={() => onSelect(market.key)}>
          <span styleName="icon">
            <IconSvg path={market.icon} />
          </span>
          <span styleName="name">
            {inOutName}
            {market.name}
          </span>
          <img styleName="right-arrow" src={rightArrowIcon} alt="" />
        </div>
      ))}
      {type === 'in' && (
        <>
          <div styleName="footer-btn" onClick={() => setVisable(true)}>
            <FormattedMessage id="zw_accept_account_info" />
          </div>
          <Modal
            visible={visable}
            content={(
              <>
                <div styleName="close-btn" onClick={() => setVisable(false)}>
                  <IconSvg path="icon_close_popup" />
                </div>
                <div styleName="account-title">
                  <FormattedMessage id="zw_accept_account_info" />
                </div>
                <AccountInfo data={data} />
              </>
            )}
          />
        </>
      )}
    </div>
  );
};

export default SelectMarket;
