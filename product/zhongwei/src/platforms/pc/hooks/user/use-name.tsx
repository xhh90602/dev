import { useEffect, useState, useContext } from 'react';
import { message } from 'antd';
import { getUserTitle } from '@/api/module-api/pwd';
import { userInfoContext } from '@/platforms/pc/helpers/entry/native';
import { notifiedName } from '@pc/helpers/native/msg';

export default function useName() {
  const [isShow, setIsShow] = useState(false);
  const [nickname, setNickname] = useState('');
  const userInfo = useContext(userInfoContext);
  useEffect(() => {
    console.log(userInfo, '用户信息');
    if (!nickname) return;
    const data = {
      nickname,
    };

    getUserTitle(data).then((res:any) => {
      const { code, message: info }:{code?: number, message?: string} = res;
      if (code === 0) {
        setNickname('');
        setIsShow(false);
        message.success('修改成功');
        notifiedName();
      } else {
        setIsShow(false);
        message.error(info);
      }
    });
  }, [nickname, userInfo]);
  return {
    isShow,
    setIsShow,
    setNickname,
    userInfo,
  };
}
