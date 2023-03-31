/**
 * 没有更多组件
 * 2022-09-13
 */
import React from 'react';
import { useIntl } from 'react-intl';
import './no-more.scss';

const NoMore: React.FC<any> = () => {
  const { formatMessage } = useIntl();
  return (
    <div styleName="no-more">
      <div styleName="no-more-text ">
        ~
        {formatMessage({ id: 'nomore' })}
        ~
      </div>
    </div>
  );
};

export default NoMore;
