import { ChartType } from '../components/chart-legend/chart-legend';

export const defaultPageSize = 30;

interface ILegendList {
  title: string;
  color: string;
  type: ChartType;
}

export const legendList: ILegendList[] = [
  {
    title: 'good_hold',
    color: '#da070e',
    type: ChartType.CIRCLE,
  },
  {
    title: 'bad_hold',
    color: '#06B899',
    type: ChartType.CIRCLE,
  },
  {
    title: 'stock_price',
    color: '#fa6d16',
    type: ChartType.CIRCLE,
  },
];
