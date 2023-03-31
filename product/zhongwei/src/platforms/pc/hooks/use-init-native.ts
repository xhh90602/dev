import React from 'react';
import { parseUrl } from '@dz-web/o-orange';
import { getUrlParam } from '@/utils';
import { useSafeState, useGetState } from 'ahooks';
import { RequestProxyScope, requestProxyManager } from '@dz-web/request';
import codeStorage from '@/helpers/code-storage';

import {
  DEFAULT_THEME, THEME_MAP,
  RISE_FALL_COLORS_DICT, IRiseFallColor,
  DEFAULT_LAN,
} from '@pc/constants/config';
import { queryUserConfig, queryUserInfo, queryServerConfig } from '@pc/helpers/native/msg';
import { updateUserConfig, IUserConfigRaw, updateUserInfo } from '@pc/helpers/native/register';

const { useEffect, useLayoutEffect } = React;
const { classList } = document.documentElement;
const { token } = getUrlParam({ token: '' });

export interface IUserConfig {
  riseFallColor?: IRiseFallColor;
  language: string;
  theme?: string;
}

export interface IUserInfo {
  orgCode: any;
  token: string;
  isLoginTrade: boolean;
  areaCode?: string
  cusNo?: string
  mobile?: string
  nickname?: string
  avatar?: string
}

interface IUseInitNative {
  userConfig: IUserConfig;
  userInfo: IUserInfo;
  quoteWsAddress: string;
}

export const defaultUserConfig = {
  language: DEFAULT_LAN,
};

export const defaultUserInfo = {
  orgCode: '',
  mobile: '',
  token: '',
  isLoginTrade: false,
};

export default function useInitNative(): IUseInitNative {
  const [userConfig, setUserConfig, getUserConfig] = useGetState<IUserConfig>(defaultUserConfig);
  const [userInfo, setUserInfo] = useSafeState<IUserInfo>(defaultUserInfo);
  const [quoteWsAddress, setQuoteWsAddress] = useSafeState<string>('');

  function updateUserConfigProxy(rawConfig: IUserConfigRaw): void {
    const { theme: prevTheme } = getUserConfig() || {};
    const { raise, theme, language } = rawConfig;
    const nextTheme = THEME_MAP[theme] || DEFAULT_THEME;

    const config = {
      theme: nextTheme,
      language,
      riseFallColor: RISE_FALL_COLORS_DICT[raise],
    };

    setUserConfig(config);

    if (prevTheme) classList.remove(prevTheme);
    classList.add(nextTheme);
  }

  function updateUserInfoProxy(res, isInit = false): void {
    Object.assign(res, { token: res.sessionCode });

    // 23-01-05 王梦的新版本
    // const { sessionCode, tradeToken } = res;
    // setUserInfo({ ...res });
    // codeStorage.set('userInfo', res);
    // codeStorage.set('token', sessionCode);
    // codeStorage.set('tradeToken', tradeToken);

    // if (sessionCode) {
    //   requestProxyManager.clear(RequestProxyScope.USER_TOKEN);
    // }

    // if (tradeToken) {
    //   requestProxyManager.clear(RequestProxyScope.TRADE_TOKEN);
    // }

    // 旧版本
    // setUserInfo({ ...res });
    // codeStorage.set('userInfo', res);
    // codeStorage.set('token', res.token);

    // if (isInit) {
    //   requestProxyManager.clear(RequestProxyScope.DEFAULT);
    //   requestProxyManager.clear(RequestProxyScope.TRADE_TOKEN);
    // }
  }

  useEffect(() => {
    console.log('【token】', token);

    if (token) {
      codeStorage.set('token', token);
      console.log('requestProxyManager', requestProxyManager);

      requestProxyManager.clear(RequestProxyScope.USER_TOKEN);
      console.log('requestProxyManager', requestProxyManager);
    }
  }, [token]);

  useLayoutEffect(() => {
    const theme = parseUrl(window.location.hash, 'theme');

    if (theme) classList.add(theme);
  }, []);

  useEffect(() => {
    queryUserConfig()
      .then((res) => {
        updateUserConfigProxy(res);
      })
      .catch((err) => console.log(`获取用户配置失败: ${err}`));

    updateUserConfig((res) => updateUserConfigProxy(res));

    queryUserInfo()
      .then((res) => updateUserInfoProxy(res, true))
      .catch((err) => console.log('err:', err));

    updateUserInfo((res) => updateUserInfoProxy(res));

    queryServerConfig()
      .then((res) => {
        if (res.websocketServer) {
          setQuoteWsAddress(res.websocketServer);
          codeStorage.set('quoteWsAddress', res.websocketServer);
          return;
        }

        console.log('未获取行情地址');
      })
      .catch((err) => console.log('err:', err));
  }, []);

  return { userConfig, userInfo, quoteWsAddress };
}
