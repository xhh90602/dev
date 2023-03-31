import { useIntl } from 'react-intl';
import { toThousand, toFixed, toPercent } from '@dz-web/o-orange';
import { BS_DIRECTION, TRADE_ACCOUNT_TYPE } from '@/constants/trade';

import classNames from 'classnames';
import useCombinationPositionOrders from '@/hooks/combination-position/use-combination-position-orders';
import IconSvg from '@mobile/components/icon-svg';
import Loading from '@mobile/components/loading/loading';
import NoMessage from '@mobile/components/no-message/no-message';
import BasicModal from '@mobile/components/basic-modal/basic-modal';
import BasicPopup from '@mobile/components/basic-popup/basic-popup';
import FullScreenPageView from '@mobile/components/full-screen-page-view/full-screen-page-view';
import OrderHeader from './components/order-header/order-header';
import OrderFooter from './components/order-footer/order-footer';
import OrderStockItem from './components/order-stock-item/order-stock-item';
import './combination-order.scss';

const CombinationOrder: React.FC = () => {
  const { formatMessage } = useIntl();
  const {
    isLoading,
    combineInfo,
    stockList,
    checkedList,
    tradeAccountInfo,
    tradeMoneyInfo,
    tradeTotalAmount,
    modalVisible,
    quotaInputRef,
    setModalVisible,
    setIsHoldings,
    handleRename,
    handleSetStockInfo,
    handleChecked,
    handleCalcNumber,
    handleCalcRatio,
    handleSubmit,
    handleSupplementQuota,
    handleSubmitOrder,
  } = useCombinationPositionOrders();

  return (
    <Loading isLoading={isLoading}>
      <FullScreenPageView title={formatMessage({ id: 'combined_firm_order' })} className="gradient-bg">
        <div styleName="combination-order-box">
          <div styleName="header">
            <OrderHeader combineInfo={combineInfo} handleRename={handleRename} />
          </div>

          <div styleName="main">
            <div styleName="warehouse-stock-box">
              {stockList.map((item, index) => (
                <OrderStockItem
                  key={item.stockCode}
                  stockInfo={item}
                  handleSetStockInfo={(info: Record<string, any>) => {
                    handleSetStockInfo({ index, info });
                  }}
                  handleChecked={(info: Record<string, any>, callback: (...args: any) => any) => {
                    handleChecked({ index, info, callback });
                  }}
                  handleCalcNumber={(info: Record<string, any>) => {
                    handleCalcNumber({ index, info });
                  }}
                  handleCalcRatio={(info: Record<string, any>) => {
                    handleCalcRatio({ index, info });
                  }}
                />
              ))}

              {!stockList.length && <NoMessage />}

              <div styleName="combination-order-prompt">
                <p>{formatMessage({ id: 'warm_prompt' })}</p>
                <p>{formatMessage({ id: 'combination_order_prompt1' })}</p>
                <p>{formatMessage({ id: 'combination_order_prompt2' })}</p>
                <p>{formatMessage({ id: 'combination_order_prompt3' })}</p>
              </div>
            </div>
          </div>

          <div styleName="footer">
            <OrderFooter
              combineInfo={combineInfo}
              checkedList={checkedList}
              tradeAccountInfo={tradeAccountInfo}
              tradeMoneyInfo={tradeMoneyInfo}
              tradeTotalAmount={tradeTotalAmount}
              setIsHoldings={setIsHoldings}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>

        <BasicPopup visible={modalVisible.quotaVisible}>
          <div styleName="supplementary-quota-box">
            <p styleName="title">{formatMessage({ id: 'current_combination_insufficient_fund' })}</p>
            <p styleName="prompt">{formatMessage({ id: 'adjust_combination_config_amount' })}</p>

            <div styleName="max-quota-box">
              <p styleName="max-quota-label">{formatMessage({ id: 'current_combination_config_amount' })}</p>
              <p styleName="max-quota-value" className="num-font">
                {`${toThousand(toFixed(combineInfo.surplusCapital))}${combineInfo.currency}`}
              </p>
            </div>

            <div styleName="input-box">
              <p styleName="input-label">
                {`${formatMessage({ id: 'supplementary_quota' })}(${
                  combineInfo.currency
                })`}
              </p>

              <input
                type="number"
                ref={quotaInputRef}
                placeholder={`${formatMessage({ id: 'min_supplementary_quota' })}${toThousand(
                  toFixed(tradeTotalAmount.minAddQuota),
                )}${combineInfo.currency}`}
              />
            </div>

            <div styleName="popup-btn-box">
              <button
                type="button"
                styleName="cancel-btn"
                onClick={() => {
                  quotaInputRef.current.value = '';
                  setModalVisible({ quotaVisible: false });
                }}
              >
                {formatMessage({ id: 'cancel' })}
              </button>

              <button type="button" styleName="determine-btn" onClick={handleSupplementQuota}>
                {formatMessage({ id: 'determine' })}
              </button>
            </div>
          </div>
        </BasicPopup>

        <BasicModal
          visible={modalVisible.orderConfirmVisible}
          title={formatMessage({ id: 'batch_transfer_confirmation' })}
          confirmText={formatMessage({ id: 'determine' })}
          cancelText={formatMessage({ id: 'cancel' })}
          onConfirm={() => handleSubmitOrder()}
          onCancel={() => setModalVisible({ orderConfirmVisible: false })}
        >
          <div>
            <div styleName="update-table">
              <div styleName="update-table-thead">
                <div styleName="update-table-td">{formatMessage({ id: 'stock_name' })}</div>
                <div styleName="update-table-td">{formatMessage({ id: 'number' })}</div>
                <div styleName="update-table-td">{formatMessage({ id: 'direction' })}</div>
                <div styleName="update-table-td">{formatMessage({ id: 'warehouse_to_expected' })}</div>
              </div>

              <div styleName="update-table-tbody">
                {checkedList.map((item) => (
                  <div styleName="update-table-tbody-tr border-box" key={item.id}>
                    <div styleName="update-table-td">
                      <p>{item.stockName}</p>
                      <p styleName="secondary-text" className="num-font">
                        {item.stockCode}
                      </p>
                    </div>
                    <div styleName="update-table-td" className="num-font">
                      {item.dealNumber || 0}
                    </div>
                    <div
                      styleName={classNames([
                        'update-table-td',
                        item.bs === BS_DIRECTION.BUY ? 'buy-color' : 'sell-color',
                      ])}
                    >
                      {formatMessage({ id: item.bs === BS_DIRECTION.BUY ? 'buy_text' : 'sell_text' })}
                    </div>
                    <div styleName="update-table-td" className="num-font">
                      {toPercent(item.nowRatio)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div styleName="confirm-data">
              <div styleName="confirm-data-label">{formatMessage({ id: 'order_type' })}</div>
              <div styleName="confirm-data-content">{formatMessage({ id: 'market_order' })}</div>
            </div>
            <div styleName="confirm-data border-box">
              <div styleName="confirm-data-label">{formatMessage({ id: 'deadline' })}</div>
              <div styleName="confirm-data-content">{formatMessage({ id: 'this_date_only' })}</div>
            </div>
            <div styleName="confirm-data">
              <div styleName="confirm-data-label">{formatMessage({ id: 'total_purchase_amount' })}</div>
              <div styleName="confirm-data-content money-box" className="num-font">
                {`${toThousand(toFixed(tradeTotalAmount.buyAmount))}${combineInfo.currency}`}
              </div>
            </div>

            {tradeAccountInfo.accountType === TRADE_ACCOUNT_TYPE.FINANCING && !!tradeTotalAmount.loanAmounts && (
              <div styleName="confirm-data">
                <div styleName="confirm-data-label content-hint">
                  <span>{formatMessage({ id: 'order_amount_of_loan_estimate' })}</span>
                  <IconSvg path="icon_hint" />
                </div>
                <div styleName="confirm-data-content money-box" className="num-font">
                  {toThousand(toFixed(tradeTotalAmount.loanAmounts))}
                </div>
              </div>
            )}

            <div styleName="confirm-data">
              <div styleName="confirm-data-label">{formatMessage({ id: 'total_amount_sold' })}</div>
              <div styleName="confirm-data-content money-box" className="num-font">
                {`${toThousand(toFixed(tradeTotalAmount.sellAmount))}${combineInfo.currency}`}
              </div>
            </div>

            <div styleName="risk-warning">{formatMessage({ id: 'market_order_risk_warning' })}</div>
          </div>
        </BasicModal>
      </FullScreenPageView>
    </Loading>
  );
};

export default CombinationOrder;
