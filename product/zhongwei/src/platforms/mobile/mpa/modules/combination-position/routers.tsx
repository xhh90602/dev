import { Suspense } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { TRADE_ORDER_TYPE } from '@/constants/trade';

const App = React.lazy(() => import('./combination-position'));

const CombinationList = React.lazy(
  () => import('@mobile-mpa/modules/combination-position/views/combination-list/combination-list'),
);
const CombinationDetail = React.lazy(
  () => import('@mobile-mpa/modules/combination-position/views/combination-detail/combination-detail'),
);
const CombinationOrder = React.lazy(
  () => import('@mobile-mpa/modules/combination-position/views/combination-order/combination-order'),
);
const StockWarehouseRecord = React.lazy(
  () => import('@mobile-mpa/modules/combination-position/views/stock-warehouse-record/stock-warehouse-record'),
);
const CombinationWarehouseRecord = React.lazy(
  // eslint-disable-next-line max-len
  () => import('@mobile-mpa/modules/combination-position/views/combination-warehouse-record/combination-warehouse-record'),
);
const CombinationWarehouseDetail = React.lazy(
  // eslint-disable-next-line max-len
  () => import('@mobile-mpa/modules/combination-position/views/combination-warehouse-detail/combination-warehouse-detail'),
);
const CombinationTrade = React.lazy(
  () => import('@mobile-mpa/modules/combination-position/views/combination-trade/combination-trade'),
);

export enum COMBINATION_POSITION_ROUTERS {
  COMBINATION_LIST = '/combination-list',
  COMBINATION_DETAIL = '/combination-detail',
  COMBINATION_ORDER = '/combination-order',
  COMBINATION_TRADE_SELL = '/combination-trade/sell',
  COMBINATION_TRADE_BUY = '/combination-trade/buy',
  STOCK_WAREHOUSE_RECORD = '/stock-warehouse-record',
  COMBINATION_WAREHOUSE_RECORD = '/combination-warehouse-record',
  COMBINATION_WAREHOUSE_DETAIL = '/combination-warehouse-detail',
}

const RouterApp = () => (
  <Suspense fallback={<div />}>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<CombinationList />} />
          <Route path={COMBINATION_POSITION_ROUTERS.COMBINATION_LIST} element={<CombinationList />} />
          <Route path={COMBINATION_POSITION_ROUTERS.COMBINATION_DETAIL} element={<CombinationDetail />} />
          <Route path={COMBINATION_POSITION_ROUTERS.COMBINATION_ORDER} element={<CombinationOrder />} />
          <Route path={COMBINATION_POSITION_ROUTERS.STOCK_WAREHOUSE_RECORD} element={<StockWarehouseRecord />} />
          <Route
            path={COMBINATION_POSITION_ROUTERS.COMBINATION_WAREHOUSE_RECORD}
            element={<CombinationWarehouseRecord />}
          />
          <Route
            path={COMBINATION_POSITION_ROUTERS.COMBINATION_WAREHOUSE_DETAIL}
            element={<CombinationWarehouseDetail />}
          />
          <Route
            path={COMBINATION_POSITION_ROUTERS.COMBINATION_TRADE_BUY}
            element={<CombinationTrade type={TRADE_ORDER_TYPE.BUY} />}
          />
          <Route
            path={COMBINATION_POSITION_ROUTERS.COMBINATION_TRADE_SELL}
            element={<CombinationTrade type={TRADE_ORDER_TYPE.SELL} />}
          />
        </Route>
      </Routes>
    </HashRouter>
  </Suspense>
);

export default RouterApp;
