/* eslint-disable react/destructuring-assignment */
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Toast } from 'antd-mobile';
import { toFixed, toPercent, toThousand } from '@dz-web/o-orange';
import { div, getUrlParam, mul, sub, toThousands } from '@/utils';
import { TRADE_ORDER_TYPE } from '@/constants/trade';
import { stockTradeEntrust } from '@/api/module-api/combination';
import { settingNavigationTitle, settingHeaderButton } from '@mobile/helpers/native/msg';
import { getActualEntrustDetail } from '@/api/module-api/combination-position';
import { COMBINATION_POSITION_ROUTERS } from '@mobile-mpa/modules/combination-position/routers';

import TradeOrder, { getActive } from '@mobile/containers/trade-order/trade-order';
import BasicCard from '@mobile/components/basic-card/basic-card';
import './combination-trade.scss';

const CombinationTrade = (props) => {
  const { type } = props;
  const isBuy = type === TRADE_ORDER_TYPE.BUY;

  const { formatMessage } = useIntl();
  const location = useLocation();
  const navigator = useNavigate();

  const [currentCombination, setCurrentCombination] = useState<Record<string, any>>({});
  const { id, pid, code } = useMemo(() => getUrlParam(), [location]);
  const stockInfo = useMemo(() => (currentCombination?.stockVOList?.length ? currentCombination.stockVOList[0] : {}), [
    currentCombination,
  ]);

  useEffect(() => {
    settingNavigationTitle({ name: formatMessage({ id: isBuy ? 'order_buy' : 'order_sell' }) });

    settingHeaderButton([
      {
        index: 1,
        icon: 'back',
        position: 'left',
        onClickCallbackEvent: 'back',
      },
    ]);
  }, []);

  useEffect(() => {
    getActualEntrustDetail({
      id: +id,
      portfolioId: +pid,
    }).then((res) => {
      console.log(res);
      if (res && res?.code === 0) {
        setCurrentCombination(res?.result || {});
      }
    });
  }, [id, pid, code]);

  const listCard = (d) => {
    const { price } = d;
    const qty = isBuy ? d.qty : sub(stockInfo.qty, d.qty);
    const countAmount = mul(price, qty);

    const scaleRatio = div(
      mul(price, qty),
      div(currentCombination.surplusCapital, currentCombination.surplusCapitalProportion),
    );

    const combinationListCurrent = [
      {
        label: `${formatMessage({ id: 'ratio' })}|${formatMessage({ id: 'source_ratio' })}`,
        content: (
          <>
            <div>{toPercent(stockInfo.assetsRatio, { multiply: 100 })}</div>
            <div>{toPercent(stockInfo.sourceAssetsRatio, { multiply: 100 })}</div>
          </>
        ),
      },
      {
        label: formatMessage({ id: 'position_number_and_cost' }),
        content: (
          <>
            <div>{stockInfo.qty}</div>
            <div>{toFixed(stockInfo.costPrice)}</div>
          </>
        ),
      },
      {
        label: formatMessage({ id: 'current_market_value' }),
        content: <div>{toThousand(toFixed(stockInfo.marketValue))}</div>,
      },
    ];

    const combinationListChange = [
      {
        label: formatMessage({ id: 'ratio' }),
        content: <div>{toPercent(scaleRatio === Infinity ? 0 : scaleRatio, { multiply: 100 })}</div>,
      },
      {
        label: formatMessage({ id: 'number' }),
        content: <div>{Number(qty).toLocaleString()}</div>,
      },
      {
        label: formatMessage({ id: 'trade_amount' }),
        content: <div>{toThousands(toFixed(countAmount))}</div>,
      },
    ];

    return (
      <BasicCard className="m-t-20" styleName="combination-box">
        <div styleName="title-label">{currentCombination.name}</div>
        <div className="line" />
        <div styleName="info-config">
          <div>
            <div styleName="num">{toThousand(toFixed(currentCombination.surplusCapital))}</div>
            <div styleName="label">{formatMessage({ id: 'remaining_configurable_amount' })}</div>
          </div>
          <div>
            <div styleName="num">{toPercent(currentCombination.surplusCapitalProportion, { multiply: 100 })}</div>
            <div styleName="label">{formatMessage({ id: 'ratio' })}</div>
          </div>
        </div>
        <div className="line" />
        <div>
          <BasicCard styleName="combination-current">
            <div styleName="combination-tip">{formatMessage({ id: 'current' })}</div>
            {combinationListCurrent.map((item) => (
              <div styleName="combination-item" key={item.label}>
                <div styleName="item-label">{item.label}</div>
                <div styleName="item-content">{item.content}</div>
              </div>
            ))}
          </BasicCard>
          <BasicCard styleName="combination-change" className="m-t-15">
            <div styleName="combination-tip">{formatMessage({ id: 'warehouse_to' })}</div>
            {combinationListChange.map((item) => (
              <div styleName="combination-item" key={item.label}>
                <div styleName="item-label">{item.label}</div>
                <div styleName="item-content">{item.content}</div>
              </div>
            ))}
          </BasicCard>
        </div>
      </BasicCard>
    );
  };

  return (
    <div>
      <TradeOrder
        type={type}
        combination
        combinationInfo={{
          ...currentCombination,
          ...stockInfo,
        }}
        callback={(data, close) => {
          console.log(data);

          const priceScale = currentCombination.surplusCapital > mul(data.nowPrice, data.qty);

          if (!priceScale) {
            Toast.show({ content: formatMessage({ id: 'scale_value_exceeds' }) });
            return;
          }

          stockTradeEntrust({
            stockList: [
              {
                bs: type,
                id: +id,
                nowPrice: +data.nowPrice,
                orderType: getActive(),
                portfolioId: +pid,
                qty: data.qty,
                stockCode: data.stockCode,
                tradeMarket: data.tradeMarket,
              },
            ],
          }).then((res) => {
            if (res?.code !== 0) return;
            close();

            Toast.show({
              maskClickable: false,
              content: formatMessage({ id: 'warehouse_success' }),
              afterClose: () => {
                navigator(`${COMBINATION_POSITION_ROUTERS.COMBINATION_WAREHOUSE_RECORD}?portfolioId=${pid}`, {
                  replace: true,
                });
              },
            });
          });
        }}
        InsetComponent={listCard}
      />
    </div>
  );
};

export default CombinationTrade;
