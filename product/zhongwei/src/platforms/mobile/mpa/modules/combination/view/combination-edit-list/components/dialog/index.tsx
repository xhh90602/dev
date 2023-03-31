import React, { memo } from 'react';
import { useIntl } from 'react-intl';

import './index.scss';

const Dialog = memo((props: any) => {
  const {
    show = false,
    value,
    userSub = false,
    cancelClick = () => null,
    confirmClick = () => null,
    goSubscription = () => null,
  } = props;
  const { formatMessage } = useIntl();

  return show && (
    <div styleName="dialog">
      <div styleName="mask" />
      <div styleName="dialog-box">
        <div styleName="title">{formatMessage({ id: 'del_tip_text' }, { value })}</div>
        <div styleName="content">
          {formatMessage({ id: userSub ? 'del_confirm_text1' : 'del_confirm_text' })}
        </div>
        <div styleName="btn-box">
          <div styleName="cancel" onClick={() => cancelClick()}>{formatMessage({ id: 'cancelText' })}</div>
          {
            userSub ? (
              <div
                styleName="confirm"
                onClick={
                  () => goSubscription()
                }
              >
                {formatMessage({ id: 'go_to_subscription_center' })}
              </div>
            ) : (
              <div
                styleName="confirm"
                onClick={
                  () => confirmClick()
                }
              >
                {formatMessage({ id: 'confirmText' })}
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
});

export default Dialog;
