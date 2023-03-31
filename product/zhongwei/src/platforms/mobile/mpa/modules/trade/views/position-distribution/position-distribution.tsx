import { useIntl, FormattedMessage } from 'react-intl';
import { toPercent, toPlaceholder, toThousand } from '@dz-web/o-orange';

import usePositionDistribution from '@/hooks/trade/use-position-distribution';
import AdaptiveText from '@/components/adaptive-text/adaptive-text';
import Loading from '@mobile/components/loading/loading';
import QuoteMarketTypeTag from '@mobile/components/quote-market-type-tag/quote-market-type-tag';
import PieChart from '@mobile/components/combination/pieChart';
import './position-distribution.scss';

interface IDistribution {
  qty: number;
  ratio: number;
  usableQty: number;
  marketValue: number;
  sourceName: string;
}

const PositionDistribution = () => {
  const { formatMessage } = useIntl();
  const {
    isLoading,
    positionData: { position = {}, chartList = [], distributionList = [] },
  } = usePositionDistribution();

  return (
    <Loading isLoading={isLoading}>
      <div styleName="position-distribution-box">
        <div styleName="statistics-box">
          <div styleName="stock-info">
            <div styleName="name-code-box">
              <p styleName="content stock-name">{position.stockName}</p>

              <div styleName="stock-code">
                <QuoteMarketTypeTag market={position.smallMarket} />
                <p>{position.stockCode}</p>
              </div>
            </div>

            <div styleName="total-position-box">
              <p styleName="content position-num">{position.currentQty}</p>
              <p styleName="position-label">{formatMessage({ id: 'total_positions_number' })}</p>
            </div>
          </div>

          <div styleName="chart-box">
            <PieChart
              showLabel
              data={chartList}
              radius={['36%', '64%']}
              borderWidth={2}
              colors={['#5B2FFA', '#41D0EF', '#41D0EF', '#882FFA', '#4021FF', '#418FEF', '#F7CC45']}
            />
          </div>
        </div>

        {distributionList.map((item: IDistribution) => (
          <div styleName="distribution-item-box" key={item.sourceName}>
            <p styleName="content source-name">{item.sourceName}</p>

            <div styleName="position-info">
              <div styleName="position-info-item">
                <p styleName="info-label">
                  <FormattedMessage id="market_value" />
                </p>
                <p styleName="content info-content">
                  <AdaptiveText text={toThousand(item.marketValue)} fontSize={28} maxFontSize={28} />
                </p>
              </div>

              <div styleName="position-info-item">
                <p styleName="info-label">
                  <FormattedMessage id="position_and_usable" />
                </p>
                <p styleName="content info-content">
                  <span>{toPlaceholder(item.qty)}</span>
                  <span styleName="vertical-line">|</span>
                  <span>{toPlaceholder(item.usableQty)}</span>
                </p>
              </div>

              <div styleName="position-info-item">
                <p styleName="info-label">
                  <FormattedMessage id="ratio" />
                </p>
                <p styleName="content info-content">{toPercent(item.ratio)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Loading>
  );
};

export default PositionDistribution;
