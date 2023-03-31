import React, { memo } from 'react';
import { useIntl } from 'react-intl';

import './index.scss';

const Dialog = memo((props: any) => {
  const {
    show = false,
    text = '',
    cancelClick = () => null,
    confirmClick = () => null,
  } = props;
  const { formatMessage } = useIntl();

  return show && (
    <div styleName="dialog">
      <div styleName="mask" />
      <div styleName="dialog-box">
        <div styleName="content">
          {text}
        </div>
        <div styleName="btn-box">
          <div styleName="cancel" onClick={() => cancelClick()}>{formatMessage({ id: 'cancelText' })}</div>
          <div
            styleName="confirm"
            onClick={
              () => confirmClick()
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
