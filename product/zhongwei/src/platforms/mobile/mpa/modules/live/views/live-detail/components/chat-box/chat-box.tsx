import * as React from 'react';
import classNames from 'classnames';
// import { useSelector } from 'react-redux';
import { Toast, Loading, Popover, Image } from 'antd-mobile';
import { CloseOutline } from 'antd-mobile-icons';
import * as IMConstant from '@mobile/model/IM/constant';
import { emojiSourceDict } from '@mobile/helpers/live/emoji';
import { getLiveLikeNum } from '@/api/module-api/live';
import useChatBox from '@/hooks/live/use-chat-box';
import { throttle } from '@/utils';
import dayjs from 'dayjs';
import { useIntl } from 'react-intl';
import { parseQuoteContent } from './utils';
import messageHelpers from '../../../../components/messageHelper';
import './chat-box.scss';

// import { chooseAPhoto } from '../../native/register';
// import { openAlbum, takePhotos } from '../../native/msg';
// import imgPhoto from './images/photo.svg';
// import imgTakePhotos from './images/take-photos.svg';
// import imgPhotoChoose from './images/photo-choose.svg';
// import imgSmile from '../../images/smile.svg';
import avator from '../../images/touxiang.png';
import likeIcon from '../../images/givelike.png';

const emojiSourceList = Object.keys(emojiSourceDict);
const { useEffect, useState, useRef, useMemo } = React;
const { MSG_TYPE } = IMConstant;

interface IProps {
  toId: string;
  isGroup: boolean;
  chatType: string;
  teacherMid?: Array<number>;
  hasError?: boolean,
  liveCourseId: string | number, // 直播间id
  keyBoardChange: (e: any) => void,
}

const msgHelper = {
  error: (msg) => Toast.show({
    icon: 'fail',
    content: msg,
  }),
  success: (msg) => Toast.show({
    icon: 'success',
    content: msg,
  }),
  tip: (msg) => Toast.show({
    content: msg,
  }),
};

const ChatBox: React.FC<IProps> = (props) => {
  const {
    toId, isGroup, chatType, teacherMid, hasError,
    liveCourseId, keyBoardChange,
  } = props;
  // const IMState = useSelector((v: any) => v.IM);
  // const { isConnected } = IMState;

  const msgContainerRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const { formatMessage } = useIntl();

  // useAlert();

  const {
    isLoadingMore,
    send,
    quoteMsg, chooseMsgContentCtxMenu, clearQuoteMsg,
    // uploadImage,
    messageData,
  } = useChatBox({
    toId,
    isGroup,
    chatType,
    msgContainerRef,
    inputRef,
    msgHelper,
    teacherMid,
    hasError,
  });
  const [isShowEmojiBoard, setIsShowEmojiBoard] = useState<boolean>(false);
  // const [isShowPhotosActions, setIsShowPhotosActions] = useState<boolean>(false);
  const [likeNum, setLikeNum] = useState(0); // 点赞数
  const [marginBottom, setMarginBottom] = useState(0); // 聊天室距离底部的距离

  // 判断设备是否为ios
  const isIos = useMemo(() => {
    const u = navigator.userAgent;
    return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  }, []);

  useEffect(() => {
    setMarginBottom(isIos ? 10 : 0);
  }, [isIos]);

  function sendMsg() {
    const { innerHTML } = inputRef.current;

    send(innerHTML, false).then(() => {
      inputRef.current.innerHTML = '';
    }).catch((err) => {
      console.log('err===>', err);
    });
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') {
      sendMsg();
      e.preventDefault();
    }
  }

  // const onFocus = (e) => {
  //   setTimeout(() => {
  //     // messageHelpers.success(`点赞成功${document.body.clientHeight}`);
  //     // document.body.style.bottom = `${window.innerHeight - document.body.clientHeight}px`;
  //     // 获取id为root的节点
  //     // const root = document.getElementById('root');
  //     // root.style.height = `${document.body.clientHeight}px`;
  //     keyBoardChange(e);
  //   }, 1000);
  // };

  async function givelike() {
    const likeRes = await getLiveLikeNum({
      // TODO 暂时写死参数
      liveCourseId,
    });
    console.log('likeRes===>', likeRes);
    const { code, result } = likeRes;
    if (code === 0) {
      setLikeNum(result);
      messageHelpers.success('点赞成功');
    } else {
      messageHelpers.fail('点赞失败');
    }
  }

  function clickBlank() {
    setIsShowEmojiBoard(false);
    // setIsShowPhotosActions(false);
    inputRef.current.blur();
  }

  function chooseEmoji(v) {
    // setIsShowEmojiBoard(false);
    // inputRef.current.innerHTML += v;
    inputRef.current.innerHTML += v;
  }

  // function toggleEmoji() {
  //   setIsShowPhotosActions(false);
  //   setIsShowEmojiBoard(!isShowEmojiBoard);
  // }

  // function togglePhotosActions() {
  //   setIsShowEmojiBoard(false);
  //   setIsShowPhotosActions(!isShowPhotosActions);
  // }

  function renderContent(info: any, isQuote = false): React.ReactElement {
    if (!info) return (<div />);
    const { contentsType, content } = info;

    switch (contentsType) {
      case MSG_TYPE.TEXT: case MSG_TYPE.UPPERTEXT:
        return (
          <div
            styleName={classNames({ 'quote-content--single': isQuote })}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: isQuote ? parseQuoteContent(content) : content }}
          />
        );
      case MSG_TYPE.IMAGE: return isQuote ? <div>[图片]</div> : <Image src={info.url} alt={info.filename} />;

      default: return (<div />);
    }
  }

  // 进入页面获取当前点赞数
  useEffect(() => {
    if (!liveCourseId) return;
    getLiveLikeNum({
      // TODO 暂时写死参数
      liveCourseId,
    }).then((res) => {
      console.log(res);
      const { code, result } = res;
      if (code === 0) {
        setLikeNum(result);
      }
    }).catch((err) => {
      console.log('err===>', err);
    });
  }, [liveCourseId]);

  // useEffect(() => {
  //   const fn = () => {
  //     setIsShowEmojiBoard(false);
  //     setIsShowPhotosActions(false);
  //   };

  //   inputRef.current.addEventListener('focus', fn);
  //   return () => inputRef.current?.removeEventListener('focus', fn);
  // }, []);

  // useEffect(() => {
  //   if (!isConnected) return;

  //   chooseAPhoto((res) => {
  //     console.log('chooseAPhoto  res===>', res);
  //     uploadImage(`data:image/${res.type || 'png'};base64,${res.data}`)
  //       .then((path) => {
  //         send(`<img src="${path}" />`, true);
  //       });
  //   });
  // }, [isConnected, toId]);

  return (
    <div styleName="chat-x">
      <div styleName="msg" onClick={clickBlank}>
        <div styleName="msg-loading-more">
          {isLoadingMore && <Loading color="primary" />}
        </div>

        <ol styleName="msg-list" ref={msgContainerRef}>
          {messageData.map((item) => (
            <li
              styleName={classNames('msg-item', { 'msg-item--rtl': item.isSelf })}
              key={item.id}
            >
              <img src={item?.ext?.avatar ? item?.ext?.avatar : avator} alt="" styleName="msg-avatar" />

              <div styleName="msg-x">
                <div styleName="msg-misc">
                  <div styleName="msg-from">
                    {item.ext.nickName?.slice(0, 6) || item.from?.slice(0, 6)}
                  </div>

                  <span styleName="msg-date">{dayjs(item.date).format('YYYY/MM/DD HH:mm:ss')}</span>
                </div>

                <Popover.Menu
                  actions={[{ text: '引用', key: 'quote' }]}
                  onAction={(v) => chooseMsgContentCtxMenu(v, item)}
                  placement="bottomLeft"
                >
                  <div
                    styleName="msg-content"
                  >
                    {
                      item.ext.quoteMsg && (
                        <div styleName="quote-content">
                          <div styleName="msg-misc">
                            <div styleName="msg-from">
                              {item.ext.quoteMsg.ext.nickName || item.ext.quoteMsg.from}
                            </div>

                            <span styleName="msg-date">{item.ext.quoteMsg.date}</span>
                          </div>
                          <div
                            styleName={
                              classNames({
                                'msg-content-quote': true,
                              })
                            }
                          >
                            {renderContent(item.ext.quoteMsg)}
                          </div>
                        </div>
                      )
                    }

                    {renderContent(item)}
                  </div>
                </Popover.Menu>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div styleName="ipt-x">
        <div styleName="ipt-box" style={{ marginBottom: `${marginBottom}px` }}>
          {/* <div styleName="ipt-emoji" onClick={toggleEmoji}>
            <img src={imgSmile} alt="" />
          </div>
          <div styleName="ipt-photo" onClick={togglePhotosActions}>
            <img src={imgPhoto} alt="" />
          </div> */}
          <div styleName="ipt-area">
            <div
              styleName="ipt"
              contentEditable
              ref={inputRef}
              onKeyDown={onKeyDown}
              // onFocus={onFocus}
              data-placeholder={formatMessage({ id: 'placeholder' })}
            />

            {
              quoteMsg
              && (
                <div styleName="ipt-quote">
                  <p styleName="ipt-content">
                    {quoteMsg.ext.nickName || quoteMsg.from}
                    ：
                    {renderContent(quoteMsg, true)}
                  </p>

                  <div styleName="ipt-close" onClick={clearQuoteMsg}>
                    <CloseOutline />
                  </div>
                </div>
              )
            }
          </div>
          <div styleName="submit" onClick={throttle(givelike, 500)}>
            <img src={likeIcon} alt="点赞" />
            <span>
              {likeNum > 999 ? '999+' : likeNum}
            </span>
          </div>
        </div>

        {
          isShowEmojiBoard
          && (
            <ol styleName="emoji operate">
              {
                emojiSourceList.map((item) => (
                  <li styleName="emoji-item" onClick={() => chooseEmoji(item)} key={item}>
                    <img src={emojiSourceDict[item]} alt="" />
                  </li>
                ))
              }
            </ol>
          )
        }

        {/* {
          isShowPhotosActions
          && (
            <div styleName="photos-actions operate">
              <div styleName="photos-actions-item" onClick={openAlbum}>
                <div styleName="photos-actions-icon-box">
                  <img src={imgPhotoChoose} alt="" styleName="photos-actions-icon" />
                </div>

                <p styleName="photos-actions-name">相册</p>
              </div>

              <div styleName="photos-actions-item" onClick={takePhotos}>
                <div styleName="photos-actions-icon-box">
                  <img src={imgTakePhotos} alt="" styleName="photos-actions-icon" />
                </div>

                <p styleName="photos-actions-name">拍照</p>
              </div>
            </div>
          )
        } */}
      </div>
    </div>
  );
};

ChatBox.defaultProps = {
  // isTextLive: false,
  // linkedTextLiveRoomId: '',
  // closeMemberDrawer: Function.prototype,
  // isShowMemberDrawer: false,
  teacherMid: [],
  hasError: false,
};

export default ChatBox;
