import React, { useState, useEffect } from 'react';
import './past-activities.scss';
import dayjs from 'dayjs';
import { useIntl } from 'react-intl';
import { getActivitys } from '@/api/module-api/activity';
import Loading from '@mobile/components/loading/loading';
import { openNewPage, PageType } from '@/platforms/mobile/helpers/native/msg';
import ActivityOption from './components/activity-option/activity-option';
import newOpenAcconuntBg from './images/new_open_acconunt_bg.png';
import inviteFriendsBg from './images/invite_friends_bg.png';

import noDataPic from './images/no-activitys.png';

const PastActivities: React.FC = () => {
  const { formatMessage } = useIntl();
  const [list, setList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  const activitylist = [
    {
      id: 1,
      time: '2022/10/19',
      theme: formatMessage({ id: 'open_account_has_gift' }), // 开户有礼
      intro: formatMessage({ id: 'gets_50_minus_after_opening_account' }), // '好友完成开户后各得50薇币'
      botton: formatMessage({ id: 'open_account_right_now' }), // '立即开户'
      title: formatMessage({ id: 'open_account_has_gift' }), // '开户有礼'
      background: { background: `url(${newOpenAcconuntBg})`, backgroundSize: 'cover' },
      buttonBg: { background: '#FA6D16' },
    },
    {
      id: 2,
      time: '2022/10/19',
      theme: formatMessage({ id: 'get_rewards_for_inviting_friends' }), // '邀请好友得奖励'
      intro: formatMessage({ id: 'open_account_has_gift' }), // '好友完成开户后各得50薇币'
      botton: formatMessage({ id: 'inviting_friends' }), // '邀请好友'
      title: formatMessage({ id: 'inviting_friends_open_account' }), // '邀请好友开户'
      background: { background: `url(${inviteFriendsBg})`, backgroundSize: 'cover' },
      buttonBg: { background: '#5385F4' },
    },
  ];

  useEffect(() => {
    getActivitys({
      tiemType: 2, // 时间类型， 1现在 2历史
    }).then((res) => {
      if (res.code === 0) {
        const newResult = res.result.map((item) => {
          const newItem = activitylist.find((val) => (val.id === item.id));
          if (newItem) {
            return {
              ...newItem,
              title: item.theme,
              background: { background: `url(${item.cover})`, backgroundSize: 'cover' },
              time: dayjs(item.endTime).format('YYYY/MM/DD'),
            };
          }
          return item;
        });
        setList(newResult);
      }
    }).catch((err) => {
      console.log('err===>', err);
    }).finally(() => setIsLoading(false));
  }, []);

  console.log('list', list);

  // 跳转到开户有礼
  const goOpenAccountGiftPage = (id) => {
    openNewPage({
      fullScreen: true,
      pageType: PageType.HTML,
      path: `open-account-gift.html?id=${id}`,
      replace: false,
    });
  };
  // 跳转到邀请好友开户礼
  const goInviteFriendsOpenAccountPage = (id) => {
    openNewPage({
      fullScreen: true,
      pageType: PageType.HTML,
      path: `invite-friends-open-account.html?id=${id}`,
      replace: false,
    });
  };

  const goActivityPage = (id) => {
    if (id === 1) {
      goOpenAccountGiftPage(id);
    }
    if (id === 2) {
      goInviteFriendsOpenAccountPage(id);
    }
  };

  return (
    <Loading isLoading={isLoading}>
      <div styleName="page">
        {
        !list.length ? (
          <div styleName="no-data">
            <div styleName="no-data-pic">
              <img src={noDataPic} alt="" />
            </div>

            <div styleName="text">
              {/* 暂无活动 */}
              {formatMessage({ id: 'no_activitys' })}
            </div>
          </div>
        )
          : list.map((item) => (
            <div key={item.id} onClick={() => goActivityPage(item.id)}><ActivityOption data={item} /></div>
          ))

      }
      </div>
    </Loading>
  );
};

export default PastActivities;
