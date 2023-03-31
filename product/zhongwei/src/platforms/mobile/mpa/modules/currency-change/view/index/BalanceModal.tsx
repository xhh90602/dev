import { Modal } from 'antd-mobile';
import './modal.scss';

const ChangeRateModal = (props) => {
  const { visible, onClose } = props;

  return (
    <Modal
      visible={visible}
      content={(
        <div styleName="modal-container">
          <div styleName="modal-title">账户现金余额</div>
          <div styleName="modal-content">现金余额是您当前账户的现金可提，支持可货币兑换。未交收结算的资金，暂不支持货币兑换。</div>
          <div styleName="modal-confirm-btn" onClick={onClose}>好的</div>
        </div>
      )}
    />
  );
};

export default ChangeRateModal;
