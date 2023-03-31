import { DotLoading } from 'antd-mobile';
import './loading.scss';

interface ILoadingProps {
  isLoading: boolean;
  children?: any;
  bgColor?: string;
}

const Loading: React.FC<ILoadingProps> = (props) => {
  const { isLoading, children, bgColor = '#FFF' } = props;

  if (isLoading) {
    return (
      <div styleName="loading-box" style={{ '--loading-bg-color': bgColor }}>
        <DotLoading />
      </div>
    );
  }

  return <div styleName="loading-page">{children}</div>;
};

export default React.memo(Loading);
