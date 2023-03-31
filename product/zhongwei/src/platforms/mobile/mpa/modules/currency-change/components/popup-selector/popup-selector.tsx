import { useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Popup } from 'antd-mobile';
import './popup-selector.scss';

const PopupSelector = (props) => {
  const { title, list, onConfirm, onReset = () => null, selected, visible, onClose } = props;

  const initActive = useRef(selected);
  const [active, setActive] = useState(selected);

  const resetActive = () => {
    setActive(initActive.current);
  };

  const onClickModal = () => {
    setActive(selected);
    onClose();
  };

  const boxRef = useRef(null);

  return (
    <div ref={boxRef} style={{ display: visible ? 'block' : 'none' }} styleName="popup-selector" onClick={onClickModal}>
      <Popup
        visible={visible}
        getContainer={boxRef.current}
        mask={false}
        position="top"
        style={{ position: 'absolute' }}
        bodyStyle={{ position: 'absolute' }}
      >
        <div
          styleName="popup-content"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div styleName="title">{title}</div>
          <div styleName="content">
            {list.map((item) => (
              <div
                styleName={`item ${active === item.key ? 'active' : ''}`}
                key={item.key}
                onClick={() => setActive(item.key)}
              >
                {item.label}
              </div>
            ))}
          </div>
          <div styleName="action">
            <div onClick={() => {
              resetActive();
              onReset();
            }}
            >
              <FormattedMessage id="reset" />
            </div>
            <div styleName="confirm" onClick={() => onConfirm(active)}>
              <FormattedMessage id="confirm" />
            </div>
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default PopupSelector;
