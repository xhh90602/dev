import React, { useState, useEffect } from 'react';
import './activity-center.scss';
import { useIntl } from 'react-intl';
import dayjs from 'dayjs';
import { openNewPage, PageType, settingNavigationTitle } from '@/platforms/mobile/helpers/native/msg';
import { getActivitys } from '@/api/module-api/activity';
import Loading from '@mobile/components/loading/loading';
import ActivityOption from './components/activity-option/activity-option';
import logo1 from './images/icon_my_coupon.png';
import logo2 from './images/icon_my_wei_coin.png';
import newOpenAcconuntBg from './images/new_open_acconunt_bg.png';
import inviteFriendsBg from './images/invite_friends_bg.png';

const ActivityCenter: React.FC = () => {
  const { formatMessage } = useIntl();
  // const activitylist = [
  //   {
  //     id: 1,
  //     time: '2022/10/19',
  //     theme: formatMessage({ id: 'open_account_has_gift' }), // 开户有礼
  //     intro: formatMessage({ id: 'gets_50_minus_after_opening_account' }), // '好友完成开户后各得50薇币'
  //     botton: formatMessage({ id: 'open_account_right_now' }), // '立即开户'
  //     title: formatMessage({ id: 'open_account_has_gift' }), // '开户有礼'
  //     background: { background: `url(${newOpenAcconuntBg})`, backgroundSize: 'cover' },
  //     buttonBg: { background: '#FA6D16' },
  //   },
  //   {
  //     id: 2,
  //     time: '2022/10/19',
  //     theme: formatMessage({ id: 'get_rewards_for_inviting_friends' }), // '邀请好友得奖励'
  //     intro: formatMessage({ id: 'open_account_has_gift' }), // '好友完成开户后各得50薇币'
  //     botton: formatMessage({ id: 'inviting_friends' }), // '邀请好友'
  //     title: formatMessage({ id: 'inviting_friends_open_account' }), // '邀请好友开户'
  //     background: { background: `url(${inviteFriendsBg})`, backgroundSize: 'cover' },
  //     buttonBg: { background: '#5385F4' },
  //   },
  // ];
  const [list, setList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    settingNavigationTitle({ name: formatMessage({ id: 'activity_center' }) }); // 活动中心
  }, []);

  useEffect(() => {
    getActivitys({
      tiemType: 1, // 时间类型， 1现在 2历史
    }).then((res) => {
      if (res.code === 0) {
        const newResult = res.result.map((item) => ({
          ...item,
          title: item.theme,
          background: { background: `url(${item.cover})`, backgroundSize: 'cover' },
          time: dayjs(item.endTime).format('YYYY/MM/DD'),
        }));
        setList(newResult);
      }
    }).catch((err) => {
      console.log('err===>', err);
    }).finally(() => setIsLoading(false));
  }, []);

  // 跳转到我的卡券
  const goMyCouponPage = () => {
    openNewPage({
      fullScreen: true,
      pageType: PageType.HTML,
      path: 'my-coupon.html',
      replace: false,
    });
  };
  // 跳转到我的薇币
  const goMyWeiCoinPage = () => {
    openNewPage({
      fullScreen: true,
      pageType: PageType.HTML,
      path: 'my-wei-coin.html',
      replace: false,
    });
  };
  // 跳转到往期活动
  const goMyPastActivitiesPage = () => {
    openNewPage({
      title: formatMessage({ id: 'past_activities' }),
      pageType: PageType.HTML,
      path: 'past-activities.html',
      replace: false,
      fullScreen: false,
    });
  };
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

  const goActivityPage = (data) => {
    const { id, type } = data;
    if (type === 1) {
      goOpenAccountGiftPage(id);
    }
    if (type === 2) {
      goInviteFriendsOpenAccountPage(id);
    }
  };

  return (
    <Loading isLoading={isLoading}>
      <div styleName="page">
        <div styleName="option">
          <div styleName="option-child" onClick={goMyCouponPage}>
            <div>
              <img src={logo1} alt="" />
            </div>
            <div>
              {/* 我的卡券 */}
              {formatMessage({ id: 'my_coupon' })}
            </div>
          </div>
          <div styleName="option-child" onClick={goMyWeiCoinPage}>
            <div>
              <img src={logo2} alt="" />
            </div>
            <div>
              {/* 我的薇币 */}
              {formatMessage({ id: 'my_wei_coin' })}
            </div>
          </div>
        </div>
        <div>
          {
            list.map((item) => (
              <div key={item.id} onClick={() => goActivityPage(item)}><ActivityOption data={item} /></div>
            ))
          }
        </div>
        <div styleName="past-activity" onClick={goMyPastActivitiesPage}>
          {/* 往期活动 */}
          {formatMessage({ id: 'past_activities' })}
        </div>
      </div>
    </Loading>

  );
};

export default ActivityCenter;
