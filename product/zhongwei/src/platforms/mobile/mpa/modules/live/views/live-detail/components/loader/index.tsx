/**
 * 正在加载中
 */
import * as React from 'react';
import './index.scss';

import loadingImage from './loading.gif';

interface IProps {
  isLoading: boolean;
}

const Loading: React.FC<IProps> = (props: IProps = { isLoading: false }) => (
  props.isLoading
    ? (
      <div styleName="loading">
        <img src={loadingImage} alt="正在加载中..." />
      </div>
    )
    : null
);

export default Loading;
