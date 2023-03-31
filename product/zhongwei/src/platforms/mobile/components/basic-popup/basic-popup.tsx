import { Popup } from 'antd-mobile';
import './basic-popup.scss';

interface IPorps {
  visible: boolean; // 是否可见
  position?: 'bottom' | 'top' | 'left' | 'right'; // 指定弹出的位置
  showCloseBtn?: boolean; // 是否在右上角显示关闭图标按钮
  closeOnMaskClick?: boolean; // 是否支持点击遮罩关闭弹窗
  onClose?: (...args: any[]) => any; // 点击 x 或 mask 回调
}

const BasicPopup: React.FC<IPorps> = (props) => {
  const { visible, position, showCloseBtn, closeOnMaskClick, children, onClose } = props;

  return (
    <Popup
      styleName="basic-popup"
      visible={visible}
      position={position}
      showCloseButton={showCloseBtn}
      closeOnMaskClick={closeOnMaskClick}
      onClose={onClose}
    >
      {children}
    </Popup>
  );
};

BasicPopup.defaultProps = {
  position: 'bottom',
  showCloseBtn: false,
  closeOnMaskClick: false,
  onClose: () => undefined,
};

export default BasicPopup;
