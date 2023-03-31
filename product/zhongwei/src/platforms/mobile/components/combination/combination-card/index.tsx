/* eslint-disable max-len */
import React, { useState, useMemo, useEffect, useContext } from 'react';
import { useIntl } from 'react-intl';
import { subApply, subSeekApply, addFollow, cancelFollow, /* addWeiyou, */ joinRanking } from '@/api/module-api/combination';
import { openNativePage, PageType, NativePages } from '@/platforms/mobile/helpers/native/msg';
// import { commonCallBack } from '@/platforms/mobile/helpers/native/register';
import { getClassNameByPriceChange } from '@dz-web/quote-client';
import { nativeOpenPage } from '@/platforms/mobile/helpers/native/url';
import { userInfoContext } from '@/platforms/mobile/helpers/entry/native';
import DefaultAvatar from '@/platforms/mobile/images/default_avatar.svg';
import IconAdd from '@/platforms/mobile/images/icon_add.svg';
import IconYes from '@/platforms/mobile/images/icon_yes.svg';
import IconAddStock from '@/platforms/mobile/images/icon_add_stock.svg';
import IconSubYes from '@/platforms/mobile/images/icon_sub_yes.svg';
import LineChart from '@/platforms/mobile/components/combination/lineChart';
import { Toast } from 'antd-mobile';
import Dialog from '@/platforms/mobile/mpa/modules/combination/view/combination/components/dialog';
import Subscription from '@/platforms/mobile/components/combination/subscription';
import { netValueJudge } from '@/utils/data-format';
import FocuslDialog from './dialog/index';
import './index.scss';

interface ICombinationCardProps {
  data: any;
  type: number;
}

const CombinationCard: React.FC<ICombinationCardProps> = (props) => {
  const { data, type } = props;
  const [portfolioId, setPortfolioId] = useState(null);
  const [list, setList] = useState<any>(null);
  const [show, setShow] = useState<boolean>(false);
  const [subInfo, setSubInfo] = useState<any>(null);
  const [userId, setUserId] = useState<any>(null);
  const [SubId, setSubId] = useState(null);
  const [dialogType, setDialogType] = useState<any>(null);
  const [subShow, setSubShow] = useState<boolean>(false);
  const [combinationName, setCombinationName] = useState<string>();
  const [combinationType, setCombinationType] = useState<string>(); // 组合类型，0 模拟盘，1 实盘
  const [showFocusl, setShowFocusl] = useState<boolean>(false);
  const [rowData, setRowData] = useState<any>();
  const userInfo = useContext<any>(userInfoContext);
  const { formatMessage } = useIntl();

  /**
 * 模拟还是实盘
 */
  const positionType = useMemo(
    () => ({
      0: {
        styleName: 'simulation',
        text: formatMessage({ id: 'simulation' }),
      },
      1: {
        styleName: 'firm',
        text: formatMessage({ id: 'firm' }),
      },
    }),
    [],
  );

  // 跳转到个人中心
  const goWeiquanCenter = (item) => {
    openNativePage({
      pageType: PageType.NATIVE,
      path: NativePages.weiquan_center,
      fullScreen: true,
      data: { hisId: item.userId, roleCode: item.userVO.roleCode },
    });
  };

  // 字符串百分比，转成number
  const splitPercentage = (str, isPrefix = false, fd = 2) => {
    if (typeof str === 'string' && str.indexOf('*') > -1) return str;
    if (str) {
      let result;
      let val;
      if (typeof str === 'string') {
        if (str.indexOf('%') > -1) {
          const rs = str.split('%');
          val = (rs[0]) ? (+rs[0]) : 0;
        } else {
          val = +str;
        }
      } else {
        val = +str;
      }
      if (fd > 0) {
        val.toFixed(fd);
      }
      if (isPrefix) {
        if (val > 0) {
          result = `+${val}`;
        } else if (val < 0) {
          result = `${val}`;
        } else {
          result = `${val}`;
        }
      } else {
        result = val;
      }
      return result;
    }
    return str;
  };

  const addCharacter = (str) => {
    if (str && +str) {
      const val = netValueJudge(str);
      if (val === 1) {
        return `+${str}`;
      }
      if (val === -1) {
        return `-${str}`;
      }
      if (val === 0) {
        return `${str}`;
      }
    }
    return 0;
  };

  // 关注dom
  const attention = (row) => {
    const { roleCode, relations } = row.userVO;
    if (roleCode === 'ANALYST' && !relations.includes(4)) {
      // 身份标识，ORDINARY: 普通客户、STRONGMAN: 牛人、ANALYST: 分析师
      // 关系：空数组无关系 1好友 2已关注 3被关注 4 自己 5 已添加好友等待对方同意
      if ((!relations.includes(2) && !relations.includes(3) && relations.length)) {
        return (
          <div
            styleName="already active"
            onClick={() => functionClick(row)}
          >
            <img src={IconAdd} alt="" />
            {formatMessage({ id: 'focus_on' })}
          </div>
        );
      }
      if (relations.includes(2)) {
        return (
          <div styleName="already" onClick={() => functionClick(row)}>
            <img src={IconYes} alt="" />
            {formatMessage({ id: 'focus_on' })}
          </div>
        );
      }
      if (relations.includes(3)) {
        return (
          <div styleName="already active" onClick={() => functionClick(row)}>
            <img src={IconAdd} alt="" />
            {formatMessage({ id: 'back_to_customs' })}
          </div>
        );
      }
      if (!relations.length) {
        return (
          <div
            styleName="already active"
            onClick={() => functionClick(row)}
          >
            <img src={IconAdd} alt="" />
            {formatMessage({ id: 'focus_on' })}
          </div>
        );
      }
    }
    return null;
  };

  // 取消关注
  let cflag = false;
  const cancelFocus = () => {
    cancelFollow({
      hisId: rowData.userId,
    }).then((res: any) => {
      if (res && res.code === 0) {
        list.forEach((item) => {
          const { userVO } = item;
          if (item.portfolioId === rowData.portfolioId) {
            userVO.relations.splice(userVO.relations.indexOf(2), 1);
            Toast.show({
              content: `${formatMessage({ id: 'cancelText' })}${formatMessage({ id: 'focus_on' })}${formatMessage({ id: 'success' })}`,
            });
          }
        });
        setShowFocusl(false);
        setList([...list]);
      }
      cflag = false;
    });
  };

  // 关注 && 取消关注
  // 身份标识，ORDINARY: 普通客户、STRONGMAN: 牛人、ANALYST: 分析师
  // 关系：空数组无关系 1好友 2已关注 3被关注 4 自己 5 已添加好友等待对方同意 6游客，未注册
  const functionClick = (row) => {
    if (cflag) return;
    cflag = true;
    if (row.userVO.relations.includes(2)) {
      setRowData(row);
      setShowFocusl(true);
    } else {
      addFollow({
        hisId: row.userId,
      }).then((res: any) => {
        if (res && res.code === 0) {
          cflag = false;
          list.forEach((item) => {
            const { userVO } = item;
            if (item.portfolioId === row.portfolioId) {
              userVO.relations.push(2);
              Toast.show({
                content: `${formatMessage({ id: 'focus_on' })}${formatMessage({ id: 'success' })}`,
              });
            }
          });
          setList([...list]);
        }
      });
    }
  };

  // 加薇友, relations：5代表添加好友请求待同意
  const addWeiyouClick = (row) => {
    // 关系：空数组无关系 1好友 2已关注 3被关注 4 自己 5 已添加好友等待对方同意 */
    if (row?.userVO?.relations.length <= 0) {
      openNativePage({
        pageType: PageType.NATIVE,
        path: NativePages.add_weiyou,
        fullScreen: true,
        data: { userId: row.userId, portfolioId: row.portfolioId },
      });
      return;
    }
    if (row.userVO.relations.includes(1)) {
      openNativePage({
        pageType: PageType.NATIVE,
        path: NativePages.siliao,
        fullScreen: true,
        data: { imUser: row.userVO.imUser },
      });
      return;
    }
    if (row.userVO.relations.includes(5)) {
      Toast.show({
        content: formatMessage({ id: 'add_friend_tip' }),
      });
    }
    // addWeiyou({
    //   id: row.userId,
    //   reason: formatMessage({ id: 'add_friend' }),
    // }).then((res: any) => {
    //   if (res && res.code === 0) {
    //     list.forEach((item) => {
    //       if (item.portfolioId === row.portfolioId) {
    //         item.userVO.relations.push(5);
    //       }
    //     });
    //     setList([...list]);
    //     Toast.show({ content: formatMessage({ id: 'request_add_friend' }) });
    //   } else {
    //     Toast.show({ content: formatMessage({ id: res.message }) });
    //   }
    // });
  };

  // 参与排行
  const goRanking = () => {
    if (!portfolioId) return;
    joinRanking({ portfolioId }).then((res) => {
      if (res && res.code === 0) {
        const idx = list.findIndex((item) => item.portfolioId === portfolioId);
        list[idx].profitRanking = '0';
        setList([...list]);
        Toast.show({ content: formatMessage({ id: 'join_ranking_success' }) });
      } else {
        Toast.show({ content: res.message });
      }
      setShow(false);
    }).catch(() => {
      setShow(false);
      Toast.show({ content: formatMessage({ id: 'join_ranking_fail' }) });
    });
  };

  // 用户订阅状态 -1:不可订阅[求订阅] 0:未订阅[可订阅] 1:已订阅待确认[不可订阅] 10:已订阅成功[不可订阅]
  const subscriptionDom = (item) => {
    const { userSub } = item;
    if (type !== 2 && userSub !== null) {
      if (userSub === '0' || userSub === '-1') {
        return (
          <div styleName="second-right active" onClick={() => subscriptionClick(item)}>
            {formatMessage({ id: 'subscription' })}
          </div>
        );
      }
      if (userSub === '1') {
        return (
          <div styleName="second-right">
            {formatMessage({ id: 'to_be_confirmed' })}
          </div>
        );
      }
      if (userSub === '10') {
        return (
          <div styleName="second-right">
            <img styleName="sub-yes" src={IconSubYes} alt="" />
            {formatMessage({ id: 'subscription_text' })}
          </div>
        );
      }
    }
    return '';
  };

  // 订阅
  const subscriptionClick = (row) => {
    const { tradeToken } = userInfo;
    if (!tradeToken) {
      openNativePage({
        pageType: PageType.NATIVE,
        path: NativePages.TRADE_LOGIN,
        fullScreen: true,
        data: null,
      });
      return;
    }
    const { userSub, name, portfolioId: id, subId, userVO, type: cType } = row;
    setUserId(userVO.id);
    setSubId(subId);
    setDialogType(userSub);
    setPortfolioId(id);
    setCombinationName(name);
    setCombinationType(cType);
    setSubShow(true);
  };

  // 订阅确认
  let sflag = false;
  const subConfirmClick = (obj) => {
    if (sflag) return;
    sflag = true;
    // 开启了订阅，申请订阅
    if (dialogType === '0') {
      subApply({ ...obj }).then((res: any) => {
        if (res && res?.code === 0 && res?.result) {
          list.forEach((item) => {
            if (item.portfolioId === portfolioId) {
              item.userSub = '1';
            }
          });
          setList([...list]);
          setSubInfo(res?.result);
          setDialogType('10');
        } else {
          Toast.show({
            content: res.message,
          });
        }
        sflag = false;
      }).catch(() => {
        sflag = false;
      });
    }
    // 没有开启订阅，申请开启订阅
    if (dialogType === '-1') {
      subSeekApply({ ...obj }).then((res: any) => {
        if (res && res?.code === 0 && res?.result) {
          list.forEach((item) => {
            if (item.portfolioId === portfolioId) {
              item.userSub = '0';
            }
          });
          setList([...list]);
          setSubInfo(res?.result);
          setDialogType('1');
        } else {
          Toast.show({
            content: res.message,
          });
        }
        sflag = false;
      }).catch(() => {
        sflag = false;
      });
    }
  };

  // 打开参与排行弹窗
  const opendRanking = (id) => {
    setPortfolioId(id);
    setShow(true);
  };

  useEffect(() => {
    if (data) {
      setList(data);
    }
  }, [data]);

  // useEffect(() => {
  // app那边加薇友后的回调
  // commonCallBack((res: any): any => {
  //   if (res.type === 'add-weiyou' && res.data) {
  //     list.forEach((item) => {
  //       if (item.portfolioId === res.data.portfolioId) {
  //         item.userVO.relations.push(5);
  //       }
  //     });
  //     setList([...list]);
  //   }
  // });
  // });

  return (
    <div styleName="combination-card" className="combination-card">
      {
        list && list.length && list.map((item) => (
          <div
            styleName="item"
            className="item"
            key={item.portfolioId}
          >
            <span styleName={`position-type ${positionType[+item.type].styleName}`}>
              {positionType[+item.type].text}
            </span>
            <div styleName="first">
              <div styleName="first-left">
                <div styleName="first-img" onClick={() => goWeiquanCenter(item)}>
                  <img styleName="first-img-icon" src={item?.userVO?.avatar || DefaultAvatar} alt="" />
                  <span styleName="first-img-position">
                    {
                      item.userVO.tagIcon
                        ? (<img src={item.userVO.tagIcon} alt="" />)
                        : null
                    }
                  </span>
                </div>
                <div styleName="first-name-box">
                  <div styleName="first-name">
                    <div onClick={() => goWeiquanCenter(item)}>{item.userVO.nickName}</div>
                    {/* 关注: 只有分析师才有关注按钮 */}
                    {
                      attention(item)
                    }
                  </div>
                  <div
                    styleName="first-name-option"
                    onClick={() => goWeiquanCenter(item)}
                  >
                    {item.userVO.tagName}
                  </div>
                </div>
              </div>

              {/* +薇友 */}
              {
                !item.userVO.relations.includes(4) && (
                  <div styleName={`${item.userVO?.relations.includes(5) ? 'first-right wait' : 'first-right'}`} onClick={() => addWeiyouClick(item)}>
                    {/* // 身份标识，ORDINARY: 普通客户、STRONGMAN: 牛人、ANALYST: 分析师
                        // 关系：空数组无关系 1好友 2已关注 3被关注 4 自己 5 已添加好友等待对方同意 */}
                    {
                      item.userVO.relations.length === 0 || (!item.userVO.relations.includes(1) && !item.userVO.relations.includes(5)) ? (
                        formatMessage({ id: 'weiyou' })
                      ) : null
                    }
                    {
                      item.userVO.relations.includes(1) ? (
                        formatMessage({ id: 'sendMsg' })
                      ) : null
                    }
                    {
                      item.userVO.relations.includes(5) ? (
                        formatMessage({ id: 'weiyou' })
                      ) : null
                    }
                  </div>
                )
              }
            </div>
            <div styleName="second">
              <div
                styleName="second-left"
              >
                <div>{item.name}</div>
                {
                  item?.sketch ? (
                    <div
                      styleName="second-left-option"
                      onClick={() => nativeOpenPage(`combination-details.html?portfolioId=${item.portfolioId}`)}
                    >
                      {item.sketch || ''}
                    </div>
                  ) : (
                    <div
                      styleName="second-left-option"
                      onClick={() => nativeOpenPage(`create-combination.html?portfolioId=${item.portfolioId}`)}
                    >
                      {formatMessage({ id: 'not_introduce_text_tip' })}
                    </div>
                  )
                }
              </div>

              {/* 订阅 && 未订阅 */}
              {
                subscriptionDom(item)
              }
              {/* 创建订阅 || 参与排行 */}
              {/* profitRanking 是否参与排行 0 已参与 1 未参与 */}
              {
                type === 2 && (item.profitRanking === '1' || item.profitRanking === null) ? (
                  <>
                    {/* <div styleName="seniority line">{formatMessage({ id: 'create_subscription' })}</div> */}
                    <div styleName="seniority" onClick={() => opendRanking(item.portfolioId)}>{formatMessage({ id: 'participate_ranking' })}</div>
                  </>
                ) : null
              }
              {/* 订阅数、日排行 */}
              {
                type === 2 && item.profitRanking === '0' ? (
                  <div styleName="ph-box">
                    <div styleName="item-text">
                      {`${formatMessage({ id: 'sub_num' })}: `}
                      <span>{item?.subNum || 0}</span>
                    </div>
                    |
                    <div styleName="item-text">
                      {`${formatMessage({ id: 'day_rank_num' })}: `}
                      <span>{item?.dayRankNum || 0}</span>
                    </div>
                  </div>
                ) : null
              }
            </div>
            <div styleName="thirdly" onClick={() => nativeOpenPage(`combination-details.html?portfolioId=${item.portfolioId}`)}>
              {/* 组合创建至今 */}
              <div styleName="thirdly-item tl">
                <div
                  className={getClassNameByPriceChange(item.totalProfitRatio)}
                >
                  {`${splitPercentage(item.totalProfitRatio, true)}%`}
                </div>
                <div styleName="thirdly-option">{formatMessage({ id: 'combination_created_so_far' })}</div>
              </div>
              {/* 最新净值 */}
              <div styleName="thirdly-item tc">
                <div
                  className={getClassNameByPriceChange(netValueJudge(item?.netValue || 0))}
                >
                  {item?.netValue || 0}
                </div>
                <div styleName="thirdly-option">{formatMessage({ id: 'latest_net_worth' })}</div>
              </div>
              {/* 近30天收益率 */}
              <div styleName="thirdly-item tr">
                <div
                  className={getClassNameByPriceChange(item?.nearly30Profit || 0)}
                >
                  {`${splitPercentage(item.nearly30Profit, true)}%`}
                </div>
                <div
                  styleName="thirdly-option"
                >
                  {formatMessage({ id: 'recent_yield' })}
                </div>
              </div>
            </div>
            {
              item.existStock ? (
                <LineChart data={item?.chartData || []} />
              ) : null
            }
            {
              !item.existStock && item?.userVO?.relations.includes(4) ? (
                <div styleName="add-stock" onClick={() => nativeOpenPage(`add-stock-filter.html?portfolioId=${item.portfolioId}&source=zuhe`, false, true)}>
                  {/* 添加股票 我的组合里并且没有添加股票  */}
                  <img styleName="icon-add" src={IconAddStock} alt="" />
                  <div styleName="add-stock-text">{formatMessage({ id: 'add_stock_text' })}</div>
                </div>
              ) : null
            }
          </div>
        ))
      }
      <Dialog
        show={show}
        cancelClick={() => setShow(false)}
        confirmClick={() => goRanking()}
      />
      {/* 订阅弹窗 */}
      <Subscription
        show={subShow}
        info={subInfo}
        userId={userId}
        subId={SubId}
        type={combinationType}
        dialogType={dialogType}
        name={combinationName}
        portfolioId={portfolioId}
        closeClick={() => setSubShow(false)}
        confirmClick={(obj) => subConfirmClick(obj)}
      />
      {/* 取消关注确认弹窗框 */}
      <FocuslDialog
        show={showFocusl}
        cancelClick={() => setShowFocusl(false)}
        confirmClick={() => cancelFocus()}
      />
    </div>
  );
};

export default CombinationCard;
