import React, { memo, useEffect, useState, useContext } from 'react';
import { useIntl } from 'react-intl';
import { userConfigContext } from '@/platforms/mobile/helpers/entry/native';
import { getClassNameByPriceChange, getMarketCategoryTag } from '@dz-web/quote-client';
import './index.scss';

const AnalystRecommendation: React.FC<any> = memo((props: any) => {
  const { item, itemClick = () => null } = props;
  const userConfig = useContext<any>(userConfigContext);
  const [lang, setLang] = useState<string>('zh-CN');
  const { formatMessage } = useIntl();

  const fixed = (num) => (+num ? +(+num).toFixed(2) : 0);

  const dataFormat = (num) => {
    if (+num) {
      if (+num > 0) {
        return `+${(+num).toFixed(2)}%`;
      }
      return `${(+num).toFixed(2)}%`;
    }
    return '0.00%';
  };

  useEffect(() => {
    if (userConfig) {
      const { language } = userConfig;
      setLang(language || 'zh-CN');
    }
  }, [userConfig]);

  const getStockName = () => {
    if (lang === 'zh-CN') {
      return item?.Name;
    }
    return item?.Name_T;
  };

  return (
    <div styleName="item" className="stock-item-card" onClick={() => itemClick(item)}>
      <div styleName="left">
        <div
          styleName="increase-box"
          className={
            getClassNameByPriceChange(
              fixed(item?.MonthRise || 0),
              { raise: 'fall-bg', decline: 'rise-bg', equal: 'equal-bg' },
            )
          }
        >
          <div
            styleName="increase-num"
            className={
              getClassNameByPriceChange(fixed(item?.MonthRise || 0))
            }
          >
            {dataFormat(fixed(item?.MonthRise || 0))}
          </div>
          <div styleName="this-month">{formatMessage({ id: 'increase_this_month' })}</div>
        </div>
        <div styleName="stock-info">
          <div styleName="stock-name">{getStockName()}</div>
          <div styleName="stock-code">
            <div styleName="market">{item?.Market ? getMarketCategoryTag(item?.Market) : ''}</div>
            <div styleName="code">{item?.Code || ''}</div>
          </div>
        </div>
      </div>
      <div styleName="right">
        <div styleName="num">{item?.peopleQuantity || 0}</div>
        <div styleName="text">{formatMessage({ id: 'recommended_by_analysts' })}</div>
      </div>
    </div>
  );
});

export default AnalystRecommendation;
