/* eslint-disable consistent-return */
/* eslint-disable max-len */
import React, { memo, useState } from 'react';
import { useIntl } from 'react-intl';
import { Input, Toast } from 'antd-mobile';

import './index.scss';

const Dialog = memo((props: any) => {
  const {
    show = false,
    czType = 'copy',
    cancelClick = () => null,
    confirmClick = () => null,
  } = props;
  const { formatMessage } = useIntl();
  const [data, setData] = useState<any>(null);

  const title = {
    copy: formatMessage({ id: 'copy_combination' }),
    shipanxiadan: formatMessage({ id: 'firm_order' }),
  };

  const change = (val, field) => {
    setData({ ...data, [field]: val });
  };

  const qrClick = () => {
    const { name, initCapitalScale } = data;
    if (!name) {
      Toast.show({ content: `${formatMessage({ id: 'please_enter' })}${formatMessage({ id: 'combination_name' })}` });
      return;
    }
    const nameReg = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/;
    if (!(nameReg.test(name))) {
      Toast.show({ content: `${formatMessage({ id: 'name_warning_text2' })}` });
      return;
    }
    if (czType === 'shipanxiadan') {
      if (!Number(initCapitalScale)) {
        Toast.show({ content: `${formatMessage({ id: 'name_warning_text2' })}` });
        return;
      }
      if (!initCapitalScale || initCapitalScale <= 0) {
        Toast.show({ content: `${formatMessage({ id: 'please_enter' })}${formatMessage({ id: 'init_amoun' })}` });
        return;
      }
    }
    confirmClick(data);
  };

  const qxClick = () => {
    cancelClick();
  };

  return show && (
    <div styleName="dialog">
      <div styleName="mask" />
      <div styleName="dialog-box">
        <div styleName="title">{title[czType]}</div>
        {
          czType === 'copy' && (
            <div styleName="content">
              <div styleName="input-box">
                <Input
                  placeholder={formatMessage({ id: 'combination_name_length_tip' })}
                  maxLength={16}
                  onChange={(val) => change(val, 'name')}
                  onEnterPress={() => qrClick()}
                />
              </div>
            </div>
          )
        }
        {
          czType === 'shipanxiadan' && (
            <div styleName="content">
              <div styleName="input-box">
                <Input
                  placeholder={formatMessage({ id: 'combination_name_length_tip' })}
                  maxLength={16}
                  onChange={(val) => change(val, 'name')}
                  onEnterPress={() => qrClick()}
                />
              </div>
              <div styleName="input-box">
                <Input
                  placeholder={formatMessage({ id: 'set_init_amount' })}
                  type="number"
                  min={0}
                  max={100000000000}
                  onChange={(val) => change(val, 'initCapitalScale')}
                  onEnterPress={() => qrClick()}
                />
              </div>
            </div>
          )
        }
        <div styleName="btn-box">
          <div styleName="cancel" onClick={() => qxClick()}>{formatMessage({ id: 'cancelText' })}</div>
          <div styleName="confirm" onClick={() => qrClick()}>
            {formatMessage({ id: 'confirmText' })}
          </div>
        </div>
      </div>
    </div>
  );
});

export default Dialog;
