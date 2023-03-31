/* eslint-disable react/require-default-props */
/* eslint-disable import/no-duplicates */
import * as React from 'react';
import cs from 'classnames';
import './index.scss';

interface IProps {
  left: any;
  right: any;
  leftName?: string;
  rightName?: string;
  className?: string;
}

const SpaceBetween: React.FC<IProps> = (props) => {
  const { left, right, className = '', leftName: leftClassName = '', rightName: rightClassName = '' } = props;
  return (
    <div className={cs('space-between', className)}>
      <div className={cs('left', leftClassName)}>{left}</div>
      <div className={cs('right', rightClassName)}>{right}</div>
    </div>
  );
};
export default SpaceBetween;
