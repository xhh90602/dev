import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import './index.scss';

const DelDialog: React.FC<any> = (props) => {
  const {
    cancelClick,
    confirmClick,
  } = props;
  const { formatMessage } = useIntl();

  return (
    <div styleName="dialog">
      <div styleName="mask" />
      <div styleName="dialog-box">
        <div styleName="title">提示</div>
        {/* <div styleName="content">{formatMessage({ id: 'del_tip_text' })}</div> */}
        <div styleName="main">您未登录交易，请登录交易账号！</div>
        <div styleName="btn-box">
          <div styleName="cancel" onClick={() => cancelClick()}>取消</div>
          <div styleName="confirm" onClick={() => confirmClick()}>
            交易登录
          </div>
        </div>
      </div>
    </div>
  );
};

export default DelDialog;
