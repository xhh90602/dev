import { useEffect, useState, useContext } from 'react';
import { getMsgTab } from '@/api/module-api/msg';
import { userConfigContext } from '@/platforms/pc/helpers/entry/native';

export interface ITabs {
  unReadNum?: number;
  msgType: number;
  msgTypeName: string;
  title?: string;
  content?: string;
}

export default function useMsgType(): Array<ITabs> {
  const { language } = useContext(userConfigContext);
  const [tabList, setTabList] = useState<Array<ITabs>>([]);
  useEffect(() => {
    getMsgTab(language).then((res) => {
      if (res?.code === 0) {
        setTabList(res?.result);
      }
    });
  }, []);
  return tabList;
}
