declare interface Window {
  __store: any;
  GLOBAL_CONFIG: {
    test: number;
    COMMON_SERVERS: any;
    [s: string]: any;
    LIVE_CONFIG: any,
  };
  QUOTES_CONFIG: {
    search: number[];
    blockidlists: number[];
    [s: string]: any;
  };
  WS_ADDRESS: {
    UP_DOWN_DISTRIBUTE: any;
    NORTH_BOUND: any;
  };
  NB_bound: {
    SZMARKET: number;
    HGMARKET: number;
    SZCODE: any;
    HGCODE: any;
  };
  SB_bound: {
    SZMARKET: number;
    HGMARKET: number;
    SZHKCODE: any;
    SHHKCODE: any;
  };
  TRADE_CONFIG: {
    tableUpdateTime: number;
    [s: string]: any;
  };
  Aliplayer: any,
}
interface IGlobalConfig {
  QUOTE_SERVERS: any;
  COMMON_SERVERS: any;
  INFORMATION_MODULE: any;
  MINE_MODULE: any;
  USE_DEAL_MODULE: any;
  ENABLE_ENCRYPT: boolean;
  DEFAULT_THEME: string;
  IPO_PATH: string;
  MONEY_PATH: string;
  LOADING_TIME_OUT: number;
}

declare type StrNumber = string | number;

declare type tradeOrderType = 'buy' | 'sell' | 'all' | 'cfs';

declare module '*.svg';
declare module '*.png';
declare module '*.gif';

declare namespace React {
  interface Attributes {
    styleName?: string | undefined;
  }
  interface HTMLAttributes<T> {
    styleName?: string | undefined;
  }
  interface SVGAttributes<T> {
    styleName?: string | undefined;
  }

  interface CSSProperties {
    [s: string]: string;
  }

}
declare interface TouchEvent {
  _isScroller: boolean;
}
