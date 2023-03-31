import React from 'react';
import v from '@mobile/images/icon_analyse.png';
import defaultAvatar from '@mobile/images/default_avatar.png';
import './live-avatar.scss';

interface IProps {
  url: string;
}

const LiveAvatar: React.FC<IProps> = (props) => {
  const { url } = props;
  return (
    <div
      styleName="analyse-wrap"
    >
      <img styleName="avatar" src={url || defaultAvatar} alt="" />
      <img src={v} alt="v" styleName="v" />
    </div>
  );
};

export default LiveAvatar;
