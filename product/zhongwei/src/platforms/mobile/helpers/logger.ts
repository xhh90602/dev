import { Logger } from '@dz-web/police-browser';
import CodeStorage from '@/helpers/code-storage';

import staticConfig, { CommonServer } from './static-config';

const logger = new Logger({
  url: staticConfig.getCommonServer(CommonServer.police),
  label: 'zhongwei-web',
  batchInterval: 10000,
  userInfo: () => `Mobile: ${CodeStorage.userInfo.mobile}`,
});

export default logger;
