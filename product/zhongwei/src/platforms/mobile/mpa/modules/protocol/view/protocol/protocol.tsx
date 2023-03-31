import React, { useEffect, useState, useContext } from 'react';
import { userConfigContext } from '@/platforms/mobile/helpers/entry/native';
import { useSearchParam } from 'react-use';
import Protocol1 from './components/protocol1';
import Protocol2 from './components/protocol2';
import Protocol3 from './components/protocol3';
import Protocol4 from './components/protocol4';
import Protocol5 from './components/protocol5';
import Protocol6 from './components/protocol6';
import Protocol7 from './components/protocol7';
import Protocol8 from './components/protocol8';
import Protocol13 from './components/protocol13';

import './protocol.scss';

const AppHome: React.FC = () => {
  const type = Number(useSearchParam('type')) || 1;
  const userConfig = useContext<any>(userConfigContext);
  const [lang, setLang] = useState<string>('zh-CN');

  useEffect(() => {
    if (userConfig) {
      const { language } = userConfig;
      setLang(language || 'zh-CN');
    }
  }, [userConfig]);

  return (
    <div styleName="protocol">
      {/* 《薇盈智投订阅服务规则》 */}
      {
        type === 1 && (<Protocol1 lang={lang} />)
      }
      {/* 《排行榜服务规则》 */}
      {
        type === 2 && (<Protocol2 lang={lang} />)
      }
      {
        type === 3 && (<Protocol3 lang={lang} />)
      }
      {
        type === 4 && (<Protocol4 lang={lang} />)
      }
      {
        type === 5 && (<Protocol5 lang={lang} />)
      }
      {
        type === 6 && (<Protocol6 lang={lang} />)
      }
      {
        type === 7 && (<Protocol7 lang={lang} />)
      }
      {
        type === 8 && (<Protocol8 lang={lang} />)
      }
      {
        type === 13 && (<Protocol13 lang={lang} />)
      }
    </div>
  );
};

export default AppHome;
