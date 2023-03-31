import { useMemo, useEffect, useState } from 'react';
import { cloneDeep, max, sum } from 'lodash-es';
import { FormattedMessage } from 'react-intl';
import { getProductInfo } from '@/api/module-api/trade';
import { returnJavaMarket } from '@/utils';
import { Data } from './use-stock-roll';

const useStockInfo = (props: {
  type: 'in' | 'out';
  data: Data;
  setData: (date: any) => void;
}) => {
  const { type, data, setData } = props;

  const isIn = type === 'in';
  const inOutName = <FormattedMessage id={isIn ? 'roll_in' : 'roll_out'} />;
  const info = useMemo(() => data, [data]);
  const [stockInfo, setStockInfo] = useState(info.stockInfo);

  useEffect(() => {
    console.log('stockInfo:', stockInfo);
    // 计算转出金额
    const outPrice = sum(stockInfo.map((stock) => (
      stock.closingPrice
        ? max([stock.number * stock.closingPrice * 0.0001, 50])
        : 0
    )));
    setData({ stockInfo, outPrice });
  }, [stockInfo]);

  /**
   * 添加股票信息
   * @memberof StockInfo
   */
  const addStock = () => {
    setStockInfo(
      stockInfo.concat([
        {
          closingPrice: 0,
          stockName: '',
          stock: '',
          market: '',
          number: 0,
        },
      ]),
    );
  };

  /**
   * 删除股票信息
   * @param index 股票信息索引
   */
  const delStock = (index: number) => {
    setStockInfo(stockInfo.filter((_, i) => i !== index));
  };

  /**
   * 设置单个股票信息
   * @param index 股票信息索引
   * @param keys 股票信息key
   * @param val 股票信息值
   */
  const setSingleStock = (index: number, keys: string[], val: any[]) => {
    keys.forEach((key, i) => {
      stockInfo[index][key] = val[i];
    });

    setStockInfo(cloneDeep(stockInfo));
  };

  /**
   * 设置股票收盘价
   * @param index 股票信息索引
   * @param code 股票代码
   * @param market 股票小市场
   * @returns
   * @memberof StockInfo
   * @description 在选择股票后通过2209接口再获取收盘价
   */
  const setStockClosingPrice = (index: number, code: string, market) => {
    getProductInfo({
      code,
      tradeMarket: returnJavaMarket(market),
    })
      .then((res) => {
        const { result = [] } = res;
        setSingleStock(index, ['closingPrice'], [result[0].prevClose || 0]);
      })
      .catch((err) => console.log(err, '--> err'));
  };

  /**
   * @description 存在未选择股票、数量为0的股票信息时，下一步按钮不可点击
   */
  const disableNext = useMemo(
    () => stockInfo.filter((item) => !(item.stock && item.number)).length > 0,
    [stockInfo],
  );

  return {
    inOutName,
    stockInfo,
    addStock,
    delStock,
    setStockClosingPrice,
    setSingleStock,
    disableNext,
  };
};

export default useStockInfo;
