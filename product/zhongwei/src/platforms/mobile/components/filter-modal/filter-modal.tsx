import { Popup } from 'antd-mobile';
import { useRef } from 'react';
import useComponentsIntl from '../../hooks/components-i18n/useComponentsIntl';
import './filter-modal.scss';

const FilterModal = (props) => {
  const { formatMessage } = useComponentsIntl();

  const {
    visible,
    onOk,
    onReset,
    onClose,
    okText = formatMessage({ id: 'confirm' }),
    resetText = formatMessage({ id: 'reset' }),
    filterList = [],
    container = document.body,
  } = props;
  const boxRef = useRef(null);
  const boxRect = container?.getBoundingClientRect();

  return (
    <div
      ref={boxRef}
      styleName="filter-box"
      onClick={() => {
        onClose();
      }}
      style={{ display: visible ? 'block' : 'none', top: `${boxRect?.top}px` }}
    >
      <Popup
        visible={visible}
        getContainer={boxRef.current}
        mask={false}
        position="top"
        style={{ position: 'absolute' }}
        bodyStyle={{ position: 'absolute' }}
      >
        <div
          styleName="modal"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {filterList.map((filterItem: any) => (
            <div key={filterItem.key} styleName="check-content">
              <div className="desc-title">{filterItem.label}</div>
              <div styleName="check-box">
                {filterItem.list.map((item) => (
                  <div
                    styleName={`${filterItem.value === item.key ? 'active' : ''} check-icon`}
                    key={item.key}
                    onClick={() => {
                      filterItem.onChange(item);
                    }}
                  >
                    {item.label}
                    {/* {formatMessage({ id: item.label })} */}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div styleName="tool">
            <div
              styleName="cancel-btn"
              onClick={() => {
                onReset();
              }}
            >
              {resetText}
            </div>
            <div
              styleName="ok-btn"
              onClick={() => {
                onOk();
              }}
            >
              {okText}
            </div>
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default FilterModal;
