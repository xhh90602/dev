import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Input, Button, message } from 'antd/es';
import * as IMAsyncActions from '@mobile/model/IM/async-action';
import { login as IMLogin } from '@mobile/model/IM/reducer';
import { getUrlParam } from '@/utils';

import * as miscHelper from '@mobile/helpers/live/misc';
import * as IMConstant from '@mobile/model/IM/constant';
import useIM from '@mobile/model/IM/use-IM';
import {
  queryLiveInfo,
  getLiveRoomDetail,
  getAnalystToken,
} from '@/api/module-api/live-admin';

import GddChatBox from './components/chat-box/chat-box';

import './chat-room-admin.scss';

interface ILiveRoomAdmin {
  IMConfig: any;
  isGdd: boolean;
}

const { token } = getUrlParam({ token: '' });
const { useEffect, useState, useRef } = React;
const { login } = IMAsyncActions;
const { CHAT_TYPE } = IMConstant;
const { parseUrlBySearch } = miscHelper;
// const { enumRoomType } = liveConstant;

// const roomId = parseUrlBySearch('roomId');
const roomId = parseUrlBySearch('id'); // url截取直播间id
const roomType = parseUrlBySearch('roomType');
// const isLive = roomType === enumRoomType.live;

const ChatRoomAdmin: React.FC<ILiveRoomAdmin> = (props) => {
  const { IMConfig = {}, isGdd } = props;
  const dispatch = useDispatch();
  const IMState = useSelector((v: any) => v.IM);
  // const userInfo = useSelector((v: any) => v.app.userInfo);
  // 后台互动管理聊天室修改为以当前老师身份发言
  const [userInfo, setUserInfo] = useState<any>({});
  const [keyWord, setKeyWord] = useState('');
  const [isShowUserList, setIsShowUserList] = useState(false);
  const chatboxRef = useRef<{search: any, delete: any}>(null);
  const { instance } = IMState;

  const [roomInfo, setRoomInfo] = useState<any>({});

  // useQueryUserInfo();
  useIM(IMConfig);

  const handleSearch = () => {
    if (keyWord === '') {
      message.error('请输入用户名');
      return;
    }
    chatboxRef.current?.search(keyWord);
  };

  const handleDelete = () => {
    chatboxRef.current?.delete(keyWord);
  };

  useEffect(() => {
    if (!instance || !userInfo.user || !userInfo.accessToken) return;

    console.log('userInfo===>', userInfo);

    dispatch(login(instance, {
      ...userInfo,
      roomId: roomInfo.imId,
    }));
    dispatch(IMLogin({
      // user: userInfo.imUserName,
      // pwd: userInfo.imUserPwd,
      ...userInfo,
    }));
  }, [instance, userInfo]);

  useEffect(() => {
    if (!roomInfo?.teacherId) return;
    console.log('token===>', token);
    getAnalystToken({
      cid: roomInfo?.teacherId,
    }, {
      token,
    })
      .then((res) => {
        console.log('res===>', res);
        const { code, result } = res;
        if (code === 0) {
          setUserInfo((pre) => ({
            ...pre,
            accessToken: result?.token,
          }));
        } else {
          message.error('当前用户不是分析师!');
        }
      }).catch((err) => {
        console.log(err);
      });
  }, [roomInfo]);

  useEffect(() => {
    getLiveRoomDetail({
      id: roomId,
    })
      .then((res) => {
        console.log('res===>', res);
        const { code, result } = res;
        if (code === 0) {
          setRoomInfo(result);
          setUserInfo({
            user: result?.teacherImUser,
            // imUserPwd: result?.imUserPwd,
            avatar: result?.teacherAvatar,
          });
        }
      }).catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div styleName="page">
      <div styleName="handle-x">
        <div styleName="info">
          <div>
            直播室：
            {roomInfo.id}
            &nbsp;
            直播标题：
            {roomInfo.theme}
          </div>
          <p>
            &nbsp;
            老师：
            {roomInfo.teacherName}
          </p>
        </div>

        <div styleName="search">
          <Input placeholder="搜索用户" onChange={(e) => setKeyWord(e.target.value)} />
          <Button style={{ padding: '0 10px' }} type="primary" onClick={handleSearch}>查询</Button>
        </div>
      </div>
      <div styleName="handle-x">
        <div styleName="info">
          <Button
            style={{
              padding: '0 10px',
              marginLeft: '10px',
            }}
            onClick={handleDelete}
          >
            删除
          </Button>

        </div>

        <div styleName="search">
          <Button style={{ padding: '0 10px' }} type="primary" onClick={() => setIsShowUserList(true)}>全部成员</Button>
        </div>
      </div>

      <div styleName="main">
        <div styleName="chat-x">
          <GddChatBox
            ref={chatboxRef}
            isAdmin
            IMConfig={IMConfig}
            toId={roomInfo.imId}
            isShowMemberDrawer={isShowUserList}
            closeMemberDrawer={() => setIsShowUserList(false)}
            roomId={roomId}
            isGroup
            chatType={CHAT_TYPE.chatRoom}
            chatCheck={roomInfo.chatCheck}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatRoomAdmin;
