import { addStockCombination, addSelf, delSelf, queryStockIsExist } from '@/api/module-api/combination';

export function addStockApi(stockList, portfolioId): any {
  return new Promise((resolve) => {
    const list = stockList.map((item) => {
      const { currencyCode, marketId, name, code } = item;
      return {
        bigMarket: null,
        currency: currencyCode,
        smallMarket: marketId,
        stockCode: code,
        stockName: name,
        tradeMarket: null,
      };
    });

    addStockCombination({ portfolioId, stockDTOList: [...list] }).then((res: any) => {
      resolve(res);
    });
  });
}

// 添加自选
export function saveSelfApi(stockList, groupId = 0): any {
  return new Promise((resolve) => {
    const list = stockList.map((item) => {
      const { marketId, code, Market, subMarket, Code } = item;
      return {
        expireStatus: 0,
        id: groupId,
        marketCode: marketId || Market || subMarket,
        stockCode: code || Code,
        type: 0,
      };
    });
    const data = {
      groupId,
      groupIds: [],
      stocks: [...list],
    };
    addSelf({ ...data }).then((res: any) => {
      resolve(res);
    });
  });
}

// 删除自选
export function delSelfApi(stockList: [{ code: string | number; market: string | number }]): any {
  return new Promise((resolve) => {
    const data = {
      stocks: [...stockList],
    };
    delSelf({ ...data }).then((res: any) => {
      resolve(res);
    });
  });
}

// 查询是否已经添加到自选了
export function stockIsExist(stockList: { code: string | number; market: string | number }): any {
  return new Promise((resolve) => {
    queryStockIsExist({ ...stockList }).then((res: any) => {
      resolve(res);
    });
  });
}
