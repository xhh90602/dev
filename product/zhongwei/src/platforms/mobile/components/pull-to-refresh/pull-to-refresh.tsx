import { FormattedMessage } from 'react-intl';
import { PullToRefresh } from 'antd-mobile';
import './pull-to-refresh.scss';

interface IPorps {
  handleRefresh: (...args: any[]) => any;
  children: any;
}

const statusRecord: Record<string, any> = {
  pulling: <FormattedMessage id="pull_to_refresh" />,
  canRelease: <FormattedMessage id="release_immediate_refresh" />,
  refreshing: <FormattedMessage id="loading_symbol" />,
  complete: <FormattedMessage id="refresh_succeeded" />,
};

const PullToRefreshComp: React.FC<IPorps> = (props) => {
  const { children, handleRefresh } = props;

  return (
    <div styleName="pull-refresh-box">
      <PullToRefresh onRefresh={handleRefresh} renderText={(status) => statusRecord[status]}>
        {children}
      </PullToRefresh>
    </div>
  );
};

export default PullToRefreshComp;
