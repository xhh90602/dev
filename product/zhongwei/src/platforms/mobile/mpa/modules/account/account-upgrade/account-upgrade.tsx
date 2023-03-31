import './account-upgrade.scss';
import bg from '@mobile/images/trade_account_bg.svg';
import finalIcon from '@mobile/images/account-upgrade/upgrade-final.svg';
import shszhkIcon from '@mobile/images/account-upgrade/upgrade-shszhk.svg';
import derivativeIcon from '@mobile/images/account-upgrade/upgrade-derivative.svg';
import FullScreenPageView from '@/platforms/mobile/components/full-screen-page-view/full-screen-page-view';
import { useIntl, FormattedMessage } from 'react-intl';
import { useMemo, useRef, useState } from 'react';
import { pageBack } from '@/platforms/mobile/helpers/native/msg';
import { Toast } from 'antd-mobile';
import CanvasDraw, { IRef } from '@mobile/components/canvans-draw/canvans-draw';
import { getObjArrAttribute } from '@/utils';
import AccountSelect from './account-select';
import AccountOpen from './account-open';
import OpenProgress from './open-progress';

const AccountUpgrade: React.FC<any> = () => {
  const { formatMessage } = useIntl();

  const openList = [
    {
      key: 'final',
      label: formatMessage({ id: 'open_financing_account' }),
      hidden: false,
      openStatus: 0,
      isAgreement: true,
      icon: finalIcon,
    },
    {
      key: 'shszhk',
      label: formatMessage({ id: 'open_sh_sz_hk' }),
      openStatus: 2,
      hidden: false,
      isAgreement: true,
      icon: shszhkIcon,
    },
    {
      key: 'derivative',
      label: formatMessage({ id: 'open_derivatives_products' }),
      openStatus: 0,
      hidden: false,
      isAgreement: false,
      icon: derivativeIcon,
    },
  ];

  const [step, setStep] = useState(1);
  const [openKey, setOpenKey] = useState('');

  const title = useMemo(() => {
    if (step === 1) return formatMessage({ id: 'account_upgrade' });
    const openLabel = getObjArrAttribute(openList, 'key', openKey, 'label', '');
    if (step === 3) return openLabel + formatMessage({ id: 'agreement' });
    if (step === 5) return openLabel;
    return '';
  }, [step, openKey]);
  const navBack = () => {
    if (step > 0) {
      setStep(step - 1);
      return;
    }
    pageBack();
  };

  const drawDom = useRef<IRef>(null);

  const submit = () => {
    if (openKey === 'derivative') {
      Toast.show({
        content: formatMessage({ id: 'knowledge_of_derivatives_is_certified' }),
      });
      setStep(1);
      return;
    }
    console.log(drawDom.current?.getPNGImage());
    setStep(step + 1);
  };

  return (
    <FullScreenPageView title={title} backgroundImg={step === 2 && bg} onBack={navBack}>
      <div styleName="account-upgrade">
        {step === 1 && <AccountSelect {...{ setStep, setOpenKey }} />}

        {step === 2 && <AccountOpen {...{ openKey, setStep, openList }} />}

        {step === 3 && (
          <>
            <div styleName="open-view" />
            <div
              styleName="footer-btn"
              onClick={() => {
                setStep(step + 1);
              }}
            >
              <FormattedMessage id="i_have_read_and_agree_to_the_agreement" />
            </div>
          </>
        )}

        {step === 4 && (
          <div styleName="horizontal-view">
            <div className="flex-1">
              <CanvasDraw ref={drawDom} placeholder={formatMessage({ id: 'canvas_placeholder' })} />
            </div>
            <div className="flex-c-c">
              <div styleName="footer-btn reset-btn" onClick={() => drawDom.current?.resetDraw()}>
                <FormattedMessage id="rewrite" />
              </div>
              <div styleName="footer-btn confirm-btn" onClick={submit}>
                <FormattedMessage id="finish" />
              </div>
            </div>
          </div>
        )}

        {step === 5 && <OpenProgress {...{ openKey, setStep, openList }} />}
      </div>
    </FullScreenPageView>
  );
};

export default AccountUpgrade;
