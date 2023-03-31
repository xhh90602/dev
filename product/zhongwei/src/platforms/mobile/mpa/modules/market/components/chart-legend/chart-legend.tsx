import classNames from 'classnames';
import './chart-legend.scss';

export enum ChartType {
  LINE = 'line',
  BAR = 'bar',
}

export interface IDataList {
  title: string;
  color: string;
  type: ChartType;
}

interface IProps {
  dataList: IDataList[];
  titleParse?: (string) => string;
}

const ChartLegend: React.FC<IProps> = ({ dataList, titleParse }) => (
  <ol styleName="legend" className="legend-wrap">
    {dataList.map((item, index) => (
      <li key={item.color} styleName="legend-item" className={`legend-item-${index}`}>
        {/* <i style={{ backgroundColor: item.color }} styleName={classNames(item.type)} /> */}
        <i style={{ backgroundColor: item.color }} styleName="bar" />
        <span>{titleParse ? titleParse(item.title) : item.title}</span>
      </li>
    ))}
  </ol>
);

export default ChartLegend;
