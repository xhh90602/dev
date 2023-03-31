import React, { useState } from 'react';
import { useGetState } from 'ahooks';
import { useIntl } from 'react-intl';
import { InfiniteScroll } from 'antd-mobile';
import Loading from '@/platforms/mobile/components/combination/loading';
import IconBack from '@/platforms/mobile/images/icon_back_white.svg';
import { goBack, NativePages, openNativePage, PageType } from '@/platforms/mobile/helpers/native/msg';
import { getStrategyAnalystList } from '@/api/module-api/strategy';
import { useSearchParam } from 'react-use';
import './analyst-recommend-detail.scss';
import Empty from '@/platforms/mobile/components/combination/empty';
import DefaultAvatar from '@/platforms/mobile/images/default_avatar.svg';

const StrategyHome: React.FC = () => {
  const safeAreaTop = Number(useSearchParam('safeAreaTop')) || 0;
  const [pages, setPages, getPage] = useGetState<any>({ pageNum: 0, pageSize: 10 });
  const [list, setList] = useState<any>([]);
  const [isLoading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const { formatMessage } = useIntl();

  let flag = true;
  const getList = (scroll = false) => {
    if (!flag) return;
    flag = false;
    try {
      const pageNum = (getPage().pageNum + 1);
      getStrategyAnalystList({
        ...pages,
        ...getPage(),
        pageNum,
      }).then((res) => {
        setLoading(false);
        if (res && res.code === 0) {
          if (res?.result && res.result.length) {
            let temp = [];
            const resData = res?.result || [];
            if (scroll) {
              temp = (list && list.length && list.concat(resData)) || resData;
            } else {
              temp = res?.result;
            }
            setList(temp);
            setPages({ ...getPage(), pageNum });
          } else {
            setHasMore(false);
          }
        } else {
          setHasMore(false);
        }
        flag = true;
      }).catch(() => {
        flag = true;
        setHasMore(false);
      });
    } catch (error) {
      flag = true;
      setHasMore(false);
    }
  };

  const openWuquanCenter = ({ id, roleCode }) => {
    openNativePage({
      pageType: PageType.NATIVE,
      path: NativePages.weiquan_center,
      fullScreen: true,
      data: { hisId: id, roleCode },
    });
  };

  return (
    <div styleName="analyst-recommend-detail">
      <div styleName="full-content">
        <div styleName="head-top" style={{ top: `${+safeAreaTop}px` }}>
          <img styleName="back" src={IconBack} alt="" onClick={() => goBack()} />
          <div styleName="title">{formatMessage({ id: 'analyst_recommendation' })}</div>
        </div>
        <div styleName="content">
          {
            isLoading ? (
              <div styleName="loading-page">
                <Loading />
              </div>
            ) : null
          }
          {
            !isLoading && !hasMore && (!list || !list.length) && (
              <div styleName="empty-box">
                <Empty type="strategy" />
              </div>
            )
          }
          {
            list && list.length ? (
              list.map((item) => (
                <div styleName="item" key={item.id}>
                  <div styleName="user-box">
                    <div styleName="l" onClick={() => openWuquanCenter(item)}>
                      <div styleName="avatar-box">
                        <img styleName="avatar" src={item?.avatar || DefaultAvatar} alt="" />
                        {
                          item?.tagIcon ? <img styleName="avatar-tag" src={item.tagIcon} alt="" /> : null
                        }
                      </div>
                      <div styleName="user-info">
                        <div styleName="name">{item?.nickname || ''}</div>
                        <div styleName="type-text">{item?.tagName || ''}</div>
                      </div>
                    </div>
                    <div styleName="r">
                      <div styleName="num">{item?.recommendQuantity || 0}</div>
                      <div styleName="text">{formatMessage({ id: 'number_of_recommended_shares' })}</div>
                    </div>
                  </div>
                  <div styleName="text">{item?.introduction || ''}</div>
                </div>
              ))
            ) : null
          }
          <InfiniteScroll threshold={0} loadMore={async () => getList(true)} hasMore={hasMore}>
            {
              list && list.length > 0 && !hasMore && (
                <span>
                  ~
                  {formatMessage({ id: 'notMore' })}
                  ~
                </span>
              )
            }
          </InfiniteScroll>
        </div>
      </div>
      <div styleName="text-tip">{formatMessage({ id: 'text_tip' })}</div>
    </div>
  );
};

export default StrategyHome;
