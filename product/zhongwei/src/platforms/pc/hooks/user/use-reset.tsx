import { useEffect, useState } from 'react';
import { getSmsCode, getUserPwd } from '@/api/module-api/pwd';
import { message } from 'antd';

export interface Idata {
  areaCode?: string;
  channelType?: string;
  mobile?: string;
  orgCode?: string;
  type?: string;
}

export default function useReset(form) {
  const [time, setTime] = useState(60);
  const [isShowTime, setIsShowTime] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [params, setParams] = useState({
    inviteCode: 'A001',
    orgCode: '0001',
    password: '',
    smsCode: '',
    versionInfo: {
      appVersion: 'App/1.0.0',
      channelType: 'PC',
      deviceNo: 1111111111,
      deviceVersion: 'iPhone 11',
      systemVersion: 'IOS 13.0.3',
    },
  });
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
      orgCode: '0001',
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

    getSmsCode(query).then((res) => {
      if (res?.code === 0) {
        message.success(res.message);
        // setSmsCode('666666');
      } else if (res?.code === 990151) {
        // 跳转登录页面
        console.log('跳转登录页面');
      }
    });
  }

  function onSubmit() {
    if (!isLoading) return;
    getUserPwd(params)
      .then((res) => {
        if (res?.code === 0) {
          message.success(res?.message);
          form.setFieldsValue({
            smsCode: '',
            password: '',
            confirm: '',
          });
          // 跳转至登录页
        } else {
          message.success(res?.message);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    onSubmit();
  }, [params]);

  return {
    getCode,
    time,
    setIsShowTime,
    isShowTime,
    setParams,
    params,
    setIsLoading,
  };
}
