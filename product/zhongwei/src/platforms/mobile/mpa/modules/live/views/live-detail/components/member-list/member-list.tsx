/**
 * 直播页面成员列表组件
 * 2022-09-15
 */
import React from 'react';
import { useIntl } from 'react-intl';
import className from 'classnames';
import { generate } from 'shortid';
import { InfiniteScroll } from 'antd-mobile';
import defaultAvatar from '@mobile/images/default_avatar.png';
import addFriend from '../../images/addfriend.png';
import './member-list.scss';

interface IProps {
  member: any,
  addFn: any,
  followFn: any,
  loadMore: any,
  hasMore: boolean,
}

const roleCode = 'ANALYST';

const MemberList:React.FC<IProps> = (props) => {
  const { member, addFn, loadMore, hasMore = false, followFn } = props;
  const { formatMessage } = useIntl();

  const getRealtions = (data: any) => {
    const { relations } = data;
    if (relations.includes(1)) {
      return <>{formatMessage({ id: 'send_msg' })}</>;
    }
    if (relations.includes(5)) {
      return <>{formatMessage({ id: 'already_send' })}</>;
    }
    return (
      <>
        <img src={addFriend} alt="" />
        {formatMessage({ id: 'wei_friend' })}
      </>
    );
  };

  const getFocus = (data) => {
    const { relations } = data;
    if (relations.includes(2)) {
      return <>{formatMessage({ id: 'send_friend' })}</>;
    }
    return (
      <>
        +
        {formatMessage({ id: 'focus' })}
      </>
    );
  };
  return (
    <div styleName="member-container">
      {
        member?.length > 0 ? (
          member.map((item) => (
            <div styleName="member-item" key={generate()}>
              <div styleName="member-intro">
                <img src={item.avatar || defaultAvatar} alt="" styleName="member-avatar" />
                <div styleName="member-name">
                  {item?.nickname}
                </div>
              </div>
              {/* 关系：空数组无关系 1好友 2已关注 3被关注 4 自己 5 已添加好友等待对方同意 */}
              {
                !item.relations.includes(4) ? (
                  <>
                    {
                    item?.roleCode === roleCode ? (
                      <div
                        styleName={className(
                          'btn',
                          item.relations.includes(2) ? 'sent' : 'focus-friend',
                        )}
                        onClick={() => followFn(item, item.relations.includes(2))}
                      >
                        {getFocus(item)}
                      </div>
                    ) : null
                  }
                    <div
                      styleName={className(item.relations.includes(1) ? 'sent' : 'add-friend')}
                      onClick={() => addFn(item)}
                    >
                      {getRealtions(item)}
                    </div>
                  </>

                ) : null
              }
            </div>
          ))
        ) : null
      }
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
    </div>
  );
};

export default MemberList;
