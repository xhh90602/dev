/**
 * 薇圈title组件
 * 2022-09-09
 */
import React from 'react';
import './title.scss';

interface IPorps{
  title: string,
}

const Title: React.FC<any> = (props: IPorps) => {
  const { title } = props;
  return (
    <div styleName="title">
      {title}
    </div>
  );
};

export default Title;
