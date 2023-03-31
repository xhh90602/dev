import { useRef } from 'react';
import { useIntl } from 'react-intl';
import { Checkbox } from 'antd-mobile';
import { isNaN } from 'lodash-es';
import { toThousand, toFixed, toPercent } from '@dz-web/o-orange';
import { goToSymbolPage } from '@mobile/helpers/native/msg';
import { BS_DIRECTION } from '@/constants/trade';

import classNames from 'classnames';
import './order-stock-item.scss';

interface IProps {
  stockInfo: Record<string, any>;
  handleSetStockInfo: (...args: any[]) => any;
  handleChecked: (...args: any[]) => any;
  handleCalcNumber: (...args: any[]) => any;
  handleCalcRatio: (...args: any[]) => any;
}

const OrderStockItem: React.FC<IProps> = (props) => {
  const { stockInfo, handleSetStockInfo, handleChecked, handleCalcNumber, handleCalcRatio } = props;

  const { formatMessage } = useIntl();
  const checkboxRef = useRef<any>();

  return (
    <div styleName="stock-item-box">
      <div styleName="stock-info">
        <Checkbox
          styleName={classNames({ 'disabled-checkbox': stockInfo.orderStatusFlag })}
          ref={checkboxRef}
          checked={stockInfo.checked}
          onChange={(val) => {
            handleChecked({ ...stockInfo, checked: val }, () => {
              checkboxRef.current.uncheck();
            });
          }}
        />

        <div
          styleName="stock-info-name"
          onClick={() => goToSymbolPage({ market: stockInfo.smallMarket, code: stockInfo.stockCode })}
        >
          <div styleName="name-box">
            <p styleName="name">
              <span>{`${stockInfo.stockName} ${stockInfo.stockCode} `}</span>
              {stockInfo.tradeMarket && <span>{`.${stockInfo.tradeMarket}`}</span>}
            </p>
          </div>

          {stockInfo.orderStatusFlag && <p styleName="in-hand-text">{formatMessage({ id: 'in_the_storehouse' })}</p>}
        </div>

        <div styleName="stock-info-price">
          <span>{formatMessage({ id: 'latest_prices' })}</span>
          <span styleName="price-val" className="num-font">{stockInfo.nowPrice}</span>
        </div>
      </div>

      <div styleName="stock-current-data">
        <div styleName="current-icon">{formatMessage({ id: 'current' })}</div>

        <div styleName="data-item">
          <p styleName="label">{`${formatMessage({ id: 'current' })}|${formatMessage({ id: 'source_ratio' })}`}</p>
          <p styleName="value" className="num-font">{toPercent(stockInfo.assetsRatio || 0, { multiply: 100 })}</p>
          <p styleName="label" className="num-font">{toPercent(stockInfo.sourceAssetsRatio || 0, { multiply: 100 })}</p>
        </div>

        <div styleName="data-item">
          <p styleName="label">{formatMessage({ id: 'position_number_and_cost' })}</p>
          <p styleName="value" className="num-font">{stockInfo.qty || 0}</p>
          <p styleName="label" className="num-font">{toFixed(stockInfo.costPrice || 0)}</p>
        </div>

        <div styleName="data-item">
          <p styleName="label">{formatMessage({ id: 'current_market_value' })}</p>
          <p styleName="value" className="num-font">{toThousand(toFixed(stockInfo.marketValue || 0))}</p>
        </div>
      </div>

      <div styleName="stock-warehouse-data">
        <div styleName="warehouse-icon">{formatMessage({ id: 'warehouse_to' })}</div>

        <div styleName="data-item">
          <p styleName="label">{formatMessage({ id: 'ratio' })}</p>
          <div styleName={classNames({ content: true, 'disabled-box': stockInfo.orderStatusFlag })}>
            <input
              className="num-font"
              type="number"
              placeholder="0.00"
              disabled={stockInfo.orderStatusFlag}
              value={stockInfo.nowRatio}
              onChange={(e) => {
                const { value } = e.target;
                handleSetStockInfo({ ...stockInfo, nowRatio: value });
              }}
              onBlur={(e) => {
                const { value } = e.target;
                const regex = /^[0-9]+(\.[0-9]+)?$/;

                if (isNaN(parseFloat(value)) || !regex.test(value)) {
                  handleCalcNumber({ ...stockInfo, nowRatio: 0 });
                  return;
                }

                handleCalcNumber({ ...stockInfo });
              }}
            />
            <span>%</span>
          </div>
        </div>

        <div styleName="data-item">
          <p styleName="label">{formatMessage({ id: 'number' })}</p>
          <div styleName={classNames({ content: true, 'disabled-box': stockInfo.orderStatusFlag })}>
            <input
              className="num-font"
              type="number"
              placeholder="0"
              disabled={stockInfo.orderStatusFlag}
              value={stockInfo.nowNumber}
              onChange={(e) => {
                const { value } = e.target;
                handleSetStockInfo({ ...stockInfo, nowNumber: value });
              }}
              onBlur={(e) => {
                const { value } = e.target;
                const regex = /^[0-9]+(\.[0-9]+)?$/;

                if (isNaN(parseFloat(value)) || !regex.test(value)) {
                  handleCalcRatio({ ...stockInfo, nowNumber: 0 });
                  return;
                }

                handleCalcRatio({ ...stockInfo });
              }}
            />
          </div>

          {!!stockInfo.dealNumber && (
            <div styleName={stockInfo.bs === BS_DIRECTION.BUY ? 'buy-text' : 'sell-text'}>
              <span>{formatMessage({ id: stockInfo.bs === BS_DIRECTION.BUY ? 'buy_text' : 'sell_text' })}</span>
              <span>{Math.abs(stockInfo.dealNumber)}</span>
            </div>
          )}
        </div>

        <div styleName="data-item">
          <p styleName="label">{formatMessage({ id: 'trade_amount' })}</p>
          <p styleName="value" className="num-font">{toThousand(toFixed(stockInfo.tradeAmount || 0))}</p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(OrderStockItem);
