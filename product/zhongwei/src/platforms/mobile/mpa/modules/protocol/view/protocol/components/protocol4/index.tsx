/* eslint-disable max-len */
import React, { memo } from 'react';
import './index.scss';

const Table = memo((props: any) => {
  const { lang } = props;
  //
  return (
    <div styleName="text">
      {
        lang === 'zh-CN' ? (
          <>
            《协议协议》 简体
          </>
        ) : (
          <>
            《協議協議》 繁体
          </>
        )
      }
    </div>
  );
});

export default Table;
