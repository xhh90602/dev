import './account-upgrade.scss';
import checkedIcon from '@mobile/images/icon_circle_checked.svg';
import notcheckedIcon from '@mobile/images/icon_circle_not_checked.svg';
import undoneIcon from '@mobile/images/icon_undone.svg';
import iconSuccess from '@mobile/images/icon_success.svg';
import iconAudit from '@mobile/images/icon_audit.svg';
import BasicCard from '@/platforms/mobile/components/basic-card/basic-card';
import { FormattedMessage } from 'react-intl';
import { useMemo } from 'react';
import { getObjArrAttribute } from '@/utils';

interface IProps {
  openList: any[];
  openKey: string;
  setStep: (step: number) => void;
}

const OpenProgress: React.FC<IProps> = ({ openList, openKey, setStep }) => {
  const openStatus = useMemo(() => getObjArrAttribute(openList, 'key', openKey, 'openStatus'), [openList, openKey]);

  return (
    <>
      <div className="flex-l-c flex-column flex-1">
        <img styleName="success-icon" src={openStatus ? iconSuccess : iconAudit} alt="" />
        <span className="f-s-40 f-bold m-y-40">
          <FormattedMessage id={openStatus ? 'open_finish' : 'under_review'} />
        </span>
        <div styleName="open-step-content">
          <BasicCard className="flex-l-t" styleName="active">
            <img src={checkedIcon} alt="" srcSet="" />
            <div className="f-s-34 f-bold p-t-5">
              <FormattedMessage id="open_application_ubmit" />
            </div>
          </BasicCard>
          <BasicCard className="flex-l-t">
            {openStatus === 2 && <img src={undoneIcon} alt="" srcSet="" />}
            {openStatus < 2 && <img src={notcheckedIcon} alt="" srcSet="" />}
            {openStatus > 2 && <img src={checkedIcon} alt="" srcSet="" />}
            <div className="p-t-5">
              <div className="f-s-34 f-bold">
                <FormattedMessage id="review_of_opening_materials" />
              </div>
              {openStatus <= 2 && (
                <div className="color-desc p-t-15">
                  <FormattedMessage id="under_review_text" />
                </div>
              )}
              {openStatus === 4 && (
                <div className="color-full p-t-15">
                  <FormattedMessage id="failed_to_pass_the_audit" />
                </div>
              )}
              {openStatus === 3 && (
                <div className="color-desc p-t-15">
                  <FormattedMessage id="pass_the_audit" />
                </div>
              )}
            </div>
          </BasicCard>
          <BasicCard className="flex-l-t" styleName={openStatus === 3 ? 'active' : ''}>
            <img src={openStatus === 3 ? checkedIcon : notcheckedIcon} alt="" srcSet="" />
            <div className="f-s-34 f-bold p-t-5">
              <FormattedMessage id="open_finish" />
            </div>
          </BasicCard>
        </div>
      </div>
      <div
        styleName="footer-btn"
        onClick={() => {
          setStep(1);
        }}
      >
        <FormattedMessage id="finish" />
      </div>
    </>
  );
};

export default OpenProgress;
