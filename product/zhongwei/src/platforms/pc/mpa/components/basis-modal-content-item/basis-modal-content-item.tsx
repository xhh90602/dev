import './basis-modal-content-item.scss';

interface ModalItemProps {
  leftContent: any; // 左侧内容
  rightContent: any; // 右侧内容
}

const BaseModalContentItem: React.FC<ModalItemProps> = (props) => {
  const { leftContent, rightContent } = props;

  return (
    <div styleName="modal-content-item">
      <div styleName="item-left">
        {leftContent}
      </div>
      <div styleName="right-left">
        {rightContent}
      </div>
    </div>
  );
};

export default BaseModalContentItem;
