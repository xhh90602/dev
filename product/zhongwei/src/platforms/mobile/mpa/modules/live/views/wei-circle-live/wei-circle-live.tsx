/**
 * 薇圈直播列表
 * 2022-09-09
 */
import React, { useContext, useMemo } from 'react';
import { InfiniteScroll, DotLoading, Swiper } from 'antd-mobile';
import shortid from 'shortid';
import { useIntl } from 'react-intl';
import useLiveList from '@/hooks/live/use-live-list';
import { userInfoContext } from '@mobile/helpers/entry/native';
import Title from './components/title/title'; // 标题分类组件
import Recommend from './components/recommend/recommend'; // 热门推荐组件
import ListItem from './components/list-item/list-item'; // 直播列表组件
import NoMore from './components/no-more/no-more'; // 没有更多组件
import './wei-circle-live.scss';

const WeiCircle: React.FC = () => {
  const { formatMessage } = useIntl();
  const userInfo = useContext(userInfoContext);
  const { preList, record, live, hasMore, getRecordData } = useLiveList();
  const liveData = useMemo(() => live.splice(0, 3), [live]);

  return (
    <div styleName="wei-circle">
      {
        liveData?.length > 0 ? (
          <>
            <Title title={formatMessage({ id: 'hot_recommend' })} />
            <Swiper indicator={() => null}>
              {liveData
                .map((item) => (
                  <Swiper.Item key={shortid.generate()}>
                    <Recommend data={item} />
                  </Swiper.Item>
                ))}
            </Swiper>
          </>
        ) : null
      }
      {/* 直播预告区域 */}
      { preList?.length > 0 && <Title title={`${formatMessage({ id: 'live' })}${formatMessage({ id: 'preview' })}`} />}
      <div styleName="preview-container">
        {preList && preList?.length ? preList?.map((item) => (
          <ListItem
            key={shortid.generate()}
            marginBottom={16}
            type="preview"
            data={item}
            userInfo={userInfo}
          />
        )) : null}
      </div>
      {/* 往期回放区域 */}
      { record.length > 0
       && <Title title={`${formatMessage({ id: 'previous' })}${formatMessage({ id: 'playback' })}`} />}
      <div styleName="preview-container">
        {record && record.length ? record.map((item) => (
          <ListItem
            key={shortid.generate()}
            data={item}
            marginBottom={33}
            type="record"
            userInfo={userInfo}
          />
        )) : null}
      </div>
      <InfiniteScroll
        loadMore={async () => getRecordData(true)}
        hasMore={hasMore}
        threshold={100}
      >
        {
          hasMore && (
            <>
              <span>{formatMessage({ id: 'loading' })}</span>
              <DotLoading />
            </>
          )
        }
        {
          record && record.length > 0 && !hasMore && (
            <NoMore />
          )
        }
      </InfiniteScroll>
    </div>
  );
};

export default WeiCircle;
