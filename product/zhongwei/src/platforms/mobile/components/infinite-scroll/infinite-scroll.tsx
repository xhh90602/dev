import { useIntl } from 'react-intl';
import { InfiniteScroll, DotLoading } from 'antd-mobile';
import './infinite-scroll.scss';

interface IPorps {
  hasMore: boolean;
  handleLoadMore: (...args: any[]) => any;
}

const InfiniteScrollComp: React.FC<IPorps> = (props) => {
  const { formatMessage } = useIntl();
  const { hasMore, handleLoadMore } = props;

  return (
    <InfiniteScroll loadMore={handleLoadMore} hasMore={hasMore}>
      <div styleName="content">
        {hasMore ? (
          <div styleName="loading">
            <span>{formatMessage({ id: 'loading' })}</span>
            <DotLoading />
          </div>
        ) : (
          <span>{`--- ${formatMessage({ id: 'no_more' })} ---`}</span>
        )}
      </div>
    </InfiniteScroll>
  );
};

export default InfiniteScrollComp;
