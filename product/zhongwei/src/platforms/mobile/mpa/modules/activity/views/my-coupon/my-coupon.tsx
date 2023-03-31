import React, { useState, useEffect, useContext, useMemo } from 'react';
import './my-coupon.scss';
import { useSearchParam } from 'react-use';
import { getMyCoypon } from '@/api/module-api/activity';
import { openNewPage, PageType, goBack, openNativePage, NativePages } from '@/platforms/mobile/helpers/native/msg';
import { userInfoContext } from '@mobile/helpers/entry/native';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import { useIntl } from 'react-intl';
import Loading from '@mobile/components/loading/loading';
import backIcon from './images/icon_return.png';
import Coupon from './components/coupon/coupon';
import NoCoupon from './components/no-data/no-data';
import DelDialog from './components/del-dialog/index';

const MyCoupon: React.FC = () => {
  const { formatMessage } = useIntl();
  const safeAreaTop = Number(useSearchParam('safeAreaTop')) || 0;
  const useInfo = useContext<any>(userInfoContext);
  const [data, setData] = useState([]);
  const [isSelectShow, setIsSelectShow] = useState(false);
  const [couponType, setCouponType] = useState<null|number>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWindow, setShowWindow] = useState(false);
  console.log('showWindow', showWindow);

  const COUPON_LIST_TYPE = [
    {
      id: 0,
      label: '全部',
      value: null,
    },
    {
      id: 1,
      label: '免佣卡券', // 优惠券用途，1现金抵扣 2佣金抵扣 3手续费抵扣 4利息抵扣 5行情抵扣 6行情折扣 7行情月卡 8线下服务 9实物兑换
      value: 2,
    },
    {
      id: 2,
      label: '行情卡券',
      value: 7,
    },
  ];

  useEffect(() => {
    if (useInfo) {
      getMyCoypon(
        {
          userId: useInfo.userId, // 用户id
          couponUse: couponType,
        },
      )
        .then((res) => {
          if (res.code === 0) {
            setData(res.result);
          }
        }).catch((err) => {
          console.log('err--->', err);
        }).finally(() => setIsLoading(false));
    }
  }, [useInfo, couponType]);

  // 跳转到历史卡券
  const goMyCouponPage = () => {
    openNewPage({
      pageType: PageType.HTML,
      path: 'history-coupon.html',
      replace: false,
    });
  };

  const confirm = () => {
    openNativePage({
      pageType: PageType.NATIVE,
      path: NativePages.TRADE_LOGIN,
      fullScreen: true,
      data: null,
    });
    setShowWindow(false);
  };

  // const renderHtml = useMemo(() => (
  //   showWindow ? <DelDialog cancelClick={setShowWindow(false)} confirmClick={confirm} /> : ''
  // ), [showWindow]);

  const openWindow = () => {
    setShowWindow(true);
  };

  const renderHtml = useMemo(() => (
    data.length ? data.map((val: any) => (
      <div key={val.myCouponId}><Coupon data={val} openWindow={openWindow} /></div>
    )) : (
      <NoCoupon />
    )
  ), [data]);
  return (
    <Loading isLoading={isLoading}>
      <div styleName="page" style={{ paddingTop: `${+safeAreaTop}px` }}>
        <div styleName="page-title">
          <img src={backIcon} alt="" onClick={() => goBack()} />
          <div styleName="page-title-center">我的卡券</div>
          <div
            styleName="page-title-right"
            onClick={() => {
              goMyCouponPage();
            }}
          >
            {formatMessage({ id: 'history_coupon' })}
            {/* 历史卡券 */}
          </div>
        </div>
        <div styleName="page-main">
          <div styleName="select">
            <span styleName="select-title">
              {
              `${COUPON_LIST_TYPE.find((item) => (item.value === couponType))?.label}(${data.length})`
            }
            </span>
            <span styleName="drap-icon" onClick={() => setIsSelectShow(!isSelectShow)}>
              {
              isSelectShow ? <UpOutline /> : <DownOutline />
            }
            </span>
            {
            isSelectShow && (
              <div styleName="pop">
                <div styleName="pop-title">
                  {formatMessage({ id: 'coupon_type' })}
                  {/* 卡券类型 */}
                </div>
                <div styleName="pop-btn-list">
                  {
                    COUPON_LIST_TYPE.map((val) => (
                      <div
                        styleName={couponType === val.value ? 'pop-btn pop-active-btn' : 'pop-btn'}
                        key={val.id}
                        onClick={() => {
                          setCouponType(val.value);
                          setIsSelectShow(!isSelectShow);
                        }}
                      >
                        {val.label}
                      </div>
                    ))
                  }
                </div>
              </div>

            )
          }
          </div>
          {
            renderHtml
          }
          {
            showWindow ? <DelDialog cancelClick={() => setShowWindow(false)} confirmClick={confirm} /> : ''
          }
        </div>
      </div>
    </Loading>
  );
};

export default MyCoupon;
