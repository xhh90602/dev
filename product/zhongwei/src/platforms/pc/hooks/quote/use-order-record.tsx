import { useEffect, useState } from 'react';
import { getOrderRecordList } from '@/api/module-api/quote';

export interface IMyQuote {
  isLoading: boolean,
  orderRecords: any[];
}

export default function useQuote(): IMyQuote {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orderRecords, setOrderRecords] = useState<any[]>([]);

  useEffect(() => {
    setIsLoading(true);

    getOrderRecordList().then((res) => {
      if (res?.code === 0) {
        setOrderRecords(res?.result);
      }
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  return {
    isLoading,
    orderRecords,
  };
}
