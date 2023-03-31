import { useEffect, useState } from 'react';
import { getQuoteList } from '@/api/module-api/quote';

export interface IMyQuote {
  isLoading: boolean,
  quoteList: any[];
}

export default function useQuote(): IMyQuote {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [quoteList, setQuoteList] = useState<any[]>([]);

  useEffect(() => {
    setIsLoading(true);

    getQuoteList().then((res) => {
      if (res?.code === 0) {
        setQuoteList(res?.result);
      }
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  return {
    isLoading,
    quoteList,
  };
}
