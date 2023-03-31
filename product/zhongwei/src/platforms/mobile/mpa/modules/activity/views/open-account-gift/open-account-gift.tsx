/* eslint-disable max-len */
import React, { useState, useEffect, useContext } from 'react';
import './open-account-gift.scss';
import { Button, Toast } from 'antd-mobile';
import { useIntl } from 'react-intl';
import { useSearchParam } from 'react-use';
import { goBack, openNewPage, PageType, openNativePage, NativePages, sharePage, CShareType, PPageType } from '@/platforms/mobile/helpers/native/msg';
import { getActivityDetail, openAccountStatus, getActivitys } from '@/api/module-api/activity';
import { getUrlParam } from '@/utils';
import { userInfoContext } from '@mobile/helpers/entry/native';
import Loading from '@mobile/components/loading/loading';
import dayjs from 'dayjs';
import backIcon from './images/icon_return.png';
import shareIcon from './images/icon_share.png';
import commissionIcon from './images/commission-card.png';
import marketIcon from './images/market-card.png';
import weiCoinIcon from './images/wei-coin.png';

const OpenAccountGift: React.FC = () => {
  const { formatMessage } = useIntl();
  const useInfo = useContext<any>(userInfoContext);
  const safeAreaTop = Number(useSearchParam('safeAreaTop')) || 0;
  const searchParams = getUrlParam();
  const pageTitle = formatMessage({ id: 'open_account_has_gift' }); // 开户有礼
  const [awardList, setAwardList] = useState<any>([]);
  const [activityTime, setActivityTime] = useState('');
  const [isOpenAccount, setIsOpenAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentActivity, setCurrentActivity] = useState<any>();

  const [list, setList] = useState<any>([]);

  const activitylist = [
    {
      id: 1,
      time: '2022/10/19',
      theme: formatMessage({ id: 'open_account_has_gift' }), // 开户有礼
      intro: formatMessage({ id: 'gets_50_minus_after_opening_account' }), // '好友完成开户后各得50薇币'
      botton: formatMessage({ id: 'open_account_right_now' }), // '立即开户'
      title: formatMessage({ id: 'open_account_has_gift' }), // '开户有礼'
    },
    {
      id: 2,
      time: '2022/10/19',
      theme: formatMessage({ id: 'get_rewards_for_inviting_friends' }), // '邀请好友得奖励'
      intro: formatMessage({ id: 'open_account_has_gift' }), // '好友完成开户后各得50薇币'
      botton: formatMessage({ id: 'inviting_friends' }), // '邀请好友'
      title: formatMessage({ id: 'inviting_friends_open_account' }), // '邀请好友开户'
    },
  ];
  useEffect(() => {
    getActivitys({
      tiemType: 1, // 时间类型， 1现在 2历史
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
    });
  }, []);

  useEffect(() => {
    if (list && list.length) {
      const id = Number(searchParams.id);
      const current = list.filter((item) => item.id === id);
      setCurrentActivity(current);
    }
  }, [list]);

  const renderIntro = () => (
    <div>
      最高抵扣
      <span>50</span>
      元
    </div>
  );

  const giftOptions = [
    {
      id: 0,
      background: '#FFF6F0',
      name: formatMessage({ id: 'free_commission_card' }), // '免佣卡'
      title: `180天 20次${formatMessage({ id: 'free_commission_card' })}`, // '180天 20次免佣卡'
      img: commissionIcon,
      intro: renderIntro(),
      color: '#FA6D16',
    },
    {
      id: 1,
      background: '#F9F7FF',
      name: '行情卡',
      title: `港股L2行情${formatMessage({ id: 'free' })}30天`, // '港股L2行情免费30天'
      img: marketIcon,
      intro: formatMessage({ id: 'Hong_Kong_stocks_real_time_market' }), // '港股实时行情'
      color: '#5B2FFA',
    },
    {
      id: 2,
      background: '#FFFAEE',
      name: '',
      title: `${formatMessage({ id: 'reward' })}300${formatMessage({ id: 'wei_coin' })}`, // '奖励300薇币'
      img: weiCoinIcon,
      intro: formatMessage({ id: 'wei_coin' }), // '薇币'
      color: '#FAB02F',
    },
  ];

  // useEffect(() => {
  //   openAccountJudge({ mobile: '15279199087' }).then((res) => {
  //     console.log('res====>', res);
  //     if (res.code === 0) {
  //       if (res.message === 'ok') {
  //         setIsOpenAccount(true);
  //       }
  //     }
  //   });
  // }, []);

  useEffect(() => {
    if (!searchParams) return;
    getActivityDetail({ activityId: Number(searchParams.id) }).then((res) => {
      if (res.code === 0) {
        console.log(res.result);
        const newOptions = [...giftOptions];
        newOptions[0].title = res.result.couponReward;
        newOptions[1].title = res.result.marketReward;
        newOptions[2].title = res.result.weicoinReward;
        const activityTimeStr = res.result.activityTime.split('-')
          .map((item) => (dayjs(item).format('YYYY/MM/DD')))
          .join('-');
        setActivityTime(activityTimeStr);
        setAwardList(newOptions);
      }
    }).catch((err) => {
      console.log('err---->', err);
    }).finally(() => setIsLoading(false));
  }, []);

  const immediatelyToReceive = () => {
    // getAward({
    //   activityId: Number(searchParams.id), // 活动id
    //   userId: useInfo.userId, // 统一用户id useInfo.userId
    // }).then((res) => {
    //   if (res.code === 0) {
    //     Toast.show({ content: res.message });
    //   }
    // }).catch((err) => {
    //   console.log('err---->', err);
    //   Toast.show({ content: `${err}` });
    // });
    openAccountStatus({}).then((res) => {
      console.log('===========>', res);
      if (res.code === 0 && res.result) {
        if (res.result.status === 'P') {
          Toast.show({ content: '开户审核中，请耐心等待' });
        } else {
          Toast.show({ content: '您已开户成功' });
        }
      } else {
        // 跳转到开户登录
        openNewPage({
          // fullScreen: true,
          pageType: PageType.HTML,
          path: '#/judge.html',
          replace: false,
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  };

  // 跳转到活动规则
  const goActivityRulesPage = (id) => {
    openNewPage({
      // fullScreen: true,
      title: '活动规则',
      pageType: PageType.HTML,
      path: `activity-rules.html?id=${id}`,
      replace: false,
    });
  };

  // const openShare = () => {
  //   openNativePage({
  //     pageType: PageType.NATIVE,
  //     path: NativePages.share,
  //     fullScreen: true,
  //     data: {
  //       url: `open-account-gift.html?id=${searchParams.id}`,
  //     },
  //   });
  // };

  return (
    <Loading isLoading={isLoading}>
      <div styleName="page" style={{ paddingTop: `${+safeAreaTop}px` }}>
        <div styleName="page-head">
          <img
            src={backIcon}
            alt=""
            onClick={() => {
              goBack();
            }}
          />
          <div>
            {pageTitle}
          </div>
          <img
            src={shareIcon}
            alt=""
            onClick={() => {
              console.log('share---------->');
              // Toast.show({ content: '待接入' });
              // openShare();
              sharePage({
                shareType: CShareType.PAGE,
                info: {
                  link: `open-account-gift.html?id=${searchParams.id}`,
                  snapshot: true, // 是否要分享页面截图
                  title: currentActivity && currentActivity.length ? currentActivity[0]?.title : '',
                  // desc: currentActivity && currentActivity.length ? currentActivity[0]?.intro : '',
                  // pictureUrl?: string,
                  pageType: PPageType.activity_center,
                },
              });
            }}
          />
        </div>
        <div styleName="page-main">
          <div styleName="advertising">
            <div styleName="advertising-btn" onClick={() => goActivityRulesPage(searchParams.id)}>
              {/* 活动规则 */}
              {formatMessage({ id: 'activity_rules' })}
            </div>
            <div styleName="advertising-title">
              {/* 新人开户赢好礼 */}
              {`${formatMessage({ id: 'new_open_an_account_to_win_good_gifts' })}`}
            </div>
            <div styleName="advertising-time-range">
              {/* 活动时间：2022/10/21-2022/12/21 */}
              {`${formatMessage({ id: 'activity_time' })}:${activityTime}`}
            </div>
          </div>
          <div styleName="gift">
            <div styleName="gift-title">
              {/* 新人开户礼包 */}
              {formatMessage({ id: 'newlyweds_opening_gift_bag' })}
            </div>
            {
          awardList.map((item) => (
            <div styleName="gift-option" key={item.id} style={{ background: `${item.background}` }}>
              <div styleName="card">
                <img src={item.img} alt="" />
                <span styleName="card-text">{item.name}</span>
              </div>
              <div>
                <div styleName="text" style={{ color: `${item.color}` }}>{item.title}</div>
                <div styleName="intro">{item.intro}</div>
              </div>
            </div>
          ))
        }
          </div>
          <div styleName="describe">
            {/* 各活动参与规则请具体以活动规则为准 */}
            {formatMessage({ id: 'please_refer_to_the_specific_rules_of_each_activity' })}
          </div>
          <div
            styleName="receive"
          >
            {/* 立即领取 */}
            <Button
              block
              size="large"
              onClick={() => {
                immediatelyToReceive();
              }}
            >
              {
          formatMessage({ id: 'immediately_to_receive' })
        }
            </Button>

          </div>
        </div>
      </div>
    </Loading>

  );
};

export default OpenAccountGift;
