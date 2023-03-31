import React from 'react';
import classNames from 'classnames';
import './chart-legend.scss';

export enum ChartType {
  LINE = 'line',
  BAR = 'bar',
  CIRCLE = 'circle',
}

export interface IDataList {
  title: string;
  color: string;
  type: ChartType;
}

interface IProps {
  dataList: IDataList[];
  titleParse: (value: string) => string;
}

const ChartLegend: React.FC<IProps> = ({ dataList, titleParse }) => (
  <ol styleName="legend" className="legend-wrap">
    {dataList.map((item, index) => (
      <li key={item.color} styleName="legend-item" className={`legend-item-${index}`}>
        <i style={{ backgroundColor: item.color }} styleName={classNames(item.type)} />
        <span>{titleParse ? titleParse(item.title) : item.title}</span>
      </li>
    ))}
  </ol>
);

export default ChartLegend;
