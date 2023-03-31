import './roll-in-hint-modal.scss';
import { Modal } from 'antd-mobile';
import { FormattedMessage } from 'react-intl';
import { Data } from '@/hooks/stock-roll/use-stock-roll';
import { AccountInfo } from '../select-market/select-market';

const RollInHintModal = (props: { data: Data; visable: boolean; onClose: () => void }) => {
  const { data, visable, onClose } = props;

  return (
    <Modal
      styleName="roll-in-hint-modal"
      visible={visable}
      title={<FormattedMessage id="roll_in_hint_modal_title" />}
      onClose={onClose}
      disableBodyScroll={false}
      closeOnMaskClick
      destroyOnClose
      content={(
        <div>
          <div styleName="step-desc-box">
            <div styleName="step-avat">1</div>
            <div styleName="step-content">
              <div>
                <FormattedMessage id="roll_in_hint_modal_title_1" />
              </div>
              <div>
                <FormattedMessage id="roll_in_hint_modal_content_1" />
              </div>
            </div>
          </div>
          <div styleName="step-desc-box">
            <div styleName="step-avat">2</div>
            <div styleName="step-content">
              <div>
                <FormattedMessage id="roll_in_hint_modal_title_2" />
              </div>
              <div>
                <FormattedMessage id="roll_in_hint_modal_content_2" />
              </div>
            </div>
          </div>
          <div styleName="account-title">
            <FormattedMessage id="zw_accept_account_info" />
          </div>
          <AccountInfo data={data} />
          <div styleName="confirm-btn" onClick={onClose}>
            <FormattedMessage id="roll_in_hint_modal_confirm_btn_text" />
          </div>
        </div>
      )}
    />
  );
};

export default RollInHintModal;
