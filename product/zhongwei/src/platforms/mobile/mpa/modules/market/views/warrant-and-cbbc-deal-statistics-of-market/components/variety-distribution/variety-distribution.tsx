/* eslint-disable camelcase */
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { getClassNameByPriceChange } from '@dz-web/quote-client';
import { useQuoteClient } from '@dz-web/quote-client-react';
// import { humanNumber, returnCurrency } from '@/utils';
import { toUnit } from '@dz-web/o-orange';
import { filterSymbolsData, varietyDistributionFields } from '../../constants';
import './variety-distribution.scss';

const VarietyDistribution = (props) => {
  const { language } = props;
  const { wsClient, isWsClientReady } = useQuoteClient();
  const { formatMessage } = useIntl();

  const [varietyData, setVarietyData] = useState<any>({});

  const ratioCalculation = (ratio) => {
    if (ratio) {
      return `${(ratio * 100).toFixed(2)}%`;
    }
    return '- - %';
  };

  // 比例条
  const widthCalculation = useMemo(() => {
    const { allCallAmount, allPutAmount, allBullAmount, allBearAmount } = varietyData;

    // 淡仓
    const longPositionAmount = allCallAmount + allPutAmount;
    // 好仓
    const shortPositionAmount = allBullAmount + allBearAmount;

    const total = longPositionAmount + shortPositionAmount;
    const long_width = total ? ((longPositionAmount / total) * 100).toFixed(2) : 0;
    const short_width = total ? (100 - +long_width).toFixed(2) : 0;

    return {
      long_width,
      short_width,
    };
  }, [varietyData]);

  useEffect(() => {
    if (!isWsClientReady) return;

    wsClient
      ?.send({
        mf: 104,
        sf: 1,
        body: {
          hk_warrant: [{ eid: 2, c: 'HSI' }],
          sort_field: '',
          begin: 0,
          count: 10,
          desc: true,
          fields: ['#long_position'],
        },
      })
      .then((res) => {
        if (res.code !== 0) return;
        const { symbols } = res.body;

        const data = filterSymbolsData(symbols);

        if (!data.length) return;
        setVarietyData(data[0]);
      })
      .catch((err) => console.log(err, '获取品种分布失败'));
  }, [isWsClientReady]);

  return (
    <div styleName="variety-distribution-content">
      <div styleName="padding-side">
        <div styleName="name-side">
          <span styleName="side-title">
            <FormattedMessage id="variety_distribution" />
          </span>
        </div>

        <div styleName="warehouse-definition">
          <span styleName="good-warehouse">
            <FormattedMessage id="good_warehouse_difinition" />
            {' '}
          </span>
          <span>
            <FormattedMessage id="short_warehouse_difinition" />
            {' '}
          </span>
        </div>

        <div styleName="percentage">
          <div styleName="percentage-bull" style={{ width: `${widthCalculation.long_width || '50'}%` }} />
          <div styleName="percentage-bear" style={{ width: `${widthCalculation.short_width || '50'}%` }} />
        </div>

        <div styleName="lengend">
          <div className={getClassNameByPriceChange(1)}>
            <span>
              <FormattedMessage id="good_warehouse" />
            </span>
            <span styleName="legend-right">
              {ratioCalculation(varietyData.allCallRatio + varietyData.allPutRatio)}
              [
              {toUnit(varietyData.allCallAmount + varietyData.allPutAmount, { lanType: language })}
              ]
            </span>
          </div>
          <div className={getClassNameByPriceChange(-1)}>
            <span>
              <FormattedMessage id="short_warehouse" />
            </span>
            <span styleName="legend-right">
              {ratioCalculation(varietyData.allBullRatio + varietyData.allBearRatio)}
              [
              {/* {humanNumber(varietyData.allBullAmount + varietyData.allBearAmount || 0, 2, 'zh')} */}
              {toUnit(varietyData.allBullAmount + varietyData.allBearAmount, { lanType: language })}
              ]
            </span>
          </div>
        </div>

        <div styleName="detail-list">
          {/* 1111开始 */}
          <div styleName="container-style">
            <div styleName="left-half">
              <h3 styleName="left-big-title">{formatMessage({ id: 'call' })}</h3>
              <div styleName="first-line">
                <span styleName="left-inner-con">{formatMessage({ id: 'type_of_amount' })}</span>
                <span styleName="right-inner-con">
                  {toUnit(varietyData.allCallAmount, { lanType: language })}
                </span>
              </div>
              <div styleName="second-line">
                <span styleName="left-inner-con">{formatMessage({ id: 'type_of_market_transactions' })}</span>
                <span styleName="right-inner-con">
                  {ratioCalculation(varietyData.allCallRatio)}
                </span>
              </div>
            </div>
            <div styleName="right-half">
              <h3 styleName="right-big-title">{formatMessage({ id: 'pull' })}</h3>
              <div styleName="first-line">
                <span styleName="left-inner-con">{formatMessage({ id: 'type_of_amount' })}</span>
                <span styleName="right-inner-con">
                  {toUnit(varietyData.allPutAmount, { lanType: language })}
                </span>
              </div>
              <div styleName="second-line">
                <span styleName="left-inner-con">{formatMessage({ id: 'type_of_market_transactions' })}</span>
                <span styleName="right-inner-con">{ratioCalculation(varietyData.allPutRatio)}</span>
              </div>
            </div>
          </div>
          {/* 1111结束 */}
          {/* 2222开始 */}
          <div styleName="container-style">
            <div styleName="left-half">
              <h3 styleName="left-big-title">{formatMessage({ id: 'bull' })}</h3>
              <div styleName="first-line">
                <span styleName="left-inner-con">{formatMessage({ id: 'type_of_amount' })}</span>
                <span styleName="right-inner-con">
                  {toUnit(varietyData.allBullAmount, { lanType: language })}
                </span>
              </div>
              <div styleName="second-line">
                <span styleName="left-inner-con">{formatMessage({ id: 'type_of_market_transactions' })}</span>
                <span styleName="right-inner-con">{ratioCalculation(varietyData.allBullRatio)}</span>
              </div>
            </div>
            <div styleName="right-half">
              <h3 styleName="right-big-title">{formatMessage({ id: 'bear' })}</h3>
              <div styleName="first-line">
                <span styleName="left-inner-con">{formatMessage({ id: 'type_of_amount' })}</span>
                <span styleName="right-inner-con">
                  {toUnit(varietyData.allBearAmount, { lanType: language })}
                </span>
              </div>
              <div styleName="second-line">
                <span styleName="left-inner-con">{formatMessage({ id: 'type_of_market_transactions' })}</span>
                <span styleName="right-inner-con">{ratioCalculation(varietyData.allBearRatio)}</span>
              </div>
            </div>
          </div>
          {/* 2222结束 */}
        </div>
      </div>
    </div>
  );
};

export default VarietyDistribution;
