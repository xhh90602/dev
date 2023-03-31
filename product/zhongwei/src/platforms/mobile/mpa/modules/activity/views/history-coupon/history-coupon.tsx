import React, { useState, useEffect, useContext } from 'react';
import './history-coupon.scss';
import { getHistoryCoypon } from '@/api/module-api/activity';
// import { userConfigContext, userInfoContext } from '@/platforms/mobile/helpers/native/native';
import { userInfoContext } from '@mobile/helpers/entry/native';
import { useIntl } from 'react-intl';
import Loading from '@mobile/components/loading/loading';
import Coupon from './components/coupon/coupon';
import NoCoupon from './components/no-data/no-data';

const HistoryCoupon: React.FC = () => {
  const { formatMessage } = useIntl();
  const [tabId, setTabId] = useState(1);
  const [couponList, setCouponList] = useState([]);
  const [couponUsedList, setCouponUsedList] = useState([]);
  const [showList, setShowList] = useState([]);
  const useInfo = useContext<any>(userInfoContext);
  const [isLoading, setIsLoading] = useState(true);

  const getHistoryCoyponList = (id) => {
    getHistoryCoypon({
      userId: useInfo.userId, // 统一用户id useInfo.userId
      status: id, // 状态 0未使用 1已使用
    }).then((res) => {
      if (res.code === 0) {
        console.log(res);
        if (id === 1) {
          setCouponUsedList(res.result);
        }
        if (id === 0) {
          setCouponList(res.result);
        }
      }
    }).finally(() => setIsLoading(false));
  };
  useEffect(() => {
    if (useInfo) {
      getHistoryCoyponList(0);
      getHistoryCoyponList(1);
    }
  }, [useInfo]);
  useEffect(() => {
    if (tabId === 0) {
      setShowList(couponList);
    }
    if (tabId === 1) {
      setShowList(couponUsedList);
    }
  }, [tabId]);
  return (
    <Loading isLoading={isLoading}>
      <div styleName="page">
        <div styleName="page-tab">
          <div styleName={tabId === 1 ? 'page-tab-item page-tab-active' : 'page-tab-item'} onClick={() => setTabId(1)}>
            已使用(
            <span>{couponUsedList.length}</span>
            )
          </div>
          <div styleName={tabId === 0 ? 'page-tab-item page-tab-active' : 'page-tab-item'} onClick={() => setTabId(0)}>
            未使用(
            <span>{couponList.length}</span>
            )
          </div>
        </div>
        <div styleName="page-main">
          {
          showList.length ? showList.map((val: any) => (
            <div key={val?.myCouponId}>
              <Coupon data={val} type={tabId} />
            </div>
          )) : (<NoCoupon />)
        }
        </div>
      </div>
    </Loading>

  );
};

export default HistoryCoupon;
