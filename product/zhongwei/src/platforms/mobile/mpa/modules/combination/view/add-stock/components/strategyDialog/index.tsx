import React, { memo, useState } from 'react';
import { useIntl } from 'react-intl';
import { Input } from 'antd-mobile';

import './index.scss';

const Dialog = memo((props: any) => {
  const {
    show = false,
    cancelClick = () => null,
    confirmClick = () => null,
  } = props;
  const [name, setName] = useState<string>('');
  const [nameWarning, setNameWarning] = useState<string>('');
  const { formatMessage } = useIntl();

  const change = (val) => {
    setName(val.trim());
  };

  const qrClick = () => {
    if (name && name.trim() && !nameWarning) {
      setNameWarning('');
      confirmClick(name);
    } else {
      setNameWarning(formatMessage({ id: 'input_strategy_name' }));
    }
  };

  return show && (
    <div styleName="dialog">
      <div styleName="mask" />
      <div styleName="dialog-box">
        <div styleName="title">{formatMessage({ id: 'input_strategy_name' })}</div>
        <div styleName="content">
          <div styleName="input-box">
            <Input
              placeholder={formatMessage({ id: 'max_ten_str' })}
              maxLength={10}
              onChange={(val) => change(val)}
              onEnterPress={() => qrClick()}
              onBlur={() => {
                if (name) {
                  setNameWarning('');
                } else {
                  setNameWarning(formatMessage({ id: 'input_strategy_name' }));
                }
              }}
            />
          </div>
          <div styleName="error-tip">{nameWarning}</div>
        </div>
        <div styleName="btn-box">
          <div styleName="cancel" onClick={() => cancelClick()}>{formatMessage({ id: 'cancelText' })}</div>
          <div
            styleName={name ? 'confirm active' : 'confirm'}
            onClick={
              () => qrClick()
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
