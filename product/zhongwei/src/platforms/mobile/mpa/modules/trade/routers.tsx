import { TRADE_ORDER_TYPE } from '@/constants/trade';
import Loading from '@/platforms/mobile/components/loading/loading';
import { Suspense } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

const App = React.lazy(() => import('./trade'));
const INDEX = React.lazy(() => import('@mobile-mpa/modules/trade/views/capital-fund-index/capital-fund-index'));
const OrderIndex = React.lazy(() => import('@mobile-mpa/modules/trade/views/order-index/order-index'));
const OrderList = React.lazy(() => import('@mobile-mpa/modules/trade/views/order-list/order-list'));
const OrderInfo = React.lazy(() => import('@mobile-mpa/modules/trade/views/order-info/order-info'));
const OrderInfoCondition = React.lazy(
  () => import('@mobile-mpa/modules/trade/views/order-info-condition/order-info-condition'),
);
const TriggerList = React.lazy(() => import('@mobile-mpa/modules/trade/views/trigger-list/trigger-list'));
const All = React.lazy(() => import('@mobile-mpa/modules/trade/views/all/all'));
const MyOrder = React.lazy(() => import('@mobile-mpa/modules/trade/views/my-order/my-order'));
const PositionDistribution = React.lazy(
  () => import('@mobile-mpa/modules/trade/views/position-distribution/position-distribution'),
);
const Setting = React.lazy(() => import('@mobile-mpa/modules/trade/views/setting/setting'));
const DurationSelect = React.lazy(() => import('@mobile-mpa/modules/trade/views/setting/duration-select'));

export enum TRADE_ROUTERS {
  BUY = '/buy', // 下单买入 -> 委托类型
  ALL = '/all', // 全部
  SELL = '/sell', // 下单卖出 -> 委托类型
  MYORDER = '/my-order', // 我的订单
  ORDER = '/order', // 订单列表
  TRIGGER = '/trigger', // 条件单列表
  INFO = '/info', // 订单详情
  INFO_CONDITION = '/info-condition', // 订单详情
  CAPITAL_INDEX = '/capital', // 账户总览 首页
  POSITION_DISTRIBUTION = '/position-distribution', // 持仓分布
  SETTING = '/setting', // 交易设置
  DURATIONSELECT = '/duration-select' // 交易密码有效时长选择
}

const RouterApp = () => (
  <Suspense fallback={<Loading isLoading> </Loading>}>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<INDEX />} />
          <Route path={TRADE_ROUTERS.CAPITAL_INDEX} element={<INDEX />} />
          <Route path={TRADE_ROUTERS.ALL} element={<All />} />
          <Route path={TRADE_ROUTERS.BUY} element={<OrderIndex type={TRADE_ORDER_TYPE.BUY} />} />
          <Route path={TRADE_ROUTERS.SELL} element={<OrderIndex type={TRADE_ORDER_TYPE.SELL} />} />
          <Route path={TRADE_ROUTERS.ORDER} element={<OrderList />} />
          <Route path={TRADE_ROUTERS.TRIGGER} element={<TriggerList />} />
          <Route path={TRADE_ROUTERS.INFO} element={<OrderInfo />} />
          <Route path={TRADE_ROUTERS.INFO_CONDITION} element={<OrderInfoCondition />} />
          <Route path={TRADE_ROUTERS.POSITION_DISTRIBUTION} element={<PositionDistribution />} />
          <Route path={TRADE_ROUTERS.MYORDER} element={<MyOrder />} />
          <Route path={TRADE_ROUTERS.SETTING} element={<Setting />} />
          <Route path={TRADE_ROUTERS.DURATIONSELECT} element={<DurationSelect />} />
        </Route>
      </Routes>
    </HashRouter>
  </Suspense>
);

export default RouterApp;
