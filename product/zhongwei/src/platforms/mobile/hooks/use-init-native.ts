import { useEffect, useLayoutEffect, useRef } from 'react';
import { useSafeState } from 'ahooks';
import { parseUrl } from '@dz-web/o-orange';

import codeStorage from '@/helpers/code-storage';
import { RequestProxyScope, requestProxyManager } from '@dz-web/request';

import {
  DEFAULT_THEME,
  THEME_MAP,
  RISE_FALL_COLORS_DICT,
  IRiseFallColor,
  DEFAULT_LAN,
} from '@mobile/constants/config';
import { getServerPath, getUserConfig, getUserInfo } from '@mobile/helpers/native/msg';
import { updateUserConfig, IUserConfigRaw, updateUserInfo } from '@mobile/helpers/native/register';
import { TradeConditionKey, tradeReqCondition } from '@/api/create-instance/trade-request';

export enum BiometricsType{
  FaceID = 'FaceID',
  FingerPrint = 'FingerPrint',
  None = 'none',
}

export interface IUserConfig {
  riseFallColor?: IRiseFallColor;
  language: string;
  theme?: string;
  quoteChangeColor: string;
  biometricsType?: 'FaceID' | 'FingerPrint' | 'none'; // 生物识别类型: FaceID-面容识别，FingerPrint-指纹识别，none-无生物识别
}

export interface IServerConfig {
  commonServer?: string; // 生产环境公共服务地址
  singleStockServer?: string; // 个股财务简况
  infoNodeServer?: string; // 资讯平台地址
  websocketServer: string;
  isUpdate?: boolean; // 更新状态
}

export interface IUserInfo {
  quoteWsAddress?: string;
  sessionCode?: string;
  userId?: string | number;
  user?: string;
}

interface IUseInitNative {
  userConfig: IUserConfig;
  userInfo: IUserInfo;
}

export const defaultUserInfo = {};

export const defaultUserConfig = {
  language: DEFAULT_LAN,
  quoteChangeColor: 'green',
};

export const themeList = {
  light: 'white',
  dark: 'black',
};

const { classList } = document.documentElement;
const pageWhiteList = ['information-detail.html'];

export default function useInitNative(): IUseInitNative {
  const [userConfig, setUserConfig] = useSafeState<IUserConfig>(defaultUserConfig);
  const [userInfo, setUserInfo] = useSafeState<IUserInfo>(defaultUserInfo);

  const userConfigRef = useRef(userConfig);

  function updateUserConfigProxy(rawConfig: IUserConfigRaw, isInit = false): void {
    console.log('rawConfig', rawConfig);
    const { theme: prevTheme } = userConfigRef.current || {};
    const {
      theme,
      language,
      font_size: fontSize,
      global_font_scale: globalGFontScale,
      quote_change_color: quoteChangeColor = 'red',
    } = rawConfig;

    const nextTheme = THEME_MAP[theme] || DEFAULT_THEME;
    if (prevTheme) {
      classList.remove(prevTheme);
    }
    classList.add(nextTheme);

    const config = {
      ...rawConfig,
      theme: nextTheme,
      language,
      quoteChangeColor,
      riseFallColor: RISE_FALL_COLORS_DICT[quoteChangeColor],
    };

    /* 设置红绿涨跌颜色 */
    document.documentElement.classList.add(quoteChangeColor === 'red' ? 'red-green' : 'green-red');

    codeStorage.set('language', language);
    console.log('updateUserConfigProxy', config);
    setUserConfig(config);

    if (isInit) {
      const htmlFontSize = parseFloat(document.documentElement.style.fontSize);
      const currentFontSize = +(htmlFontSize * 0.28).toFixed(4);
      const currentRatioSize = (globalGFontScale - 2 + currentFontSize) / 0.28;

      document.documentElement.style.fontSize = `${currentRatioSize}px`;
    }

    const isFind = pageWhiteList.findIndex((local) => window.location.pathname.includes(local));
    if (isFind !== -1) {
      document.body.style.fontSize = `${(fontSize - 2) * 0.1 + 0.28}rem`;
    }
  }

  function updateUserInfoProxy(res): void {
    const { sessionCode, tradeToken } = res;

    setUserInfo({ ...res });
    codeStorage.set('userInfo', res);
    codeStorage.set('token', sessionCode);
    codeStorage.set('tradeToken', tradeToken);

    if (sessionCode) {
      requestProxyManager.clear(RequestProxyScope.USER_TOKEN);
    }

    if (tradeToken) {
      tradeReqCondition[TradeConditionKey.TRADETOKEN] = tradeToken;
    }
  }

  useLayoutEffect(() => {
    const theme = parseUrl(window.location.hash, 'theme');

    if (theme) classList.add(theme);
  }, []);

  useEffect(() => {
    getUserConfig()
      .then((res) => {
        console.log('【获取用户配置】', res);

        updateUserConfigProxy(res, true);
      })
      .catch((err) => console.log(`获取用户配置失败: ${err}`));

    updateUserConfig((res) => {
      console.log('【更新用户配置】', res);

      updateUserConfigProxy(res);
    });

    getUserInfo()
      .then((res) => {
        console.log('【用户信息】', res);

        updateUserInfoProxy(res);
      })
      .catch((err) => console.log('【获取用户信息失败】', err));

    updateUserInfo((res) => {
      console.log('【更新用户信息】', res);

      updateUserInfoProxy(res);
    });

    getServerPath()
      .then((res) => {
        if (res?.websocketServer) {
          setUserInfo((old) => ({ quoteWsAddress: res.websocketServer, ...old }));
          codeStorage.set('quoteWsAddress', res.websocketServer);
        }
      })
      .catch((err) => console.log('【获取行情地址请求失败】', err));
  }, []);

  useEffect(() => {
    userConfigRef.current = userConfig;
  }, [userConfig]);

  return { userConfig, userInfo };
}
