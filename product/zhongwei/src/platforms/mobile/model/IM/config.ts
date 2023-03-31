export default {
  socketServer:
    `${window.location.protocol === 'https:' ? 'https:' : 'http:'
    }//im-api-v2.easemob.com/ws`,
  restServer:
    `${window.location.protocol === 'https:' ? 'https:' : 'http:'
    }//a1.easemob.com`,
  appkey: window.GLOBAL_CONFIG.LIVE_CONFIG.ck,
  autoReconnectInterval: 3,
  Host: 'easemob.com',
  https: true,
  isHttpDNS: true,
  isMultiLoginSessions: true,
  isSandBox: false, // 内部测试环境，集成时设为false
  isDebug: true,
  autoReconnectNumMax: 10,
  // eslint-disable-next-line no-useless-escape
  isWebRTC: window.RTCPeerConnection && /^https\:$/.test(window.location.protocol),
  useOwnUploadFun: false,
  i18n: 'cn',
  isAutoLogin: false,
  p2pMessageCacheSize: 500,
  delivery: true,
  groupMessageCacheSize: 200,
  loglevel: 'ERROR',
  enableLocalStorage: true,
  deviceId: 'webim',
};
