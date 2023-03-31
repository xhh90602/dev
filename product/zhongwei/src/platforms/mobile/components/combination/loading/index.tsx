import IconLoading from '@/platforms/mobile/images/loading.svg';
import { useIntl } from 'react-intl';
import './index.scss';

interface ILoadingProps {
  text?: string;
  children?: any;
}

const Loading: React.FC<ILoadingProps> = (props) => {
  const { formatMessage } = useIntl();
  const { text = formatMessage({ id: 'loading_text' }), children = null } = props;

  if (children) {
    return (
      <div styleName="loading-page">{children}</div>
    );
  }

  return (
    <div styleName="loading-box">
      <img src={IconLoading} alt="" />
      <div styleName="text">{text}</div>
    </div>
  );
};

export default React.memo(Loading);
