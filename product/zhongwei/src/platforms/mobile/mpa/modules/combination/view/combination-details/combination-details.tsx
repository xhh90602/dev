import React, { useEffect, useState, useContext } from 'react';
import { useSearchParam } from 'react-use';
import { getCombiDetailDataInfo, getCombiDetailBasicInfo, subApply, subSeekApply } from '@/api/module-api/combination';
import {
  settingHeaderButton,
  openNativePage,
  PageType,
  NativePages,
  settingNavigationTitle,
  sharePage,
  CShareType,
  PPageType,
  goBack,
} from '@mobile/helpers/native/msg';
import {
  headerButtonCallBack,
  headerSearchCallBack,
  headerButtonCallShare,
  pageOnShow,
} from '@mobile/helpers/native/register';
import { useIntl } from 'react-intl';
import IconTip from '@/platforms/mobile/images/icon_zh_tip.svg';
import { Toast, PullToRefresh } from 'antd-mobile';
import { sleep } from 'antd-mobile/es/utils/sleep';
import { userInfoContext } from '@/platforms/mobile/helpers/entry/native';
import Subscription from '@/platforms/mobile/components/combination/subscription';
import Card from '@/platforms/mobile/components/combination/card';
import Ranking from '@/platforms/mobile/components/combination/ranking';
import Fans from '@/platforms/mobile/components/combination/fans';
import Synopsis from '@/platforms/mobile/components/combination/synopsis';
import Trend from '@/platforms/mobile/components/combination/trend';
import Performance from '@/platforms/mobile/components/combination/performance';
import Distribution from '@/platforms/mobile/components/combination/distribution';
import WarehouseRecord from '@/platforms/mobile/components/combination/warehouse-record';
import RevenueContribution from '@/platforms/mobile/components/combination/revenue-contribution';
import Tool from '@/platforms/mobile/components/combination/tool';

import './combination-details.scss';

const AppHome: React.FC = () => {
  const portfolioId = Number(useSearchParam('portfolioId')) || 0;
  const [dataInfo, setDataInfo] = useState<any>(null);
  const [basicInfo, setBasicInfo] = useState<any>(null);
  const [subShow, setSubShow] = useState<boolean>(false);
  const [subInfo, setSubInfo] = useState<any>(null);
  const [dialogType, setDialogType] = useState<any>(null);
  const userInfo = useContext<any>(userInfoContext);
  const { formatMessage } = useIntl();

  // 获取基础信息
  const getCombiBasicInfo = () => {
    getCombiDetailBasicInfo({
      portfolioId,
    }).then((res: any) => {
      if (res && res.code === 0 && res?.result) {
        if (res.result?.basicInfoVO) {
          setBasicInfo(res.result.basicInfoVO);
        }
      }
    });
  };

  // 获取顾问的宣传信息
  const getCombiDataInfo = () => {
    getCombiDetailDataInfo({
      portfolioId,
    }).then((res: any) => {
      if (res && res.code === 0 && res?.result) {
        setDataInfo(res.result);
      }
    });
  };

  // 订阅确认
  let sflag = false;
  const subConfirmClick = (obj) => {
    if (!userInfo?.tradeToken) {
      openNativePage({
        pageType: PageType.NATIVE,
        path: NativePages.TRADE_LOGIN,
        fullScreen: true,
        data: null,
      });
      return;
    }
    if (sflag) return;
    sflag = true;
    // 开启了订阅，申请订阅
    if (dialogType === '0') {
      subApply({ ...obj }).then((res: any) => {
        if (res && res?.code === 0 && res?.result) {
          setSubInfo(res?.result);
          setDialogType('10');
          getCombiBasicInfo();
          Toast.show(
            { content: `${formatMessage({ id: 'subscription_text' })}${formatMessage({ id: 'success' })}` },
          );
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
          setSubInfo(res?.result);
          setDialogType('1');
          getCombiBasicInfo();
          Toast.show(
            { content: `${formatMessage({ id: 'request_send_success' })}` },
          );
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

  const subscriptionClick = () => {
    if (!userInfo?.tradeToken) {
      openNativePage({
        pageType: PageType.NATIVE,
        path: NativePages.TRADE_LOGIN,
        fullScreen: true,
        data: null,
      });
      return;
    }
    setDialogType(basicInfo.userSub);
    setSubShow(true);
  };

  useEffect(() => {
    if (portfolioId) {
      getCombiDataInfo();
      getCombiBasicInfo();
    }
  }, [portfolioId]);

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
        link: `combination-details.html?portfolioId=${portfolioId}`,
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
      icon: 'back', // 返回
      position: 'left',
      index: 1,
      onClickCallbackEvent: 'headerButtonCallBack',
    }, {
      icon: 'search',
      position: 'right',
      index: 1,
      onClickCallbackEvent: 'headerSearchCallBack',
    }, {
      icon: 'share',
      position: 'right',
      index: 2,
      onClickCallbackEvent: 'headerButtonCallShare',
    }]).then((res) => {
      console.log('设置按钮', res);
    });
    // 返回
    headerButtonCallBack(() => goBack());
    // 搜索
    headerSearchCallBack(() => searchCallback());
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

  return (
    <div styleName="components-details">
      <PullToRefresh onRefresh={async () => onRefresh()}>
        {/* 组合信息 */}
        <Card data={basicInfo} />
        {/* 排行 */}
        {
          (basicInfo && +basicInfo.profitRanking) === 0 && (<Ranking portfolioId={portfolioId} />)
        }
        {/* 分析师信息 */}
        <Fans data={dataInfo?.userVO} portfolioId={portfolioId} />
        {/* 组合介绍 */}
        <Synopsis data={dataInfo} />
        {/* 收益趋势 */}
        <Trend portfolioId={portfolioId} />
        {/* 历史业绩 */}
        <Performance portfolioId={portfolioId} />
        {/* 组合分布 */}
        <Distribution portfolioId={portfolioId} />
        {/* 调仓记录 */}
        <WarehouseRecord
          userSub={basicInfo?.userSub}
          isSelf={dataInfo ? dataInfo.userVO.relations.includes(4) : false}
          portfolioId={portfolioId}
          subClick={() => subscriptionClick()}
        />
        {/* 个股收益贡献 */}
        <RevenueContribution portfolioId={portfolioId} />
        {/* 风险提示 */}
        <div styleName="risk-tip">
          <img src={IconTip} alt="" />
          {formatMessage({ id: 'risk_tip' })}
        </div>
        {/* 按钮 */}
        <Tool
          dataInfo={dataInfo?.userVO}
          data={basicInfo}
          tradeToken={userInfo?.tradeToken}
          subClick={() => subscriptionClick()}
        />
        {/* 订阅弹窗 */}
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
        />
      </PullToRefresh>
    </div>
  );
};

export default AppHome;
