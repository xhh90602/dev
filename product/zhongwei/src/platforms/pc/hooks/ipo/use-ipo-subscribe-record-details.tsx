import { useEffect, useState } from 'react';
import { useInRouterContext } from 'react-router-dom';
import { getSubscribeRecordDetails } from '@/api/module-api/ipo';
import { handleNavigate } from '@/utils/navigate';

export interface IUseIpo {
  recordDetails: Record<string, any>;
  handleStatement: (...arg: any[]) => any;

}

export default function useIpoSubscribeRecordDetails({ orderId }): IUseIpo {
  const [recordDetails, setRecordDetails] = useState<Record<string, any>>({});

  const isRouterContext = useInRouterContext();
  const handleStatement = () => {
    let path = '/subscribe-statement.html';

    if (isRouterContext) {
      path = '/trade.html#/subscribe-statement';
    }

    handleNavigate(path);
  };

  useEffect(() => {
    if (orderId) {
      getSubscribeRecordDetails({ orderId }).then((res) => {
        if (res?.code === 0) {
          setRecordDetails(res?.result);
        }
      });
    }
  }, []);

  return {
    recordDetails,
    handleStatement,
  };
}
