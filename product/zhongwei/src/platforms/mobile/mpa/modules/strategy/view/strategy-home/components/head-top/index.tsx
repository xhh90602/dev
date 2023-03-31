import React, { memo, useState, useEffect } from 'react';
// import { nativeOpenPage } from '@/platforms/mobile/helpers/native/url';
// import { openNativePage, PageType, NativePages } from '@/platforms/mobile/helpers/native/msg';
import { Toast } from 'antd-mobile';
import IconAvatar from '@/platforms/mobile/images/default_avatar.svg';
import IconSearch from '@/platforms/mobile/images/icon_search.svg';
import IconMsg from '@/platforms/mobile/images/icon_msg.svg';

import './index.scss';

const HeadTop: React.FC<any> = memo((props: any) => {
  const { data } = props;
  const [pages, setPages] = useState<any>({ pageNum: 0, pageSize: 10 });

  // 跳转到个人中心
  const goCenter = () => {
    Toast.show({ content: '跳转到个人中心' });
    // openNativePage({
    //   pageType: PageType.NATIVE,
    //   path: NativePages.weiquan_center,
    //   fullScreen: true,
    //   data: { hisId: data.userId, roleCode: data.roleCode },
    // });
  };

  // 跳转到搜索
  const goSearch = () => {
    Toast.show({ content: '跳转到全局搜索' });
  };

  // 跳转到消息中心
  const goMsg = () => {
    Toast.show({ content: '跳转到消息中心' });
  };

  useEffect(() => {
    console.log('data', data);
  }, []);

  return (
    <div styleName="head-top">
      <div styleName="left" onClick={() => goCenter()}>
        <img src={IconAvatar} alt="" />
        <div styleName="user-name">平底锅</div>
      </div>
      <div styleName="right">
        <img styleName="search" src={IconSearch} alt="" onClick={() => goSearch()} />
        <div styleName="msg-box" onClick={() => goMsg()}>
          <img styleName="icon-msg" src={IconMsg} alt="" />
          <span>3</span>
        </div>
      </div>
    </div>
  );
});

export default HeadTop;
