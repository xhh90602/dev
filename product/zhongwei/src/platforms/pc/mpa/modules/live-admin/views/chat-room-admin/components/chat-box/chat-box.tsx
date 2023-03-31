/* eslint-disable consistent-return */
import * as React from 'react';
import mediumZoom from 'medium-zoom';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { get } from 'lodash-es';
import dayjs from 'dayjs';
import { message, Popover, Menu, Dropdown, Image, Drawer, Checkbox } from 'antd/es';
import { SmileOutlined, PictureOutlined } from '@ant-design/icons';
import useIM from '@mobile/model/IM/use-IM';
import { setMsgRecordDict, pushSendQueue } from '@mobile/model/IM/reducer';
import * as IMConstant from '@mobile/model/IM/constant';
import {
  uploadImage,
  // sendMsg, // 股多多发送消息接口
  // personalQueryMsg, // 股多多查询群聊消息
  // adminQueryMsg, // 股多多管理员查询群聊消息
  queryChatRoomCustomerList,
  updateChatRoomCustomerStatus,
  getHistoryMsg,
  sendLiveMsg,
  delMessage, // 删除消息
} from '@/api/module-api/live-admin';

import {
  dataURLtoFile,
  parseQuoteContent,
  photoCompress, // 上传图片压缩
  emojiSourceDict,
} from './utils';
import './chat-box.scss';

import Loading from '../loading/loading';

import avatar from '../../images/icon_avatar.png';

// const emojiSourceList = Object.keys(emojiSourceDict);
const {
  useMemo,
  useEffect,
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
  useImperativeHandle,
  forwardRef,
} = React;
const { MSG_TYPE, CHAT_TYPE } = IMConstant;
// const { setMsgRecordDict, pushSendQueue } = IMActions;
// const { uploadImage } = interfaceFile;
// 查询聊天历史记录
// const {
//   sendMsg, // 股多多发送消息接口
//   personalQueryMsg, // 股多多查询群聊消息
//   adminQueryMsg, // 股多多管理员查询群聊消息
// } = interfaceChatHistoryList;

// 查询聊天室成员, 禁言成员接口
// const {
//   queryChatRoomCustomerList,
//   updateChatRoomCustomerStatus,
// } = interfaceChatRoom;

const zoom = mediumZoom({
  background: 'rgba(255, 255, 255, .3)',
});

interface IProps {
  ref: any;
  toId: string;
  roomId?: string | number,
  isGroup: boolean;
  isTextLive?: boolean;
  IMConfig?: any;
  // chatType: typeof CHAT_TYPE;
  chatType: string;
  linkedTextLiveRoomId?: string;
  closeMemberDrawer?: any;
  isShowMemberDrawer?: boolean;
  filterByDate?: any,
  onlyMe?: boolean,
  teacherMid?: any,
  filterKey?: number,
  hasError?: boolean,
  isAdmin: boolean,
  chatinLiveroom?: boolean,
  chatCheck: number, // 消息是否需要审核,0不需要,1需要
  // isClassics: boolean,
}

interface ICrops {
  toId: string,
  count: number,
  ltId: string,
  gtId: string,
  fromId?: string,
  fromIds?: Array<string>,
  startDate?: string,
  endDate?: string,
  type: number,
}

const ChatBox: React.FC<IProps> = forwardRef((props, ref) => {
  const {
    toId, roomId, IMConfig = {}, isGroup, chatType, isTextLive, linkedTextLiveRoomId,
    isShowMemberDrawer, closeMemberDrawer, filterByDate, onlyMe,
    teacherMid, filterKey, hasError, isAdmin, chatinLiveroom,
    chatCheck = 1,
  } = props;

  const dispatch = useDispatch();
  const userInfo = useSelector((v: any) => v.app.userInfo);
  const IMState = useSelector((v: any) => v.IM);
  const { instance, isConnected, msgRecordDict, accountInfo,
    // webIM,
  } = IMState;

  useIM(IMConfig);

  const [isGM, setIsGM] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isAutoScrollToBottom, setIsAutoScrollToBottom] = useState(false);

  const [memberList, setMemberList] = useState([]);
  const [muteDict, setMuteDict] = useState(new Set());

  const [quoteMsg, setQuoteMsg] = useState<any>();

  // const [isShowEmojiBoard, setIsShowEmojiBoard] = useState<boolean>(false);
  // 上划flag
  const [isUpScroll, setIsUpScroll] = useState<boolean>(false);
  //  下划flag
  const [isDownScroll, setIsDownScroll] = useState<boolean>(false);
  // 是否为第一次加载
  const [isFirstLoading, setIsFirstLoading] = useState<boolean>(true);
  const [checkedList, setCheckedList] = useState<any>([]); // 勾选的消息列表

  const dateRef = useRef<any>([]);
  const onlyMeRef = useRef<any>(false);
  const fetchFinish = useRef<any>(false);
  const currentScrollHeight = useRef<any>(null);

  useEffect(() => {
    if (filterByDate) {
      dateRef.current = filterByDate;
      setIsFirstLoading(true);
    }
  }, [filterByDate]);

  const msgContainerRef = useRef<any>(null);
  const msgContainerScrollTimer = useRef<any>(null);
  const uploadImageRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const msgListRef = useRef<any>([]);
  // 判断滑动动作
  const isScrollDirectionUp = useRef<any>(null);
  // 聊天记录筛选条件
  const filterKeyRef = useRef<any>(null);

  const {
    data: msgList,
    newMessageFlow = '0',
    unreadCount = 0,
  } = useMemo(() => get(msgRecordDict, `${toId}`, {
    data: [],
  }), [toId, msgRecordDict]);

  const isPreviewMode = useMemo(() => isTextLive && !isGM, [isTextLive, isGM]);
  const uploadImageId = useMemo(() => `uploadImageId-${performance.now()}`, []);
  // 聊天历史是否有数据返回
  // let getHistoryMessageFlag = true;

  const fetchHistoryMessage = useCallback((isFetchHS = false, minId = null, maxId = null) => {
    console.log('accountInfo===>', accountInfo);
    if (!toId || !isConnected || !accountInfo.user) return;
    if (isUpScroll && fetchFinish.current) return; // 如果是上划并且拉取完成，则不再拉取
    if (isDownScroll && fetchFinish.current) return; // 如果是下划并且拉取完成，则不再拉取
    const [startDate, endDate] = dateRef.current || [];

    const queryUrl = getHistoryMsg;
    const params: ICrops = {
      toId,
      count: 20,
      fromId: accountInfo?.user,
      ltId: minId || null,
      gtId: maxId || null,
      startDate: startDate || null,
      endDate: endDate || null,
      type: onlyMeRef.current ? 1 : 3,
    };

    if (isFetchHS) {
      setIsLoadingMore(true);
    }

    /**
     * 将实例接口替换为后台提供
     */
    // instance.fetchHistoryMessages(params)
    // TODO 需要改成从url获取
    queryUrl(params)
      .then((res: any) => {
        console.log('res===>', res);
        const { code, result } = res;
        // 判断是否有聊天数据返回,scroll是否继续拉取数据
        // getHistoryMessageFlag = list.length > 0;
        // 判断上划id是否存在并且返回数据是否为空, 如果上划flag存在并且返回数据为空,则证明上划拉取数据结束,禁止上划继续发送请求
        if (isUpScroll && minId && !result.length) {
          fetchFinish.current = true;
          setIsUpScroll(true);
        }
        // 判断下划id是否存在并且返回数据是否为空, 如果下划flag存在并且返回数据为空,则证明下划拉取数据结束,禁止下划继续发送请求
        if (isDownScroll && maxId && !result.length) {
          fetchFinish.current = true;
          setIsDownScroll(true);
        }
        // const parseList = messageData.map((item) => {
        const parseList = result.map((item) => {
          let isTeacherSpeak = false;
          if (teacherMid && teacherMid.length) {
            if (teacherMid.indexOf(Number(item.fromId)) !== -1) {
              isTeacherSpeak = true;
            }
          }
          return {
            ...item,
            isSelf: accountInfo.user === item.fromId,
            date: item.timestamp,
            ext: JSON.parse(item.ext),
            isTeacherSpeak,
          };
        }).reverse();

        // const { scrollHeight } = msgContainerRef.current || {};

        // eslint-disable-next-line no-nested-ternary
        dispatch(setMsgRecordDict({ data: isFetchHS ? (isDownScroll
          ? [...msgListRef.current, ...parseList] : [...parseList, ...msgListRef.current]) : parseList,
        id: toId }));

        if (!isFetchHS) {
          setIsAutoScrollToBottom(true);
        } else {
          // setTimeout(() => {
          const { scrollHeight: nextHeight, clientHeight } = msgContainerRef.current;
          // 需要判断是上划还是下划操作,不要滚动到顶部或者底部 触发加载更多
          if (isScrollDirectionUp.current) {
            // msgContainerRef.current.scrollTop = nextHeight - scrollHeight;
            msgContainerRef.current.scrollTo(0, nextHeight - currentScrollHeight.current);
          } else {
            msgContainerRef.current.scrollTop = nextHeight - clientHeight - 100;
          }
          // }, 0);
        }
      })
      .then(() => {
        setIsLoadingMore(false);
      })
      .catch(() => {
        setIsLoadingMore(false);
      });
  }, [toId, isConnected, instance, accountInfo, isUpScroll, isDownScroll, isScrollDirectionUp]);

  // 搜索聊天记录
  const searchMessage = (value: string) => {
    console.log('value===>', value);
    const filterMessage = msgListRef.current.filter((item) => {
      const { ext } = item;
      return ext?.nickName?.indexOf(value) !== -1;
    });
    if (filterMessage.length) {
      const acElement = document.getElementById(filterMessage[0]?.ext?.nickName);
      if (acElement) {
        acElement.scrollIntoView({ block: 'start', behavior: 'smooth' });
        // 给acElement增加twinkle类名
        acElement.classList.add('twinkle');
        setTimeout(() => {
          acElement.classList.remove('twinkle');
        }, 2000);
      }
    }
  };

  // 勾选消息记录
  const handleChange = (e: any, item) => {
    if (e.target.checked) {
      setCheckedList([...checkedList, item?.id]);
    } else {
      const filterList = checkedList.filter((i) => i !== item?.id);
      setCheckedList(filterList);
    }
  };

  // 删除聊天记录
  const deleteMessage = () => {
    console.log('checkedList===>', checkedList);
    if (!checkedList.length) {
      message.error('请选择需要删除的消息!');
      return;
    }
    delMessage({ ids: checkedList }).then((res) => {
      console.log('res===>', res);
      const { code, message: msg } = res;
      if (code === 0) {
        message.success('删除成功');
        // 删除成功后更新redux,重新拉取数据
        dispatch(setMsgRecordDict({ data: [...msgListRef.current.filter((item) => !checkedList.includes(item.id))],
          id: toId }));
      } else {
        message.error(msg);
      }
    });
  };

  useImperativeHandle(ref, () => ({
    search: searchMessage,
    delete: deleteMessage,
  }));

  // 替换消息中的emoji
  function parseMsg(msg): string {
    if (!msg) return '';
    return msg.replaceAll(/\[(.+?)\]/g, (match) => {
      if (match in emojiSourceDict) {
        return `<img class="emoji-icon" src="${emojiSourceDict[match]}"" alt="emoji"/>`;
      }
      return match;
    });
  }

  // 发送消息
  const send = useCallback(
  // function send() {
    () => {
      console.log('accountInfo===>', accountInfo);
      if (hasError) {
        message.error('暂未开播!');
        return;
      }
      if (!isConnected) {
        message.error('未登录');
        return;
      }
      if (!toId) {
        message.error('暂时无法发表评论');
        return;
      }

      const { innerHTML } = inputRef.current;
      const value = innerHTML.replace('<img', '<img data-zoomable');
      // const trimValue = value.trim();

      if (!innerHTML) {
        message.error('不能发送空白消息!');
        return;
      }

      const id = instance.getUniqueId();
      // eslint-disable-next-line new-cap
      // const msg = new webIM.message('txt', id);
      const ext: any = {
        avatar: accountInfo?.avatar,
        nickName: accountInfo?.user,
        userNickName: accountInfo?.user,
        userAccount: accountInfo?.user,
        imUserName: accountInfo.user,
      };

      // if (userInfo.mobile) {
      //   ext.mobile = userInfo.mobile;
      // }

      if (quoteMsg) {
        ext.quoteMsg = quoteMsg;
      }

      inputRef.current.innerHTML = '';

      // 构造发送消息参数
      const params = {
        fromId: accountInfo.user,
        toId,
        // chatType,
        ext: JSON.stringify(ext),
        sourceMsg: value,
        contentsType: MSG_TYPE.TEXT,
        timestamp: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        quoteId: null,
      // chatCheck,
      };

      if (quoteMsg) {
        params.quoteId = quoteMsg?.fromId;
      }
      sendLiveMsg(params).then((res: any) => {
        console.log('res===>', res);
        const { code, message: msg } = res;
        if (code === 0) {
          // 发送消息之后在拉取一次消息记录,以展示自己发送的消息
          // msgList.push({
          //   isSelf: true,
          //   ext: JSON.stringify(ext),
          //   sourceMsg: value,
          //   content: parseMsg(value),
          //   timestamp: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          //   date: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          //   fromId: accountInfo.user,
          //   id,
          //   toId,
          //   // chatType,
          //   contentsType: MSG_TYPE.TEXT,
          // });
          dispatch(setMsgRecordDict({ data: [...msgListRef.current, {
            isSelf: true,
            ext,
            sourceMsg: value,
            content: parseMsg(value),
            timestamp: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            date: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            fromId: accountInfo.user,
            id,
            toId,
            // chatType,
            contentsType: MSG_TYPE.TEXT,
          }],
          id: toId }));
          setIsAutoScrollToBottom(true);
        } else {
          message.error(msg);
        }
      });
      setQuoteMsg(null);
    },
    [userInfo, isConnected, accountInfo],
  );

  function uploadCallback(base64) {
    console.log('base64===>', base64);
    const f = dataURLtoFile(base64, `chat-${performance.now()}.png`);

    console.log('f===>', f);
    const { size } = f;
    if (size > 1024 * 1000) {
      message.error('上传图片过大,请重新选择');
      return;
    }
    const formdata = new FormData();
    formdata.append('file', f);

    uploadImage(formdata)
      .then((res) => {
        console.log('res===>', res);
        const { code, message: msg } = res;
        if (code === 0) {
          inputRef.current.innerHTML += `<img src="${res.url}" alt="" />`;
          inputRef.current.focus();
        } else {
          message.error(msg);
        }
      })
      .catch((err) => {
        console.log(err, '<-- err');
      })
      .then(() => {
        // event.target.value = '';
      });
  }

  function changeImage(event): void {
    if (uploadImageRef.current.value) {
      const file = uploadImageRef.current.files[0];
      photoCompress(file, { quality: 0.5 }, uploadCallback);
    }
  }

  // function syncMsg(info: any) {
  //   if (info.contentsType === MSG_TYPE.TEXT) {
  //     const id = instance.getUniqueId();
  //     // eslint-disable-next-line new-cap
  //     const msg = new webIM.message('txt', id);
  //     const ext: any = {};

  //     if (quoteMsg) {
  //       ext.quoteMsg = quoteMsg;
  //     }

  //     msg.set({
  //       msg: info.sourceMsg,
  //       to: linkedTextLiveRoomId,
  //       chatType: CHAT_TYPE.chatRoom,
  //       ext: info.ext,
  //       fail(err) {
  //         message.error(`发送消息失败: ${err.reason}`);
  //       },
  //     });

  //     msg.setGroup('groupchat');

  //     instance.send(msg.body);
  //     inputRef.current.innerHTML = '';

  //     dispatch(pushSendQueue({
  //       isSelf: true,
  //       ext: info.ext,
  //       data: info.data,
  //       sourceMsg: info.sourceMsg,
  //       time: +new Date(),
  //       from: accountInfo.username,
  //       id,
  //       to: linkedTextLiveRoomId,
  //       type: CHAT_TYPE.chatRoom,
  //       contentsType: MSG_TYPE.TEXT,
  //     }));
  //   }
  // }

  function toggleMuteMember(id, imUser, nickName) {
    if (!toId) {
      message.error('聊天室id不存在');
      return;
    }
    // 判断当前用户是否被禁言
    if (muteDict.has(id)) {
      updateChatRoomCustomerStatus({ imUserName: imUser, isGag: false, imRoomId: toId })
        .then((res) => {
          const { code, message: msg } = res;
          if (code === 0) {
            message.success(`用户：${nickName}已取消禁言`);
            muteDict.delete(id);
            setMuteDict(new Set(muteDict));
          } else {
            message.error(msg);
          }
        }).catch((err) => {
          message.error(err);
        });
    } else {
      updateChatRoomCustomerStatus({ imUserName: imUser, isGag: true, imRoomId: toId })
        .then((res) => {
          const { code, message: msg } = res;
          if (code === 0) {
            message.success(`用户：${nickName}已禁言`);
            muteDict.add(id);
            setMuteDict(new Set(muteDict));
          } else {
            message.error(msg);
          }
        }).catch((err) => {
          message.error(err);
        });
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') {
      send();
      e.preventDefault();
    }
  }

  function inputOnFocus(e) {
    e.target.dataset.placeholder = '';
    e.preventDefault();
  }

  function inputOnBlur(e) {
    e.target.dataset.placeholder = '请输入互动消息......';
    e.preventDefault();
  }

  // function chooseEmoji(v) {
  //   setIsShowEmojiBoard(false);
  //   inputRef.current.innerHTML += v;
  // }

  // function renderEmoji() {
  //   return (
  //     <ol styleName="emoji">
  //       {
  //         emojiSourceList.map((item) => (
  //           <li styleName="emoji-item" onClick={() => chooseEmoji(item)} key={item}>
  //             <img src={emojiSourceDict[item]} alt="" />
  //           </li>
  //         ))
  //       }
  //     </ol>
  //   );
  // }

  function chooseMsgContentCtxMenu(v, item) {
    switch (v.key) {
      case 'quote':
        setQuoteMsg(item);
        break;
      // case 'syncToTextLiveRoom':
      //   syncMsg(item);
      //   break;
      default: break;
    }
  }

  function chooseAvatarContentCtxMenu(v, item) {
    console.log('item===>', item);
    if (v.key === 'mute') {
      toggleMuteMember(item.id, item?.ext?.imUserName, item.nickName);
    }
  }

  function goQuoteMessage(id) {
    console.log(id, '<-- id');
  }

  function renderAvatarContentCxtMenu(item) {
    return (
      <Menu onClick={(v) => chooseAvatarContentCtxMenu(v, item)}>
        {
          !item.isSelf && (
            <Menu.Item key="mute">{muteDict.has(item.id) ? '取消禁言' : '禁言'}</Menu.Item>
          )
        }
      </Menu>
    );
  }

  function renderMsgContentCxtMenu(item) {
    const items = [
      { label: '引用', key: 'quote' },
    ];
    return (
      // eslint-disable-next-line react/jsx-no-bind
      <Menu onClick={(v) => chooseMsgContentCtxMenu(v, item)} items={items}>
        {/* {
          !isPreviewMode
          && (
            <>
              <Menu.Item key="quote">引用</Menu.Item>
              {
                (linkedTextLiveRoomId && isGM && item.isSelf)
                && (
                  <Menu.Item key="syncToTextLiveRoom">同步到文字直播间</Menu.Item>
                )
              }
            </>
          )
        } */}
      </Menu>
    );
  }

  function renderContent(info: any, isQuote = false): React.ReactElement {
    if (!info) return <div />;
    const { contentsType, content } = info;

    switch (contentsType) {
      case MSG_TYPE.TEXT: case MSG_TYPE.UPPERTEXT:
        return (
          <div
            styleName={classNames({ 'quote__content__msg--single': isQuote })}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: isQuote ? parseQuoteContent(content) : content }}
          />
        );
      case MSG_TYPE.IMAGE: return isQuote ? <div>[图片]</div> : <Image src={info.url} alt={info.filename} />;
      default: return <div />;
    }
  }

  function renderQuote() {
    if (!quoteMsg) return null;

    return (
      <div styleName="quote" onClick={() => goQuoteMessage(quoteMsg.id)}>
        <div styleName="quote__name">
          {quoteMsg?.ext?.nickName || quoteMsg.fromId}
          &nbsp;
          &nbsp;
          {quoteMsg.date}
        </div>

        <div styleName="quote__content__msg">
          {renderContent(quoteMsg, true)}
        </div>
      </div>
    );
  }

  useEffect(() => {
    msgListRef.current = msgList;
  }, [msgList]);

  // useEffect(() => {
  //   setIsAutoScrollToBottom(true);
  // }, [toId]);

  // 拉取历史
  useEffect(() => {
    if (!toId || !isConnected) return;
    // setIsDownScroll(true);
    // setIsUpScroll(true);
    fetchHistoryMessage();
  }, [toId, isConnected, filterByDate]);

  // 查询禁言名单
  useEffect(() => {
    // 修改为无需判断是否为管理员, 只需要根据isAdmin来判断是否有禁言的权限
    // if (!isConnected || !toId || !isGM) return;
    if (!toId) return;

    // 拉取聊天室成员使用roomId
    const params = {
      imRoomId: toId,
      cursor: 0,
      limit: 20,
    };
    queryChatRoomCustomerList(params)
      .then((res) => {
        const { code, result } = res;
        if (code === 0) {
          setMemberList(result?.members);
          // 接口会返回禁言状态, 过滤出禁言的id 使用set对象更新到muteDict数组中
          const mutedObj = new Set();
          result?.members.forEach((v) => {
            if (v.isGag) {
              mutedObj.add(v.id);
            }
          });
          setMuteDict(mutedObj);
        }
      }).catch((err) => {
        console.log(err, '<-----拉取聊天室成员失败');
      });
  }, [toId]);

  useLayoutEffect(() => {
    if (!toId || !isConnected) return undefined;
    let currentVal = 0;
    let scrollVal = 0;
    function scroll() {
      clearTimeout(msgContainerScrollTimer.current);
      setIsFirstLoading(false);
      msgContainerScrollTimer.current = setTimeout(() => {
        const { scrollTop, clientHeight, scrollHeight } = msgContainerRef.current;
        currentVal = scrollVal;
        scrollVal = scrollTop;
        if (currentVal < scrollVal) {
          // 滚动条下滑，实现下滑效果
          console.log('下划');

          isScrollDirectionUp.current = false;
        } else {
          // 滚动条上滑，实现上滑效果
          console.log('上划');

          isScrollDirectionUp.current = true;
          // 记录当前消息列表的高度
          currentScrollHeight.current = msgContainerRef.current.scrollHeight;
        }
        if (scrollTop < 30 && !isLoadingMore && isScrollDirectionUp.current) {
          if (!msgListRef.current.length) return;

          /**
           * 上划拉取历史,取所有消息中最小id
           * 上滑需要清空时间筛选条件,并且gtId保持为null
           */
          const idArr = msgList.map((item) => item.id);
          const minId = Math.min(...idArr);
          // 设置上划flag为true;
          setIsUpScroll(true);
          setIsDownScroll(false);
          if (isFirstLoading) {
            return;
          }
          // setFilterChatByDate([]);
          dateRef.current = [];
          fetchHistoryMessage(true, minId, null);
        }
        // TODO: 滚动到底部加载下一页数据, 目前会第一次就触发,
        // 解决方法,使用两个flag来标识上划和下划是否加载完毕
        // 只有聊天室可以下滑动
        if (chatType !== 'chatroom') return;
        if (scrollTop + clientHeight >= scrollHeight && !isLoadingMore && !isScrollDirectionUp.current) {
          // 下滑也需要清空时间筛选条件,并取最大id
          // 并且ltId保持为null
          const idArr = msgList.map((item) => item.id);
          const maxId = Math.max(...idArr);
          // 设置下划flag为true;
          setIsDownScroll(true);
          setIsUpScroll(false);
          if (isFirstLoading) {
            return;
          }
          // setFilterChatByDate([]);
          dateRef.current = [];
          fetchHistoryMessage(true, null, maxId);
        }
      }, 500);
    }

    msgContainerRef.current.addEventListener('scroll', scroll);

    return () => msgContainerRef.current.removeEventListener('scroll', scroll);
  }, [toId, isConnected, isLoadingMore, msgList, isFirstLoading]);

  useEffect(() => {
    if (!isAutoScrollToBottom) return;

    setTimeout(() => {
      const { scrollHeight, clientHeight } = msgContainerRef.current;
      // msgContainerRef.current.scrollTop = scrollHeight - clientHeight + 100;
      msgContainerRef.current.scrollTop = (scrollHeight - clientHeight) > 0 ? (scrollHeight - clientHeight) : 0;
      setIsAutoScrollToBottom(false);
    }, 10);
  }, [isAutoScrollToBottom]);

  useEffect(() => {
    if (!newMessageFlow) return;
    const { scrollHeight, scrollTop, clientHeight } = msgContainerRef.current;

    if (newMessageFlow.indexOf('self') === 0 || scrollHeight - scrollTop - clientHeight < 150) {
      setIsAutoScrollToBottom(true);
    }
  }, [newMessageFlow]);

  // 只看与我相关
  useEffect(() => {
    onlyMeRef.current = onlyMe;
    fetchHistoryMessage();
  }, [onlyMe]);

  // 只看与我相关或者只看老师
  useEffect(() => {
    filterKeyRef.current = filterKey;
    fetchHistoryMessage();
  }, [filterKey]);

  // 清空未读消息
  // useEffect(() => {
  //   if (unreadCount <= 0 || isGroup) return;
  //   if (!newMessageFlow) return;
  //   // eslint-disable-next-line no-useless-return
  //   if (!toId || !isConnected) return;

  //   const id = instance.getUniqueId();
  //   // eslint-disable-next-line new-cap
  //   const msg = new webIM.message('read', id);
  //   const params: any = {
  //     to: toId,
  //     id,
  //   };
  //   if (isGroup) params.chatType = 'groupChat';

  //   msg.set(params);
  //   instance.send(msg.body);
  // }, [unreadCount, toId, isConnected]);

  useEffect(() => {
    zoom.detach('[data-zoomable]');
    zoom.attach('[data-zoomable]');
  }, [msgRecordDict]);

  return (
    <div styleName="chat-x">
      <div styleName="msg">
        <div styleName="msg__loading-more">
          <Loading isLoading={isLoadingMore} />
        </div>

        <ol styleName="msg-list" ref={msgContainerRef}>
          {msgList.map((item) => (
            <Checkbox key={item.id} onChange={(e) => handleChange(e, item)}>
              <li
                styleName={classNames('msg-item', { 'msg-item--rtl': item.isSelf }, { twinkle: item.isTwinkle })}
                key={item.id}
                id={item?.ext?.nickName}
              >
                <Dropdown overlay={renderAvatarContentCxtMenu(item)} trigger={['contextMenu']}>
                  <img src={item?.ext?.avatar || avatar} alt="" styleName="msg__avatar" />
                </Dropdown>

                <div styleName="msg-x">
                  <div styleName="msg__misc">
                    <div styleName="msg__from">
                      {item?.ext?.nickName || item.from}
                    </div>
                    {
                    item.isTeacherSpeak ? (
                      <div styleName={
                        classNames({
                          msg__tag: item.isTeacherSpeak,
                        })
                      }
                      >
                        大师
                      </div>
                    ) : null
                  }

                    <span styleName="msg__date">{item.date}</span>
                  </div>

                  <div styleName={classNames(
                    'msg-content',
                    { 'teacher-speak': item.isTeacherSpeak },
                  )}
                  >
                    {/* 注释引用功能 */}
                    {/* <Dropdown overlay={renderMsgContentCxtMenu(item)} trigger={['contextMenu']}> */}
                    <div>
                      {
                        item?.ext?.quoteMsg && (
                          <div styleName="quote-content">
                            <div styleName="msg__misc">
                              <div styleName="msg__from">
                                {/* <img src={item.ext.avatar || avatar} alt="" styleName="msg__avatar" /> */}
                                {item?.ext?.quoteMsg?.ext?.nickName || item?.ext?.quoteMsg?.fromId}
                              </div>

                              {/* <span styleName="msg__date">{item.ext.quoteMsg.date}</span> */}
                            </div>

                            <div styleName="msg-content">
                              {renderContent(item?.ext?.quoteMsg)}
                            </div>
                          </div>
                        )
                      }
                      {renderContent(item)}
                    </div>
                    {/* </Dropdown> */}
                  </div>
                </div>
              </li>
            </Checkbox>
          ))}
        </ol>
      </div>

      <Drawer
        title="全部成员列表"
        placement="right"
        onClose={closeMemberDrawer}
        open={isShowMemberDrawer}
      >
        {
          memberList?.map((item: any) => (
            <div styleName="member" key={item.id}>
              <p>{item?.nickname}</p>

              <p
                styleName={
                  classNames({
                    muted: muteDict.has(item.id),
                    normal: !muteDict.has(item.id),
                  })
                }
                onClick={() => toggleMuteMember(item.id, item?.imUser, item?.imUser)}
                key={item.id}
              >
                {muteDict.has(item.id) ? '取消禁言' : '禁言'}
              </p>
            </div>
          ))
        }
      </Drawer>

      {
        !isPreviewMode
        && (
          <>
            <div styleName="operation-x">
              {/* <Popover
                placement="top"
                title={null}
                content={renderEmoji()}
                trigger="click"
                open={isShowEmojiBoard}
                onOpenChange={setIsShowEmojiBoard}
              >
                <SmileOutlined styleName="operation-img" />
              </Popover> */}

              <label
                htmlFor={uploadImageId}
                onClick={() => uploadImageRef.current
                  && uploadImageRef.current.focus() && uploadImageRef.current.click()}
              >
                {/* <img src={picture} alt="上传图片" /> */}
                <PictureOutlined styleName="operation-img" />

                <input
                  id={uploadImageId}
                  style={{ display: 'none' }}
                  ref={uploadImageRef}
                  onChange={changeImage}
                  type="file"
                  accept="image/*"
                />
              </label>
            </div>

            <div styleName="ipt-x">
              {renderQuote()}

              <div styleName={classNames({
                'ipt-box': !isAdmin,
                'admin-box': isAdmin,
              })}
              >
                <div
                  styleName="ipt"
                  contentEditable
                  ref={inputRef}
                  onKeyDown={onKeyDown}
                  onFocus={inputOnFocus}
                  onBlur={inputOnBlur}
                  data-placeholder="请输入互动消息......"
                />
              </div>

              <div styleName={classNames({
                ipt__handle: !isAdmin,
                'admin-handle': isAdmin,
              })}
              >
                <div styleName="submit" onClick={send}>发送消息</div>
              </div>
            </div>
          </>
        )
      }
    </div>
  );
});

export default ChatBox;
