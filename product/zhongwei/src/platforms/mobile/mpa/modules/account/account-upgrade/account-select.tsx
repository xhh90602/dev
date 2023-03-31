import './account-upgrade.scss';
import arrowRight from '@mobile/images/icon_zh_more.svg';
import finalIcon from '@mobile/images/account-upgrade/upgrade-final.svg';
import shszhkIcon from '@mobile/images/account-upgrade/upgrade-shszhk.svg';
import derivativeIcon from '@mobile/images/account-upgrade/upgrade-derivative.svg';
import BasicCard from '@/platforms/mobile/components/basic-card/basic-card';
import { useIntl } from 'react-intl';

interface IProps {
  setStep: (step: number) => void;
  setOpenKey: (key: string) => void;
}

const AccountSelect: React.FC<IProps> = ({ setStep, setOpenKey }) => {
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

  return (
    <>
      {openList
        .filter((item) => !item.hidden)
        .map((item) => (
          <BasicCard
            key={item.key}
            styleName="open-card"
            onClick={() => {
              setOpenKey(item.key);
              setStep(item.openStatus === 0 ? 2 : 5);
            }}
          >
            <div className="flex-c-between">
              <span className="num-font f-s-32 f-weight-500">{item.label}</span>
              <img styleName="arrow" src={arrowRight} alt="" />
            </div>
          </BasicCard>
        ))}
    </>
  );
};

export default AccountSelect;
