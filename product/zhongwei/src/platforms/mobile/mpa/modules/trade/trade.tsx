import { getUserInfo } from '@/api/module-api/combination-position';
import { getTradeAccountInfo } from '@/api/module-api/trade';
import { userInfoContext } from '@/platforms/mobile/helpers/entry/native';
import { activeTradeState, getTradeUserInfo, getUserTradeConfigInfo } from '@/platforms/mobile/helpers/native/msg';
import { updateTradeSetting } from '@/platforms/mobile/helpers/native/register';
import { useTradeStore } from '@/platforms/mobile/model/trade-store';
import { useUpdateEffect } from 'ahooks';
import { useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

const App: React.FC = () => {
  const {
    tradeAccountUpdate,
    tradeAccountInfo,
    setUserInfo,
    setUserTradeConfigInfo,
    setTradeAccountInfo,
    setTradeAccountUpdate,
  } = useTradeStore();
  const [tradeLogintInfo, setTradeLoginInfo] = useState({
    token: '', // 登陆token
    account: '', // 账号
    areaCode: '', // 手机区号
    mobile: '', // 手机号
    email: '', // 邮箱
  });

  useEffect(() => {
    /* 获取交易设置信息 */
    getUserTradeConfigInfo().then((res) => {
      console.log('调用获取交易设置交互', res);
      if (res) {
        setUserTradeConfigInfo(res);
      }
    });

    /* 监听app交易设置更新 */
    updateTradeSetting((res) => {
      console.log('app调用交易设置更新回调:', res);
      setUserTradeConfigInfo(res);
    });

    /* 获取交易账户信息 */
    getTradeAccountInfo().then((res) => {
      const { code, result } = res;
      if (code === 0) {
        setTradeAccountInfo(result);
      }
    });

    getTradeUserInfo().then((res) => {
      console.log('获取交易登陆信息：', res);
      setTradeLoginInfo(res);
    });

    /* 激活交易状态，通知app */
    activeTradeState();
  }, [tradeAccountUpdate]);

  useEffect(() => {
    if (!tradeAccountInfo.clientId) return;
    getUserInfo({ clientId: tradeAccountInfo.clientId }).then((res) => {
      const { code, result } = res;
      if (code === 0) {
        setUserInfo(result);
      }
    });
  }, [tradeAccountInfo.clientId]);

  const userInfo = useContext<any>(userInfoContext);

  useUpdateEffect(() => {
    console.log('🚀 ~ file: trade.tsx:50 ~ useUpdateEffect ~ userInfo', userInfo);
    if (tradeLogintInfo?.account) {
      /* 切换账户后，刷新页面 */
      getTradeUserInfo().then((res) => {
        console.log('切换账号，获取登录信息：', res);
        if (res.account !== tradeLogintInfo.account) {
          setTradeAccountUpdate();
        }
      });
    }
  }, [userInfo, tradeLogintInfo]);

  return (
    <div className="trade-container">
      <Outlet />
    </div>
  );
};

export default App;
