/* eslint-disable react/require-default-props */
import { useEffect, useState } from 'react';
import IconSvg from '../icon-svg';
import './trade-tip.scss';

interface ITip {
  openTip: boolean;
  tip: string | JSX.Element;
  className?: string;
  close?: boolean;
  onClose?: (v: boolean) => void;
  onClick?: (...args: any[]) => any;
}

const TradeTip = (props: ITip) => {
  const { openTip, tip, close = true, className = '', onClose, onClick } = props;

  const [open, setOpen] = useState(true);

  useEffect(() => {
    setOpen(openTip);
  }, [openTip]);

  if (!open) return null;

  return (
    <div styleName="trade-tip" className={className} onClick={onClick}>
      <div styleName="content">{tip}</div>

      {close && (
        <div
          styleName="icon"
          onClick={(e) => {
            e.stopPropagation();

            if (onClose) {
              onClose(!open);
            }

            setOpen(false);
          }}
        >
          <IconSvg path="icon_close" />
        </div>
      )}
    </div>
  );
};

export default TradeTip;
