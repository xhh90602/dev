import { CommodityQuote } from '@dz-web/quote-client';

export type IQuoteFieldProps = CommodityQuote;

export interface IQuoteFieldCompProps {
  commodityQuote: IQuoteFieldProps;
}
