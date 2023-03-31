/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import './invite-friends-open-account.scss';
import dayjs from 'dayjs';
import { useSearchParam } from 'react-use';
import { MoreOutline } from 'antd-mobile-icons';
import { Popover, Toast } from 'antd-mobile';
import { useIntl } from 'react-intl';
import { getUrlParam } from '@/utils';
import { getActivityDetail, getInviteFriendOpenAccountAward } from '@/api/module-api/activity';
import { goBack, openNewPage, PageType, sharePage, CShareType, PPageType, getUserInfo } from '@/platforms/mobile/helpers/native/msg';
import Loading from '@mobile/components/loading/loading';
import copy from 'copy-to-clipboard';
import ParticularsModal from './components/particulars-modal/particulars-modal';
import backIcon from './images/icon_return.png'; // 返回
import marketCardIcon from './images/icon_market.png'; // 行情卡
import freeCommissionCardIcon from './images/icon_free_commission_card.png'; // 免佣卡
import weiCoinIcon from './images/icon_wei_coin.png'; // 薇币
import giftBagIcon from './images/icon_gift_bag.png'; // 新人礼包
import shareIcon from './images/icon_share.png'; // 分享
import userIcon from './images/icon_user.png'; // 用户
import awardIcon from './images/icon_award.png'; // 奖励
import rightArrowIcon from './images/icon_right-arrow.png'; // 右箭头
import shareLinkIcon from './images/icon_share_link.png'; // 右箭头
import shareInviteIcon from './images/icon_share_invite.png'; // 右箭头
import faceToFaceIcon from './images/icon_face_toface.png'; // 右箭头
import shareLogo from './images/icon_share_logo.png'; // 分享logo
import refleshLogo from './images/icon_reflesh.png'; // 刷新logo
import logoIcon from './images/icon_logo.png';

const InviteFriendsOpenAccount: React.FC = () => {
  const { formatMessage } = useIntl();
  const safeAreaTop = Number(useSearchParam('safeAreaTop')) || 0;
  const [userInfo, setUserInfo] = useState<any>({});
  console.log('userInfo', userInfo);
  const searchParams = getUrlParam();
  const [tabId, setTabId] = useState(0);
  const [activityTime, setActivityTime] = useState('');
  const [awardList, setAwardList] = useState<any>([]);
  const [countRewards, setAountRewards] = useState({
    couponCount: 0, // 卡券总数
    weicoinCount: 0, // 薇币总数
    marketCount: 0, // 行情总数
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [pramasData, setPramasData] = useState<any>();

  // 判断页面是否为app打开
  useEffect(() => {
    const isAppOpen = window.navigator.userAgent.includes('dzapp');
    if (!isAppOpen) {
      // 注册登录链接
      const resgisterlink = `${window.location.protocol}//${window.location.host}/invite-friends-register.html?id=1&nickName=${userInfo?.nickName}`;
      window.location.href = resgisterlink;
    }
    // 当前页面链接
    // const pageLink = window.location.href;
  }, []);

  useEffect(() => {
    getUserInfo()
      .then((res) => {
        console.log('====>【获取用户信息】', res);
        setUserInfo(res);
      })
      .catch((err) => console.log('【获取用户信息失败】', err));
  }, []);

  // formatMessage({ id: 'open_account_has_gift' })
  const pageTitle = formatMessage({ id: 'inviting_friends_open_account' }); // 邀请好友开户

  // const renderCommissionIntro = () => (
  //   <>
  //     30天
  //     <br />
  //     10次免佣
  //   </>
  // );
  // const renderMarketIntro = () => (
  //   <>
  //     7天
  //     <br />
  //     港股L2行情
  //   </>
  // );
  // const renderWeiCoinIntro = () => (
  //   <>
  //     50
  //     <br />
  //     薇币
  //   </>
  // );

  const giftOptions = [
    {
      id: 0,
      background: '#FFF6F0',
      name: formatMessage({ id: 'free_commission_card' }), // '免佣卡'
      img: freeCommissionCardIcon,
      intro: '', // renderCommissionIntro()
    },
    {
      id: 1,
      background: '#F9F7FF',
      name: '行情卡',
      img: marketCardIcon,
      intro: '', // renderMarketIntro()
    },
    {
      id: 2,
      background: '#FFFAEE',
      name: '',
      img: weiCoinIcon,
      intro: '', // '薇币' renderWeiCoinIntro()
    },
  ];

  const renderShareLogo = () => (
    <img src={shareLogo} alt="" style={{ width: '20px', height: '20px', marginTop: '8px' }} />
  );

  const renderRefleshLogo = () => (
    <img src={refleshLogo} alt="" style={{ width: '20px', height: '20px', marginTop: '8px' }} />
  );
  const actions: any[] = [
    { key: 'share', icon: renderShareLogo(), text: '分享' },
    { key: 'refresh', icon: renderRefleshLogo(), text: '刷新' },
  ];

  useEffect(() => {
    if (!searchParams.id) return;
    getActivityDetail({ activityId: Number(searchParams.id) }).then((res) => {
      if (res.code === 0) {
        console.log(res.result);
        const activityTimeStr = res.result.activityTime.split('-')
          .map((item) => (dayjs(item).format('YYYY/MM/DD')))
          .join('-');
        const newOptions = [...giftOptions];
        newOptions[0].intro = res.result.couponReward;
        newOptions[1].intro = res.result.marketReward;
        newOptions[2].intro = res.result.weicoinReward;
        setActivityTime(activityTimeStr);
        setAwardList(newOptions);
      }
    }).catch((err) => {
      console.log('err---->', err);
    }).finally(() => setIsLoading(false));

    getInviteFriendOpenAccountAward({ activityId: Number(searchParams.id) }).then((res) => {
      console.log('====>getInviteFriendOpenAccountAward', res);
      if (res.code === 0) {
        setAountRewards(res.result);
      }
    }).catch((err) => {
      console.log('=====>getInviteFriendOpenAccountAward====>err', err);
    }).finally(() => setIsLoading(false));
  }, [searchParams]);

  // 跳转到活动规则
  const goActivityRulesPage = (id) => {
    openNewPage({
      fullScreen: true,
      title: formatMessage({ id: 'activity_rules' }), // '活动规则'
      pageType: PageType.HTML,
      path: `activity-rules.html?id=${id}`,
      replace: false,
    });
  };

  // 跳转到帮助中心/standard/west-help-home.html
  const goHelpCenterPage = (id) => {
    openNewPage({
      fullScreen: true,
      pageType: PageType.HTML,
      path: '/standard/west-help-home.html',
      replace: false,
    });
  };

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

  // 跳转到我的薇币
  const goMarketPage = () => {
    openNewPage({
      // fullScreen: true,
      pageType: PageType.HTML,
      path: 'high-list.html',
      replace: false,
    });
  };

  const handlerShare = () => {
    console.log('userInfo?.nickName', userInfo?.nickName);
    sharePage({
      shareType: CShareType.PAGE,
      info: {
        link: `/invite-friends-register.html?id=1&nickName=${userInfo?.nickName}`, // `/invite-friends-register.html?id=${searchParams.id}`
        snapshot: false, // 是否要分享页面截图
        title: formatMessage({ id: 'open_account_has_gift' }),
        // desc: '',
        // pictureUrl?: string,
        pageType: PPageType.activity_center,
      },
    });
  };

  const posterShare = () => {
    console.log('userInfo?.nickName', userInfo?.nickName, '分享海报邀请');
    sharePage({
      shareType: CShareType.PAGE,
      info: {
        link: `/invite-friends-register.html?id=1&nickName=${userInfo?.nickName}`, // `/invite-friends-register.html?id=${searchParams.id}`
        snapshot: true, // 是否要分享页面截图
        title: formatMessage({ id: 'open_account_has_gift' }),
        // desc: '',
        // pictureUrl?: string,
        pageType: PPageType.poster,
      },
    });
  };

  const faceToFaceShare = () => {
    console.log('userInfo?.nickName', userInfo?.nickName, '面对面邀请');
    sharePage({
      shareType: CShareType.PAGE,
      info: {
        link: `/invite-friends-register.html?id=1&nickName=${userInfo?.nickName}`, // `/invite-friends-register.html?id=${searchParams.id}`
        snapshot: false, // 是否要分享页面截图
        title: formatMessage({ id: 'open_account_has_gift' }),
        // desc: '',
        // pictureUrl?: string,
        pageType: PPageType.faceToFace,
      },
    });
  };

  const shareOrRefresh = (type) => {
    if (type === 'refresh') {
      window.location.reload();
    }
    if (type === 'share') {
      // console.log('share');
      handlerShare();
    }
  };

  const arrList = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const openParticulars = (data) => {
    console.log('打开明细');
    setPramasData(data);
    setIsVisible(true);
  };

  const copyPageLink = () => {
    // 注册登录链接
    // const resgisterlink = `${window.location.protocol}//${window.location.host}/invite-friends-register.html?id=1&nickName=${userInfo?.nickName}`;
    // console.log('resgisterlink', resgisterlink);
    // 当前页面链接
    const pageLink = window.location.href;
    return copy(pageLink, { debug: true, message: '链接复制成功！' });
  };

  const handlerCopyLink = () => {
    const isCopy = copyPageLink();
    // const a = window.navigator.userAgent.includes('dzapp');
    // console.log('aaaa', a);
    Toast.show({
      content: isCopy ? formatMessage({ id: 'copy_success' }) : formatMessage({ id: 'copy_fail' }),
    });
  };

  return (
    <div styleName="page" style={{ paddingTop: `${+safeAreaTop}px` }}>
      <div styleName="head">
        <div onClick={() => goBack()}>
          <img src={backIcon} alt="" />
        </div>
        <div>
          {pageTitle}
        </div>
        <div>
          <Popover.Menu
            actions={actions}
            placement="bottom-start"
            onAction={(node) => {
              shareOrRefresh(node.key);
            }}
            trigger="click"
          >
            <MoreOutline />
          </Popover.Menu>
        </div>
      </div>
      <div styleName="page-main">
        <div styleName="award">
          <div
            styleName="rule"
            onClick={() => goActivityRulesPage(searchParams.id)}
          >
            {formatMessage({ id: 'activity_rules' })}
            {/* 活动规则 */}
          </div>
          <div styleName="award-title">
            {formatMessage({ id: 'inviting_friends_open_account_get_gift' })}
            {/* 邀好友開戶 得奖励禮包 */}
          </div>
          <div styleName="time-range">
            {
              `${formatMessage({ id: 'activity_time' })}：${activityTime}`
            }
            {/* activity_time  */}
          </div>
          <div styleName="award-intro">
            {formatMessage({ id: 'inviting_friends_finish_open_account' })}
            {/* 通过邀请好友完成开户 */}
          </div>
          <div styleName="award-main">
            <div styleName="award-main-title">
              {formatMessage({ id: 'your_award' })}
              {/* 您的奖励 */}
            </div>
            <div styleName="award-main-card">
              {
              awardList.map((item) => (
                <div styleName="award-main-item" key={item.id} style={{ background: item.background }}>
                  <div styleName="pic">
                    <img src={item.img} alt="" />
                    <span styleName="pic-text">{item.name}</span>
                  </div>
                  <div styleName="card-text">
                    {item.intro}
                  </div>
                </div>
              ))
            }

            </div>
          </div>
          <div styleName="award-friends">
            <div styleName="award-friends-title">
              {formatMessage({ id: 'friend_award' })}
              {/* 好友的奖励 */}
            </div>
            <div styleName="gift-bag">
              <div styleName="gift-bag-icon"><img src={giftBagIcon} alt="" /></div>
              <div styleName="gift-bag-text">
                {/* 新人开户大礼包 */}
                {formatMessage({ id: 'new_account_opening_package' })}
                <br />
                价值1300HKD
              </div>
            </div>
          </div>
        </div>
        <div styleName="steps">
          <div styleName="steps-title">
            {/* 三步得奖励 */}
            {formatMessage({ id: 'three_steps_to_reward' })}
          </div>
          <div styleName="steps-main">
            <div styleName="steps-item">
              <div styleName="steps-icon">
                <img src={shareIcon} alt="" />
              </div>
              <div styleName="steps-text">
                {/* 分享本活动页 */}
                {formatMessage({ id: 'share_this_activity_page' })}
                <br />
                {/* 邀请好友inviting_friends */}
                {formatMessage({ id: 'inviting_friends' })}
              </div>
            </div>
            <div styleName="arrow">
              <img src={rightArrowIcon} alt="" />
            </div>
            <div styleName="steps-item">
              <div styleName="steps-icon">
                <img src={userIcon} alt="" />
              </div>
              <div styleName="steps-text">
                {/* 好友点击链接 */}
                {formatMessage({ id: 'friends_click_the_link' })}
                <br />
                {/* 注册并开户成功 */}
                {formatMessage({ id: 'registration_and_account_opening_succeeded' })}
              </div>
            </div>
            <div styleName="arrow">
              <img src={rightArrowIcon} alt="" />
            </div>
            <div styleName="steps-item">
              <div styleName="steps-icon">
                <img src={awardIcon} alt="" />
              </div>
              <div styleName="steps-text">
                {/* 双方 */}
                {formatMessage({ id: 'both' })}
                <br />
                {/* 获得奖励 */}
                {formatMessage({ id: 'receive_award' })}
              </div>
            </div>
          </div>
        </div>
        <div styleName="list">
          <div styleName="list-title">
            我的成就
          </div>
          <div styleName="list-head">
            <div styleName="list-head-item" onClick={goMyCouponPage}>
              <div styleName="list-head-top">
                { countRewards ? countRewards.couponCount : 0 }
              </div>
              <div styleName="list-head-bottom">
                {/* 获得卡券 */}
                {formatMessage({ id: 'get_coupon' })}
              </div>
            </div>
            <div styleName="list-head-item" onClick={goMyWeiCoinPage}>
              <div styleName="list-head-top">
                {countRewards ? countRewards.weicoinCount : 0}
              </div>
              <div styleName="list-head-bottom">
                {/* 获得薇币 */}
                {formatMessage({ id: 'get_wei_coin' })}
              </div>
            </div>
            <div styleName="list-head-item" onClick={goMarketPage}>
              <div styleName="list-head-top">
                { countRewards ? countRewards.marketCount : 0}
              </div>
              <div styleName="list-head-bottom">
                {formatMessage({ id: 'get_quote' })}
                (天)
                {/* 获得行情(天) */}
              </div>
            </div>
          </div>

          <div styleName="list-main">
            <div styleName="list-main-tab">
              <div
                styleName={tabId === 0 ? 'list-main-tab-item list-main-tab-active' : 'list-main-tab-item'}
                onClick={() => setTabId(0)}
              >
                {formatMessage({ id: 'number_of_unopened_accounts' })}
                {/* 未开户人数 */}
              </div>
              <div
                styleName={tabId === 1 ? 'list-main-tab-item list-main-tab-active' : 'list-main-tab-item'}
                onClick={() => setTabId(1)}
              >
                {formatMessage({ id: 'number_of_opened_accounts' })}
                {/* 已开户人数 */}
              </div>
            </div>

            <div styleName="list-main-table">
              <div styleName="table-title">
                <span styleName="title-l">排名</span>
                <span styleName="title-c">
                  {/* 奖励 */}
                  {formatMessage({ id: 'reward' })}
                </span>
                <span styleName="title-r">
                  {/* 明细 */}
                  {formatMessage({ id: 'particulars' })}
                </span>
              </div>
              <div styleName="table-main">
                {
                  arrList.map((item) => (
                    <div styleName="table-col" key={item}>
                      <div styleName="table-row-l">
                        <img src={logoIcon} alt="" />
                        <span>Aisa</span>
                      </div>
                      <div styleName="table-row-c" onClick={() => openParticulars(2)}>
                        {/* 奖励明细 */}
                        {formatMessage({ id: 'reward' })}
                        {formatMessage({ id: 'particulars' })}
                      </div>
                      <div styleName="table-row-r">
                        <div>2022/02/02</div>
                        <div>16:00:00</div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
        <div styleName="help">
          <div styleName="help-title">
            {/* 邀请帮助 */}
            {formatMessage({ id: 'invite_help' })}
          </div>
          <div>
            <div styleName="btn" onClick={goHelpCenterPage}>
              <span>
                {/* 介绍中薇证券 */}
                {formatMessage({ id: 'zhong_wei_intro' })}
              </span>
              <img src={rightArrowIcon} alt="" />
            </div>
            <div styleName="btn" onClick={goHelpCenterPage}>
              <span>
                {/* 开户指引 */}
                {formatMessage({ id: 'account_opening_guidelines' })}
              </span>
              <img src={rightArrowIcon} alt="" />
            </div>
          </div>
        </div>

        <div styleName="intro">
          {/* 各活动参与规则请具体以活动规则为准 */}
          {formatMessage({ id: 'activity_rules_description' })}
        </div>

        <div styleName="share">
          <div styleName="share-btn-left" onClick={() => posterShare()}>
            <img src={shareInviteIcon} alt="" />
            <div>
              {/* 分享海报邀请 */}
              {formatMessage({ id: 'share_the_poster_invitation' })}
            </div>
          </div>
          <div styleName="share-btn-center" onClick={() => faceToFaceShare()}>
            <img src={faceToFaceIcon} alt="" />
            <div>
              {/* 面对面邀请 */}
              {formatMessage({ id: 'face_to_face_invite' })}
            </div>
          </div>
          <div styleName="share-btn-right">
            <img src={shareLinkIcon} alt="" />
            <div onClick={() => handlerCopyLink()}>
              {/* 复制链接 */}
              {formatMessage({ id: 'copy_links' })}
            </div>
          </div>
        </div>
      </div>
      <ParticularsModal visible={isVisible} setVisible={setIsVisible} activityId={pramasData} userId={userInfo.userId} />
    </div>
  );
};

export default InviteFriendsOpenAccount;
