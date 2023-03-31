// import { createReducer } from 'redux-go';
import { createSlice } from '@reduxjs/toolkit';

import dayjs from 'dayjs';
import { get } from 'lodash-es';
import WebIM from 'easemob-websdk';
import { IM_STATUS_ENUM, ALERT_LIST_ACTIONS, CHAT_TYPE } from '@mobile/model/IM/constant';
import { parseMsg } from '../../helpers/live/misc';

// import * as actions from './action';

const initialState: any = {
  accountInfo: {},
  instance: null,
  webIM: WebIM,
  isConnected: false,
  status: -1,
  sendQueue: {},
  msgRecordDict: {},
  alertList: [],
};

export const ChatSlice = createSlice({
  name: 'live-chat',
  initialState: JSON.parse(JSON.stringify(initialState)),
  reducers: {
    login: (state, action) => ({
      ...state,
      accountInfo: action.payload,
    }),
    logout: (state) => ({
      ...state,
      accountInfo: {},
      msgRecordDict: {},
      alertList: [],
      isConnected: false,
      status: -1,
    }),
    setAlertList: (state, action) => {
      const { type, data } = action.payload;
      const nextAlertList = state.alertList;

      switch (type) {
        case ALERT_LIST_ACTIONS.push:
          nextAlertList.push(data);
          break;
        case ALERT_LIST_ACTIONS.unshift:
          nextAlertList.splice(0, 1);
          break;
        default:
          break;
      }

      return {
        ...state,
        alertList: [...nextAlertList],
      };
    },
    setStatus: (state, action) => {
      const nextStatus = action.payload;

      return {
        ...state,
        status: nextStatus,
        isConnected: nextStatus === IM_STATUS_ENUM.open,
      };
    },
    setInstance: (state, action) => ({
      ...state,
      instance: action.payload,
    }),
    setMsgRecordDict: (state, action) => {
      const { msgRecordDict } = state;
      const { id, data, pageNum } = action.payload;

      console.log('setMsgRecordDict', data);

      return {
        ...state,
        msgRecordDict: {
          ...msgRecordDict,
          [id]: {
            newMessageFlow: '0',
            pageNum,
            data: data.map((item) => ({
              ...item,
              content: parseMsg(item.sourceMsg),
            })),
          },
        },
      };
    },
    pushSendQueue: (state, action) => {
      const { sendQueue } = state;
      const { id } = action.payload;

      sendQueue[id] = action.payload;
      return { ...state, sendQueue };
    },
    pushMessage: (state, action) => {
      const { msgRecordDict, sendQueue, accountInfo } = state;
      let data = action.payload;

      console.log('收到了消息', data);
      console.log('accountInfo', state.accountInfo);

      let id = (data.type === CHAT_TYPE.singleChat) ? data.from : data?.to;
      if (data.isSelf || data.from === accountInfo.username) {
        data = sendQueue[data.id];
        id = data?.to;

        delete sendQueue[data.id];
        if (!data) {
          return { ...state };
        }
      }

      const { data: msgList, unreadCount } = get(msgRecordDict, `${id}`, { data: [], unreadCount: 0 });
      const { time } = data;

      msgList.push({
        isSelf: false,
        date: dayjs(+time).format('YYYY-MM-DD HH:mm:ss'),
        content: parseMsg(data.sourceMsg),
        ...data,
      });

      let nextUnreadCount = unreadCount || 0;
      if (!data.isSelf) {
        nextUnreadCount += 1;
      }

      return {
        ...state,
        sendQueue: { ...sendQueue },
        msgRecordDict: {
          ...state.msgRecordDict,
          [id]: {
            newMessageFlow: `${
              data.isSelf ? 'self' : ''
            }__${performance.now()}`,
            data: msgList,
            unreadCount: nextUnreadCount,
          },
        },
      };
    },
  },
});

export const {
  login,
  logout,
  setStatus,
  setInstance,
  setMsgRecordDict,
  pushMessage,
  pushSendQueue,
  setAlertList,
} = ChatSlice.actions;

export default ChatSlice.reducer;
