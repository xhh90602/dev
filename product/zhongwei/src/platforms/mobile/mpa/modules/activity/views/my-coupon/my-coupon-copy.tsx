import React, { useState, useEffect, useContext, useMemo } from 'react';
import './my-coupon-copy.scss';
import { useSearchParam } from 'react-use';
import { getMyCoypon } from '@/api/module-api/activity';
import { openNewPage, PageType, goBack, openNativePage, NativePages } from '@/platforms/mobile/helpers/native/msg';
import { userInfoContext } from '@mobile/helpers/entry/native';
import { DownOutline, UpOutline, DownFill } from 'antd-mobile-icons';
import { useIntl } from 'react-intl';
import Loading from '@mobile/components/loading/loading';
import backIcon from './images/icon_return.png';
import Coupon from './components/coupon-copy/coupon';
import NoCoupon from './components/no-data/no-data';
import DelDialog from './components/del-dialog/index';

const d = [
  {
    stock: 'hk',
    type: '免佣卡',
    title: '180天5折免傭卡',
    time: '2022/07/10',
    useType: 'useing',
  },
  {
    stock: 'a',
    type: '免佣卡',
    title: '60天5折免傭卡',
    time: '2022/07/10',
    useType: 'useing',
  },
];

const MyCoupon: React.FC = () => {
  const { formatMessage } = useIntl();
  const safeAreaTop = Number(useSearchParam('safeAreaTop')) || 0;
  const useInfo = useContext<any>(userInfoContext);
  const [data, setData] = useState(d);
  const [selectId, setSelectId] = useState<number>(0);
  const [isSelectShow, setIsSelectShow] = useState(false);
  const [couponStatus, setCouponStatus] = useState<null|string>('all');
  const [stockMarket, setStockMarket] = useState<null|string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [showWindow, setShowWindow] = useState(false);

  const COUPON_USE_STATUS = [
    {
      id: 0,
      label: '全部',
      value: 'all',
    },
    {
      id: 1,
      label: '未使用', // 优惠券用途，1现金抵扣 2佣金抵扣 3手续费抵扣 4利息抵扣 5行情抵扣 6行情折扣 7行情月卡 8线下服务 9实物兑换
      value: 'noUse',
    },
    {
      id: 2,
      label: '使用中',
      value: 'useing',
    },
    {
      id: 4,
      label: '已使用',
      value: 'used',
    },
    {
      id: 5,
      label: '已失效',
      value: 'lose',
    },
  ];

  const STOCK_MARKET = [
    {
      id: 0,
      label: '全部',
      value: 'all',
    },
    {
      id: 1,
      label: '港股', // 优惠券用途，1现金抵扣 2佣金抵扣 3手续费抵扣 4利息抵扣 5行情抵扣 6行情折扣 7行情月卡 8线下服务 9实物兑换
      value: 'hk',
    },
    {
      id: 2,
      label: 'A股',
      value: 'a',
    },
  ];

  const [selectOption, setSelectOption] = useState(COUPON_USE_STATUS);

  useEffect(() => {
    if (useInfo) {
      getMyCoypon(
        {
          userId: useInfo.userId, // 用户id
          couponUse: couponStatus,
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
  }, [useInfo, couponStatus, stockMarket]);

  console.log('couponStatus', couponStatus);
  console.log('stockMarket', stockMarket);

  // 跳转到历史卡券
  const goMyCouponPage = () => {
    openNewPage({
      pageType: PageType.HTML,
      path: 'history-coupon.html',
      replace: false,
    });
  };

  const handlerSelect = (id) => {
    if (id === selectId) {
      setIsSelectShow(!isSelectShow);
    } else {
      setIsSelectShow(true);
    }

    if (id === 0) {
      setSelectOption(COUPON_USE_STATUS);
    } else {
      setSelectOption(STOCK_MARKET);
    }
    setSelectId(id);
    // setIsSelectShow(!isSelectShow);
  };

  const handlerSelectOption = (val) => {
    if (selectId === 0) {
      setCouponStatus(val.value);
    } else {
      setStockMarket(val.value);
    }
    setIsSelectShow(!isSelectShow);
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

  const openWindow = () => {
    setShowWindow(true);
  };

  const renderHtml = useMemo(() => (
    data.length ? data.map((val: any) => (
      <div key={val.title}><Coupon data={val} openWindow={openWindow} /></div>
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
            {/* <span styleName="select-title">
              {
                `${COUPON_LIST_TYPE.find((item) => (item.value === couponType))?.label}(${data.length})`
              }
            </span>
            <span styleName="drap-icon" onClick={() => setIsSelectShow(!isSelectShow)}>
              {
              isSelectShow ? <UpOutline /> : <DownOutline />
            }
            </span> */}
            <div styleName="select-box">
              <div styleName="select-option">
                {
                  couponStatus === 'all' ? '全部状态' : COUPON_USE_STATUS.filter((v) => (v.value === couponStatus))[0].label
                }

                <span styleName="drap-icon" onClick={() => handlerSelect(0)}>
                  {
                    isSelectShow ? <DownFill /> : <DownFill />
                  }
                </span>
              </div>
              <div styleName="select-option">
                {
                  stockMarket === 'all' ? '全部市场' : STOCK_MARKET.filter((v) => (v.value === stockMarket))[0].label
                }

                <span styleName="drap-icon" onClick={() => handlerSelect(1)}>
                  {
                    isSelectShow ? <DownFill /> : <DownFill />
                  }
                </span>
              </div>
            </div>
            {
            isSelectShow && (
              <div styleName="pop">
                <div styleName="pop-title">
                  {/* {formatMessage({ id: 'coupon_type' })} */}
                  卡券狀態選擇
                  {/* 卡券类型 */}
                </div>
                <div styleName="pop-btn-list">
                  {
                    selectId === 0 && selectOption.map((val) => (
                      <div
                        styleName={
                          couponStatus === val.value ? 'pop-btn pop-active-btn' : 'pop-btn'
                        }
                        key={val.id}
                        onClick={() => handlerSelectOption(val)}
                      >
                        {val.label}
                      </div>
                    ))
                  }
                  {
                    selectId === 1 && selectOption.map((val) => (
                      <div
                        styleName={
                          stockMarket === val.value ? 'pop-btn pop-active-btn' : 'pop-btn'
                        }
                        key={val.id}
                        onClick={() => handlerSelectOption(val)}
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
