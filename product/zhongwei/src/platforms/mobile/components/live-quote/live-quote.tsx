/* eslint-disable react/jsx-wrap-multilines */
import { toFixed } from '@/utils';
import { getClassNameByPriceChange } from '@dz-web/quote-client';
import IconSvg from '@mobile/components/icon-svg';
import { Collapse } from 'antd-mobile';
import { FormattedMessage } from 'react-intl';
import { useStockInfoStore } from '@mobile/model/stock-info-store';
import './live-quote.scss';

interface ILiveQuote {
  children?: React.ReactNode;
}

/** 实时行情组件 */
const LiveQuote = (props: ILiveQuote) => {
  const { children = <span>123</span> } = props;
  const stockInfo = useStockInfoStore((state) => state.stockInfo);

  return (
    <div>
      <Collapse>
        <Collapse.Panel
          key="chart"
          // eslint-disable-next-line react/no-unstable-nested-components
          arrow={(b) => (!b ? <IconSvg path="icon_quote" /> : <IconSvg path="icon_quote_down" />)}
          title={
            <div styleName="live-info">
              <FormattedMessage id="newest" />
              <span className={getClassNameByPriceChange(stockInfo?.priceRise, 'none-stock-info')}>
                <span>{toFixed(stockInfo?.now, stockInfo?.dec) || '--'}</span>
                <span>{toFixed(stockInfo?.priceRise, stockInfo?.dec) || '--'}</span>
                <span>{toFixed(stockInfo?.priceRiseRate, stockInfo?.dec) || '--'}</span>
              </span>
            </div>
          }
        >
          <div styleName="chart-box">{children}</div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

LiveQuote.defaultProps = {
  children: <span>123</span>,
};

export default LiveQuote;
