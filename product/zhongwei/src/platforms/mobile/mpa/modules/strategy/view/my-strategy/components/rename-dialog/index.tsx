import React, { memo, useState } from 'react';
import { useIntl } from 'react-intl';
import { Input, Toast } from 'antd-mobile';

import './index.scss';

const ReNameDialog = memo((props: any) => {
  const {
    show = false,
    cancelClick = () => null,
    confirmClick = () => null,
  } = props;
  const [name, setName] = useState<string>('');
  const { formatMessage } = useIntl();

  const qrClick = () => {
    if (!name || !name.trim() || (name.length < 2 && name.length > 16)) {
      Toast.show({
        content: `${formatMessage({ id: 'combination_name_length_tip' })}`,
      });
    } else {
      confirmClick(name);
    }
  };

  return show && (
    <div styleName="dialog">
      <div styleName="mask" />
      <div styleName="dialog-box">
        <div styleName="title">
          {formatMessage({ id: 'input_strategy_name' })}
        </div>
        <div styleName="content">
          <Input
            styleName="ipnut-k"
            maxLength={10}
            placeholder={formatMessage({ id: 'max_ten_str' })}
            onChange={(val) => setName(val)}
          />
        </div>
        <div styleName="btn-box">
          <div styleName="cancel" onClick={() => cancelClick()}>{formatMessage({ id: 'cancelText' })}</div>
          <div
            styleName="confirm"
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

export default ReNameDialog;
