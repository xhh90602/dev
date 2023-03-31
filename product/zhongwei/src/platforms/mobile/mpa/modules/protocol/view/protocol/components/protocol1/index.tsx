/* eslint-disable max-len */
import React, { memo } from 'react';
import './index.scss';

const Table = memo((props: any) => {
  const { lang } = props;
  // 《排行榜服务规则》
  return (
    <div styleName="text">
      {
        lang === 'zh-CN' ? (
          <>
            《排行榜服务规则》 简体
          </>
        ) : (
          <>
            《排行榜服务规则》 繁体
          </>
        )
      }
    </div>
  );
});

export default Table;
