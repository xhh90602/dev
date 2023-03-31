import React, { useState, useEffect } from 'react';
import './no-data.scss';

import noDataIcon from '../../images/icon_no_data.png';

const NoData: React.FC = () => {
  const a = 1;
  return (
    <div>
      <div styleName="no-data">
        <div styleName="no-data-item">
          <img src={noDataIcon} alt="" />
          <div>暂无数据</div>
        </div>
      </div>
    </div>
  );
};

export default NoData;
