import * as React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd/es';

import './loading.scss';

const loadingIcon = <LoadingOutlined style={{ fontSize: '24px' }} spin />;

interface IProps {
  isLoading: boolean;
}

const Loading: React.FC<IProps> = (props: IProps = { isLoading: false }) => (
  props.isLoading
    ? (
      <div styleName="loading">
        <Spin indicator={loadingIcon} />
      </div>
    )
    : null
);

export default Loading;
