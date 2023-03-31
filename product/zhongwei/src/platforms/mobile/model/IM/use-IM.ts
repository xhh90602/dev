import * as React from 'react';
import { useDispatch } from 'react-redux';
import WebIM from 'easemob-websdk';
import { setStatus, setInstance, pushMessage, setAlertList } from '@mobile/model/IM/reducer';
import defaultConfig from './config';
import { IM_STATUS_ENUM, ALERT_LIST_ACTIONS, ALERT_TYPE } from './constant';

const { useEffect } = React;

export default function useIM(config = {}) {
  const dispatch = useDispatch();

  useEffect(() => {
    // eslint-disable-next-line new-cap
    const connect = new WebIM.connection({
      appKey: defaultConfig.appkey,
      isHttpDNS: defaultConfig.isHttpDNS,
      isMultiLoginSessions: defaultConfig.isMultiLoginSessions,
      https: defaultConfig.https,
      url: defaultConfig.socketServer,
      apiUrl: defaultConfig.restServer,
      isAutoLogin: defaultConfig.isAutoLogin,
      autoReconnectNumMax: defaultConfig.autoReconnectNumMax,
      autoReconnectInterval: defaultConfig.autoReconnectInterval,
      delivery: defaultConfig.delivery,
      useOwnUploadFun: defaultConfig.useOwnUploadFun,
      ...config,
    });

    dispatch(setInstance(connect));

    connect.listen({
      // 登录回调
      onOpened() {
        dispatch(setInstance(connect));
        dispatch(setStatus(IM_STATUS_ENUM.open));
      }, // 连接成功回调

      // 失败回调
      onError(message) {
        console.log(message, '<-- IM发生错误');
      },

      /** * 消息相关 ** */

      // 消息已到达服务器回执
      onReceivedMessage: (message) => {
        dispatch(pushMessage({ ...message, isSelf: true }));
      },

      // 收到文本消息
      onTextMessage(message) {
        console.log('message', message);

        dispatch(pushMessage(message));
      },

      // 收到图片消息
      onPictureMessage(message) {
        dispatch(pushMessage(message));
      },

      // 收到禁言消息
      // 如果用户在A群组被禁言，在A群发消息会走这个回调并且消息不会传递给群其它成员
      onMutedMessage() {
        dispatch(
          setAlertList({ type: ALERT_LIST_ACTIONS.push, data: { type: ALERT_TYPE.error, msg: '您已被禁言' } }),
        );
      },

      // 收到消息送达客户端回执
      onDeliveredMessage(message) {
        console.log(message, '<-- 消息已经送达客户端');
      },

      // 收到消息已读回执
      onReadMessage(message) {
        console.log(message, '<-- 消息已读');
      },

      // 收到离线消息已读回执
      onStatisticMessage(message) {
        console.log(message, '<-- 收到离线消息已读回执');
      },

      // 收到整个会话已读的回执，在对方发送channel ack时会在这个回调里收到消息
      onChannelMessage(message) {
        console.log(message, '<-- 整个会话已读');
      },

      /** * 其他 ** */
      // onClosed(message) {}, // 连接关闭回调
      // onTextMessage(message) {
      // }, // 收到文本消息
      // onEmojiMessage(message) {}, // 收到表情消息
      // onCmdMessage(message) {}, // 收到命令消息
      // onAudioMessage(message) {}, // 收到音频消息
      // onLocationMessage(message) {}, // 收到位置消息
      // onFileMessage(message) {}, // 收到文件消息
      // onVideoMessage(message) {
      //   const node = document.getElementById('privateVideo');
      //   const option = {
      //     url: message.url,
      //     headers: {
      //       Accept: 'audio/mp4',
      //     },
      //     onFileDownloadComplete(response) {
      //       const objectURL = WebIM.utils.parseDownloadResponse.call(
      //         conn,
      //         response,
      //       );
      //       node.src = objectURL;
      //     },
      //     onFileDownloadError() {
      //     },
      //   };
      //   WebIM.utils.download.call(conn, option);
      // }, // 收到视频消息
      // onPresence(message) {
      // }, // 处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢解散等消息
      // onRoster(message) {}, // 处理好友申请
      // onInviteMessage(message) {}, // 处理群组邀请
      // onOnline() {}, // 本机网络连接成功
      // onOffline() {}, // 本机网络掉线
      // onError(message) {}, // 失败回调
      // onBlacklistUpdate(list) {
      //   // 黑名单变动
      //   // 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
      // },
      // onRecallMessage(message) {}, // 收到撤回消息回调
      // onCreateGroup(message) {}, // 创建群组成功回执（需调用createGroupNew）

    });
  }, []);
}
