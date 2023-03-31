import { Modal } from 'antd-mobile';
import './modal.scss';

const ChangeRateModal = (props) => {
  const { visible, onClose } = props;

  return (
    <Modal
      visible={visible}
      content={(
        <div styleName="modal-container">
          <div styleName="modal-title">参考汇率</div>
          <div styleName="modal-content">此汇率为当前货币兑换汇率，仅供参考。外币兑换受外汇波动的影响，以实际兑换结果为准</div>
          <div styleName="modal-confirm-btn" onClick={onClose}>好的</div>
        </div>
      )}
    />
  );
};

export default ChangeRateModal;
