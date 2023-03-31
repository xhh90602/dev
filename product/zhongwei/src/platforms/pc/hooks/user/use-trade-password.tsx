import { useEffect, useState } from 'react';
import { message } from 'antd';
import { getTradePwd } from '@/api/module-api/trade';
import { TradeLogin } from '@/platforms/pc/helpers/native/msg';

export default function useTradePassword() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [params, setParams] = useState({
    type: '',
    oldPassword: '',
    newPassword: '',
  });
  useEffect(() => {
    if (isLoading === false) return;
    setIsLoading(true);
    getTradePwd(params)
      .then((res) => {
        if (!res) return;
        if (res?.code === 0) {
          message.success('修改成功');
          return;
        }
        message.error(res.message);
      })
      .catch((e) => {
        console.log(e);
        // 登录失败，提示密码错误 ，可点击 忘记密码 ，调用openNativePage() 弹出原生框
      })
      .finally(() => {
        setIsLoading(false);
        // 跳转至登录页
        TradeLogin();
      });
  }, [params]);
  return {
    setParams,
    setIsLoading,
  };
}
