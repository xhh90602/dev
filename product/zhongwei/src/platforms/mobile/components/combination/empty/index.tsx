/* eslint-disable react/require-default-props */
/* eslint-disable import/no-duplicates */
import * as React from 'react';
import { useIntl } from 'react-intl';
import './index.scss';
import notImages from '@/platforms/mobile/images/not_data.png';
import notImages1 from '@/platforms/mobile/images/not_data_01.png';

const Empty: React.FC<any> = (props: any) => {
  const { formatMessage } = useIntl();
  const { text = formatMessage({ id: 'empty_text' }), type = 'combination' } = props;
  return (
    <div styleName="empty-box">
      <img src={type === 'combination' ? notImages : notImages1} alt="" />
      <div styleName="text">{text}</div>
    </div>
  );
};
export default Empty;
