import React, { memo, useState, useContext, useEffect } from 'react';
import { getClassNameByPriceChange } from '@dz-web/quote-client';
import { userConfigContext } from '@/platforms/mobile/helpers/entry/native';
import { useIntl } from 'react-intl';
import { openNewPage, PageType, sessionStorageSetItem } from '@/platforms/mobile/helpers/native/msg';
import bg1 from '@/platforms/mobile/images/bg_01.png';
import './index.scss';

const AnalystRecommendation: React.FC<any> = memo((props: any) => {
  const { item } = props;
  const userConfig = useContext<any>(userConfigContext);
  const [lang, setLang] = useState<string>('zh-CN');
  const { formatMessage } = useIntl();

  const goDetail = () => {
    const { name, desc } = item;
    sessionStorageSetItem({ key: 'strategyInfo', value: { name, desc } });
    openNewPage({
      fullScreen: true,
      pageType: PageType.HTML,
      path: `selected-strategy-detail.html?strategyId=${item.id}`,
      replace: false,
    });
  };

  const fixed = (num) => (+num ? +(+num * 100).toFixed(2) : 0);

  const dataFormat = (num) => {
    if (+num) {
      if (+num > 0) {
        return `+${(+num).toFixed(2)}%`;
      }
      return `${(+num).toFixed(2)}%`;
    }
    return '0.00%';
  };

  const getStockName = (data) => {
    if (lang === 'zh-CN') {
      return data?.Name;
    }
    return data?.Name_T;
  };

  useEffect(() => {
    if (userConfig) {
      const { language } = userConfig;
      setLang(language || 'zh-CN');
    }
  }, [userConfig]);

  return (
    <div styleName="item" className="strategy-item-card" onClick={() => goDetail()}>
      <div styleName="card-box">
        <img styleName="bg-img" src={item?.imgUrl ? item.imgUrl : bg1} alt="" />
        <div styleName="item-box">
          <div styleName="combination-name">{item?.name || ''}</div>
          <div styleName="tag-box">
            {
              item?.labels && item?.labels.length ? item.labels.map((ele) => (
                <span key={`${ele.name}-${ele.id}`}>{ele.name}</span>
              )) : null
            }
          </div>
          <div styleName="stock-box">
            {
              item && item?.top2Stks.length ? item.top2Stks.map((ele) => (
                <div styleName="line" key={`${ele.code}-${ele.subMarket}`}>
                  <div styleName="l">{getStockName(ele)}</div>
                  <div styleName="r" className={getClassNameByPriceChange(fixed(ele?.MonthRise || 0))}>
                    {dataFormat(fixed(ele?.MonthRise || 0))}
                  </div>
                </div>
              )) : null
            }
          </div>
          <div styleName="text">{formatMessage({ id: 'selected_shares' }, { value: item?.stkCount || 0 })}</div>
        </div>
      </div>
    </div>
  );
});

export default AnalystRecommendation;
