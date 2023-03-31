import React, { ReactElement } from 'react';
import IconSvg from '@/platforms/mobile/components/icon-svg';
import { pageBack } from '@/platforms/mobile/helpers/native/msg';
import './nav-bar.scss';

export interface IProps {
  title: ReactElement |string;
  back?: boolean;
  right?: ReactElement | string;
  onBack?: () => void
}

const NavBar: React.FC<IProps> = (props) => {
  const { title, back = true, right = '', onBack } = props;

  return (
    <div styleName="nav-bar">
      <span styleName="back">
        {back && (
          <span onClick={() => (onBack ? onBack() : pageBack())}>
            <IconSvg path="icon_back" />
          </span>
        )}
      </span>
      <span styleName="title">{title}</span>
      <span styleName="right">{right}</span>
    </div>
  );
};

NavBar.defaultProps = {
  back: true,
  right: undefined,
  onBack: undefined,
};

export default NavBar;
