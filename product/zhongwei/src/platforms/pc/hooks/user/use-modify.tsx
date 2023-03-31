import { useState } from 'react';
import { getSmsCode, getUserPwd } from '@/api/module-api/pwd';
import { message } from 'antd';
import { queryLoginDialog } from '@pc/helpers/native/msg';

export interface Idata {
  areaCode?: string;
  channelType?: string;
  mobile?: string;
  orgCode?: string;
  type?: string;
}

export default function useModify(form) {
  const [time, setTime] = useState(60);
  const [isShowTime, setIsShowTime] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // 获取验证码
  function getCode(data) {
    // 倒计时
    if (isShowTime) {
      // 倒计时未结束,不能重复点击
      return;
    }
    const query = {
      areaCode: data.areaCode,
      channelType: 'PC',
      mobile: data.mobile,
      orgCode: data.orgCode,
      type: 'MODIFY_PWD',
    };
    const active = setInterval(() => {
      setTime((preSecond) => {
        if (preSecond <= 1) {
          setIsShowTime(false);
          clearInterval(active);
          // 重置秒数
          return 60;
        }
        return preSecond - 1;
      });
    }, 1000);

    getSmsCode(query)
      .then((res) => {
        if (res?.code === 0) {
          message.success(res.message);
          return;
        }
        message.error('获取验证码失败，请重新获取');
        clearInterval(active);
        setIsShowTime(false);
      }).catch((err) => {
        message.error(err.message);
      });
  }

  function onSubmit(data) {
    if (isLoading === false) return;
    setIsLoading(false);
    getUserPwd(data)
      .then((res) => {
        console.log(res, '获取res');
        if (!res) return;
        const { code, message: info }:{code?: number, message?: string} = res;
        if (code === 0) {
          message.success(info);
          // 跳转至登录页
          queryLoginDialog();
          return;
        }
        message.error(info);
        setIsLoading(false);
        form.setFieldsValue({
          areaCode: '86',
          mobile: '',
          password: '',
          smsCode: '',
          confirm: '',
        });
      })
      .finally(() => {
        setIsLoading(true);
      });
  }

  return {
    getCode,
    time,
    setIsShowTime,
    isShowTime,
    onSubmit,
  };
}
