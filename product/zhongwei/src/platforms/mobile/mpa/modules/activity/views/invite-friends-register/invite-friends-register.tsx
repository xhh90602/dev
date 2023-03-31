/* eslint-disable no-unused-expressions */
/* eslint-disable no-plusplus */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import './invite-friends-register.scss';
import { useSearchParam } from 'react-use';
import { goBack, openNewPage, PageType } from '@/platforms/mobile/helpers/native/msg';
import { DownOutline, MoreOutline } from 'antd-mobile-icons';
import { Popover, Toast, Button, Input } from 'antd-mobile';
import { useIntl } from 'react-intl';
import { getActivityDetail, getVerifyCode, verifyCodeLogin } from '@/api/module-api/activity';
import { getUrlParam } from '@/utils';
import AreaCode from './components/area-code/area-code';

import backIcon from './images/icon_return.png'; // 返回
import shareLogo from './images/icon_share_logo.png'; // 分享logo
import refleshLogo from './images/icon_reflesh.png'; // 刷新logo
import freeCommissionCardIcon from './images/icon_free_commission_card.png'; // 免佣卡
import weiCoinIcon from './images/icon_wei_coin.png'; // 薇币
import marketCardIcon from './images/icon_market.png'; // 行情卡
import HongkongLicensedIcon from './images/icon_hong_kong_licensed.png';
import HongkongListedIcon from './images/icon_hong_kong_listed.png';
import tradeIcon from './images/icon_trade.png';
import majorIcon from './images/icon_major.png';
import serviceIcon from './images/icon_service.png';
import submitSuccessIcon from './images/icon_submit_success.png'; // 提交成功

const RegisterAndLoin: React.FC = () => {
  const { formatMessage } = useIntl();
  const searchParams = getUrlParam();
  const safeAreaTop = Number(useSearchParam('safeAreaTop')) || 0;
  const [isRegisterSucced, setIsRegisterSucced] = useState(false);
  const [phonePrefix, setPhonePrefix] = useState<any>('+86');
  const [isLoading, setIsLoading] = useState(true);
  const [awardList, setAwardList] = useState<any>([]);
  const [showAreaCode, setShowAreaCode] = useState(false);
  const [phoneNum, setPhoneNum] = useState('');
  const mobileError = useRef(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [smsCode, setSmsCode] = useState('');
  const [captchaBtnTxt, setCaptchaBtnTxt] = useState(formatMessage({ id: 'get_code' }));
  // formatMessage({ id: 'wei_coin' }) 获取验证码
  const [isSmsCodeButtonDisabled, setIsSmsCodeButtonDisabled] = useState(false);

  const checkPhone = (num) => {
    const reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
    if (reg.test(num)) {
      mobileError.current = true;
      return true;
    }
    mobileError.current = false;
    return false;
  };

  const renderShareLogo = () => (
    <img src={shareLogo} alt="" style={{ width: '20px', height: '20px', marginTop: '8px' }} />
  );

  const renderRefleshLogo = () => (
    <img src={refleshLogo} alt="" style={{ width: '20px', height: '20px', marginTop: '8px' }} />
  );

  const renderCommissionIntro = () => (
    <>
      30天
      <br />
      10次免佣
    </>
  );
  const renderMarketIntro = () => (
    <>
      7天
      <br />
      港股L2行情
    </>
  );
  const renderWeiCoinIntro = () => (
    <>
      50
      <br />
      薇币
    </>
  );
  const giftOptions = [
    {
      id: 0,
      background: '#FFF6F0',
      name: formatMessage({ id: 'free_commission_card' }), // '免佣卡'
      img: freeCommissionCardIcon,
      intro: renderCommissionIntro(),
    },
    {
      id: 1,
      background: '#F9F7FF',
      name: '行情卡',
      img: marketCardIcon,
      intro: renderMarketIntro(),
    },
    {
      id: 2,
      background: '#FFFAEE',
      name: '',
      img: weiCoinIcon,
      intro: renderWeiCoinIntro(), // '薇币'
    },
  ];
  const actions: any[] = [
    // { key: 'share', icon: renderShareLogo(), text: '分享' },
    { key: 'refresh', icon: renderRefleshLogo(), text: '刷新' },
  ];

  const introOption = [
    {
      id: 0,
      img: HongkongLicensedIcon,
      intro: '香港持牌',
    },
    {
      id: 1,
      img: HongkongListedIcon,
      intro: '港股上市',
    },
    {
      id: 2,
      img: tradeIcon,
      intro: formatMessage({ id: 'flexible_trading' }),
      // intro: '交易灵活',
    },
    {
      id: 3,
      img: majorIcon,
      intro: formatMessage({ id: 'professional_compliance' }),
      // intro: '专业合规',
    },

  ];

  const pageTitle = formatMessage({ id: 'zhong_wei' }); // 薇盈智投

  const getActivityDetailData = () => {
    getActivityDetail({ activityId: Number(searchParams.id) }).then((res) => {
      if (res.code === 0) {
        console.log(res.result);
        const newOptions = [...giftOptions];
        newOptions[0].intro = res.result.couponReward;
        newOptions[1].intro = res.result.marketReward;
        newOptions[2].intro = res.result.weicoinReward;
        setAwardList(newOptions);
      }
    }).catch((err) => {
      console.log('err---->', err);
    }).finally(() => setIsLoading(false));
  };
  useEffect(() => {
    if (!searchParams) return;
    getActivityDetailData();
  }, []);

  const getVerificationCode = () => {
    if (checkPhone(phoneNum)) {
      console.log(phoneNum);
      getVerifyCode({
        areaCode: phonePrefix,
        // channelType: 'IOS',
        mobile: phoneNum,
        // orgCode: '0001',
        type: 'LOGIN',
      }).then((res) => {
        console.log('res--->', res);
        if (res.code === 0) {
          Toast.show(formatMessage({ id: 'the_verification_code_has_been_sent' })); // '验证码已发送'
          setIsButtonDisabled(false);
          let conutDown = 60;
          const cookieInterval = setInterval(() => {
            if (conutDown > 0) {
              conutDown -= 1;
              setCaptchaBtnTxt(`${conutDown}${formatMessage({ id: 'resend_the_message' })}`); // 秒后重新发送
              setIsSmsCodeButtonDisabled(true);
            } else {
              // 清除定时器和cookies
              clearInterval(cookieInterval);
              setCaptchaBtnTxt(formatMessage({ id: 'get_code' })); // 获取验证码
              setIsSmsCodeButtonDisabled(false);
            }
          }, 1000);
        }
      }).catch((err) => {
        console.log(err);
      }).finally();
    } else {
      Toast.show(formatMessage({ id: 'please_input_correct_mobile' })); // 请输入正确的手机号
    }
  };

  const register = () => {
    verifyCodeLogin({
      areaCode: phonePrefix,
      inviteCode: searchParams.inviteCode,
      mobile: phoneNum,
      // orgCode: '0001',
      smsCode,
      versionInfo: {
        appVersion: searchParams.appVersion,
        channelType: searchParams.channelType,
        deviceNo: searchParams.deviceNo,
        deviceVersion: searchParams.deviceVersion,
        systemVersion: searchParams.systemVersion,
      },
    }).then((res) => {
      console.log(res);
      if (res.code === 0) {
        Toast.show(formatMessage({ id: 'login_success' })); // 登录成功
        setIsRegisterSucced(true);
      } else {
        Toast.show(res.message);
      }
    }).catch((err) => {
      console.log(err);
      Toast.show(err);
    }).finally();
  };

  const BrowserInfo = () => {
    const json = {
      userAgent: navigator.userAgent.toLowerCase(),
      isAndroid: Boolean(navigator.userAgent.match(/android/ig)),
      isIphone: Boolean(navigator.userAgent.match(/iphone|ipod/ig)),
      isIpad: Boolean(navigator.userAgent.match(/ipad/ig)),
      isWeixin: Boolean(navigator.userAgent.match(/MicroMessenger/ig)),
    };

    return json;
  };

  // const openApp = (openUrl, callback) => {
  //   // 检查app是否打开
  //   function checkOpen(cb) {
  //     const _clickTime = +(new Date());
  //     function check(elsTime) {
  //       if (elsTime > 3000 || document.hidden || document.webkitHidden) {
  //         cb(1);
  //       } else {
  //         cb(0);
  //       }
  //     }
  //     // 启动间隔20ms运行的定时器，并检测累计消耗时间是否超过3000ms，超过则结束
  //     let _count = 0;

  //     const intHandle = setInterval(() => {
  //       _count++;
  //       const elsTime = +(new Date()) - _clickTime;
  //       if (_count >= 100 || elsTime > 3000) {
  //         clearInterval(intHandle);
  //         check(elsTime);
  //       }
  //     }, 20);
  //   }

  //   // 在iframe 中打开APP
  //   const ifr = document.createElement('iframe');
  //   ifr.src = openUrl;
  //   ifr.style.display = 'none';

  //   if (callback) {
  //     // 客户端检测微信直接跳应用宝链接
  //     const browser = BrowserInfo();
  //     // 使用微链接
  //     const encodeUri = encodeURIComponent(openUrl);

  //     if (browser.isWeixin) {
  //       window.location.href = `你的微链url&android_schema=${encodeUri}`;
  //     } else {
  //       checkOpen((opened) => {
  //         callback && callback(opened);
  //       });
  //     }
  //   }

  //   document.body.appendChild(ifr);
  //   setTimeout(() => {
  //     document.body.removeChild(ifr);
  //   }, 2000);
  // };

  function clickDownload() {
    if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
      const loadDateTime = new Date();
      window.location.href = '...';// schema链接或者universal link
      window.setTimeout(() => { // 如果没有安装app,便会执行setTimeout跳转下载页
        const timeOutDateTime = new Date();
        if (timeOutDateTime - loadDateTime < 5000) {
          window.location.href = '...'; // ios下载地址
        } else {
          window.close();
        }
      }, 500);
    } else if (navigator.userAgent.match(/android/i)) {
      const state = null;
      try {
        window.location.href = '...'; // schema链接或者universal link
        window.setTimeout(() => {
          window.location.href = '...'; // android下载地址
        }, 500);
      } catch (e) {
        console.log(e);
      }
    }
  }

  const shareOrRefresh = (node) => {
    if (node.key === 'refresh') {
      window.location.reload();
    } else {
      Toast.show(`选择了 ${node.text}`);
    }
  };

  // 跳转到活动规则
  const goActivityRulesPage = (id) => {
    openNewPage({
      // fullScreen: true,
      pageType: PageType.HTML,
      path: `activity-rules.html?id=${id}`,
      replace: false,
    });
  };

  return (
    <div styleName="page" style={{ paddingTop: `${+safeAreaTop}px` }}>
      <div styleName="head">
        <div>
          <img src={backIcon} alt="" onClick={goBack} />
        </div>
        <div>
          {pageTitle}
        </div>
        <div>
          <Popover.Menu
            actions={actions}
            placement="bottom-start"
            onAction={(node) => { shareOrRefresh(node); }}
            trigger="click"
          >
            <MoreOutline />
          </Popover.Menu>
        </div>
      </div>
      {
        showAreaCode && (
          <div styleName="float">
            <AreaCode setShowAreaCode={setShowAreaCode} setPhonePrefix={setPhonePrefix} />
          </div>
        )

      }
      <div styleName="box">
        <div styleName="advertising">
          <div styleName="advertising-btn" onClick={() => goActivityRulesPage(Number(searchParams.id))}>
            {/* 活动规则 */}
            {formatMessage({ id: 'activity_rules' })}
          </div>
          <div styleName="advertising-title">
            {/* 新人开户赢好礼 */}
            {`${formatMessage({ id: 'new_open_an_account_to_win_good_gifts' })}`}
          </div>
        </div>
        {
        !isRegisterSucced && (
          <div styleName="register">
            <div styleName="register-head">
              <div styleName="register-logo"><img src="" alt="" /></div>
              <div styleName="register-notice">
                { searchParams.nickName }
                {formatMessage({ id: 'invite_open_account_get_gift' })}
                {/* 邀請您開戶赢好禮 */}
              </div>
            </div>
            <div styleName="register-input">
              <div styleName="phone-prefix">
                <span onClick={() => setShowAreaCode(true)}>
                  {
                    phonePrefix
                  }
                </span>
                <span style={{ marginLeft: '5px' }}><DownOutline /></span>
              </div>
              <div styleName="input-phone">
                <Input
                  placeholder={formatMessage({ id: 'please_input_mobile' })} // 请输入手机号
                  value={phoneNum}
                  onChange={(val) => {
                    setPhoneNum(val);
                  }}
                />
              </div>
            </div>
            <div styleName="register-validation">
              <div styleName="register-validation-input">
                <Input
                  placeholder={formatMessage({ id: 'please_input_verification_code' })} // 请输入验证码"
                  value={smsCode}
                  onChange={(val) => {
                    setSmsCode(val);
                  }}
                />
              </div>
              <div styleName="register-validation-btn">
                <Button onClick={() => getVerificationCode()} disabled={isSmsCodeButtonDisabled}>
                  {captchaBtnTxt}
                </Button>
              </div>
            </div>
            <div styleName="register-btn">
              <Button block color="primary" size="large" disabled={isButtonDisabled} onClick={register}>
                {formatMessage({ id: 'Accept_Friend_Invitation' })}
                {/* 接受好友邀请 */}
              </Button>
            </div>
            <div styleName="server">
              登录注册即代表阅读并同意
              <a>隐私协议</a>
              和
              <a>用户条款</a>
            </div>
          </div>
        )
      }

        {
          isRegisterSucced && (
            <div styleName="register-success">
              <div styleName="register-success-img">
                <img src={submitSuccessIcon} alt="" />
              </div>
              <div styleName="register-success-tip">
                {formatMessage({ id: 'register_success' })}
                {/* 注册成功 */}
              </div>
              <div styleName="register-success-intro">
                {/* 您已完成注册，快去薇盈智投APP上开通 */}
                {formatMessage({ id: 'you_are_register_success_go_app' })}
                <br />
                {/* 证券账号吧！ */}
                {formatMessage({ id: 'securities_account_number' })}
              </div>
              {/* onClick={() => openApp('openUrl', (callback) => callback)} */}
              <div styleName="register-success-btn" onClick={() => clickDownload()}>
                {/* 打开APP */}
                {formatMessage({ id: 'open_app' })}
              </div>
            </div>
          )
        }

        <div styleName="award">
          <div styleName="award-title">
            {/* 奖励介绍 */}
            {formatMessage({ id: 'description_award' })}
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

        <div styleName="intro">
          <div styleName="intro-title">
            {/* 中薇证券介绍 */}
            {formatMessage({ id: 'zhong_wei_description' })}
          </div>
          <div styleName="intro-main">
            {
            introOption.map((item: any) => (
              <div key={item.id}>
                <div styleName="intro-main-img">
                  <img src={item.img} alt="" />
                </div>
                <div styleName="intro-main-text">
                  {item.intro}
                </div>
              </div>
            ))
          }
          </div>
          <div styleName="intro-describe">
            {/* 了解更多请打开薇盈智投APP吧 */}
            {formatMessage({ id: 'for_more_information_open_app' })}
          </div>
        </div>
        <div styleName="service">
          <div styleName="">
            <div
              styleName="service-text"
              onClick={(e) => {
                console.log(e.target);
              }}
            >
              {/* 联系我们 */}
              {formatMessage({ id: 'contact_us' })}
            </div>
            <div styleName="service-phone">(852) 3899 3990</div>
          </div>
          <div styleName="service-right">
            <img src={serviceIcon} alt="" />
          </div>
        </div>
      </div>

    </div>
  );
};

export default RegisterAndLoin;
