import React, { memo, useState } from 'react';
import { useIntl } from 'react-intl';
import { Stepper } from 'antd-mobile';

import './index.scss';

const Dialog = memo((props: any) => {
  const {
    show = false,
    value,
    cancelClick = () => null,
    confirmClick = () => null,
  } = props;
  const [data, setData] = useState(0);
  const { formatMessage } = useIntl();

  return show && (
    <div styleName="dialog">
      <div styleName="mask" />
      <div styleName="dialog-box">
        <div styleName="title">{formatMessage({ id: 'adjustment_to' })}</div>
        <div styleName="content">
          <Stepper
            step={10000}
            defaultValue={value}
            min={0}
            max={100000000000}
            digits={0}
            onChange={(val) => {
              setData(val);
            }}
          />
        </div>
        <div styleName="btn-box">
          <div styleName="cancel" onClick={() => cancelClick()}>{formatMessage({ id: 'cancelText' })}</div>
          <div
            styleName="confirm"
            onClick={
              () => confirmClick(data)
            }
          >
            {formatMessage({ id: 'confirmText' })}
          </div>
        </div>
      </div>
    </div>
  );
});

export default Dialog;
