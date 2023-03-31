import React from 'react';
import { PullToRefresh } from 'antd-mobile';
import { sleep } from 'antd-mobile/es/utils/sleep';
// import HeadeTop from './components/head-top';
import StrategyClass from './components/strategy-class';
import AnalystRecommendation from './components/analyst-recommendation';
import ExcellentStock from './components/excellent-stock';
import SelectedPortfolio from './components/selected-portfolio';
import SelectedStrategy from './components/selected-strategy';
import './strategy-home.scss';

const StrategyHome: React.FC = () => {
  // 下拉刷新
  const onRefresh = async () => {
    await sleep(500);
    window.location.reload();
  };

  return (
    <PullToRefresh onRefresh={async () => onRefresh()}>
      <div styleName="strategy-home">
        {/* 顶部用户、搜索、消息 */}
        {/* <HeadeTop data={{}} /> */}
        {/* 策略分类 */}
        <StrategyClass />
        {/* 分析师荐股 */}
        <AnalystRecommendation />
        {/* 优质股票 */}
        <ExcellentStock />
        {/* 精选组合 */}
        <SelectedPortfolio />
        {/* 精选策略 */}
        <SelectedStrategy />
      </div>
    </PullToRefresh>
  );
};

export default StrategyHome;
