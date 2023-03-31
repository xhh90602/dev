/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect, useState } from 'react';
import { PullToRefresh, Toast } from 'antd-mobile';
import { getUrlParam } from '@/utils';
import { postLikeList } from '@/api/module-api/consult';
import iconAddFriend from '@/platforms/mobile/images/icon_add_friend.svg';
import './like-list.scss';
import { NativePages, PageType, openNativePage } from '@/platforms/mobile/helpers/native/msg';
import { FormattedMessage, useIntl } from 'react-intl';
import { addFollow, cancelFollow } from '@/api/module-api/combination';

const param = {
  contentType: 'NEWS',
  id: 1,
  ...getUrlParam(),
};

const ConsultDetail: React.FC = () => {
  const { formatMessage } = useIntl();
  const [likeList, setLikeList] = useState<Record<string, any>[]>([]);
  const fetchLikeList = async () => {
    try {
      const res = await postLikeList({
        contentId: param.id,
        contentType: param.contentType,
      });
      if (res.code === 0) {
        setLikeList(res.result);
      }
    } catch (e) {
      console.log('获取点赞列表失败:', e);
    }
  };

  useEffect(() => {
    console.log('初始化');
    fetchLikeList();
  }, []);

  const openWuquanCenter = (hisId: number, roleCode: string) => {
    openNativePage({
      pageType: PageType.NATIVE,
      path: NativePages.weiquan_center,
      fullScreen: true,
      data: { hisId, roleCode },
    });
  };

  const attention = async (isFollowed: boolean, hisId: number) => {
    try {
      const res = await (isFollowed ? cancelFollow : addFollow)({ hisId });
      if (res.code === 0) {
        fetchLikeList();
      } else {
        Toast.show({ content: formatMessage({ id: 'handle_fail' }) });
        console.log('========操作失败：', res);
      }
    } catch (e) {
      Toast.show({ content: formatMessage({ id: 'handle_fail' }) });
      console.log('========操作异常：', e);
    }
  };

  const addWeiyou = (row) => {
    // 关系：空数组无关系 1好友 2已关注 3被关注 4 自己 5 已添加好友等待对方同意
    if (row.relations.length <= 0) {
      openNativePage({
        pageType: PageType.NATIVE,
        path: NativePages.add_weiyou,
        data: { userId: row.id },
      });
      return;
    }
    if (row.relations.includes(5)) {
      Toast.show({
        content: formatMessage({ id: 'add_friend_tip' }),
      });
    }
  };

  const sendMessage = (imUser: number) => {
    openNativePage({
      pageType: PageType.NATIVE,
      path: NativePages.siliao,
      data: { imUser },
    });
  };

  return (
    <PullToRefresh
      onRefresh={async () => {
        await fetchLikeList();
      }}
    >
      <div styleName="container">
        {likeList.map((item) => (
          <div styleName="cell">
            <div styleName="head">
              <img
                styleName="avatar"
                src={item.avatar}
                alt=""
                onClick={() => openWuquanCenter(item.id, item.roleCode)}
              />
              {item.tagIcon && <img styleName="analyse" src={item.tagIcon} alt="" />}
            </div>
            <div style={{ flex: '1' }}>
              <div styleName="name">{item.nickname}</div>
              <div styleName="user-type" className="num-font">
                {item.tagName}
              </div>
            </div>
            {!item.relations.includes(4) && (
              <>
                {item.roleCode === 'ANALYST'
                  && (item.relations.includes(2) ? (
                    <div styleName="is-attention btn" onClick={() => attention(true, item.id)}>
                      <FormattedMessage id="followed" />
                    </div>
                  ) : (
                    <div styleName="attention btn" onClick={() => attention(false, item.id)}>
                      +<FormattedMessage id="follow" />
                    </div>
                  ))}
                {item.relations.includes(1) ? (
                  <div styleName="send-msg btn" onClick={() => sendMessage(item.id)}>
                    <FormattedMessage id="send_message" />
                  </div>
                ) : (
                  <div styleName="add-friend btn" onClick={() => addWeiyou(item)}>
                    <img src={iconAddFriend} alt="" />
                    <FormattedMessage id="wei_friend" />
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </PullToRefresh>
  );
};

export default ConsultDetail;
