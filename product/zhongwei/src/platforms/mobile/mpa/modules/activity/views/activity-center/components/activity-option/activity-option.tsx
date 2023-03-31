import React, { useState, useEffect } from 'react';
import './activity-option.scss';
import { useIntl } from 'react-intl';

const ActivityOption: React.FC<any> = (props) => {
  const { formatMessage } = useIntl();
  const { data } = props;
  const { time, theme, intro, botton, title, background, buttonBg } = data;
  return (
    <div styleName="activity">
      <div styleName="activity-top" style={background}>
        {/* <div>
          <p styleName="theme">{theme}</p>
          <p styleName="intro">{intro}</p>
        </div>
        <div styleName="botton" style={buttonBg}>
          {botton}
        </div> */}
      </div>
      <div styleName="activity-bottom">
        <div styleName="title">
          {title}
        </div>
        <div styleName="time">
          {`${formatMessage({ id: 'deadline_of_activity' })}：${time}`}
        </div>
      </div>
    </div>
  );
};

export default ActivityOption;
