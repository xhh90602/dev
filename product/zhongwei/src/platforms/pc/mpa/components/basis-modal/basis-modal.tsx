import { Modal } from 'antd';
import './basis-modal.scss';

interface ModalProps {
  isVisible: boolean; // 是否展示弹窗
  title: string; // 标题
  width?: string | number; // 宽度
  okText?: string; // 确认按钮文字
  cancelText?: string; // 取消按钮文字
  confirmLoading?: boolean; // 确定按钮 loading
  centered?: boolean; // 垂直居中展示 Modal
  maskClosable?: boolean; // 点击蒙层是否允许关闭
  closable?: boolean; // 是否显示右上角的关闭按钮
  footer?: any; // 底部内容，当不需要默认底部按钮时，可以设为 footer={null | []}
  children: any; // 子元素
  handleOk: (...ary: any) => any; // 点击确定回调
  handleCancel: (...ary: any) => any; // 点击遮罩层或右上角叉或取消按钮的回调
}

const BaseModal: React.FC<ModalProps> = (props) => {
  const {
    isVisible = false,
    title,
    width = 500,
    okText = '确认',
    cancelText = '取消',
    confirmLoading = false,
    centered = true,
    maskClosable = false,
    closable = true,
    footer,
    children,
    handleOk,
    handleCancel,
  } = props;

  return (
    <Modal
      title={title}
      visible={isVisible}
      width={width}
      okText={okText}
      cancelText={cancelText}
      confirmLoading={confirmLoading}
      centered={centered}
      maskClosable={maskClosable}
      closable={closable}
      onOk={handleOk}
      onCancel={handleCancel}
      className="base-modal"
      footer={footer}
    >
      {children}
    </Modal>
  );
};

export default BaseModal;
