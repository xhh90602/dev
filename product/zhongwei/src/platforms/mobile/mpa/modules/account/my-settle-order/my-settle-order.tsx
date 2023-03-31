import './my-settle-order.scss';
import { FormattedMessage } from 'react-intl';
import { useState } from 'react';
import FullScreenPageView from '@/platforms/mobile/components/full-screen-page-view/full-screen-page-view';
import bg from '@mobile/images/trade_account_bg.svg';
import { getTradeAccountInfo } from '@/api/module-api/trade';

const MySettleOrder: React.FC = () => {
  const [email, setEmail] = useState('');

  /* 获取交易账户信息 */
  getTradeAccountInfo().then((res) => {
    const { code, result } = res;
    if (code === 0) {
      setEmail(result.email);
    }
  });

  return (
    <FullScreenPageView
      title={<FormattedMessage id="title" />}
      backgroundImg={bg}
    >
      <div styleName="container">
        <div styleName="content">
          <div>
            <FormattedMessage id="dear_customer" />
            <br />
            <br />
            <FormattedMessage id="shalom" />
            <br />
            <FormattedMessage id="text_1" />
            <span styleName="email">{email}</span>
            <FormattedMessage id="text_2" />
          </div>
        </div>
      </div>
    </FullScreenPageView>
  );
};

export default MySettleOrder;
