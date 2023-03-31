import React, { memo } from 'react';
import { useIntl } from 'react-intl';

import './index.scss';

const Dialog = memo((props: any) => {
  const {
    show = false,
    cancelClick = () => null,
    confirmClick = () => null,
  } = props;
  const { formatMessage } = useIntl();

  return show && (
    <div styleName="dialog">
      <div styleName="mask" />
      <div styleName="dialog-box">
        <div styleName="content">
          {formatMessage({ id: 'are_you_sure_to_cancel_the_following' })}
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
