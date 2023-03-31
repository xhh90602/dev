import { useContext } from 'react';
import { userConfigContext, userInfoContext } from '@mobile/helpers/entry/native';
import staticConfig from '@mobile/helpers/static-config';

export { default as logger } from '@mobile/helpers/logger';

export const useGetUserInfo = () => useContext<any>(userInfoContext);
export const useGetUserConfig = () => useContext<any>(userConfigContext);
export const useGetChartIndicatorParamsList = () => staticConfig.getConfig('QUOTES_CONFIG.chartIndicatorsParamsList');
