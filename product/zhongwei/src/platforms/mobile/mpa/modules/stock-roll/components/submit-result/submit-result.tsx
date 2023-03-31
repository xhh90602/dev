import { normalCall } from '@/platforms/mobile/helpers/native/msg';
import './submit-result.scss';
import successIcon from '@mobile/images/icon_success.svg';
import { FormattedMessage, useIntl } from 'react-intl';

const SubmitResult = (props: { setStep: (v) => void; resetData:() => void }) => {
  console.log('SubmitResult');
  const { setStep, resetData } = props;
  const { formatMessage } = useIntl();

  return (
    <div styleName="container">
      <img styleName="success-icon" src={successIcon} alt="" />
      <div styleName="submit-title">
        <FormattedMessage id="submit_success" />
      </div>
      <div styleName="desc">
        <FormattedMessage id="submit_result_content_1" />
        <br />
        <FormattedMessage id="submit_result_content_2" />
        <br />
        <FormattedMessage id="submit_result_content_3" />

      </div>
      <div
        styleName="btn"
        onClick={() => {
          setStep(0);
          resetData();
        }}
      >
        <FormattedMessage id="finish" />
      </div>
      <div styleName="hint">
        <FormattedMessage id="submit_result_hint" />
        <span onClick={() => {
          normalCall([{
            name: `${formatMessage({ id: 'tel_name_hk' })}`,
            tel: '+852 2213 1888',
          }]);
        }}
        >
          <FormattedMessage id="contact_service" />

        </span>
      </div>
    </div>
  );
};

export default SubmitResult;
