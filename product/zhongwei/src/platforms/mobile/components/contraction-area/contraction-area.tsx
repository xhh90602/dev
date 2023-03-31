import { useState } from 'react';
import IconSvg from '../icon-svg';

import './contraction-area.scss';

/**
 * @name ContractionArea 收缩区域组件
 *
 * @param defaultOpen 初始状态
 * @param background 是否有icon背景色
 *
 */
const ContractionArea = (props) => {
  const { children, className, defaultOpen = true, background = false } = props;

  const [open, setOpen] = useState<boolean>(defaultOpen);

  return (
    <div
      styleName={`area ${background ? 'bg' : ''}`}
      className={className}
      onClick={() => {
        setOpen(!open);
      }}
    >
      <div styleName={open ? '' : 'hidden'}>
        {children}
      </div>
      <div
        styleName="arrow"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        <span styleName={background ? 'bg-circle' : ''}>
          <IconSvg path={!open ? 'icon_arrow_open' : 'icon_arrow_close'} />
        </span>
      </div>
    </div>
  );
};

export default ContractionArea;
