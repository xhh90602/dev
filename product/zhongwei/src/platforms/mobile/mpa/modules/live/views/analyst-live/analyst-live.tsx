/**
 * 分析师主页直播
 * 2022-09-13
 */
import React, { useState, useEffect, useContext } from 'react';
import shortid from 'shortid';
import { useIntl } from 'react-intl';
import { InfiniteScroll, DotLoading } from 'antd-mobile';
import useLiveList from '@/hooks/live/use-live-list';
import messageHelpers from '@mobile-mpa/modules/live/components/messageHelper';
import { userInfoContext } from '@mobile/helpers/entry/native';
import { nativeOpenPage } from '@/platforms/mobile/helpers/native/url';
import { subscribeLive } from '@/api/module-api/live';
import './analyst-live.scss';
import timeIcon from '@mobile/images/time.png';
import playIcon from '@mobile/images/icon_play.png';
import { openNewPage } from '@/platforms/mobile/helpers/native/msg';
import NoMore from '../wei-circle-live/components/no-more/no-more'; // 没有更多组件
import LivingIcon from '../../components/living-icon/liveing-icon';
import recommendBg from '../wei-circle-live/images/recommend.png';

const AnalystLive: React.FC<any> = () => {
  const { formatMessage } = useIntl();
  const [liveData, setLiveData] = useState<any>([]);
  // 已预约过直播的liveCourseId的集合
  const liveCourseIdSet = new Set();
  const userInfo = useContext(userInfoContext);
  const { preList, record, live, hasMore, getRecordData } = useLiveList();

  const getImageUrl = (data: any) => {
    const { type } = data;
    if (type === 1) {
      return data?.liveCoursePic || recommendBg;
    } if (type === 2) {
      return data?.liveCoursePic || recommendBg;
    } if (type === 3) {
      return data?.pic || recommendBg;
    }
    return recommendBg;
  };

  // 跳转分析师直播详情
  const toLive = (data: any) => {
    console.log('data===>', data);
    if (data.type === 1) {
      openNewPage({
        path: 'live-detail.html',
        title: '直播详情',
        fullScreen: true,
        pageType: 1,
      });
    } else if (data.type === 3) {
      openNewPage({
        path: `live-detail.html?roomType=2&liveId=${data.id}`,
        title: '录播详情',
        fullScreen: true,
        pageType: 1,
      });
    }
  };

  // 预约直播
  const subscribe = (data: any) => {
    console.log('data===>', data);
    if (!data.liveCourseId) return;
    // 如果liveCourseIdSet中存在data.liveCourseId，则表示已预约过，不再重复预约
    if (liveCourseIdSet.has(data.liveCourseId)) {
      messageHelpers.fail('已预约过该场直播');
      return;
    }
    subscribeLive({
      liveCourseId: data.liveCourseId,
      userId: userInfo.userId,
    }).then((res: any) => {
      console.log('res===>', res);
      const { code, message } = res;
      if (code === 0) {
        liveCourseIdSet.add(data.liveCourseId);
        messageHelpers.success(formatMessage({ id: 'subscribe_success' }));
      } else {
        messageHelpers.fail(message);
      }
    }).catch((err: any) => {
      console.log('err===>', err);
    });
  };

  // 播放录播
  const playRecord = (recordData: any) => {
    console.log('recordData===>', recordData);
    nativeOpenPage('live-detail.html');
    messageHelpers.success(formatMessage({ id: 'playback' }));
  };

  useEffect(() => {
    const liveList = live.map((item) => ({
      ...item,
      type: 1,
    }));
    const preListData = preList.map((item) => ({
      ...item,
      type: 2,
    }));
    const recordData = record.map((item) => ({
      ...item,
      type: 3,
    }));
    setLiveData([...liveList, ...preListData, ...recordData]);
  }, [preList, record, live]);

  return (
    <div
      styleName="live-container"
    >
      {liveData.map((item: any) => (
        <div
          styleName="list-item"
          key={shortid.generate()}
          style={{
            backgroundImage: `url(${getImageUrl(item)})`,
            backgroundSize: '100% 100%',
          }}
          onClick={() => toLive(item)}
        >
          {
            item?.type === 1 && (
              <div styleName="icon">
                <LivingIcon />
              </div>
            )
          }
          {
            item?.type === 2 && (
              <>
                <div styleName="icon preview">
                  {formatMessage({ id: 'preview' })}
                </div>
                <div styleName="appointment-btn" onClick={() => subscribe(item)}>
                  <img src={timeIcon} alt="" />
                  {formatMessage({ id: 'appointment' })}
                </div>
              </>
            )
          }
          {
            item?.type === 3 && (
              <>
                <div styleName="icon-record">
                  <div styleName="name record-item">
                    {formatMessage({ id: 'playback' })}
                  </div>
                  <div styleName="time record-item">
                    {item?.duration}
                  </div>
                </div>
                <img src={playIcon} alt="" styleName="play-btn" onClick={() => playRecord(item)} />
              </>
            )
          }
          <div styleName="live-intro">
            <div styleName="title break-line">
              {
               (item?.type === 3 && (item.theme)) || item.liveCourseName
              }
            </div>
          </div>
        </div>
      ))}

      <InfiniteScroll
        loadMore={async () => getRecordData(true)}
        hasMore={hasMore}
        threshold={100}
      >
        {
          hasMore && (
            <>
              <span>{formatMessage({ id: 'loading' })}</span>
              <DotLoading />
            </>
          )
        }
        {
          record && record.length > 0 && !hasMore && (
            <NoMore />
          )
        }
      </InfiniteScroll>
    </div>
  );
};

export default AnalystLive;
