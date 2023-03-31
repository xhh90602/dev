/* eslint-disable max-len */
/**
 * 直播详情页
 * 2022-09-15
 */
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import useAliplayer from '@/hooks/live/use-aliplayer';
import * as miscHelper from '@mobile/helpers/live/misc';
import * as IMAsyncActions from '@mobile/model/IM/async-action';
import { login as IMLogin } from '@mobile/model/IM/reducer';
import * as IMConstant from '@mobile/model/IM/constant';
import * as interfaceLive from '@/api/module-api/live';
import TabsComponent from '@mobile/components/tabs/tabs';
import Avatar from '@mobile-mpa/modules/live/components/live-avatar/live-avatar'; // 直播中组件
import messageHelpers from '@mobile-mpa/modules/live/components/messageHelper';
import { pageClose, openNativePage, PageType, NativePages, sharePage, CShareType, PPageType } from '@mobile/helpers/native/msg';
import { userInfoContext } from '@mobile/helpers/entry/native';
import LivingIcon from '../../../../components/living-icon/liveing-icon';
import './zw-live-detail.scss';
import Player from '../player/player';
import ChatBox from '../chat-box/chat-box';
import MemberList from '../member-list/member-list';
import liveBg from '../../images/livebg.png';
import backIcon from '../../images/back.png';
import share from '../../images/share.png';

const { useState, useEffect, useRef, useMemo, useContext } = React;
const { CHAT_TYPE } = IMConstant;
const { login } = IMAsyncActions;
const { parseUrlBySearch } = miscHelper;
interface ILiveRoom {
  iframeUrl?: string;
}

enum EnumLiveStatus {
  unknown,
  comming,
  live,
  off,
}

enum enumRoomType {
  live = '1',
  record = '2',
}

// const { origin, pathname } = window.location;
const playerId = 'unique-player';
const activeKey = 'chat';
// 从配置文件获取公告内容
// const { CHAT_ROOM_CHECK_STATUS_TIME } = window.GLOBAL_CONFIG.LIVE_CONFIG || {};

// 从url截取参数
const roomType = parseUrlBySearch('roomType') || '1'; // 直播为1,录播从url截取
const liveId = parseUrlBySearch('liveId'); // 录播从url截取liveId
const safeAreaTop = +parseUrlBySearch('safeAreaTop'); // app传递的安全区域高度
const isLive = roomType === enumRoomType.live;
console.log('roomType===>', roomType);

// TODO: 仅做演示用，后续需要删除该字段
const staticIntro = () => (
  <pre>
    如拨云见日，最近半个月，市场的回温让人看到了反弹的曙光，相信很多人有一种雨过天晴的舒适感。但面对重振旗鼓的市场，你真的做好心理准备了吗？&#10;
    市场很少有一帆风顺的年份。就拿最近两年来说，2022年开年市场重挫，但很快触底反弹，后期一路高歌猛进；2023年开始时，许多赛道投资人一时风头无两，但临近年末却跌去了当年一半的收益。&#10;
    市场不乏“一鼓作气，再而衰，三而竭”的现象，但很多时候，我们要用“不以物喜，不以己悲”的心态看待市场。&#10;
    一位中国企业家曾说过一句话：“不是乐观主义者，就不要当企业家，守规矩，向前看，爱中国！”同样，想要投资A股获得成功，也要选择向前看，相信中国。&#10;
    不以物喜，不以己悲。话说回来，若被短时间的市场走势冲昏了头，多是得不偿失的。&#10;
    有位投资大佬在一次演讲中曾说，一条河干了很长时间，水一点点流进来的时候，最先浮起来的是垃圾，到最后浮起来的才是大船。&#10;
    面对市场的涨势，急于抛售手中的股票，往往会得小利而错失大时机。&#10;
  </pre>
);

const LiveDetail: React.FC<ILiveRoom> = (props) => {
  const { formatMessage } = useIntl();
  const { iframeUrl } = props;
  const {
    // queryLiveRoomList,
    // queryLiveInfo,
    // queryLiveList,
    getLiveList, // 获取直播列表
    getMember, // 获取成员列表
    getLiveRecordList, // 获取录播列表
    // addWeiFriend, // 添加薇友
    focus, // 关注分析师
    cancleFocus, // 取消关注分析师
    addRoomMember, // 添加成员
  } = interfaceLive;

  const userInfo = useContext(userInfoContext);
  console.log('userInfo===>', userInfo);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [liveRoomList, setLiveRoomList] = useState<any>([]); // 直播间列表
  const [roomTheme, setRoomTheme] = useState(''); // 直播间标题
  const [roomId, setRoomId] = useState(0); // 直播间id
  const [liveCourseId, setLiveCourseId] = useState(0); // 直播场次id
  const [videoInfo, setVideoInfo] = useState<any>({});
  const [roomInfo, setRoomInfo] = useState<any>({});
  const [activeTab, setActiveTab] = useState(activeKey); // 当前tab
  const [liveStatus, setLiveStatus] = useState(EnumLiveStatus.unknown);
  const [memberList, setMemberList] = useState<any>([]); // 成员列表
  // const [imUserInfo, setImUserInfo] = useState({ user: 'live0002', pwd: '123456' }); // im用户信息
  // const [imUserInfo, setImUserInfo] = useState({
  //   accessToken: 'YWMtt6WHrmS0Ee2dYWXSY_hmHhx8TQvD-0ENlaouKcfPHp1HB8ggXB4R7Y-pFwF7kfmMAwMAAAGEeiDfwDeeSABJR2657TPT8eC2KYn97X2cqMH-olejr27QxJIOw52YGw',
  //   avatar: 'http://183.57.47.83:1280/group1/M00/00/09/CgoL_GL8igGAOoOqAABW0JIFf6k659.jpg',
  //   nickname: '小薇61383828',
  //   user: 'd61383828',
  // }); // im用户信息

  const [followed, setFollowed] = useState(false); // 是否关注
  const [isFriend, setIsFriend] = useState(false); // 是否薇友
  const [hasMore, setHasMore] = useState(false); // 是否还有数据
  const [totalMember, setTotalMember] = useState(0); // 成员总数
  const [cursor, setCursor] = useState(null);
  const timerId = useRef<any>(null); // 轮询定时器
  const pageRef = useRef(null); // page dom
  const dispatch = useDispatch();
  const IMState = useSelector((v: any) => v.IM);
  const alreadySend = new Set(); // 已发送的好友请求
  const { instance, isConnected } = IMState;
  useAliplayer();

  const tabMemo = useMemo(() => {
    const tabList = [
      {
        title: formatMessage({ id: 'chat' }),
        key: 'chat',
        children: null,
      },
      {
        title: formatMessage({ id: 'intro' }),
        key: 'intro',
        children: null,
      },
      {
        title: `${formatMessage({ id: 'member' })}(${totalMember})`,
        key: 'member',
        children: null,
      },
    ];
    if (roomType === '2') {
      setActiveTab('intro');
      return tabList.splice(1, 1);
    }
    return tabList;
  }, [roomType, memberList, totalMember]);

  // 页面顶部安全区域高度
  const marginTop = useMemo(() => safeAreaTop, [safeAreaTop]);

  // 直播/录播详情 roomId => liveId
  // function createRecordPath(info: any) {
  //   return `${origin}${pathname}?theme=white&roomType=
  //   ${enumRoomType.record}&liveId=${info.id}&roomId=${info.liveRoomId}`;
  // }

  // function playVideo(info) {
  //   window.open(createRecordPath(info));
  // }

  // 键盘弹出,修改page style bottom
  const keyboardShow = (e: any) => {
  //   // const { height } = e.detail;
  //   messageHelpers.fail(`${window.innerHeight}px ${window.visualViewport.height}px `);
  //   pageRef.current.style.height = `${window.visualViewport.height}px`;
  };

  // tab切换
  const tabChange = (key) => {
    setActiveTab(key);
  };

  // 返回首页
  const back = () => {
    pageClose(undefined);
  };

  // 关注分析师
  const focusFn = () => {
    const api = followed ? cancleFocus : focus;
    api({ hisId: roomInfo.teacherId }).then((res) => {
      console.log('res===>', res);
      const { code, message } = res;
      if (code === 0) {
        messageHelpers.success(followed ? formatMessage({ id: 'cancel_focus' }) : formatMessage({ id: 'focus_success' }));
        setFollowed(!followed);
      } else {
        console.log('关注===>', message);
      }
    });
  };

  // 关注薇友
  const addWeiFriendFn = (data: any, isfocus: boolean) => {
    console.log('data===>', data);
    console.log('isfocus===>', isfocus);
    console.log('member===>', memberList);
    const api = isfocus ? cancleFocus : focus;
    api({ hisId: roomInfo.teacherId }).then((res) => {
      console.log('res===>', res);
      const { code, message } = res;
      if (code === 0) {
        messageHelpers.success(isfocus ? formatMessage({ id: 'cancel_focus' }) : formatMessage({ id: 'focus_success' }));
        const updateMemberList = memberList.map((item) => {
          if (item.id === data.id) {
            // isfocus为true item.relations push2,为false item.relations 删除2
            if (isfocus) {
              item.relations = item.relations.filter((v) => v !== 2);
            } else {
              item.relations.push(2);
            }
          }
          return item;
        });
        setMemberList(updateMemberList);
        // setFollowed(!followed);
      } else {
        console.log('关注===>', message);
      }
    });
  };

  // 分享直播
  const shareLive = () => {
    // messageHelpers.show('待接入');
    // openNativePage({
    //   pageType: PageType.NATIVE,
    //   path: NativePages.share,
    //   fullScreen: true,
    // });
    sharePage({
      shareType: CShareType.PAGE,
      info: {
        link: `live-detail.html?liveId=${liveId}&roomType=${roomType}`,
        snapshot: false,
        pageType: PPageType.live_room,
        pictureUrl: +roomType === 2 ? roomInfo?.pic : roomInfo?.liveCoursePic,
        title: +roomType === 2 ? roomInfo?.theme : roomInfo?.liveCourseName,
        desc: +roomType === 2 ? roomInfo?.theme : roomInfo?.liveCourseRemark,
        id: roomInfo?.id,
      },
    });
  };

  // 添加薇友
  const addFriend = (data) => {
    console.log('data===>', data);
    if (!data?.id || !data?.imUser) {
      messageHelpers.fail('获取好友信息失败');
      return;
    }
    const { id } = data;
    // 已发送好友请求
    if (data?.relations.includes(5)) {
      messageHelpers.fail('已发送好友请求,请勿重复操作');
      return;
    }
    // 如果是好友 跳转私聊
    if (data?.relations.includes(1)) {
      openNativePage({
        pageType: PageType.NATIVE,
        path: NativePages.siliao,
        fullScreen: true,
        data: { imUser: data.imUser },
      });
      return;
    }
    // 跳转app加好友
    openNativePage({
      pageType: PageType.NATIVE,
      path: NativePages.add_weiyou,
      fullScreen: true,
      data: { userId: id, status: 'add' },
    });
  };

  // 跳转分析师主页
  const goWeiquanCenter = (e, teacherInfo) => {
    console.log('teacherInfo===>', teacherInfo);
    e.stopPropagation();
    if (!teacherInfo?.id || !teacherInfo?.roleCode) {
      messageHelpers.fail(formatMessage({ id: 'error_info' }));
      return;
    }
    openNativePage({
      pageType: PageType.NATIVE,
      path: NativePages.weiquan_center,
      fullScreen: true,
      // TODO 跳转分析师主页需要后台增加roleCode参数
      data: { hisId: teacherInfo.id, roleCode: teacherInfo.roleCode },
    });
  };

  // 获取成员列表
  async function getMemberList() {
    const { code, result } = await getMember({ imRoomId: roomInfo.imId, limit: 10, cursor });
    console.log('getMemberList result===>', result);
    if (code !== 0) {
      messageHelpers.fail('获取成员列表失败');
      return;
    }
    if (result === null) {
      setHasMore(false);
      return;
    }
    const { cursor: cursorRes, count, members } = result;
    if (members?.length) {
      setMemberList((pre) => [...pre, ...members]);
      setHasMore(cursorRes !== null);
      setTotalMember(count);
      setCursor(cursorRes);
    }
  }

  // 获取录播列表
  // TODO 按照录播id查询对应录播,而不是查询全部录播
  function getRecordList() {
    getLiveRecordList({ pageNum: 0, pageSize: 100 }).then((res) => {
      console.log('res===>', res);
      const { code, result } = res;
      const { records } = result;
      if (code === 0 && records?.length > 0) {
        // 从result中过滤出liveid === id的数据
        const recordList = records.filter((item) => item.id === +liveId);
        console.log('recordList===>', recordList);
        if (!recordList?.length) {
          recordList.push(records[0]);
        }
        setRoomTheme(recordList[0].theme);
        // 设置录播老师信息,录播简介
        setRoomInfo({
          // liveCourseRemark: recordList[0]?.teacherRemark,
          // teacherHeader: recordList[0]?.teacherHeader,
          // teacherName: recordList[0]?.teacherName,
          // teacherRemark: recordList[0]?.teacherRemark,
          ...recordList[0],
        });
        // 设置录播地址
        setVideoInfo({
          recordedUrl: recordList[0]?.url,
          userId: recordList[0]?.teacherId,
          platformType: 1,
        });
      }
    });
  }

  // 获取直播间团队介绍
  function getTeam() {
    getLiveList({})
      .then((res) => {
        console.log('res===>', res);
        const { code, result } = res;
        const { records } = result;
        if (code === 0 && records?.length) {
          const liveData = records.filter((item) => item.liveCourseId === +liveId)[0];
          console.log('liveData===>', liveData);
          // 查询是否关注了当前直播
          const relations = liveData?.teacherInfo?.relations;
          if (relations?.length) {
            setFollowed(relations.includes(2));
            setIsFriend(relations.includes(1));
          }
          setLiveRoomList(records);
          setRoomId(liveData.liveRoomId);
          setRoomTheme(liveData.liveCourseName);
          // 如果存在livecourseid,则获取直播间详情
          if (liveData.liveCourseId) {
            setLiveCourseId(liveData.liveCourseId);
          }
          setRoomInfo({
            ...liveData,
            beginTimestamp: +new Date(liveData.startTime.replace(/-/g, '/')),
            endTimestamp: +new Date(liveData.endTime.replace(/-/g, '/')),
          });
          setVideoInfo({
            iframeUrl,
            isLive,
            userId: liveData?.teacherId,
            userName: liveData?.teacherName,
            title: liveData?.liveCourseName,
            ...JSON.parse(liveData?.roomInfo),
            platformType: 1,
            liveRoomId: liveData?.liveRoomId,
          });
        }
      });
  }

  // useEffect(() => {
  //   getIMToken().then((res) => {
  //     console.log('getIMToken  res===>', res);
  //     setImUserInfo(res);
  //   });
  // }, []);

  // 登录环信聊天室
  useEffect(() => {
    if (isConnected || !roomInfo.imId || !userInfo?.user) return;

    dispatch(login(instance, {
      ...userInfo,
      roomId: roomInfo.imId,
      // user: 'live0001',
      // pwd: '123456',
      // user: 'live0001',
      // accessToken: 'YWMtNJmAVDmPEe2y1tFKKDleWEDvkYMPZUejlLooBDKLL2-iJojQONQR7bWlzQziNoN9AwMAAAGDX10B2TeeSACosSAvXwFBTKYRSokw2NLALeY5ZySkQuAPX9CBFUn4xg',
    }));
    dispatch(IMLogin(userInfo));

    // 将用户添加到环信聊天室
    addRoomMember({
      imRoomId: roomInfo.imId,
      imUserName: userInfo.user,
    }).then((res) => {
      console.log('res===>', res);
      const { code, message } = res;
      if (code === 0) {
        // 获取成员列表
        console.log('加入聊天室成功', message);
      }
    });
  }, [isConnected, roomInfo, userInfo]);

  // 获取直播间录播列表
  useEffect(() => {
    if (!liveId) return;
    if (roomType !== '2') {
      getTeam();
    } else {
      getRecordList();
    }
    // let timer;
    // // 如果开始直播,停止轮询
    // if (liveCourseId) return clearInterval(timer);
    // timer = setInterval(() => getTeam(), CHAT_ROOM_CHECK_STATUS_TIME * 1000);
    // return () => clearInterval(timer);
  }, [roomType, liveId]);

  useEffect(() => {
    if (!roomInfo.imId) return;
    getMemberList();
  }, [roomInfo]);

  // 轮询直播间关闭时间
  useEffect(() => {
    if (!roomInfo || !videoInfo.isLive) return undefined;
    const { beginTimestamp, endTimestamp } = roomInfo;

    function run() {
      const now = +new Date();

      if (now < beginTimestamp) {
        setLiveStatus(EnumLiveStatus.comming);
      } else if (now > endTimestamp) {
        setLiveStatus(EnumLiveStatus.off);
      } else {
        setLiveStatus(EnumLiveStatus.live);
      }
    }

    run();
    timerId.current = window.setInterval(run, 5000);

    return () => {
      window.clearInterval(timerId.current);
    };
  }, [roomInfo, videoInfo]);

  return (
    <div styleName="page" ref={pageRef}>
      <div
        styleName="safe-area"
        style={{ height: `${marginTop}px` }}
      />
      <div styleName="nav_bar" style={{ top: `${marginTop}px` }}>
        <div styleName="left-area">
          <img src={backIcon} styleName="back" alt="返回" onClick={back} />
          <div styleName="teacher-wrap" onClick={(e) => goWeiquanCenter(e, roomInfo?.teacherInfo)}>
            <Avatar url={roomInfo?.teacherInfo?.avatar} />
            <div styleName="teacher-intro">
              <span>{roomInfo?.teacherInfo?.nickname}</span>
              <span styleName="teacher-tag">{roomInfo?.teacherInfo?.tagName}</span>
            </div>
          </div>
        </div>
        {/* 关系：空数组无关系 1好友 2已关注 3被关注 4 自己 5 已添加好友等待对方同意 */}
        {/* 如果是自己就不需要这些关注, 加薇友操作 */}
        {
          roomInfo?.teacherInfo?.relations?.includes(4) ? null : (
            <div styleName="right-area">
              <div
                styleName={isFriend ? 'unfocus' : 'addfriend'}
                onClick={() => addFriend(roomInfo?.teacherInfo)}
              >
                {
                  isFriend ? formatMessage({ id: 'send_msg' }) : `+${formatMessage({ id: 'wei_friend' })}`
                }
              </div>
              <div
                styleName={followed ? 'unfocus' : 'focus'}
                onClick={focusFn}
              >
                {
                  followed ? '已关注' : `+${formatMessage({ id: 'focus' })}`
                }
              </div>
              <img
                src={share}
                styleName="share"
                alt="share"
                onClick={shareLive}
              />
            </div>
          )
        }
      </div>
      <div styleName="player-container">
        <div styleName="player" id={playerId}>
          <Player containerId={playerId} videoInfo={videoInfo} />
        </div>
        {
          // 如果不存在userId,则显示封面
          (!videoInfo.userId) ? <div styleName="cover" style={{ backgroundImage: `url(${liveBg})` }} /> : (
            <div styleName="status-icon">
              {roomType === '2' ? <div styleName="record-icon">回放</div> : (<LivingIcon />)}
            </div>
          )
        }
      </div>
      {/* 直播主题与在线人数展示 */}
      <div styleName="live-theme">
        <div styleName="live-title">
          {roomTheme}
        </div>
        {
          roomType !== '2' ? (
            <div styleName="online-num">
              {roomInfo?.showCount}
              {formatMessage({ id: 'people' })}
              {formatMessage({ id: 'online' })}
            </div>
          ) : null
        }
      </div>

      <div styleName="main">
        <div styleName="table-tabs">
          <TabsComponent list={tabMemo} onChange={tabChange} />
        </div>
        <div styleName="tab-container">
          <div style={{
            display: activeTab === 'chat' ? 'block' : 'none',
            height: '100%',
          }}
          >
            <ChatBox
              toId={roomInfo.imId}
              isGroup
              chatType={CHAT_TYPE.chatRoom}
              hasError={liveStatus !== EnumLiveStatus.live}
              // eslint-disable-next-line no-unsafe-optional-chaining
              liveCourseId={liveCourseId}
              keyBoardChange={keyboardShow}
            />
          </div>
          {activeTab === 'intro' && (
            <div styleName="intor-container">
              {roomInfo?.liveCourseRemark || staticIntro()}
            </div>
          )}
          {activeTab === 'member' && (
            <div styleName="member-wrap">
              <MemberList
                member={memberList}
                addFn={addFriend}
                followFn={addWeiFriendFn}
                loadMore={() => getMemberList()}
                hasMore={hasMore}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

LiveDetail.defaultProps = {
  iframeUrl: '',
};

export default LiveDetail;
