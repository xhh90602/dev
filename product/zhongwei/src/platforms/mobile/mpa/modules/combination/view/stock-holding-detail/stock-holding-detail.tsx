import React, { useEffect, useState, useContext } from 'react';
import { useSearchParam } from 'react-use';
import { getCombiDetailDataInfo, getCombiDetailBasicInfo, subApply, subSeekApply } from '@/api/module-api/combination';
import {
  settingHeaderButton,
  openNativePage,
  PageType,
  NativePages,
  settingNavigationTitle,
  sharePage, CShareType, PPageType,
} from '@mobile/helpers/native/msg';
import { headerButtonCallBack, headerButtonCallShare, pageOnShow } from '@mobile/helpers/native/register';
import { useIntl } from 'react-intl';
import { Toast, PullToRefresh } from 'antd-mobile';
import { sleep } from 'antd-mobile/es/utils/sleep';
import { userInfoContext } from '@/platforms/mobile/helpers/entry/native';
import AccoundCard from '@/platforms/mobile/components/combination/account-card/account-card';
import AccountRanking from '@/platforms/mobile/components/combination/account-ranking';
import AccountTrend from '@/platforms/mobile/components/combination/account-trend';
import WarehouseRecord from '@/platforms/mobile/components/combination/account-warehouse-record';

import './stock-holding-detail.scss';

const AppHome: React.FC = () => {
  const accountId = Number(useSearchParam('accountId')) || 0;
  const userInfo = useContext<any>(userInfoContext);
  const [basicInfo, setBasicInfo] = useState<any>(null);
  const { formatMessage } = useIntl();

  const searchCallback = () => {
    openNativePage({
      pageType: PageType.NATIVE,
      path: NativePages.global_search,
      fullScreen: true,
    });
  };

  const shareCallback = () => {
    sharePage({
      shareType: CShareType.PAGE,
      info: {
        link: `stock-holding-detail.html?accountId=${accountId}`,
        desc: basicInfo.totalProfitRatio,
        snapshot: false, // 是否要分享页面截图
        title: basicInfo.name,
        id: basicInfo.portfolioId,
        pageType: PPageType.combination,
        type: basicInfo.type,
        userId: basicInfo.userId,
      },
    });
  };

  useEffect(() => {
    settingHeaderButton([{
      icon: 'search',
      position: 'right',
      index: 1,
      onClickCallbackEvent: 'headerButtonCallBack',
    }, {
      icon: 'share',
      position: 'right',
      index: 2,
      onClickCallbackEvent: 'headerButtonCallShare',
    }]).then((res) => {
      console.log('设置按钮', res);
    });
    // 搜索
    headerButtonCallBack(() => searchCallback());
    // 设置页面标题
    settingNavigationTitle({ name: formatMessage({ id: 'combination_detail' }) });
    // page重新激活的时候重新加载一下
    pageOnShow(() => {
      window.location.reload();
    });
  }, []);

  useEffect(() => {
    if (!basicInfo) return;
    // 分享
    headerButtonCallShare(() => shareCallback());
  }, [basicInfo]);

  // 下拉刷新
  const onRefresh = async () => {
    await sleep(500);
    window.location.reload();
  };

  // 订阅解锁所有数据
  const subscriptionUnlock = () => {
    console.log('订阅解锁所有数据');
  };
  return (
    <div styleName="components-details">
      <PullToRefresh onRefresh={async () => onRefresh()}>
        {/* 账户信息 */}
        <AccoundCard />
        {/* 排行 portfolioId={portfolioId} */}
        <AccountRanking />
        {/* 收益率曲线 */}
        <AccountTrend />
        {/* 调仓记录 */}
        <WarehouseRecord />
        <div styleName="subscription" onClick={() => subscriptionUnlock()}>订阅解锁所有数据</div>
        {/* <WarehouseRecord
          userSub={basicInfo?.userSub}
          isSelf={dataInfo ? dataInfo.userVO.relations.includes(4) : false}
          portfolioId={portfolioId}
          subClick={() => subscriptionClick()}
        /> */}
        {/* 订阅弹窗
        <Subscription
          show={subShow}
          info={subInfo}
          userId={basicInfo?.userId}
          subId={basicInfo?.subId}
          dialogType={dialogType}
          name={basicInfo?.name}
          type={basicInfo?.type}
          portfolioId={basicInfo?.portfolioId}
          closeClick={() => setSubShow(false)}
          confirmClick={(obj) => subConfirmClick(obj)}
        /> */}
      </PullToRefresh>
    </div>
  );
};

export default AppHome;
