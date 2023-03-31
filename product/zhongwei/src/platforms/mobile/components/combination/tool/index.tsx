import React, { memo, useState } from 'react';
import { useIntl } from 'react-intl';
import { nativeOpenPage } from '@/platforms/mobile/helpers/native/url';
import { Toast } from 'antd-mobile';
import { openNativePage, PageType, NativePages } from '@mobile/helpers/native/msg';
import { copyCombination, createActual, existActual } from '@/api/module-api/combination';
import IconMenu33 from '@/platforms/mobile/images/icon_zh_33.svg';
import IconYes from '@/platforms/mobile/images/icon_yes1.svg';
import Dialog from './dialog';
import './index.scss';

const WarehouseRecord: React.FC<any> = memo((props) => {
  const { data, dataInfo, tradeToken, subClick = () => null } = props;
  const [showDialog, setShowDialog] = useState(false);
  const [czType, setCzType] = useState<string>('');
  const { formatMessage } = useIntl();

  // 复制组合接口
  const copy = (name) => {
    const { portfolioId } = data;
    copyCombination({ parentId: portfolioId, name }).then((res: any) => {
      if (res && res?.code === 0 && res?.result) {
        Toast.show({
          content: `${formatMessage({ id: 'combination_copy_finish' })}`,
        });
        setTimeout(() => {
          nativeOpenPage(`combination-details.html?portfolioId=${res.result.portfolioId}`);
        }, 1500);
      } else {
        Toast.show({
          content: res.message,
        });
      }
    });
  };

  // 实盘下单接口
  const firmOrder = (obj) => {
    if (!tradeToken) {
      openNativePage({
        pageType: PageType.NATIVE,
        path: NativePages.TRADE_LOGIN,
        fullScreen: true,
        data: null,
      });
      return;
    }
    const { portfolioId } = data;
    const { name, initCapitalScale } = obj;
    createActual({
      parentId: portfolioId,
      name,
      initCapitalScale: +((+initCapitalScale).toFixed()),
    }).then((res) => {
      if (res && res?.code === 0 && res?.result) {
        if (res?.result.portfolioId) {
          nativeOpenPage(`combination-position.html#/combination-order?portfolioId=${res.result.portfolioId}`);
        } else {
          Toast.show({
            content: res.message,
          });
        }
      } else {
        Toast.show({
          content: res.message,
        });
      }
    });
  };

  // 验证是否存在实盘
  const verifyFirmOrder = () => {
    if (!tradeToken) {
      openNativePage({
        pageType: PageType.NATIVE,
        path: NativePages.TRADE_LOGIN,
        fullScreen: true,
        data: null,
      });
      return;
    }
    const { portfolioId } = data;
    existActual({
      parentId: portfolioId,
    }).then((res) => {
      if (res && res?.code === 0 && res?.result) {
        if (res?.result.portfolioId) {
          nativeOpenPage(`combination-position.html#/combination-order?portfolioId=${res.result.portfolioId}`, true);
        } else {
          setCzType('shipanxiadan');
          setShowDialog(true);
        }
      } else {
        Toast.show({
          content: res.message,
        });
      }
    });
  };

  // 订阅
  const subscriptionClick = () => {
    subClick();
  };

  // 用户订阅状态 -1:不可订阅[求订阅] 0:未订阅[可订阅] 1:已订阅待确认[不可订阅] 10:已订阅成功[不可订阅]
  const subscriptionDom = () => {
    const userSub = data?.userSub || null;
    if (userSub !== null) {
      if (userSub === '0' || userSub === '-1') {
        return (
          <div styleName="btn min-dy" onClick={() => subscriptionClick()}>{formatMessage({ id: 'subscription' })}</div>
        );
      }
      if (userSub === '1') {
        return (
          <div styleName="btn min-dy-yes">
            <img styleName="icon-yes" src={IconYes} alt="" />
            {formatMessage({ id: 'subscriptioning' })}
          </div>
        );
      }
      if (userSub === '10') {
        return (
          <div styleName="btn min-dy-yes">
            <img styleName="icon-yes" src={IconYes} alt="" />
            {formatMessage({ id: 'already_subscription' })}
          </div>
        );
      }
    }
    return '';
  };

  // 按钮点击事件
  const placeAnOrder = (ts) => {
    // type 类型 0 模拟盘 1 实盘
    const { portfolioId, userSub } = data;
    // 组合调仓
    if (ts === 'zuhetiaocang' && userSub === null) {
      nativeOpenPage(`simulate-combination-adjustment.html?portfolioId=${portfolioId}`, true);
    }
    // 复制组合
    if (ts === 'copy') {
      if (userSub === '10') {
        setCzType('copy');
        setShowDialog(true);
      } else {
        Toast.show({
          content: formatMessage({ id: 'please_subscription' }),
        });
      }
    }
    // 实盘下单
    if (ts === 'shipanxiadan') {
      if (userSub === null || userSub === '10') {
        verifyFirmOrder();
      } else {
        Toast.show({
          content: formatMessage({ id: 'please_subscription' }),
        });
      }
    }
  };

  // 弹窗确认事件
  const confirmClick = (obj) => {
    if (czType === 'copy') {
      copy(obj.name);
    }
    if (czType === 'shipanxiadan') {
      firmOrder(obj);
    }
    setShowDialog(false);
  };

  return (
    <div styleName="btn-warp">
      {/* 组合调仓 && 禁用组合调仓 + 实盘下单 */}
      <div styleName="btn-box between">
        {/* 用户订阅状态 -1:不可订阅[求订阅] 0:未订阅[可订阅] 1:已订阅待确认[不可订阅] 10:已订阅成功[不可订阅] */}
        {
          subscriptionDom() // 订阅 && 已订阅
        }
        {
          // 组合调仓
          data?.userSub === null && data?.type === '0' ? (
            <div styleName="btn zhtc zhtc-disabled" onClick={() => placeAnOrder('zuhetiaocang')}>
              <img styleName="icon-menu" src={IconMenu33} alt="" />
              {formatMessage({ id: 'combination_adjustment' })}
            </div>
          ) : null
        }
        {
          // 实盘下单
          data?.userSub === null ? (
            <div
              styleName={
                `btn btn-spxd ${!dataInfo?.relations.includes(4) && !(data?.userSub === '10') ? 'disable' : ''}`
              }
              onClick={() => placeAnOrder('shipanxiadan')}
            >
              {formatMessage({ id: 'firm_order' })}
            </div>
          ) : (
            // {/* (复制组合 + 实盘下单) */}
            <div styleName="zh-box">
              {/* 复制组合 */}
              <div
                styleName={`btn zh-fzzh ${!(data?.userSub === '10') ? 'disable' : ''}`}
                onClick={() => placeAnOrder('copy')}
              >
                {formatMessage({ id: 'copy_combination' })}
              </div>
              {/* 实盘下单 */}
              <div
                styleName={`btn zh-spxd ${!(data?.userSub === '10') ? 'disable' : ''}`}
                onClick={() => placeAnOrder('shipanxiadan')}
              >
                {formatMessage({ id: 'firm_order' })}
              </div>
            </div>
          )
        }

      </div>
      <Dialog
        show={showDialog}
        czType={czType}
        confirmClick={(obj) => confirmClick(obj)}
        cancelClick={() => setShowDialog(false)}
      />
    </div>
  );
});

export default WarehouseRecord;
