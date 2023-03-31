import React, { memo } from 'react';
import { goBack } from '@/platforms/mobile/helpers/native/msg';
import { useIntl } from 'react-intl';
import IconBack from '@/platforms/mobile/images/icon_back_black.svg';

import './index.scss';

const HeadTop: React.FC<any> = memo((props: any) => {
  const {
    title = '',
    headType = '',
    isData = false,
    backCallback = () => goBack(),
    completeCallback = () => null,
  } = props;
  const { formatMessage } = useIntl();

  // 返回
  const backClick = () => {
    backCallback();
  };

  // 完成
  const completeClick = () => {
    if (isData) {
      completeCallback();
    }
  };

  return (
    <div styleName="head-top">
      <div styleName="left" onClick={() => backClick()}>
        <img src={IconBack} alt="" />
      </div>
      <div styleName="title">{title}</div>
      <div styleName="right">
        {
          headType === 'add-stock' && (
            <div styleName={isData ? 'complete active' : 'complete'} onClick={() => completeClick()}>
              {formatMessage({ id: 'finish' })}
            </div>
          )
        }
      </div>
    </div>
  );
});

export default HeadTop;
