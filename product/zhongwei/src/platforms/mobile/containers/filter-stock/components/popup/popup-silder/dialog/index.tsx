import React, { useState, useEffect } from 'react';
import { Popup, Stepper } from 'antd-mobile';
import { CloseOutline } from 'antd-mobile-icons';
import './index.scss';

const DialogPopup: React.FC<any> = (props: any) => {
  const {
    visible = false,
    title = '',
    defaRange = {},
    range = {},
    type = '',
    onClick = () => null,
  } = props;

  const [data, setData] = useState<any>({ min: 0, max: 0 });
  const [errorText, setErrorText] = useState<string>('');

  const confirmClick = () => {
    setTimeout(() => {
      if (!errorText) {
        const { min = 0, max } = data;
        onClick('confirm', { min, max });
      }
    }, 10);
  };

  useEffect(() => {
    if (range) {
      const { min, max } = range;
      setData({ min, max });
    }
  }, [range]);

  return (
    <Popup
      visible={visible}
      onMaskClick={() => onClick('cancel')}
    >
      <div styleName="custom-content">
        <div styleName="header">
          <div styleName="title">{title || ''}</div>
          <div styleName="close">
            <CloseOutline fontSize={18} color="#717686" onClick={() => onClick('cancel')} />
          </div>
        </div>
        <div styleName="content-box">
          <div styleName="text">自定义</div>
          <div styleName="stepper-box">
            <Stepper
              disabled={type === 'alone'}
              value={data?.min || 0}
              min={defaRange?.min}
              max={defaRange?.max || 100}
              step={1}
              digits={0}
              onChange={(val) => {
                setData({ ...data, min: val });
              }}
              onBlur={() => {
                const { min, max } = data;
                if (min && max && min !== 0 && max !== 0 && min > max) {
                  setErrorText('最小值不能大于最大值');
                } else {
                  setErrorText('');
                }
              }}
            />
          </div>
          <div styleName="text">至</div>
          <div styleName="stepper-box">
            <Stepper
              value={data?.max || 0}
              min={defaRange?.min || 0}
              max={defaRange?.max || 100}
              step={1}
              digits={0}
              onChange={(val) => {
                setData({ ...data, max: val });
              }}
              onBlur={() => {
                const { min, max } = data;
                if (min && max && min !== 0 && max !== 0 && min > max) {
                  setErrorText('最小值不能大于最大值');
                } else {
                  setErrorText('');
                }
              }}
            />
          </div>
        </div>
        <div styleName="errorText">{errorText}</div>
        <div styleName="confirm-text">
          <div styleName="btn" onClick={() => confirmClick()}>确定</div>
        </div>
      </div>
    </Popup>
  );
};
export default DialogPopup;
