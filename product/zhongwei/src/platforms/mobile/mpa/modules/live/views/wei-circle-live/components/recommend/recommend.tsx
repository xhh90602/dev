/**
 * 薇圈热门推荐组件
 * 2022-09-09
 */
import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import LivingIcon from '@mobile-mpa/modules/live/components/living-icon/liveing-icon'; // 直播中组件
import Avatar from '@mobile-mpa/modules/live/components/live-avatar/live-avatar'; // 直播中组件
import messageHelpers from '@mobile-mpa/modules/live/components/messageHelper';
import { openNewPage, openNativePage, PageType, NativePages } from '@/platforms/mobile/helpers/native/msg';
import './recommend.scss';
import defaultAvatar from '@mobile/images/default_avatar.png';
import recommendBg from '../../images/recommend.png';

 interface IPorps{
   data: any,
 }

const Recommend: React.FC<any> = (props: IPorps) => {
  const { data } = props;
  const { formatMessage } = useIntl();
  const tolive = (liveData: any) => {
    openNewPage({
      path: `live-detail.html?liveId=${liveData.liveCourseId}`,
      title: '直播详情',
      fullScreen: true,
      pageType: 1,
    });
  };

  const goWeiquanCenter = (e) => {
    const { teacherInfo } = data;
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

  return (
    <div
      styleName="recommend"
      style={{
        backgroundImage: `url(${data?.liveCoursePic || recommendBg})`,
        backgroundSize: '100% 100%',
      }}
      onClick={() => tolive(data)}
    >
      <LivingIcon />
      <div styleName="recommend-intro">
        <div styleName="title break-line">
          {data?.liveCourseName}
        </div>
        <div styleName="compere" onClick={(e) => goWeiquanCenter(e)}>
          <Avatar url={data?.teacherInfo?.avatar || defaultAvatar} />
          {/* <Avatar url={defaultAvatar} /> */}
          <div styleName="compere-intro">
            <span styleName="name">
              {data?.teacherInfo?.nickname}
            </span>
            <span styleName="intro break-line">
              {data?.teacherInfo?.tagName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommend;
