const userInfo = {
  userId: 9527,
  mobile: '0',
  customerName: '法外狂徒_张三',
  customerNickname: 'nick',
  orgCode: '0002',
  tradeToken: 'ESBOOT_CONTENT_PATH=./modules/filter-stock',
  sessionCode: '4bb133d5-0330-491e-bd60-8939e06eedde',
  isLogin: true,
  bindTrade: true,
};

const tradeConfig = {
  orderToConfirmByDialog: false,
  orderToConfirmByPwd: false,
  idleAutoLockDuration: '15m',
  searchMarketPreference: 'US',
};

const userConfig = {
  env: 'dev',
  theme: 'light', // dark light red
  language: 'zh-CN', // zh-TW  zh-CN
  font_size: 2, // 0 - 4  最小 - 最大 默认值2
  global_font_scale: 2,
  raise: 'green', // 红涨绿跌 还是绿涨红跌
  orderToConfirmByDialog: true,
};

const serverConfig = {
  websocketServer: 'ws://47.107.33.136:8219/socket', //websoket地址
};

// 用戶配置切換
// {"name":"updateUserConfiguration","params":{"env": "dev", "language":"zh-TW","theme":"light","raise": "green","font_size": "4"}}
// {"name":"updateUserInfo","params":{"userId":9527,"mobile":"0","customerName":"法外狂徒_张三","customerNickname":"nick","orgCode":"0002","tradeToken":"65a79ea5-ccb5-40f6-8077-bfd624fe8056","sessionCode":"65a79ea5-ccb5-40f6-8077-bfd624fe8056","isLogin":true,"bindTrade":true}}

module.exports = {
  port: process.env.BRIDGE_MOCK_PORT || 3000,
  response: {
    url: (url, arg) => {
      console.log(`打开${url}?${JSON.stringify(arg)}`);
      return 'to url success';
    },
    view: (v, arg) => {
      console.log(`打开 ${v} 原生视图,传入参数${JSON.stringify(arg)}`);
      return 'open view';
    },
    msg: new Proxy(
      {
        NORMAL_GET_USER_INFO: () => userInfo,
        sessionCodeExpire: (args) => {
          console.log(`登录超时: \n${JSON.stringify(args)}`);
        },
        NORMAL_GET_USER_CONFIG: () => userConfig,
        QUOTE_GET_SERVER_INFO: () => serverConfig,
      },
      {
        get(target, name) {
          return name in target ? target[name] : (args) => console.log(`收到消息: ${name}, 尚未处理`);
        },
      },
    ),
  },
};
