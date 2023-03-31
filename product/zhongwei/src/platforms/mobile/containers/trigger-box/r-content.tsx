import { Grid } from 'antd-mobile';
import { useState } from 'react';

import { TRADE_ORDER_TYPE } from '@/constants/trade';
import { getClassNameByPriceChange } from '@dz-web/quote-client';
import ContractionArea from '@mobile/components/contraction-area/contraction-area';
import IconSvg from '@mobile/components/icon-svg';
import CountInput from '@mobile/components/count-input/count-input';
import { add, floatNumStr, sub } from '@/utils';

import './trigger-box.scss';
import { FormattedMessage, useIntl } from 'react-intl';

const RContent = (props) => {
  const { formatMessage } = useIntl();
  const { bs, rLowestRise, rTopLower, setRLowestRise, setRTopLower } = props;

  const isBuy = bs === TRADE_ORDER_TYPE.BUY;
  const [f, setF] = useState(false);
  const [fs, setFS] = useState(false);

  const sell = (
    <>
      <IconSvg path="chart_rebound_to_buy" />
      <div styleName="chart-desc">
        *
        <FormattedMessage id="sketch_map" />
      </div>
      <div styleName="chart-icon low-buy">
        <FormattedMessage id="minimum_price" />
      </div>
      <div styleName="chart-icon top-buy">
        <FormattedMessage id="maximum_price" />
      </div>
      <div styleName="chart-icon low-right-buy">
        <FormattedMessage id="minimum_distance" />
      </div>
      <div styleName="up-buy" className={getClassNameByPriceChange(1)}>
        <FormattedMessage id="rise" />
      </div>
      <div styleName="down-buy" className={getClassNameByPriceChange(-1)}>
        <FormattedMessage id="lower" />
      </div>
    </>
  );

  const buy = (
    <>
      <IconSvg path="chart_back_to_sell" />
      <div styleName="chart-desc">
        *
        <FormattedMessage id="sketch_map" />
      </div>
      <div styleName="chart-icon low">
        <FormattedMessage id="minimum_price" />
      </div>
      <div styleName="chart-icon top">
        <FormattedMessage id="maximum_price" />
      </div>
      <div styleName="chart-icon top-right">
        <FormattedMessage id="maximum_distance" />
      </div>
      <div styleName="up" className={getClassNameByPriceChange(1)}>
        <FormattedMessage id="rise" />
      </div>
      <div styleName="down" className={getClassNameByPriceChange(-1)}>
        <FormattedMessage id="lower" />
      </div>

    </>
  );

  const sellInput = (
    <CountInput
      className="price-raise f-bold"
      size={32}
      placeholder={formatMessage({ id: 'input_price' })}
      value={fs ? rLowestRise : `${rLowestRise}%`}
      plus={() => {
        setRLowestRise(rLowestRise >= 90 ? 99.99 : add(Number(rLowestRise), 1));
      }}
      minus={() => {
        setRLowestRise(rLowestRise < 1 ? 0 : sub(Number(rLowestRise), 1));
      }}
      change={(v) => {
        const value = v.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1') || 0;
        if (!v) {
          setRLowestRise(0);
          return;
        }
        setRLowestRise(floatNumStr(Number(value) >= 99.99 ? 99.99 : value));
      }}
      focus={() => {
        setFS(true);
      }}
      blur={() => {
        setFS(false);
      }}
    />
  );

  const buyInput = (
    <CountInput
      className="price-decline"
      size={32}
      weight="bold"
      placeholder={formatMessage({ id: 'input_price' })}
      value={f ? rTopLower : `${rTopLower}%`}
      plus={() => {
        setRTopLower(rTopLower >= 90 ? 99.99 : add(Number(rTopLower), 1));
      }}
      minus={() => {
        setRTopLower(rTopLower < 1 ? 0 : sub(Number(rTopLower), 1));
      }}
      change={(v) => {
        const value = v.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1') || 0;
        if (!v) {
          setRTopLower(0);
          return;
        }
        setRTopLower(floatNumStr(Number(value) >= 99.99 ? 99.99 : value));
      }}
      focus={() => {
        setF(true);
      }}
      blur={() => {
        setF(false);
      }}
    />
  );

  const buyText = (
    <>
      <FormattedMessage id="minimum_price" />
      <FormattedMessage id="lower" />
    </>
  );
  const sellText = (
    <>
      <FormattedMessage id="maximum_price" />
      <FormattedMessage id="rise" />
    </>
  );
  const buyText2 = (
    <>
      <FormattedMessage id="minimum_price" />
      <FormattedMessage id="rise" />
    </>
  );
  const sellText2 = (
    <>
      <FormattedMessage id="maximum_price" />
      <FormattedMessage id="lower" />
    </>
  );

  return (
    <div>
      <div styleName="r-form">
        <div styleName="r-form-icon">
          <IconSvg
            path="icon_1"
          />
          <IconSvg path="icon_2" />
          <IconSvg path="icon_line" />
        </div>
        <div styleName="r-form-input">
          <Grid styleName="padding-end" columns={11}>
            <Grid.Item span={5}>
              <div styleName="label">
                <div>
                  <FormattedMessage id="on_that_day" />
                  <FormattedMessage id={!isBuy ? 'minimum_price' : 'maximum_price'} />
                  <FormattedMessage id="to" />
                </div>
                <div>
                  {isBuy ? buyText : sellText}
                  <FormattedMessage id="extent" />
                  ≥
                </div>
              </div>
            </Grid.Item>
            <Grid.Item span={6}>
              <div
                className="t-r"
              >
                <div
                  styleName="grid-input"
                >
                  {!isBuy ? sellInput : buyInput}
                </div>
              </div>
            </Grid.Item>
          </Grid>
          <div className="line" styleName="margin-line" />
          <Grid columns={11}>
            <Grid.Item span={5}>
              <div styleName="label">
                <FormattedMessage id="also_distance" />
                {isBuy ? buyText2 : sellText2}
                <FormattedMessage id="extent" />
                ≥
              </div>
            </Grid.Item>
            <Grid.Item span={6}>
              <div
                className="t-r"
              >
                <div
                  styleName="grid-input"
                >
                  {isBuy ? sellInput : buyInput}
                </div>
              </div>
            </Grid.Item>
          </Grid>
        </div>
      </div>
      <ContractionArea>
        <div styleName="r-chart">
          {isBuy ? sell : buy}
        </div>
      </ContractionArea>
    </div>
  );
};

export default RContent;
