import generatePage from '@pc/helpers/generate-page';
import { store } from '@mobile/model/store';
import 'antd/dist/antd.css';
import App from './chat-room-admin';
// import { LAN_ENUM } from '@pc/constants/config';
// import zhHans from '../../lang/zh';
// import zhHant from '../../lang/hk';

generatePage(<App />, {
  store,
  // i18n: { messageDict: { [LAN_ENUM.ZH_TW]: zhHant, [LAN_ENUM.ZH_CN]: zhHans } },
});

export default {
  title: '聊天室',
};
