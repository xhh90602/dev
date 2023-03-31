import React, { memo } from 'react';
import { useIntl } from 'react-intl';

import './index.scss';

const DelDialog = memo((props: any) => {
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
        <div styleName="title">{formatMessage({ id: 'del_straegy_tip_title' })}</div>
        <div styleName="content">{formatMessage({ id: 'del_straegy_tip_text' })}</div>
        <div styleName="btn-box">
          <div styleName="cancel" onClick={() => cancelClick()}>{formatMessage({ id: 'cancelText' })}</div>
          <div styleName="confirm" onClick={() => confirmClick()}>
            {formatMessage({ id: 'confirmText' })}
          </div>
        </div>
      </div>
    </div>
  );
});

export default DelDialog;
