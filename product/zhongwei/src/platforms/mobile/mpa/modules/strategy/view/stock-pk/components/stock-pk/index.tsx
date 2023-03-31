/* eslint-disable no-eval */
import React, { memo, useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Toast } from 'antd-mobile';
import { sessionStorageSetItem, sessionStorageGetItem } from '@/platforms/mobile/helpers/native/msg';
import { CommonApi } from '@/api/module-api/strategy';
import { pageOnShow } from '@/platforms/mobile/helpers/native/register';
import dayjs from 'dayjs';
import DataGraph from './components/data-graph';
import StockItemCard from './components/stock-item-card';
import LegendCard from '../legend-card';
import DataItemCard from './components/data-item-card';
import './index.scss';

const colors = ['#f96d16', '#5c2ffb', '#fbb02f', '#f05da8'];
const StockPk: React.FC<any> = memo(() => {
  const [stockList, setStockList] = useState<any>();
  const [marketList, setMarketList] = useState<any>([]);
  const [indexList, setIndexList] = useState<any>([]);
  const [financeRatioList, setFinanceRatioList] = useState<any>([]);
  const [financeDataList, setFinanceDataList] = useState<any>([]);
  const [legend, setLegend] = useState<any>({});
  const { formatMessage } = useIntl();
  const [selectItem, setSelectItem] = useState<any>(null);
  const [blcycle, setBlCycle] = useState('Q1');
  const [cwcycle, setCwCycle] = useState('Q1');
  const [chartCycle, setChartCycle] = useState('1M');
  const [chartData, setChartData] = useState<any>([]);
  const [init, setInit] = useState<boolean>(true);
  const [isReq, setReq] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [currency, setCurrency] = useState<string>('HKD');

  // 删除图表里的数据
  const delChartData = (idx) => {
    const tempList = [...chartData];
    tempList.splice(idx, 1);
    setChartData([...tempList]);
  };

  // 删除对比的股票
  const stockDel = (idx) => {
    const tempList = [...stockList];
    tempList.splice(idx, 1);
    setStockList([...tempList]);
    delChartData(idx);
    sessionStorageSetItem({ key: 'stockList', value: [...tempList] });
  };

  // 市场数据[勿删]
  const marketListTemp = [
    {
      name: formatMessage({ id: 'closing_price' }), // 收盘价
      moduleName: 'marketList',
      field: 'close_price',
      formatType: 5,
      echartType: 'line',
      dimension: 'price', // 统计维度【折线图】
    },
    {
      name: formatMessage({ id: 'current_price' }), // 现价
      moduleName: 'marketList',
      field: 'price',
      formatType: 5,
    },
    {
      name: formatMessage({ id: 'rise_and_fall' }), // 涨跌幅
      moduleName: 'marketList',
      field: 'price_rise_rate',
      formatType: 2,
      echartType: 'bar',
      dimension: 'priceRiseRate', // 统计维度【柱状图】
    },
    {
      name: formatMessage({ id: 'total_market_value' }), // 总市值
      moduleName: 'marketList',
      field: 'market_vol',
      formatType: 3,
      echartType: 'line',
      dimension: 'marketVol', // 统计维度【折线图】
    },
    {
      name: formatMessage({ id: 'circulation_market_value' }), // 流通市值
      moduleName: 'marketList',
      field: 'circ_vol',
      formatType: 3,
      echartType: 'bar',
      dimension: 'circVol', // 统计维度【柱状图】
    },
    {
      name: formatMessage({ id: 'turnover' }), // 成交量
      moduleName: 'marketList',
      field: 'volume',
      formatType: 3,
      echartType: 'line',
      dimension: 'volume', // 统计维度【折线图】
    },
    {
      name: formatMessage({ id: 'transaction_amount' }), // 成交额
      moduleName: 'marketList',
      field: 'amount',
      formatType: 3,
      echartType: 'bar',
      dimension: 'amount', // 统计维度【柱状图】
    },
    {
      name: formatMessage({ id: 'weeks_52_maximum' }), // 52周最高
      moduleName: 'marketList',
      field: '52w_high',
      formatType: 1,
      echartType: 'bar',
      dimension: '52WHigh', // 统计维度【柱状图】
    },
    {
      name: formatMessage({ id: 'weeks_52_minimum' }), // 52周最低
      moduleName: 'marketList',
      field: '52w_low',
      formatType: 1,
      echartType: 'bar',
      dimension: '52WLow', // 统计维度【柱状图】
    },
    {
      name: formatMessage({ id: 'beta' }), // 贝塔值
      moduleName: 'marketList',
      field: 'beta',
      formatType: 1,
      echartType: 'bar',
      dimension: 'beta', // 统计维度【柱状图】
    },
    {
      name: (
        <div styleName="ttm-tag">
          {`${formatMessage({ id: 'dividend_yield' })}`}
          <sup>TTM</sup>
        </div>), // 股息率
      moduleName: 'marketList',
      field: 'divid_ratio',
      formatType: 2,
      echartType: 'bar',
      dimension: 'dividRatio', // 统计维度【柱状图】
    },
    {
      name: formatMessage({ id: 'equity' }), // 总股本
      moduleName: 'marketList',
      field: 'capital',
      formatType: 3,
      echartType: 'bar',
      dimension: 'capital', // 统计维度【柱状图】
    },
    {
      name: formatMessage({ id: 'number_of_outstanding_shares' }), // 流通股数
      moduleName: 'marketList',
      field: 'circ_capital',
      formatType: 3,
      echartType: 'bar',
      dimension: 'circCapital', // 统计维度【柱状图】
    },
    {
      name: formatMessage({ id: 'top_10_shares_east_proportion' }), // 前十大股东占比
      moduleName: 'marketList',
      field: 'top10_share',
      formatType: 2,
      echartType: 'bar',
      dimension: 'top10Share', // 统计维度【柱状图】
    },
    {
      name: formatMessage({ id: 'time_to_market' }), // 上市时间
      moduleName: 'marketList',
      field: 'list_date',
      formatType: 4,
    },
  ];

  // 估值指标数据[勿删]
  const indexListTemp = [
    {
      name: formatMessage({ id: 'EBITDA' }), // EBITDA倍数
      moduleName: 'indexList',
      field: 'ebitda',
      formatType: 1,
      echartType: 'line',
      dimension: 'ebitda', // 统计维度【折线图】
    },
    {
      name: formatMessage({ id: 'PE_ratio_multiple' }), // 市盈率倍数
      moduleName: 'indexList',
      field: 'pe_ttm',
      formatType: 1,
      echartType: 'line',
      dimension: 'pe', // 统计维度【折线图】
    },
    {
      name: formatMessage({ id: 'PE_jl_ratio_multiple' }), // 市净率倍数
      moduleName: 'indexList',
      field: 'pbr',
      formatType: 1,
      echartType: 'line',
      dimension: 'pb', // 统计维度【折线图】
    },
    {
      name: formatMessage({ id: 'market_sales_ratio_multiple' }), // 市销率倍数
      moduleName: 'indexList',
      field: 'ps_ttm',
      formatType: 1,
      echartType: 'line',
      dimension: 'ps', // 统计维度【折线图】
    },
  ];

  // 财务比例[勿删]
  const financeRatioListTemp = [
    {
      name: formatMessage({ id: 'growth_rate_of_operating_income' }), // 营业收入增长率
      moduleName: 'financeRatioList',
      field: 'income_grow_ratio',
      formatType: 2,
      echartType: 'bar',
      dimension: 'incomeGrowRatio', // 统计维度【柱状图】
    },
    {
      name: formatMessage({ id: 'net_profit_growth_rate' }), // 净利润入增长率
      moduleName: 'financeRatioList',
      field: 'net_profit_grow_ratio',
      formatType: 2,
      echartType: 'bar',
      dimension: 'netProfitGrowRatio', // 统计维度【柱状图】
    },
    {
      name: formatMessage({ id: 'gross_profit_margin' }), // 毛利率
      moduleName: 'financeRatioList',
      field: 'gpr',
      formatType: 2,
      echartType: 'bar',
      dimension: 'gpr', // 统计维度【柱状图】
    },
    {
      name: formatMessage({ id: 'net_interest_rate' }), // 净利率
      moduleName: 'financeRatioList',
      field: 'npr',
      formatType: 2,
      echartType: 'bar',
      dimension: 'npr', // 统计维度【柱状图】
    },
    {
      name: 'ROE', // ROE
      moduleName: 'financeRatioList',
      field: 'roe',
      formatType: 2,
      echartType: 'bar',
      dimension: 'roe', // 统计维度【柱状图】
    },
    {
      name: 'ROA', // ROA
      moduleName: 'financeRatioList',
      field: 'roa',
      formatType: 2,
      echartType: 'bar',
      dimension: 'roa', // 统计维度【柱状图】
    },
    {
      name: formatMessage({ id: 'asset_liability_ratio' }), // 资产负债率
      moduleName: 'financeRatioList',
      field: 'asset_debt_ratio',
      formatType: 2,
      echartType: 'bar',
      dimension: 'assetDebtRatio', // 统计维度【柱状图】
    },
    {
      name: formatMessage({ id: 'current_ratio' }), // 流动比率
      moduleName: 'financeRatioList',
      field: 'current_ratio',
      formatType: 1,
      echartType: 'bar',
      dimension: 'currentRatio', // 统计维度【柱状图】
    }, {
      name: formatMessage({ id: 'quick_ratio' }), // 速动比率
      moduleName: 'financeRatioList',
      field: 'quick_ratio',
      formatType: 1,
      echartType: 'bar',
      dimension: 'quickRatio', // 统计维度【柱状图】
    },
    {
      name: formatMessage({ id: 'interest_coverage_ratio' }), // 利息覆盖倍数
      moduleName: 'financeRatioList',
      field: 'int_cov_ts',
      formatType: 1,
      echartType: 'bar',
      dimension: 'intCovTs', // 统计维度【柱状图】
    },
    {
      name: formatMessage({ id: 'turnover_rate_of_total_assets' }), // 总资产周转率
      moduleName: 'financeRatioList',
      field: 'asset_rate',
      formatType: 1,
      echartType: 'bar',
      dimension: 'assetRate', // 统计维度【柱状图】
    },
    {
      name: formatMessage({ id: 'inventory_turnover_rate' }), // 存货周转率
      moduleName: 'financeRatioList',
      field: 'inv_rate',
      formatType: 1,
      echartType: 'bar',
      dimension: 'invRate', // 统计维度【柱状图】
    },
    {
      name: formatMessage({ id: 'turnover_rate_of_accounts_receivable' }), // 应收账款周转率
      moduleName: 'financeRatioList',
      field: 'arc_rate',
      formatType: 1,
      echartType: 'bar',
      dimension: 'arcRate', // 统计维度【柱状图】
    },
  ];

  // 财务数据[勿删]
  const financeDataListTemp = [
    {
      name: formatMessage({ id: 'business_income' }), // 营业收入
      moduleName: 'financeDataList',
      field: 'income',
      formatType: 3,
      echartType: 'bar',
      dimension: 'income', // 统计维度【柱状图】
    },
    {
      name: 'EBITDA', // EBITDA
      moduleName: 'financeDataList',
      field: 'ebitda',
      formatType: 3,
      echartType: 'bar',
      dimension: 'ebitda', // 统计维度【柱状图】
    },
    {
      name: 'EBIT', // EBIT
      moduleName: 'financeDataList',
      field: 'ebit',
      formatType: 3,
      echartType: 'bar',
      dimension: 'ebit', // 统计维度【柱状图】
    },
    {
      name: formatMessage({ id: 'net_profit' }), // 净利润
      moduleName: 'financeDataList',
      field: 'net_profit',
      formatType: 3,
      echartType: 'bar',
      dimension: 'netProfit', // 统计维度【柱状图】
    },
    {
      name: 'EPS', // EPS
      moduleName: 'financeDataList',
      field: 'eps',
      formatType: 1,
      echartType: 'bar',
      dimension: 'eps', // 统计维度【柱状图】
    },
    {
      name: 'BPS', // BPS
      moduleName: 'financeDataList',
      field: 'bps',
      formatType: 1,
      echartType: 'bar',
      dimension: 'bps', // 统计维度【柱状图】
    },
    {
      name: formatMessage({ id: 'total_assets' }), // 总资产
      moduleName: 'financeDataList',
      field: 'tot_asset',
      formatType: 3,
      echartType: 'bar',
      dimension: 'totAsset', // 统计维度【柱状图】
    },
    {
      name: formatMessage({ id: 'total_liabilities' }), // 总负债
      moduleName: 'financeDataList',
      field: 'tot_debt',
      formatType: 3,
      echartType: 'bar',
      dimension: 'totDebt', // 统计维度【柱状图】
    },
    {
      name: formatMessage({ id: 'owner_equity' }), // 所有者权益
      moduleName: 'financeDataList',
      field: 'owner_equity',
      formatType: 3,
      echartType: 'bar',
      dimension: 'ownerEquity', // 统计维度【柱状图】
    },
    {
      name: formatMessage({ id: 'net_cash_flow_from_operations' }), // 经营净现金流
      moduleName: 'financeDataList',
      field: 'bus_net_cash',
      formatType: 3,
      echartType: 'bar',
      dimension: 'busNetCash', // 统计维度【柱状图】
    },
    {
      name: formatMessage({ id: 'net_cash_flow_of_investment' }), // 投资净现金流
      moduleName: 'financeDataList',
      field: 'inv_net_cash',
      formatType: 3,
      echartType: 'bar',
      dimension: 'invNetCash', // 统计维度【柱状图】
    },
    {
      name: formatMessage({ id: 'net_financing_cash_flow' }), // 融资净现金流
      moduleName: 'financeDataList',
      field: 'fin_net_cash',
      formatType: 3,
      echartType: 'bar',
      dimension: 'finNetCash', // 统计维度【柱状图】
    },
  ];

  // 获取数据
  const getDataList = (params) => new Promise((resolve, reject) => {
    try {
      if (!isReq) return;
      CommonApi({ ...params }).then((res: any) => {
        if (res && res.code === 0) {
          resolve(res.body?.mqs || res.body?.data);
        } else {
          reject(res);
        }
      }).catch((err) => {
        Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err.message}` });
      });
    } catch (err) {
      Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${err}` });
    }
  });

  // 字段类型格式化。 1: 保留2位小数；2：保留两位小数，并且加%；3：金额转换成万亿、亿、万，并且保留两位小数；4：日期格式化
  const fieldFormat = (val, type, remain = 2) => {
    if (val !== null && val !== '') {
      if (type === 1) {
        return val ? (val).toFixed(remain) : 0.00;
      }
      if (type === 2) {
        return val ? `${(val).toFixed(remain)}%` : '0.00%';
      }
      if (type === 3) {
        if (Math.abs(val) >= 1000000000000) {
          return `${(val / 1000000000000).toFixed(remain)}${formatMessage({ id: 'unit13' })}`; // 万亿
        }
        if (Math.abs(val) >= 100000000) {
          return `${(val / 100000000).toFixed(remain)}${formatMessage({ id: 'unit9' })}`; // 亿
        }
        if (Math.abs(val) >= 10000) {
          return `${(val / 10000).toFixed(remain)}${formatMessage({ id: 'unit5' })}`; // 万
        }
        return (val).toFixed(remain);
      }
      if (type === 4) {
        return dayjs(val).format('YYYY-MM-DD');
      }
      if (type === 5) {
        return val ? (val).toFixed(remain) : 0.00;
      }
      return val;
    }
    return '--';
  };

  // 数据格式化
  const dataFormat = (res, temp) => {
    temp.forEach((item, idx) => {
      const tempName = eval(`${item}Temp`);
      tempName.forEach((ele: any) => {
        res[idx].forEach((j) => {
          const index = stockList.findIndex(({ code, marketId }) => (`${code}` === `${j.code}`
            && `${marketId}` === `${j.sub_market}`));
          if (index > -1 && ele.formatType === 5) {
            ele[`data${[index + 1]}`] = fieldFormat(j[ele.field], ele.formatType, j?.decimal || 0);
          } else {
            ele[`data${[index + 1]}`] = fieldFormat(j[ele.field], ele.formatType);
          }
        });
      });
      if (`${item}Temp` === 'marketListTemp') {
        if (init) {
          setSelectItem(tempName[0]); // 设置默认选中
          setInit(false);
        }
        setMarketList(tempName);
      }
      if (`${item}Temp` === 'indexListTemp') {
        setIndexList(tempName);
      }
      if (`${item}Temp` === 'financeRatioListTemp') {
        setFinanceRatioList(tempName);
      }
      if (`${item}Temp` === 'financeDataListTemp') {
        setFinanceDataList(tempName);
      }
    });
  };

  const stockListFormat = () => {
    if (stockList && stockList.length) {
      return stockList.map((item) => ({ subMarket: item.marketId, code: item.code }));
    }
    return [];
  };

  const getPeriod = (moduleName, echartType) => {
    if (echartType === 'bar') {
      if (moduleName === 'financeRatioList') {
        return blcycle;
      }
      if (moduleName === 'financeDataList') {
        return cwcycle;
      }
    }
    return chartCycle;
  };

  // 【列表】接口参数格式化
  const listParamsFormat = (fieldType) => {
    if (fieldType === 'marketList') {
      // 市场数据
      return {
        mf: 9,
        sf: 6,
        body: {
          currency,
          stocks: [...stockListFormat()],
        },
      };
    }
    if (fieldType === 'indexList') {
      // 估值指标数据
      return {
        mf: 9,
        sf: 6,
        body: {
          currency,
          stocks: [...stockListFormat()],
        },
      };
    }
    if (fieldType === 'financeRatioList') {
      // 财务比例
      return {
        mf: 9,
        sf: 8,
        body: {
          currency,
          stocks: [...stockListFormat()],
          period: blcycle,
        },
      };
    }
    if (fieldType === 'financeDataList') {
      // 财务数据
      return {
        mf: 9,
        sf: 7,
        body: {
          currency,
          stocks: [...stockListFormat()],
          period: cwcycle,
        },
      };
    }
    if (fieldType === 'bar') {
      const { moduleName, dimension, echartType } = selectItem;
      return {
        mf: 9,
        sf: 9,
        body: {
          currency,
          dimension, // 查询指标
          stocks: [...stockListFormat()],
          period: getPeriod(moduleName, echartType), // Q1:1季度，Q2:半年，Q3:三季度，Q4：1年，Y3:3年
        },
      };
    }
    if (fieldType === 'line') {
      const { dimension } = selectItem;
      return {
        mf: 9,
        sf: 10,
        body: {
          currency,
          dimension, // 查询指标
          stocks: [...stockListFormat()],
          lts: chartCycle, // 1M:近1月，3M:近3月，6M:近6月，1Y：近1年，3Y:近3年
        },
      };
    }
    return {};
  };

  const dataTemp = ['marketList', 'indexList', 'financeRatioList', 'financeDataList'];
  const reqData = (temp = dataTemp) => {
    const reqList: any = [];
    temp.forEach((item) => {
      reqList.push(getDataList(listParamsFormat(item)));
    });
    Promise.all(reqList).then((res: any) => {
      dataFormat(res, temp);
    }).catch((err) => {
      setChartData([]);
      Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${JSON.stringify(err)}` });
    });
  };

  useEffect(() => {
    setMarketList([...marketListTemp]);
    setIndexList([...indexListTemp]);
    setFinanceRatioList([...financeRatioListTemp]);
    setFinanceDataList([...financeDataListTemp]);
    if (stockList && stockList.length) {
      reqData();
    } else {
      setLoading(false);
    }
  }, [stockList, currency]);

  // const tempStock = [
  //   {
  //     name: '银河娱乐',
  //     marketId: 2002,
  //     code: '00027',
  //   },
  //   {
  //     name: '澳博控股',
  //     marketId: 2002,
  //     code: '00880',
  //   },
  // ];

  useEffect(() => {
    if (selectItem && stockList && stockList.length) {
      const { echartType } = selectItem;
      getDataList(listParamsFormat(echartType)).then((res: any) => {
        if (res && res.length) {
          const temp: any = [];
          stockList.forEach((item) => {
            const index = res.findIndex(({ code }) => (`${code}` === `${item.code}`));
            if (index > -1) {
              temp.push(res[index]);
            }
          });
          setChartData(temp);
        } else {
          setChartData([]);
        }
        setLoading(false);
      }).catch((err) => {
        Toast.show({ content: `${formatMessage({ id: 'interface_exception' })}: ${JSON.stringify(err)}` });
      });
    }
  }, [selectItem, chartCycle]);

  // 财务比例 周期切换
  useEffect(() => {
    if (stockList && stockList.length) {
      reqData(['financeRatioList']);
    }
  }, [blcycle]);

  // 财务数据 周期切换
  useEffect(() => {
    if (stockList && stockList.length) {
      reqData(['financeDataList']);
    }
  }, [cwcycle]);

  useEffect(() => {
    sessionStorageGetItem({ key: 'stockList' }).then((res) => {
      if (res && res?.key && res?.value) {
        setReq(true);
        setStockList(res?.value || []);
      } else {
        setReq(false);
        setLoading(false);
        setSelectItem(marketListTemp[0]); // 设置默认选中
      }
    });

    pageOnShow(() => {
      sessionStorageGetItem({ key: 'stockList' }).then((res) => {
        if (res && res?.key && res?.value) {
          setReq(true);
          setStockList(res?.value || []);
        } else {
          setReq(false);
          setLoading(false);
          setSelectItem(marketListTemp[0]); // 设置默认选中
        }
      });
    });
  }, []);

  return (
    <div styleName="stock-pk">
      <div styleName="stock-pk-box">
        {/* 股票列表 */}
        <StockItemCard list={stockList} colors={colors} stockDel={(idx) => stockDel(idx)} />
        {/* 折线图/柱状图 */}
        <DataGraph
          stockList={stockList}
          selectItem={selectItem}
          isLoading={isLoading}
          chartCycle={chartCycle}
          list={[...chartData]}
          colors={colors}
          legend={legend}
          setCycle={(item) => setChartCycle(item)}
        />
        {/* 股票选择 */}
        <LegendCard
          list={stockList}
          colors={colors}
          currency={currency}
          getLegend={(data) => setLegend(data)}
          getCurrency={(res) => setCurrency(res)}
        />
        {/* 市场数据 */}
        <DataItemCard
          defaultOpen
          list={marketList}
          selectItem={selectItem}
          setItem={(row) => setSelectItem(row)}
          title={formatMessage({ id: 'market_data' })}
        />
        {/* 估值指标 */}
        <DataItemCard
          list={indexList}
          selectItem={selectItem}
          setItem={(row) => setSelectItem(row)}
          title={formatMessage({ id: 'valuation_indicators' })}
        />
        {/* 财务比例 */}
        <DataItemCard
          showCondition
          cycle={blcycle}
          list={financeRatioList}
          selectItem={selectItem}
          setItem={(row) => setSelectItem(row)}
          setCycle={(key) => setBlCycle(key)}
          title={formatMessage({ id: 'financial_ratio' })}
        />
        {/* 财务数据 */}
        <DataItemCard
          showCondition
          cycle={cwcycle}
          list={financeDataList}
          selectItem={selectItem}
          setItem={(row) => setSelectItem(row)}
          setCycle={(key) => setCwCycle(key)}
          title={formatMessage({ id: 'financial_data' })}
        />
        <div styleName="text">{formatMessage({ id: 'tz_tip_text' })}</div>
      </div>
    </div>
  );
});

export default StockPk;
