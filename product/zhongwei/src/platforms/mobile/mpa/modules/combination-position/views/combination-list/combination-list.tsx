import { useIntl } from 'react-intl';
import { openNewPage, PageType } from '@mobile/helpers/native/msg';

import useCombinationPositionList from '@/hooks/combination-position/use-combination-position-list';
import IconSvg from '@mobile/components/icon-svg';
import Loading from '@mobile/components/loading/loading';
import InfiniteScroll from '@mobile/components/infinite-scroll/infinite-scroll';
import PullToRefresh from '@mobile/components/pull-to-refresh/pull-to-refresh';
import BasicCard from '@mobile/components/basic-card/basic-card';
import TradeTip from '@mobile/components/trade-tip/trade-tip';
import CombinationListItem from './components/combination-list-item/combination-list-item';
import './combination-list.scss';

const CombinationList: React.FC = () => {
  const { formatMessage } = useIntl();
  const {
    isLoading,
    queryInfo: { pageNum, portfolioList = [], hasMore },
    fetchDataHandle,
    readAllHandle,
  } = useCombinationPositionList();

  const openHandle = (path: string) => openNewPage({
    replace: false,
    pageType: PageType.HTML,
    path,
  });

  return (
    <div styleName="combination-box">
      <PullToRefresh handleRefresh={fetchDataHandle}>
        <Loading isLoading={isLoading}>
          {portfolioList.length ? (
            <>
              <div styleName="main">
                {portfolioList.map((item: Record<string, any>) => (
                  <BasicCard className="orange-low-bg" key={item.portfolioId}>
                    <CombinationListItem data={item} />

                    {item.messageMap && (
                      <TradeTip
                        openTip
                        tip={`${item.messageMap.title}：${item.messageMap.content}`}
                        onClick={() => {
                          readAllHandle(
                            {
                              type: item.messageMap.subMsgType,
                              pId: item.parentPortfolioId,
                            },
                            openHandle('/standard/warn-notice-list.html?typevalue=1800'),
                          );
                        }}
                        onClose={() => readAllHandle({
                          type: item.messageMap.subMsgType,
                          pId: item.parentPortfolioId,
                        })}
                      />
                    )}
                  </BasicCard>
                ))}

                <InfiniteScroll handleLoadMore={() => fetchDataHandle(pageNum + 1)} hasMore={hasMore} />
              </div>

              <div styleName="prompts-box">
                <IconSvg path="icon_hint" styleName="icon-hint" />
                <div>{formatMessage({ id: 'combination_prompts' })}</div>
              </div>
            </>
          ) : (
            <div styleName="no-data-box">
              <p styleName="no-data-text">{formatMessage({ id: 'no_combination_positions_data' })}</p>

              <button type="button" styleName="order-btn" onClick={() => openHandle('combination.html')}>
                {formatMessage({ id: 'combination_list_place_an_order' })}
              </button>
            </div>
          )}
        </Loading>
      </PullToRefresh>
    </div>
  );
};

export default CombinationList;
