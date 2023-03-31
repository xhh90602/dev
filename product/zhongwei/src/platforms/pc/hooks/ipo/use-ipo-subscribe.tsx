import { useCallback, useContext, useEffect, useState } from 'react';
import { useInRouterContext } from 'react-router-dom';
import { useSetState } from 'ahooks';
import { getSubscribeList } from '@/api/module-api/ipo';
import { handleNavigate } from '@/utils/navigate';
import { userInfoContext } from '@/platforms/pc/helpers/entry/native';
import { TradeLogin } from '@/platforms/pc/helpers/native/msg';
import useTradeLock, { LockDialog } from '@/platforms/pc/hooks/trade-lock/use-trade-lock';

export interface IUseIpo {
  isLoading: boolean;
  subscribeList: any[];
  handleSubscribe: (...arg: any[]) => any;
  lockDialog: React.ReactNode;
}

const navigateTo = (isRouterContext: boolean, code: string) => {
  let path = `/ipo-buy.html?code=${code}`;

  if (isRouterContext) {
    path = `/trade.html?code=${code}#/ipo-buy`;
  }

  return handleNavigate(path);
};

export default function useIpoSubscribe(): IUseIpo {
  const isRouterContext = useInRouterContext();
  const { isLoginTrade } = useContext(userInfoContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [subscribeList, setSubscribeList] = useState<any[]>([]);

  useEffect(() => {
    setIsLoading(true);

    getSubscribeList()
      .then((res) => {
        if (res?.code === 0) {
          setSubscribeList(res?.result);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const [isLock, setIsLock] = useState<boolean>(false);
  useTradeLock(isLock, setIsLock);

  const [tradeActive, setTradeActive] = useSetState<Record<string, any>>({
    code: '',
    isActiveLogin: false,
    isLockVisible: false,
  });

  useEffect(() => {
    const { isActive, code } = tradeActive;

    if (isActive) {
      navigateTo(isRouterContext, code);
    }
  }, [isLoginTrade]);

  // 交易解锁回调
  const lockCallback = useCallback(() => {
    setIsLock(false);
    navigateTo(isRouterContext, tradeActive.code);
  }, [tradeActive.code]);

  // 去认购
  const handleSubscribe = useCallback(
    (ipoCode: string) => {
      if (!isLoginTrade) {
        setTradeActive({ isActive: true, code: ipoCode });
        return TradeLogin();
      }

      if (!isLock) {
        return navigateTo(isRouterContext, ipoCode);
      }

      return setTradeActive({ code: ipoCode, isLockVisible: true });
    },
    [isLock],
  );

  return {
    isLoading,
    subscribeList,
    handleSubscribe,
    lockDialog: (
      <LockDialog
        isPwdVisible={tradeActive.isLockVisible}
        setIsPwdVisible={(visible: boolean) => {
          setTradeActive({ isLockVisible: visible });
        }}
        cb={lockCallback}
      />
    ),
  };
}
