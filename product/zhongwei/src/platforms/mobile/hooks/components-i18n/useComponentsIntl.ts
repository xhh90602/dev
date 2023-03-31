import { userConfigContext } from '@/platforms/mobile/helpers/entry/native';
import { useContext, useMemo } from 'react';
import { createIntl, IntlContext } from 'react-intl';
import zhCN from './lang/zh-hans';
import zhTW from './lang/zh-hant';

const messageDict = {
  'zh-CN': zhCN,
  'zh-TW': zhTW,
};

const useComponentsIntl = () => {
  const { language } = useContext<any>(userConfigContext);

  const intl = useMemo(() => createIntl({
    locale: language,
    messages: messageDict[language],
  }), [language]);

  return intl;
};

export default useComponentsIntl;
