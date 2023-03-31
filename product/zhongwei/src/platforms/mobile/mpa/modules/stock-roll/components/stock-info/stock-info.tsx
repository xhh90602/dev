import './stock-info.scss';
import { Input } from 'antd-mobile';
import addIcon from '@mobile/images/icon_zh_add.svg';
import delIcon from '@mobile/images/icon_del.svg';
import { FormattedMessage, useIntl } from 'react-intl';
import { Data } from '@/hooks/stock-roll/use-stock-roll';
import useStockInfo from '@/hooks/stock-roll/use-stock-info';
import StockSearch from '../stock-search/stock-search';

const StockInfo = (props: {
  // eslint-disable-next-line react/require-default-props
  parentDom?: HTMLElement;
  type: 'in' | 'out';
  addStep: (v) => void;
  data: Data;
  setData: (date: any) => void;
  stockMarket: string;
}) => {
  const { formatMessage } = useIntl();
  const { parentDom, type, addStep, data, setData, stockMarket } = props;

  const {
    inOutName,
    stockInfo,
    addStock,
    delStock,
    setStockClosingPrice,
    setSingleStock,
    disableNext,
  } = useStockInfo({ type, data, setData });

  return (
    <>
      <div styleName="container">
        <div styleName="title">
          <FormattedMessage id="fill_in" />
          {inOutName}
          <FormattedMessage id="stocks" />
          <FormattedMessage id="info" />
        </div>
        {stockInfo.map((stock, index) => (
          <div styleName="basic-card" key={stock.stock}>
            {index > 0 && <img styleName="del" src={delIcon} alt="" onClick={() => delStock(index)} />}
            <div styleName="card-title">
              <FormattedMessage id="stocks" />
              <FormattedMessage id="detail" />
              {index + 1}
            </div>
            <div styleName="info-item">
              <div styleName="label">
                <FormattedMessage id="stocks" />
                <FormattedMessage id="designation" />
                /
                <FormattedMessage id="code" />
              </div>
              <StockSearch
                name={stock.stockName}
                code={stock.stock}
                market={stock.market || ''}
                placeholder={`${
                  formatMessage({ id: 'please_enter' })
                  + formatMessage({ id: 'stocks' })
                  + formatMessage({ id: 'designation' })
                }/${formatMessage({ id: 'code' })}`}
                stockMarket={stockMarket}
                itemCallBack={(m, c, n) => {
                  setSingleStock(index, ['stock', 'stockName', 'market'], [c, n, m]);
                  setStockClosingPrice(index, c, m);
                }}
                parentDOM={parentDom}
              />
            </div>
            <div styleName="info-item">
              <div styleName="label">
                <FormattedMessage id="stocks" />
                <FormattedMessage id="qty" />
              </div>
              <Input
                type="number"
                value={stock.number === 0 ? '' : stock.number.toString()}
                placeholder={
                  formatMessage({ id: 'please_enter' })
                  + formatMessage({ id: 'stocks' })
                  + formatMessage({ id: 'qty' })
                }
                onChange={(val) => setSingleStock(index, ['number'], [val === '' ? 0 : Number(val)])}
              />
            </div>
          </div>
        ))}
        <div styleName="add-stock-btn" onClick={addStock}>
          <img src={addIcon} alt="" />
          <FormattedMessage id="add" />
          <FormattedMessage id="stocks" />
        </div>
      </div>
      <div styleName="footer-btns">
        <div styleName="prev" onClick={() => addStep(-1)}>
          <FormattedMessage id="last_step" />
        </div>
        <div styleName="next" data-disable={disableNext} onClick={() => !disableNext && addStep(1)}>
          <FormattedMessage id="next_step" />
        </div>
      </div>
    </>
  );
};

export default StockInfo;
