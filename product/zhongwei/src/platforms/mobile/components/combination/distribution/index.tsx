import React, { memo, useState, useMemo, useEffect, useContext } from 'react';
import cx from 'classnames';
import { useIntl } from 'react-intl';
import { getAssetsDistribute, getIndustryDistribute, getMarketDistribute } from '@/api/module-api/combination';
import { toThousand } from '@dz-web/o-orange';
import { userConfigContext } from '@/platforms/mobile/helpers/entry/native';
import dayjs from 'dayjs';
import IconMenu from '@/platforms/mobile/images/icon_zh_04.svg';
import IconStockPosition from '@/platforms/mobile/images/icon_stock_position.svg';
import IconSZ from '@/platforms/mobile/images/icon_SZ.svg';
import IconSH from '@/platforms/mobile/images/icon_SH.svg';
import IconHK from '@/platforms/mobile/images/icon_HK.svg';
import IconUS from '@/platforms/mobile/images/icon_US.svg';
import PieChart from '@/platforms/mobile/components/combination/pieChart';
import Table from './table';
import './index.scss';

const colors = [
  '#fab02f',
  '#80e09b',
  '#7879f1',
  '#ea8749',
  '#529af3',
  '#eedaa3',
  '#fa3135',
  '#feddb9',
  '#2e9cfb',
  '#e76147',
  '#1c3c61',
  '#633ae5',
  '#309bfb',
  '#fbb12d',
  '#f88684',
  '#13af94',
  '#9a60b4',
  '#ea7ccc',
  '#5da0db',
  '#e37b36',
];

const Distribution: React.FC<any> = memo((props) => {
  const { portfolioId } = props;
  const [type, setType] = useState(1);
  const { formatMessage } = useIntl();
  const [showType, setShowType] = useState(1);
  const [data1, setData1] = useState<any>({});
  const [data2, setData2] = useState<any>({});
  const [data3, setData3] = useState<any>({});
  const [lang, setLang] = useState<string>('');
  const userConfig = useContext<any>(userConfigContext);

  // 获取资产分布
  const getData1 = () => {
    getAssetsDistribute({
      portfolioId,
    }).then((res: any) => {
      if (res && res.code === 0) {
        setData1(res?.result || null);
      }
    });
  };
  // 获取行业分布
  const getData2 = () => {
    getIndustryDistribute({
      portfolioId,
    }).then((res: any) => {
      if (res && res.code === 0) {
        setData2(res?.result || null);
      }
    });
  };
  // 获取市场分布
  const getData3 = () => {
    getMarketDistribute({
      portfolioId,
    }).then((res: any) => {
      if (res && res.code === 0) {
        setData3(res?.result || null);
      }
    });
  };

  useEffect(() => {
    if (type === 1) {
      getData1();
    }
    if (type === 2) {
      getData2();
    }
    if (type === 3) {
      getData3();
    }
  }, [type]);

  const tabList = [
    {
      name: formatMessage({ id: 'asset_ratio' }),
      type: 1,
    },
    {
      name: formatMessage({ id: 'industrial_distribution' }),
      type: 2,
    },
    {
      name: formatMessage({ id: 'market_distribution' }),
      type: 3,
    },
  ];

  const dateFormat = (date) => {
    if (date) {
      return `${dayjs(date).format('MM/DD HH:mm')}${formatMessage({ id: 'update' })}`;
    }
    return `${dayjs().format('MM/DD HH:mm')}${formatMessage({ id: 'update' })}`;
  };

  // 切换数据
  const data = useMemo(() => {
    if (type === 1) {
      return data1 || null;
    }
    if (type === 2) {
      return data2 || null;
    }
    if (type === 3) {
      return data3 || null;
    }
    return null;
  }, [data1, data2, data3]);

  // 千分位转换
  const toThousandFormat = (str) => {
    if (str && typeof str === 'string' && str.indexOf('*') > -1) {
      return str;
    }
    if (str && typeof str === 'string') {
      return toThousand((+str).toFixed(2));
    }
    return (str && toThousand((+str).toFixed(2))) || 0;
  };

  const transformVal = (str) => {
    if (str && typeof str === 'string' && str.indexOf('*') > -1) {
      return str;
    }
    return `${(str && toThousand(+(+str * 100).toFixed(2))) || 0}%`;
  };

  const totalMarketValue = useMemo(() => {
    const li = data?.assetsDistributionVOList || [];
    if (li && li.length) {
      const isMask = li.some((i) => (i.marketValue).indexOf('*') > -1);
      if (isMask) return '*******';
      const total = li.reduce((t, n) => t + (+n.marketValue), 0);
      return toThousandFormat(total);
    }
    return 0;
  }, [data]);

  const isMark = ((str, isFixed = false) => {
    if (str && typeof str === 'string' && str.indexOf('*') > -1) {
      return 0;
    }
    if (str && typeof str === 'string' && str.indexOf('%') > -1) {
      const rs = str.split('%');
      if (isFixed) {
        return (rs[0]) ? +(+rs[0] * 100).toFixed(2) : 0;
      }
      return (rs[0]) ? (+rs[0]) : 0;
    }
    return isFixed ? +(+str * 100).toFixed(2) : str;
  });

  const stockNameFormat = (str, n) => {
    if (!str) return 0;
    if (str && str.indexOf('*') > -1) {
      let text = '';
      for (let i = 0; i < 4 + n; i += 1) {
        text += '*';
      }
      return text;
    }
    if (str && str.indexOf('%') > -1) {
      const rs = str.split('%');
      return (rs[0]) ? (+rs[0]) : 0;
    }
    return str;
  };
  // 市场转换
  const tradeMarketTransform = { HKEX: IconHK, SZMK: IconSZ, SHMK: IconSH, USA: IconUS };

  // 市场转换
  const tradeMarketTransformText = {
    HKEX: formatMessage({ id: 'HKEX' }),
    A: formatMessage({ id: 'AStock' }),
    SZMK: formatMessage({ id: 'AStock' }),
    SHMK: formatMessage({ id: 'AStock' }),
    USA: formatMessage({ id: 'USA' }),
  };

  // 市场名称转换
  const marketNameFormat = (str, n) => {
    if (str && str.indexOf('*') > -1) {
      let text = '';
      for (let i = 0; i < 4 + n; i += 1) {
        text += '*';
      }
      return text;
    }
    return tradeMarketTransformText[str];
  };

  // 数据格式化
  const dataFormat = () => {
    const temp: any = [];
    let li: any = [];
    if (type === 1) {
      li = (data && data?.assetsDistributionVOList) || [];
    }
    if (type === 2) {
      li = (data && data?.industryVOList) || [];
    }
    if (type === 3) {
      li = (data && data?.marketVOList) || [];
    }
    li.forEach((item, idx) => {
      const obj: any = {};
      if (type === 1) {
        obj.name = stockNameFormat(item?.stockName, idx); // 股票名称(饼状图用的)
        obj.stockName = item.stockName;
        obj.value = isMark(item.marketValue); // 市值(饼状图用的)
        obj.amount = item.marketValue; // 市值(列表用的)
        obj.ratio = transformVal(item?.assetsRatio || 0); // 资产占比
        obj.profitRatio = item.profitRatio; // 收益率
        obj.costPrice = item.costPrice; // 成本价
        obj.nowPrice = item.nowPrice; // 现价
        obj.tradeMarket = item.tradeMarket; // 市场
        obj.MarketIMG = tradeMarketTransform[item.tradeMarket]; // 市场(图片)
        obj.stockCode = item.stockCode; // 代码
        obj.hide = false;
      }
      if (type === 2) {
        obj.name = stockNameFormat(lang === 'zh-CN' ? item.industryName : item.industryNameTw, idx); // 股票名称(饼状图用的)
        obj.value = isMark(item.assetsRatio); // 市值(饼状图用的)
      }
      if (type === 3) {
        obj.name = marketNameFormat(item.market, idx); // 股票名称(饼状图用的)
        obj.value = isMark(item.assetsRatio); // 市值(饼状图用的)
      }
      temp.push(obj);
    });
    const obj = {
      name: formatMessage({ id: 'configurable_amount' }),
      stockName: formatMessage({ id: 'configurable_amount' }),
      value: type === 1 ? isMark(data?.surplusCapital || 0) : isMark(data?.surplusCapitalRatio || 0, true),
      amount: data?.surplusCapital || 0,
      ratio: transformVal(data?.surplusCapitalRatio || 0),
      hide: true,
    };
    temp.unshift(obj);
    return temp;
  };

  useEffect(() => {
    if (userConfig) {
      const { language } = userConfig;
      setLang(language || 'zh-CN');
    }
  }, [userConfig]);

  useEffect(() => {
    setShowType(1);
  }, [type]);

  return (
    <div styleName="warp">
      <div styleName="title">
        <div>
          <span styleName="title-header">{formatMessage({ id: 'combined_distribution' })}</span>
          <span styleName="title-month">{dateFormat((data && data?.updateTime) || null)}</span>
        </div>

        <div styleName="title-right">{formatMessage({ id: 'unit_ten_thousand' })}</div>
      </div>

      <div styleName="hs-trend">
        <ol styleName="hs-tabs">
          {tabList.map((item) => (
            <li
              key={item.type}
              onClick={() => setType(item.type)}
              styleName={cx({
                'hs-tabs-item': true,
                'hs-tabs-item--active': item.type === type,
              })}
            >
              {item.name}
            </li>
          ))}
        </ol>
      </div>
      {type === 1
        ? (
          <div styleName="content">
            <div styleName="content-left">
              {/* 组合总资产 */}
              <div styleName="content-first">
                <span styleName="content-first-name">{formatMessage({ id: 'portfolio_total_assets' })}</span>
                <span styleName="content-first-number">
                  {(data && data?.marketValue && toThousandFormat(data.marketValue)) || 0}
                </span>
                {/* 持仓市值 */}
                <div styleName="content-second">
                  <span styleName="content-second-name">{formatMessage({ id: 'market_value_of_positions' })}</span>
                  <span styleName="content-second-number">
                    {totalMarketValue}
                  </span>
                </div>
              </div>
              <div styleName="content-right" onClick={() => setShowType(showType === 1 ? 2 : 1)}>
                {
                  showType === 1 ? (
                    <img src={IconMenu} alt="" />
                  ) : (
                    <img src={IconStockPosition} alt="" />
                  )
                }
              </div>
            </div>
          </div>
        ) : null}
      {
        showType === 1 ? (
          <div styleName="hs-trend-box">
            <div styleName={cx({
              'hs-trend-chart': type === 1,
              'hs-trend-chart-all': type !== 1,
            })}
            >
              <PieChart data={(dataFormat()) || []} showLabel={type !== 1} colors={colors} />
            </div>
            <div styleName="hs-trend-list">
              <div styleName="hs-trend-list-box">
                {
                  type === 1 && dataFormat().map((item, idx) => (
                    <div styleName="item" key={item.name}>
                      <div styleName="stock-name-box">
                        <span style={{ backgroundColor: colors[idx] }} />
                        <div styleName="stock-name">{item.stockName}</div>
                      </div>
                      <div styleName="stock-ratio">
                        {item.ratio}
                      </div>
                      <div styleName="stock-value">
                        {item.amount}
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        ) : (
          <Table list={dataFormat()} />
        )
      }
    </div>
  );
});

export default Distribution;
