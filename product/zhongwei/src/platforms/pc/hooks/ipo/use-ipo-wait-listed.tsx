import { useContext, useEffect, useState } from 'react';
import { userConfigContext } from '@/platforms/pc/helpers/entry/native';
import { getWaitListedList } from '@/api/module-api/ipo';

export interface IUseIpo {
  isLoading: boolean,
  waitListedList: any[];
  isModalVisible: boolean;
  handleSwitchVisible: (...arg: any) => any;
}

export default function useIpoWaitListed(): IUseIpo {
  const { language } = useContext(userConfigContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [waitListedList, setWaitListedList] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const handleSwitchVisible = () => {
    setIsModalVisible(!isModalVisible);
  };

  useEffect(() => {
    setIsLoading(true);

    getWaitListedList({
      language,
    }).then((res) => {
      if (res?.code === 0) {
        setWaitListedList(res?.result);
      }
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  return {
    isLoading,
    waitListedList,
    isModalVisible,
    handleSwitchVisible,
  };
}
