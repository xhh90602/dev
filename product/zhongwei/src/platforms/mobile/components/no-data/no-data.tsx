import * as React from 'react';
import whiteImg from './images/nodata-w.svg';
import blackImg from './images/nodata-b.svg';
import './no-data.scss';

interface IProps {
  text: string,
  theme?: string
  width?: string
  height?: string
}

const imgObj = { blackImg, whiteImg };

const NoData: React.FC<IProps> = ({ text, theme, width, height }) => (
  <div styleName="no-wrap">
    {
      theme && (
      <div styleName="img-box" style={{ width, height }}>
        <img src={imgObj[`${theme}Img`]} alt="" />
      </div>
      )
    }
    <div styleName="tip">{text}</div>
  </div>
);

NoData.defaultProps = {
  theme: '',
  width: '2rem',
  height: '2rem',
};

export default NoData;
