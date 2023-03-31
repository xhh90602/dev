/* eslint-disable max-len */
import { useState, useMemo, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { parseUrl } from '@dz-web/o-orange';
import { openNewPage, PageType, sharePage, CShareType, PPageType } from '@mobile/helpers/native/msg';
import { COMBINATION_POSITION_ROUTERS } from '@mobile-mpa/modules/combination-position/routers';
import { openStockSearch } from '@mobile/helpers/native/url';
import { userInfoContext } from '@mobile/helpers/entry/native';
import { PORTFOLIO_TYPE } from '@/constants/combination';

import useCombinationBasicInfo from '@/hooks/combination-position/use-combination-basic-info';
import Tabs from '@mobile/components/tabs/tabs';
import Loading from '@mobile/components/loading/loading';
import IconSvg from '@mobile/components/icon-svg';
import FullScreenPageView from '@mobile/components/full-screen-page-view/full-screen-page-view';
import CombinationBasicInfo from './components/combination-basic-info/combination-basic-info';
import CombinationTabsCurrent from './components/combination-tabs-current/combination-tabs-current';
import CombinationTabsSource from './components/combination-tabs-source/combination-tabs-source';
import './combination-detail.scss';

const CURRENT_GROUP = 'current';
const SOURCE_GROUP = 'source';

const CombinationDetail: React.FC = () => {
  const { formatMessage } = useIntl();

  const location = useLocation();
  const portfolioId = parseUrl(location.search, 'portfolioId');

  const { userId } = useContext(userInfoContext);
  const [currentTabs, setCurrentTabs] = useState<string>(CURRENT_GROUP);

  const {
    isLoading,
    combinationInfo,
    combinationInfo: { basicInfoVO = {}, parentBasicInfoVO = {} },
    getCombinationInfo,
  } = useCombinationBasicInfo();

  const isFirmOffer = useMemo(() => {
    if (currentTabs === CURRENT_GROUP || parentBasicInfoVO?.type === PORTFOLIO_TYPE.FRIM_OFFER) {
      return true;
    }

    return false;
  }, [currentTabs]);

  const isShowFooter = useMemo(() => {
    if (currentTabs === CURRENT_GROUP) {
      return true;
    }

    return `${userId}` === `${parentBasicInfoVO?.userId}`;
  }, [currentTabs]);

  const tabList = useMemo(
    () => [
      {
        key: CURRENT_GROUP,
        title: formatMessage({ id: 'position_combination' }),
        children: <CombinationTabsCurrent info={basicInfoVO} refreshHanlde={getCombinationInfo} />,
      },
      {
        key: SOURCE_GROUP,
        title: formatMessage({ id: 'source_combination' }),
        children: <CombinationTabsSource info={parentBasicInfoVO} refreshHanlde={getCombinationInfo} />,
      },
    ],
    [combinationInfo],
  );

  const handleWarehouse = () => {
    let isFull = false;
    let pagePath = `simulate-combination-adjustment.html?portfolioId=${parentBasicInfoVO?.portfolioId}`;

    if (isFirmOffer) {
      isFull = true;
      pagePath = `combination-position.html#${COMBINATION_POSITION_ROUTERS.COMBINATION_ORDER}?portfolioId=${basicInfoVO?.portfolioId}`;
    }

    openNewPage({
      pageType: PageType.HTML,
      path: pagePath,
      replace: false,
      fullScreen: isFull,
    });
  };

  const handleShare = () => {
    const hash = COMBINATION_POSITION_ROUTERS.COMBINATION_DETAIL;

    sharePage({
      shareType: CShareType.PAGE,
      info: {
        link: `combination-position.html#${hash}?portfolioId=${portfolioId}`,
        desc: basicInfoVO.totalProfitRatio,
        snapshot: false, // 是否要分享页面截图
        title: basicInfoVO.name,
        id: basicInfoVO.portfolioId,
        pageType: PPageType.combination,
        type: basicInfoVO.type,
        userId: basicInfoVO.userId,
      },
    });
  };

  return (
    <Loading isLoading={isLoading}>
      <FullScreenPageView
        title={formatMessage({ id: 'details' })}
        className="gradient-bg"
        right={(
          <div styleName="head-icon-box">
            <IconSvg path="icon_search" click={openStockSearch} />
            <IconSvg path="icon_share" click={handleShare} />
          </div>
        )}
      >
        <div styleName="combination-detail">
          <div styleName="main">
            <div styleName="basic-info">
              <CombinationBasicInfo name={formatMessage({ id: 'actual_position' })} info={basicInfoVO} />
              <CombinationBasicInfo name={formatMessage({ id: 'source_combination' })} info={parentBasicInfoVO} />
            </div>

            <Tabs
              list={tabList}
              activeKey={currentTabs}
              className="basic-card"
              onChange={(key: string) => setCurrentTabs(key)}
            />
          </div>

          {isShowFooter && (
            <div styleName="footer">
              <div styleName="operation-box">
                <button type="button" styleName="operation-btn" onClick={handleWarehouse}>
                  {formatMessage({ id: isFirmOffer ? 'firm_offer_warehouse' : 'mimic_panel_warehouse' })}
                </button>
              </div>
            </div>
          )}
        </div>
      </FullScreenPageView>
    </Loading>
  );
};

export default CombinationDetail;
