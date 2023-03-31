/* eslint-disable react/require-default-props */
import inobounce from 'inobounce';
import NavBar, { IProps as NavIProps } from '@mobile/components/nav-bar/nav-bar';
import { getUrlParam } from '@/utils';
import './full-screen-page-view.scss';
import { useEffect, useMemo, forwardRef, ReactNode, CSSProperties } from 'react';

interface IProps extends NavIProps {
  backgroundColor?: string;
  backgroundImg?: string;
  fixedBottom?: boolean;
  style?: CSSProperties;
  children: ReactNode;
  className?: string;
}

const FullScreenPageView = forwardRef<HTMLDivElement, Partial<IProps>>((props, ref) => {
  const {
    children,
    title = '',
    back = true,
    right = '',
    onBack,
    backgroundColor = '',
    backgroundImg = '',
    fixedBottom = false,
    style = {},
    className = '',
  } = props;
  const { safeAreaTop = 0, safeAreaBottom = 0 } = getUrlParam();

  useEffect(() => {
    document.documentElement.style.setProperty('--safe-area-top', `${safeAreaTop}px`);
  }, [safeAreaTop]);

  useEffect(() => {
    document.documentElement.style.setProperty('--safe-area-bottom', `${safeAreaBottom}px`);
  }, [safeAreaBottom]);

  useEffect(() => {
    // 禁用ios回弹效果
    const u = navigator.userAgent;
    if (u.indexOf('iPhone') > -1) {
      inobounce.enable();
    }
    return () => {
      if (inobounce.disabled) inobounce.disabled();
    };
  }, []);

  const styleName = useMemo(() => {
    let str = 'container';
    if (backgroundColor) str += ' background-color';
    if (backgroundImg) str += ' background-img';
    if (fixedBottom) str += ' fixed-safe-arae-bottom';
    return str;
  }, [backgroundColor, backgroundImg, fixedBottom]);

  return (
    <div
      className={className}
      styleName={styleName}
      style={{
        '--background-color': backgroundColor,
        '--background-img': `url(${backgroundImg})`,
        ...(style as Record<string, any>),
      }}
    >
      <NavBar title={title} back={back} right={right} onBack={onBack} />

      <div styleName="content" ref={ref}>
        {children}
      </div>
    </div>
  );
});

export default FullScreenPageView;
