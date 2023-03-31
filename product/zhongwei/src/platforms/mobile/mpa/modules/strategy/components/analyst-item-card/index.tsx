import React, { memo } from 'react';
import { openNativePage, PageType, NativePages } from '@/platforms/mobile/helpers/native/msg';
import { useIntl } from 'react-intl';
import DefaultAvatar from '@/platforms/mobile/images/default_avatar.svg';
import './index.scss';

const AnalystRecommendation: React.FC<any> = memo((props: any) => {
  const { item, index } = props;
  const { formatMessage } = useIntl();

  // 跳转
  const goWeiquanCenter = () => {
    openNativePage({
      pageType: PageType.NATIVE,
      path: NativePages.weiquan_center,
      fullScreen: true,
      data: { hisId: item.id, roleCode: item.roleCode },
    });
  };

  return (
    <div
      styleName={index === 0 ? 'item active' : 'item'}
      className="analyst-card-item"
      onClick={() => goWeiquanCenter()}
    >
      <div styleName="num">{item?.recommendQuantity || 0}</div>
      <div styleName="num-text">{formatMessage({ id: 'number_of_recommended_shares' })}</div>
      <div styleName="avatar-box">
        {
          item?.avatar ? (
            <img styleName="avatar" src={item?.avatar} alt="" />
          ) : (
            <img styleName="avatar" src={DefaultAvatar} alt="" />
          )
        }
        {item?.tagIcon ? (<img styleName="tag-img" src={item.tagIcon} alt="" />) : null}
      </div>
      <div styleName="name">{item?.nickname || ''}</div>
      <div styleName="text">{item?.tagName || ''}</div>
    </div>
  );
});

export default AnalystRecommendation;
