import { FormattedMessage, useIntl } from 'react-intl';
import { useEffect, useState } from 'react';
import copy from 'copy-to-clipboard';
import { Toast } from 'antd-mobile';
import BasicCard from '@/platforms/mobile/components/basic-card/basic-card';
import FullScreenPageView from '@/platforms/mobile/components/full-screen-page-view/full-screen-page-view';
import bg from '@mobile/images/account_number_bg.svg';
import { getTradeAccountInfo } from '@/api/module-api/trade';
import { TRADE_ACCOUNT_TYPE } from '@/constants/trade';
import './account-number.scss';

const AccountNumber: React.FC = () => {
  const { formatMessage } = useIntl();
  const [accountInfo, setAccountInfo] = useState({
    account: '',
    accountType: TRADE_ACCOUNT_TYPE.CASH,
  });

  const fetchAccount = async () => {
    const { code, result } = await getTradeAccountInfo();
    if (code === 0) {
      setAccountInfo(result);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  const copyAccount = (str: string) => {
    const success = copy(str);
    Toast.show({
      content: formatMessage({ id: success ? 'copy_success' : 'copy_fail' }),
    });
  };

  return (
    <FullScreenPageView title={formatMessage({ id: 'account_number' })}>
      <div styleName="container">
        <img styleName="bg-img" src={bg} alt="" />
        <BasicCard>
          <div className="flex-c-between">
            <span className="f-s-30 color-assist">
              <FormattedMessage id="account_type" />
            </span>
            <span className="f-s-34 f-bold">
              <FormattedMessage id={accountInfo.accountType === TRADE_ACCOUNT_TYPE.CASH ? 'cash' : 'final'} />
            </span>
          </div>
        </BasicCard>
        <BasicCard>
          <div className="flex-c-between">
            <span className="f-s-30 color-assist">
              <FormattedMessage id="account_number" />
            </span>
            <span>
              <span styleName="copy-btn" className="m-l-20" onClick={() => copyAccount(accountInfo.account)}>
                <FormattedMessage id="copy" />
              </span>
              <span className="f-s-34 f-bold">
                {accountInfo.account}
              </span>
            </span>
          </div>
        </BasicCard>
      </div>
    </FullScreenPageView>
  );
};

export default AccountNumber;
