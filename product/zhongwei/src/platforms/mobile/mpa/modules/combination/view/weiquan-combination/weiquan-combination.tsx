/* eslint-disable consistent-return */
import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { getwqCombinationList } from '@/api/module-api/combination';
import { nativeOpenPage } from '@/platforms/mobile/helpers/native/url';
import IconCreate from '@/platforms/mobile/images/icon_create_btn1.svg';
import Empty from '@/platforms/mobile/components/combination/empty';
import Card from './components/card';

import './weiquan-combination.scss';

const AppHome: React.FC = () => {
  const [list, setList] = useState<any>([]);
  const { formatMessage } = useIntl();

  // 获取编辑信息
  const getwqCombination = () => {
    getwqCombinationList({
      type: 1,
    }).then((res: any) => {
      if (res && res.code === 0 && res?.result && res?.result.length) {
        setList(res?.result);
      } else {
        setList([]);
      }
    });
  };

  useEffect(() => {
    getwqCombination();
  }, []);

  return (
    <div styleName="weiquan-combination">
      {
        list && list.length ? list.map((item) => (
          <Card
            data={item}
            key={item.portfolioId}
          />
        )) : (
          <>
            <div styleName="empty-box"><Empty text={formatMessage({ id: 'not_combination' })} /></div>
            <div styleName="btn-box" onClick={() => nativeOpenPage('create-combination.html')}>
              <img src={IconCreate} alt="" />
              {formatMessage({ id: 'create_portfolio' })}
            </div>
          </>
        )
      }
    </div>
  );
};

export default AppHome;
