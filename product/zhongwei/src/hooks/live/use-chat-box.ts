/* eslint-disable no-unsafe-optional-chaining */
import * as React from 'react';
import mediumZoom from 'medium-zoom';
import { useDispatch, useSelector } from 'react-redux';
import { get } from 'lodash-es';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { emojiSourceDict } from '@mobile/helpers/live/emoji';
import { setMsgRecordDict, pushSendQueue } from '@mobile/model/IM/reducer';
import messageHelpers from '@mobile-mpa/modules/live/components/messageHelper';
import {
  sendLiveMsg, // 直播间发送消息
  getHistoryMsg,
} from '@/api/module-api/live';
// import { dataURLtoFile } from './utils';
// import { uploadFile } from '../api/live/file';
import { MSG_TYPE, CHAT_TYPE } from '../../platforms/mobile/model/IM/constant';
import useIM from '../../platforms/mobile/model/IM/use-IM';

const { useMemo, useEffect, useState, useRef, useCallback, useLayoutEffect } = React;

dayjs.extend(customParseFormat);

const zoom = mediumZoom({
  background: 'rgba(255, 255, 255, .3)',
});

interface ICrops {
  toId: string,
  count: number,
  ltId: string | null,
  gtId: string | null,
  fromId?: string,
  fromIds?: Array<string>,
  startDate?: string | null,
  endDate?: string | null,
  type: number,
}

export default function useChatBox(props) {
  const {
    toId,
    IMConfig = {},
    isGroup,
    chatType,
    linkedTextLiveRoomId,
    msgContainerRef,
    inputRef,
    msgHelper,
    teacherMid,
    hasError,
  } = props;

  const dispatch = useDispatch();
  const userInfo = useSelector((v: any) => v.app.userInfo);
  const IMState = useSelector((v: any) => v.IM);
  const { instance, isConnected, msgRecordDict, accountInfo, webIM } = IMState;
  useIM(IMConfig);
  console.log('isConnected', isConnected);

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isAutoScrollToBottom, setIsAutoScrollToBottom] = useState(false);
  const [isSendImg, setIsSendImg] = useState(false); // 发送消息是否为图片

  const [pageNum, setPageNum] = useState(1);

  const [quoteMsg, setQuoteMsg] = useState<any>();
  // 消息state
  const [messageData, setMessageData] = useState<any>([]);

  const msgContainerScrollTimer = useRef<any>(null);
  const msgListRef = useRef<any>([]);
  // 聊天记录筛选条件
  const filterKeyRef = useRef<any>(null);

  const {
    data: msgList,
    newMessageFlow = '0',
    unreadCount = 0,
  } = useMemo(
    () => {
      const res = get(msgRecordDict, `${toId}`, { data: [], pageNum: 1 });
      setPageNum(res.pageNum || 1);
      setMessageData([...res.data]);
      return res;
    },
    [toId, msgRecordDict],
  );

  // 聊天历史是否有数据返回
  const isMoreHistoryMsg = useRef(true);

  const fetchHistoryMessage = useCallback(
    (isFetchHS = false, minId = null) => {
      console.log('accountInfo', accountInfo);

      if (!toId || !isConnected || !accountInfo.nickname || !isMoreHistoryMsg.current) return;
      let nextPageNum = pageNum;

      if (isFetchHS) {
        nextPageNum += 1;
        setIsLoadingMore(true);
      }

      // 判断是单聊还是群聊
      // const queryUrl = personalQueryMsg;
      const queryUrl = getHistoryMsg;
      const params: ICrops = {
        toId,
        count: 20,
        fromId: accountInfo?.nickname,
        ltId: minId || null,
        gtId: null,
        startDate: null,
        endDate: null,
        type: 3,
      };

      queryUrl(params).then((res) => {
        console.log('res', res);
        const { code, result } = res;
        if (code === 0) {
          // 判断是否有聊天数据返回,scroll是否继续拉取数据
          if (!result.length) {
            isMoreHistoryMsg.current = false;
          }

          const parseList = result?.map((listItem) => {
            const { ext, sourceMsg, id, timestamp, fromId } = listItem;

            // 在这里判断消息来源fromId中是否有teacherMid,做一个老师发言的标记
            let isTeacherSpeak = false;
            if (teacherMid && teacherMid.length) {
              if (teacherMid.indexOf(Number(fromId)) !== -1) {
                isTeacherSpeak = true;
              }
            }
            return {
              contentsType: MSG_TYPE.TEXT,
              from: fromId,
              isSelf: accountInfo.username === fromId,
              date: timestamp,
              ext: ext ? JSON.parse(ext) : {},
              content: sourceMsg,
              sourceMsg,
              id,
              isTeacherSpeak, // 是否为老师发言
            };
          });

          const { scrollHeight } = msgContainerRef.current;

          dispatch(
            setMsgRecordDict({
              data: isFetchHS
                ? [...parseList, ...msgListRef.current]
                : parseList,
              id: toId,
              pageNum: nextPageNum,
            }),
          );

          if (!isFetchHS) {
            setIsAutoScrollToBottom(true);
          } else {
            setTimeout(() => {
              const { scrollHeight: nextHeight } = msgContainerRef.current;
              msgContainerRef.current.scrollTop = nextHeight - scrollHeight + 100;
            }, 0);
          }
        }
      }).then(() => {
        setIsLoadingMore(false);
      });
    },
    [toId, isConnected, pageNum, instance, accountInfo, isMoreHistoryMsg],
  );

  // 替换消息中的emoji
  function parseMsg(msg): string {
    if (!msg) return '';
    return msg.replaceAll(/\[(.+?)\]/g, (match) => {
      if (match in emojiSourceDict) {
        return `<img class="emoji" src="${emojiSourceDict[match]}"" alt="emoji"/>`;
      }
      return match;
    });
  }

  async function send(rawContent: string, isImg: boolean): Promise<any> {
    messageHelpers.loading('发送中');
    if (hasError) {
      msgHelper.tip('暂未开播!');
      return Promise.reject();
    }
    if (!isConnected) {
      msgHelper.error('未登录');

      return Promise.reject();
    }

    if (!rawContent) {
      msgHelper.error('不能发送空白消息!');
      return Promise.reject();
    }

    const value = rawContent.replace('<img', '<img data-zoomable');
    const id = instance.getUniqueId();
    // eslint-disable-next-line new-cap
    // const msg = new webIM.message('txt', id);

    // const ext: any = {
    //   avatar: accountInfo.avatar || userInfo.avatar,
    //   nickName: accountInfo.nickName || userInfo.nickName,
    // };

    // TODO 临时处理
    const ext: any = {
      // eslint-disable-next-line max-len
      avatar: accountInfo.avatar,
      nickName: accountInfo.nickName,
      imUserName: accountInfo.user,
      // mobile: '13289052237',
    };
    if (userInfo.mobile) {
      ext.mobile = userInfo.mobile;
    }

    if (quoteMsg) {
      ext.quoteMsg = quoteMsg;
    }

    // 构造发送消息参数
    const params = {
      fromId: accountInfo.nickname,
      toId,
      // chatType,
      // ext: (accountInfo?.nickName || userInfo?.nickName) ? JSON.stringify(ext) : null,
      ext: JSON.stringify(ext),
      // ext: null,
      sourceMsg: value,
      contentsType: MSG_TYPE.TEXT,
      timestamp: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      // quoteId: null,
    };
    // sendMsg(params)
    const { code } = await sendLiveMsg(params);
    console.log('result', code);
    if (code !== 0) {
      return messageHelpers.fail('消息发送失败');
    }

    // .then((res) => {
    //   console.log(res);
    // }).catch((err) => {
    // // msgHelper.error('消息发送失败', err);
    //   console.log('sendmsg', err);
    //   messageHelpers.fail(err);
    //   return false;
    // });

    // 将本次消息添加到消息列表中
    msgList.concat([{
      isSelf: true,
      ext: JSON.stringify(ext),
      sourceMsg: value,
      content: parseMsg(value),
      timestamp: dayjs(new Date()).format('YYYY/MM/DD HH:mm:ss'),
      date: dayjs(new Date()).format('YYYY/MM/DD HH:mm:ss'),
      fromId: accountInfo.nickname,
      id,
      toId,
      chatType,
      contentsType: MSG_TYPE.TEXT,
    }]);

    // 发送成功消息之后更新页面数据
    setMessageData((prev) => [...prev, {
      isSelf: true,
      ext,
      sourceMsg: value,
      content: parseMsg(value),
      timestamp: dayjs(new Date()).format('YYYY/MM/DD HH:mm:ss'),
      date: dayjs(new Date()).format('YYYY/MM/DD HH:mm:ss'),
      fromId: accountInfo.nickname,
      id,
      toId,
      chatType,
      contentsType: MSG_TYPE.TEXT,
    }]);
    setQuoteMsg(null);

    // 如果不是图片消息,则滚动到最底部,展示最新消息
    setIsSendImg(isImg);
    if (!isImg) {
      setIsAutoScrollToBottom(true);
    }

    return Promise.resolve();
  }

  // function uploadImage(base64) {
  //   const f = dataURLtoFile(base64, `chat-${performance.now()}`);

  //   console.log('文件对象file', f);

  //   const formdata = new FormData();
  //   formdata.append('file', f);

  //   return uploadFile(formdata)
  //     .then((res) => res.path);
  // }

  function syncMsg(info: any) {
    if (info.contentsType === MSG_TYPE.TEXT) {
      const id = instance.getUniqueId();
      // eslint-disable-next-line new-cap
      const msg = new webIM.message('txt', id);
      const ext: any = {};

      if (quoteMsg) {
        ext.quoteMsg = quoteMsg;
      }

      msg.set({
        msg: info.sourceMsg,
        to: linkedTextLiveRoomId,
        chatType: CHAT_TYPE.chatRoom,
        ext: info.ext,
        fail(err) {
          console.log(err, '发送消息失败');
        },
      });

      msg.setGroup('groupchat');

      instance.send(msg.body);
      inputRef.current.innerHTML = '';

      dispatch(
        pushSendQueue({
          isSelf: true,
          ext: info.ext,
          data: info.data,
          sourceMsg: info.sourceMsg,
          time: +new Date(),
          from: accountInfo.nickname,
          id,
          to: linkedTextLiveRoomId,
          type: CHAT_TYPE.chatRoom,
          contentsType: MSG_TYPE.TEXT,
        }),
      );
    }
  }

  function chooseMsgContentCtxMenu(v, item) {
    switch (v.key) {
      case 'quote':
        setQuoteMsg(item);
        break;
      case 'syncToTextLiveRoom':
        syncMsg(item);
        break;
      default:
        break;
    }
  }

  function clearQuoteMsg() {
    setQuoteMsg(null);
  }

  useEffect(() => {
    msgListRef.current = messageData;
  }, [messageData]);

  useEffect(() => {
    setIsAutoScrollToBottom(true);
  }, [toId]);

  // 拉取历史
  useEffect(() => {
    if (!toId || !isConnected) return;
    if (msgListRef.current.length) return;

    fetchHistoryMessage();
  }, [toId, isConnected]);

  useLayoutEffect(() => {
    if (!toId || !isConnected) return undefined;
    function scroll() {
      clearTimeout(msgContainerScrollTimer.current);

      msgContainerScrollTimer.current = setTimeout(() => {
        const scrollTop = msgContainerRef.current?.scrollTop;
        if (!scrollTop) return;

        if (scrollTop < 30 && !isLoadingMore && !isSendImg) {
          if (!msgListRef.current.length) return;
          const idArr = msgList.map((item) => item.id);
          const minId = Math.min(...idArr);
          fetchHistoryMessage(true, minId);
        }
      }, 500);
    }

    msgContainerRef.current.addEventListener('scroll', scroll);

    return () => msgContainerRef.current.removeEventListener('scroll', scroll);
  }, [toId, isConnected, isLoadingMore, msgList]);

  useEffect(() => {
    if (!isAutoScrollToBottom || !msgContainerRef.current) return;

    const fn = () => {
      if (msgContainerRef.current?.scrollHeight) {
        msgContainerRef.current.scrollTop = msgContainerRef.current?.scrollHeight
         - msgContainerRef.current?.clientHeight + 100;
      }
    };

    // setTimeout(() => {
    //   fn();
    // }, 100);

    let timer:any = null;
    // 因为图片延迟加载
    Array.from(document.querySelectorAll('[data-zoomable]')).forEach(
      (v: any) => {
        v.onload = () => {
          clearTimeout(timer);
          timer = setTimeout(() => fn(), 500);
        };
      },
    );

    setTimeout(() => {
      fn();
      setIsAutoScrollToBottom(false);
    }, 500);
  }, [isAutoScrollToBottom]);

  useEffect(() => {
    if (!newMessageFlow) return;
    const { scrollHeight, scrollTop, clientHeight } = msgContainerRef.current;

    if (
      newMessageFlow.indexOf('self') === 0
      || scrollHeight - scrollTop - clientHeight < 150
    ) {
      setIsAutoScrollToBottom(true);
    }
  }, [newMessageFlow]);

  // 清空未读消息
  useEffect(() => {
    if (unreadCount <= 0 || isGroup) return;
    if (!newMessageFlow) return;
    // eslint-disable-next-line no-useless-return
    if (!toId || !isConnected) return;

    const id = instance.getUniqueId();
    // eslint-disable-next-line new-cap
    const msg = new webIM.message('read', id);
    const params: any = {
      to: toId,
      id,
    };
    if (isGroup) params.chatType = 'groupChat';

    msg.set(params);
    instance.send(msg.body);
  }, [unreadCount, toId, isConnected]);

  useEffect(() => {
    zoom.detach('[data-zoomable]');
    zoom.attach('[data-zoomable]');
  }, [msgRecordDict]);

  return {
    isLoadingMore,
    quoteMsg,
    msgList,
    messageData,
    send,
    chooseMsgContentCtxMenu,
    clearQuoteMsg,
    // uploadImage,
  };
}
