export const hashCode = (market, code) => `${market}_${code}`;

export class StockMap {
  private readonly stockMap: { string: number };

  constructor(list) {
    this.stockMap = list.reduce((prev, curr, idx) => {
      prev[hashCode(curr.market, curr.code)] = idx;
      return prev;
    }, {});
  }

  public has(market: number, code: string) {
    return hashCode(market, code) in this.stockMap;
  }

  public getIndex(market, code) {
    if (this.has(market, code)) {
      return this.stockMap[hashCode(market, code)];
    }
    return null;
  }
}
