import Trend from '@mobile/components/combination/trend';
import Performance from '@mobile/components/combination/performance';
import Distribution from '@mobile/components/combination/distribution';
import WarehouseRecord from '@mobile/components/combination/warehouse-record';
import RevenueContribution from '@mobile/components/combination/revenue-contribution';
import RankingInfo from '../ranking-info/ranking-info';
import RiskWarning from '../risk-warning/risk-warning';
import './combination-tabs-source.scss';

interface IProps {
  info: Record<string, any>;
  refreshHanlde: (...args: any[]) => any;
}

const CombinationTabsSource: React.FC<IProps> = (props) => {
  const { info = {}, refreshHanlde } = props;

  return (
    <div styleName="source-combination-box">
      <RankingInfo info={info} refreshHanlde={refreshHanlde} />

      <Trend portfolioId={info.portfolioId} />

      <Performance portfolioId={info.portfolioId} />

      <Distribution portfolioId={info.portfolioId} />

      <WarehouseRecord
        isSelf={info.userSub === null}
        userSub={info.userSub}
        portfolioId={info.portfolioId}
        portfolioType={info.type}
      />

      <RevenueContribution portfolioId={info.portfolioId} />

      <RiskWarning />
    </div>
  );
};

export default React.memo(CombinationTabsSource);
