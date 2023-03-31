import { useContext, useEffect, useState } from 'react';
import { userConfigContext } from '@/platforms/pc/helpers/entry/native';
import { getAlreadyListedList } from '@/api/module-api/ipo';

export interface IUseIpo {
  isLoading: boolean,
  alreadyListedList: any[];
}

export default function useIpoAlreadyListed(): IUseIpo {
  const { language } = useContext(userConfigContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alreadyListedList, setAlreadyListedList] = useState<any[]>([]);

  useEffect(() => {
    setIsLoading(true);

    getAlreadyListedList({
      language,
    }).then((res) => {
      if (res?.code === 0) {
        setAlreadyListedList(res?.result);
      }
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  return {
    isLoading,
    alreadyListedList,
  };
}
