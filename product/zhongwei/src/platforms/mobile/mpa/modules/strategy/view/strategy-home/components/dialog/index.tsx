import React, { memo, useState } from 'react';
import { useIntl } from 'react-intl';
import IconNotSelect from '@/platforms/mobile/images/icon_not_select.svg';
import IconSelect from '@/platforms/mobile/images/icon_select.svg';
import { nativeOpenPage } from '@/platforms/mobile/helpers/native/url';
import { Toast } from 'antd-mobile';

import './index.scss';

const Dialog = memo((props: any) => {
  const {
    show = false,
    value,
    cancelClick = () => null,
    confirmClick = () => null,
  } = props;
  const [select, setSelect] = useState(false);
  const { formatMessage } = useIntl();

  const qrClick = () => {
    if (select) {
      confirmClick();
    } else {
      Toast.show({ content: formatMessage({ id: 'please_select_text' }) });
    }
  };

  return show && (
    <div styleName="dialog">
      <div styleName="mask" />
      <div styleName="dialog-box">
        <div styleName="title">{formatMessage({ id: 'join_ranking_tip_title' }, { value })}</div>
        <div styleName="content">
          {formatMessage({ id: 'join_ranking_tip_text' })}
          <div styleName="ty-text" onClick={() => setSelect(!select)}>
            {
              select ? (
                <img styleName="icon" src={IconSelect} alt="" />
              ) : (
                <img styleName="icon" src={IconNotSelect} alt="" />
              )
            }
            <div styleName="text">
              {formatMessage({ id: 'agree_text' })}
              <span
                onClick={() => nativeOpenPage('protocol.html?type=2')}
              >
                {formatMessage({ id: 'ranking_rules' })}
              </span>
            </div>
          </div>
        </div>
        <div styleName="btn-box">
          <div styleName="cancel" onClick={() => cancelClick()}>{formatMessage({ id: 'cancelText' })}</div>
          <div styleName="confirm" onClick={() => qrClick()}>
            {formatMessage({ id: 'confirmText' })}
          </div>
        </div>
      </div>
    </div>
  );
});

export default Dialog;
