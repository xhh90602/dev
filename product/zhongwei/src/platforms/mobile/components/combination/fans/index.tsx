import React, { memo, useEffect, useState } from 'react';
import Tab from '@/platforms/mobile/components/combination/detail-tab';
import { useIntl } from 'react-intl';
import { Toast } from 'antd-mobile';
import { addFollow, cancelFollow /* addWeiyou */ } from '@/api/module-api/combination';
import IconAdd from '@/platforms/mobile/images/icon_add.svg';
import IconYes from '@/platforms/mobile/images/icon_yes.svg';
import DefaultAvatar from '@/platforms/mobile/images/default_avatar.svg';
// import IconMore from '@/platforms/mobile/images/icon_zh_more_right.svg';
// import { commonCallBack } from '@/platforms/mobile/helpers/native/register';
import { openNativePage, PageType, NativePages } from '../../../helpers/native/msg';

import './index.scss';

const Card: React.FC<any> = memo((props) => {
  const { data, portfolioId } = props;
  const [info, setInfo] = useState<any>(null);
  const [tabItems, setTabItem] = useState<any>(null);
  const [activeKey, setActiveKey] = useState<string>('experience');
  const { formatMessage } = useIntl();

  // 关注 && 取消关注
  // 身份标识，ORDINARY: 普通客户、STRONGMAN: 牛人、ANALYST: 分析师
  // 关系：空数组无关系 1好友 2已关注 3被关注 4 自己 5 已添加好友等待对方同意
  let cflag = false;
  const functionClick = (row) => {
    if (cflag) return;
    cflag = true;
    if (row.relations.includes(2)) {
      cancelFollow({
        hisId: row.userId,
      }).then((res: any) => {
        if (res && res.code === 0) {
          cflag = false;
          row.relations.splice(row.relations.indexOf(2), 1);
          Toast.show({
            content: `
            ${formatMessage({ id: 'cancelText' })}
            ${formatMessage({ id: 'focus_on' })}
            ${formatMessage({ id: 'success' })}
            `,
          });
          setInfo(row);
        }
      });
    } else {
      addFollow({
        hisId: row.userId,
      }).then((res: any) => {
        if (res && res.code === 0) {
          cflag = false;
          row.relations.push(2);
          Toast.show({
            content: `${formatMessage({ id: 'focus_on' })}${formatMessage({ id: 'success' })}`,
          });
          setInfo(row);
        }
      });
    }
  };

  // 加薇友
  const addWeiyouClick = (row) => {
    // 关系：空数组无关系 1好友 2已关注 3被关注 4 自己 5 已添加好友等待对方同意
    if (row.relations.includes(4)) return;
    console.log('row', row, portfolioId);
    if (row.relations.length <= 0) {
      openNativePage({
        pageType: PageType.NATIVE,
        path: NativePages.add_weiyou,
        data: { userId: row.id, portfolioId },
      });
      return;
    }
    if (row.relations.includes(1)) {
      openNativePage({
        pageType: PageType.NATIVE,
        path: NativePages.siliao,
        data: { imUser: row.imUser },
      });
      return;
    }
    if (row.relations.includes(5)) {
      Toast.show({
        content: formatMessage({ id: 'add_friend_tip' }),
      });
    }
    // openNativePage({
    //   pageType: PageType.NATIVE,
    //   path: NativePages.add_weiyou,
    //   fullScreen: true,
    //   data: { userId: row.userId, portfolioId },
    // });
    // if (flag) return;
    // flag = true;
    // addWeiyou({
    //   id: row.userId,
    //   reason: formatMessage({ id: 'add_friend' }),
    // }).then((res: any) => {
    //   if (res.code === 0) {
    //     flag = false;
    //     if (info.relations.includes(5)) {
    //       info.relations.push(5);
    //       setInfo(info);
    //     }
    //   }
    // });
  };

  const tempItem: any = [
    { key: 'experience', title: formatMessage({ id: 'investment_resume' }), el: '' },
    { key: 'performance', title: formatMessage({ id: 'history_performance' }), el: '' },
  ];

  const switchTab = (key) => {
    setActiveKey(key);
  };

  useEffect(() => {
    if (data) {
      tempItem.forEach((item: any) => {
        if (item.key === 'experience') {
          item.el = data.roleCode === 'ANALYST' ? `${data?.introduction || ''}` : `${data?.profile || ''}`;
        }
        if (item.key === 'performance') {
          item.el = `${data.pastAchievements || ''}`;
        }
      });
      setTabItem(tempItem);
      setInfo(data);
    }
  }, [data]);

  const attention = (row) => {
    const { roleCode, relations } = row;
    if (roleCode === 'ANALYST' && relations && !relations.includes(4)) {
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

  // 跳转至薇圈个人中心
  const goToCenter = () => {
    const { roleCode, id } = data;
    openNativePage({
      pageType: PageType.NATIVE,
      path: NativePages.weiquan_center,
      fullScreen: true,
      data: { hisId: id, roleCode },
    });
  };

  // useEffect(() => {
  //   app那边加薇友后的回调
  //   commonCallBack((res: any): any => {
  //     if (res.type === 'add-weiyou' && res.data) {
  //       info.relations.push(5);
  //       setInfo({ ...info });
  //     }
  //   });
  // });

  return (
    <div styleName="warp">
      {/* 头部 */}
      <div styleName="first">
        <div styleName="first-left">
          <div styleName="first-img" onClick={() => goToCenter()}>
            <img styleName="first-img-icon" src={(info && info?.avatar) || DefaultAvatar} alt="" />
            <span styleName="first-img-position">
              {
                info && info?.tagIcon ? (<img src={(info.tagIcon)} alt="" />) : null
              }
            </span>
          </div>

          <div styleName="first-name">
            <div styleName="first-name-box">
              <div styleName="name" onClick={() => goToCenter()}>{(info && info?.nickName) || ''}</div>
              {/* 关注: 只有分析师才有关注按钮 */}
              {
                info && attention(info)
              }
            </div>
            <div styleName="first-name-option" onClick={() => goToCenter()}>
              {(info && info.tagName) || ''}
            </div>
          </div>
        </div>

        {
          !info?.relations.includes(4) && (
            <div styleName="first-right">
              <div
                styleName={`${info?.relations.includes(5) ? 'first-right-friends wait' : 'first-right-friends'}`}
                onClick={() => addWeiyouClick(info)}
              >
                {
                  info?.relations.length === 0 || (!info?.relations.includes(1) && !info?.relations.includes(5)) ? (
                    formatMessage({ id: 'weiyou' })
                  ) : null
                }
                {
                  info?.relations.includes(1) ? (
                    formatMessage({ id: 'sendMsg' })
                  ) : null
                }
                {
                  info?.relations.includes(5) ? (
                    formatMessage({ id: 'weiyou' })
                  ) : null
                }
              </div>
            </div>
          )
        }
        {/* <div styleName="more" onClick={() => goToCenter()}>
          <img styleName="icon-right" src={IconMore} alt="" />
        </div> */}
      </div>

      {/* tab */}
      {
        data && data.roleCode === 'ANALYST' ? (
          <Tab
            tabItems={tabItems || []}
            activeKey={activeKey}
            className="toggle-tab"
            switchTab={(key) => switchTab(key)}
          />
        ) : null
      }
    </div>
  );
});

export default Card;
