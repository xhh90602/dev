/**
 * 薇圈热门推荐组件
 * 2022-09-09
 */
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import dayjs from 'dayjs';
import { subscribeLive } from '@/api/module-api/live';
import messageHelpers from '@mobile-mpa/modules/live/components/messageHelper';
import Avatar from '@mobile-mpa/modules/live/components/live-avatar/live-avatar'; // 直播中组件
// import { nativeOpenPage } from '@/platforms/mobile/helpers/native/url';
import { openNewPage, openNativePage, PageType, NativePages } from '@/platforms/mobile/helpers/native/msg';
import './list-item.scss';
import subscribeIcon from '@mobile/images/subscribe-icon.png';
import recordbg0 from '../../images/record1.png';
import recordbg1 from '../../images/record2.png';
import recordbg2 from '../../images/record3.png';
import recordbg3 from '../../images/record4.png';

 interface IPorps{
  marginBottom: number,
  type: string, // 预告或者回放
  data: any,
  userInfo: any,
 }

const Recommend: React.FC<IPorps> = (props) => {
  const { marginBottom, type, data, userInfo } = props;
  const { formatMessage } = useIntl();
  const [alreadyAppointment, setAlreadyAppointment] = useState<any>([]);
  const toLive = (teacherInfo: any) => {
    if (type === 'record') {
      // nativeOpenPage(`live-detail.html?roomType=2&liveId=${data.id}`);
      openNewPage({
        path: `live-detail.html?roomType=2&liveId=${data.id}`,
        title: '直播详情',
        fullScreen: true,
        pageType: 1,
      });
      // messageHelpers.success(formatMessage({ id: 'live' }) + formatMessage({ id: 'playback' }));
    } else {
      // 预告需要跳转分析师主页
      // messageHelpers.show('等待跳转app分析师主页');
      openNativePage({
        pageType: PageType.NATIVE,
        path: NativePages.weiquan_center,
        fullScreen: true,
        data: { hisId: teacherInfo.id, roleCode: teacherInfo.roleCode },
      });
    }
  };

  // 随机取值默认封面
  const randomBg = () => {
    const random = Math.floor(Math.random() * 4);
    switch (random) {
      case 0:
        return recordbg0;
      case 1:
        return recordbg1;
      case 2:
        return recordbg2;
      case 3:
        return recordbg3;
      default:
        return recordbg0;
    }
  };

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
      data: { hisId: teacherInfo.id, roleCode: teacherInfo.roleCode },
    });
  };

  // 预约直播
  const subscribe = (event, liveData: any) => {
    event?.stopPropagation();
    if (!liveData.liveCourseId) return;
    if (alreadyAppointment.includes(liveData.id)) {
      messageHelpers.fail(formatMessage({ id: 'alreadyAppointment' }));
      return;
    }
    subscribeLive({
      liveCourseId: liveData.liveCourseId,
      userId: userInfo.userId,
    }).then((res) => {
      console.log('预约res===>', res);
      const { code, message } = res;
      if (code === 0) {
        setAlreadyAppointment([...alreadyAppointment, liveData.liveCourseId]);
        messageHelpers.success(formatMessage({ id: 'appointment_tip' }));
      } else {
        messageHelpers.fail(message);
      }
    }).catch((err: any) => {
      console.log('err===>', err);
    });
  };

  return (
    <div
      style={{ marginBottom: `${marginBottom / 100}rem` }}
      styleName="recommend"
      onClick={() => toLive(data?.teacherInfo)}
    >
      <div
        styleName="top-banner"
        style={{
          backgroundImage: `url(${type === 'preview' ? data?.liveCoursePic : data?.pic || randomBg()})`,
          backgroundSize: '100% 100%',
        }}
      >
        {
          type === 'preview' && (
            <div styleName="icon-preview">
              {formatMessage({ id: 'preview' })}
            </div>
          )
        }
        {
          type === 'record' && (
            <div styleName="icon-record">
              <div styleName="name record-item">
                {formatMessage({ id: 'playback' })}
              </div>
              <div styleName="time record-item">
                {data?.duration || '00:00'}
              </div>
            </div>
          )
        }
      </div>
      <div styleName="recommend-intro">
        <div styleName="title break-line">
          {type === 'preview' ? (data?.liveCourseName || '--') : (data?.theme || '--')}
        </div>
        <div styleName="compere intro-area" onClick={(e) => goWeiquanCenter(e, data?.teacherInfo)}>
          <Avatar url={data?.teacherInfo?.avatar} />
          <div styleName="compere-intro">
            <div styleName="compere-name">
              {data?.teacherInfo?.nickname}
            </div>
            <div styleName="intro break-line">
              {data?.teacherInfo?.tagName}
            </div>
          </div>
        </div>
        {
          type === 'preview' && (
            <div styleName="appointment-area intro-area">
              <div
                styleName="appointment-btn"
                style={{
                  backgroundImage: `url(${subscribeIcon})`,
                  backgroundSize: '0.92rem 0.36rem',
                  backgroundRepeat: 'no-repeat',
                }}
                onClick={(e) => subscribe(e, data)}
              >
                <span>
                  {formatMessage({ id: 'appointment' })}
                </span>
              </div>
              <div styleName="appointment-time">
                {dayjs(data?.beginDate).format('MM/DD HH:mm')}
                开始
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default Recommend;
