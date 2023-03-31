/* eslint-disable react/require-default-props */
/* eslint-disable import/no-dynamic-require */
import React from 'react';

interface IIconProp {
  path: string;
  className?: string;
  click?: any;
}

const IconSvg: React.FC<IIconProp> = (props) => {
  const { path, className = '', click = () => null } = props;

  let Icon;
  try {
    Icon = require(`@mobile/images/${path}_svg.svg`);
  } catch {
    Icon = require(`../images/${path}_svg.svg`);
  }

  return (
    <span
      className={`${path.replace(/_/g, '-')} icon-svg ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: Icon }}
      onClick={click}
    />
  );
};

export default IconSvg;
