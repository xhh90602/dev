import { Modal } from 'antd-mobile';
import './basic-modal.scss';

interface IPorps {
  title?: string; // 标题
  visible: boolean; // 是否可见
  showCloseBtn?: boolean; // 是否在右上角显示关闭图标按钮
  closeOnMaskClick?: boolean; // 是否支持点击遮罩关闭弹窗
  cancelText?: string; // 取消按钮文字
  confirmText?: string; // 确认按钮文字
  onCancel?: (...args: any[]) => any; // 点击 取消按钮 回调
  onConfirm?: (...args: any[]) => any; // 点击 确认按钮 回调
  onClose?: (...args: any[]) => any; // 点击 x 或 mask 回调
}

const BasicModal: React.FC<IPorps> = (props) => {
  const {
    title,
    visible,
    showCloseBtn,
    closeOnMaskClick,
    cancelText,
    confirmText,
    children,
    onCancel,
    onConfirm,
    onClose,
  } = props;

  const actions: any[] = [];

  if (cancelText) {
    actions.push({
      key: 'cancel',
      className: 'modal-cancel-btn',
      text: cancelText,
      onClick: onCancel,
    });
  }

  if (confirmText) {
    actions.push({
      key: 'confirm',
      className: 'modal-confirm-btn',
      text: confirmText,
      onClick: onConfirm,
    });
  }

  return (
    <Modal
      styleName="basic-modal"
      title={title}
      visible={visible}
      showCloseButton={showCloseBtn}
      closeOnMaskClick={closeOnMaskClick}
      actions={actions}
      onClose={onClose}
      content={children}
    />
  );
};

BasicModal.defaultProps = {
  title: '',
  showCloseBtn: false,
  closeOnMaskClick: false,
  cancelText: '',
  confirmText: '',
  onCancel: () => undefined,
  onConfirm: () => undefined,
  onClose: () => undefined,
};

export default BasicModal;
