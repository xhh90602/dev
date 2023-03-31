import * as React from 'react';

import Loading from '../loader';
import './empty.scss';

interface IProps {
  isLoading?: boolean;
  isData?: boolean;
  children?: any,
  text?: React.ReactNode,
}

const Empty: React.FC<IProps> = (props = {}) => {
  const { isLoading = false, isData = false, children = null, text } = props;

  const isShowData = React.useMemo(() => !isLoading && isData, [isLoading, isData]);

  if (isLoading) return <Loading isLoading={isLoading} />;

  return (
    isShowData
      ? children : (
        <div styleName="empty">
          <p>{text}</p>
        </div>
      )
  );
};

Empty.defaultProps = {
  isLoading: false,
  isData: false,
  children: null,
  text: '暂无数据',
};

export default Empty;
