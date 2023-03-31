import { Grid } from 'antd-mobile';
import { countType, countPrice, strToNumber, returnJavaMarket, getStockDec } from '@/utils';
import CountInput from '@mobile/components/count-input/count-input';

import './trigger-box.scss';
import { FormattedMessage, useIntl } from 'react-intl';

const SContent = (props) => {
  const { sPrice, setSPrice, changeNum, market, setExecutePrice } = props;

  const { formatMessage } = useIntl();

  return (
    <div styleName="s-content">
      <Grid styleName="padding-right" columns={10}>
        <Grid.Item span={4}>
          <div styleName="label">
            <FormattedMessage id="stock_price_reach" />
          </div>
        </Grid.Item>
        <Grid.Item span={6}>
          <div
            className="t-r"
          >
            <div
              className="price-raise"
              styleName="grid-input"
            >
              <CountInput
                size={32}
                weight="bold"
                placeholder={formatMessage({ id: 'input_price' })}
                value={sPrice}
                plus={() => {
                  countPrice({
                    type: countType.PLUS,
                    price: strToNumber(sPrice),
                    setPrice: (v) => {
                      setSPrice(v);
                      setExecutePrice(v);
                    },
                    changePrice: changeNum,
                    market: returnJavaMarket(market),
                  });
                }}
                minus={() => {
                  countPrice({
                    type: countType.MINUS,
                    price: strToNumber(sPrice),
                    setPrice: (v) => {
                      setSPrice(v);
                      setExecutePrice(v);
                    },
                    changePrice: changeNum,
                    market: returnJavaMarket(market),
                  });
                }}
                change={(v) => {
                  setSPrice(v);
                  setExecutePrice(v);
                }}
                blur={() => {
                  const dec = getStockDec(returnJavaMarket(market), sPrice);
                  setSPrice(Number(sPrice).toFixed(dec));
                }}
              />
              <div styleName="price-text" className="t-desc">
                <FormattedMessage id="trigger_price_2" />
                &nbsp;&nbsp;
                {sPrice || '--'}
              </div>
            </div>
          </div>
        </Grid.Item>
      </Grid>
    </div>
  );
};

export default SContent;
