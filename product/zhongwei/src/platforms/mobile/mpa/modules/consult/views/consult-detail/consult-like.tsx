import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import { NativePages, openNativePage, openNewPage, PageType } from '@/platforms/mobile/helpers/native/msg';
import IconSvg from '@/platforms/mobile/components/icon-svg';

import './consult-detail.scss';

const ConsultLike: React.FC<any> = memo((props) => {
  const { id, contentType, contentData } = props;

  const { formatMessage } = useIntl();

  const goToLikeList = () => {
    openNewPage({
      path: `like-list.html?id=${id}&contentType=${contentType}`,
      title: formatMessage({ id: 'like_list' }),
      pageType: PageType.HTML,
    });
  };

  const openWuquanCenter = (hisId: number, roleCode: string) => {
    openNativePage({
      pageType: PageType.NATIVE,
      path: NativePages.weiquan_center,
      fullScreen: true,
      data: { hisId, roleCode },
    });
  };

  return (
    <div styleName="like">
      <div styleName="module-title">
        {formatMessage({ id: 'like' })}
        <span styleName="count-num" className="num-font">
          {contentData.likeCount}
        </span>
      </div>
      <div styleName="avat">
        {contentData.likes.slice(0, 2).map((item) => (
          <img src={item.avatar} key={item.id} alt="" onClick={() => { openWuquanCenter(item.id, item.roleCode); }} />
        ))}
        {contentData.likes.length > 0 && (
          <i onClick={goToLikeList}>
            <IconSvg path="icon_more_like" />
          </i>
        )}
      </div>
    </div>
  );
});

export default ConsultLike;
