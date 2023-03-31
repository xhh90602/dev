import { ArrowLeftOutlined } from '@ant-design/icons';
import './header.scss';

const Header = ({ leftContent, rightContent }: Record<string, React.ReactNode>) => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div styleName="header">
      <div styleName="header-left">{leftContent || <ArrowLeftOutlined onClick={handleBack} />}</div>
      <div styleName="header-right">{rightContent}</div>
    </div>
  );
};

export default Header;
