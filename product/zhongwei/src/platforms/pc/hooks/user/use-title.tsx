// 获取用户信息
import { useEffect, useState } from 'react';
import { getUserTitle } from '@/api/module-api/pwd';

export interface IMyQuote {
  titleStatus: any;
}
export default function useTitle(title: string) {
  const [titleStatus, setTitleStatus] = useState({});
  useEffect(() => {
    getUserTitle({ title }).then((res) => {
      if (res) {
        setTitleStatus(res);
      }
    });
  }, [title]);
  return {
    titleStatus,
  };
}
